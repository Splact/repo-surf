import { useRef, useMemo } from "react";
import { useFrame } from "react-three-fiber";
import { useSpring } from "react-spring/three";

import { useConfig } from "utils/config";

const DISTANCE_FROM_HEAD_DAMPING = 0.02;
const CAMERA_UP_DAMPING = 0.001;

const CameraOperator = ({ commitsCount }) => {
  const distanceFromHead = useRef(0);
  const speed = useConfig(c => c.speed);
  const waitOnFirstCommit = useConfig(c => c.waitOnFirstCommit);
  const commitsDistance = useConfig(c => c.commitsDistance);
  const isOrbitControlsEnabled = useConfig(c => c.isOrbitControlsEnabled);
  const {
    position: { x, y },
    xVariation,
    yVariation,
    variationDuration,
    distanceFromHead: distanceFromHeadOnRun
  } = useConfig(c => c.camera);

  const [spring, set] = useSpring(() => ({
    position: [0, 10, -0.1],
    lookPosition: [0, 0.1, 0],
    config: {
      mass: 1,
      tension: 280,
      friction: 200
    }
  }));

  // {waitOnFirstCommit}s wait + time to reach the second commit
  const timeToMove = useMemo(() => waitOnFirstCommit + 1 / speed, [
    waitOnFirstCommit,
    speed
  ]);
  // last commit is reached with the camera
  const timeToAlmostEnd = useMemo(
    () => waitOnFirstCommit + (commitsCount - 1) / speed,
    [waitOnFirstCommit, speed, commitsCount]
  );
  // the camera reach the max elevation on last commit
  const timeToEnd = useMemo(() => {
    const tte = waitOnFirstCommit + commitsCount / speed;
    const ttq = variationDuration - (tte % variationDuration);

    return tte + ttq - variationDuration / 2;
  }, [waitOnFirstCommit, speed, commitsCount, variationDuration]);

  useFrame(({ camera, clock }) => {
    if (isOrbitControlsEnabled) {
      // skip camera update
      return;
    }

    // angle used for position variation
    const alpha =
      -Math.PI / 2 +
      (Math.max(0, Math.min(clock.elapsedTime - timeToMove, timeToEnd)) /
        variationDuration) *
        Math.PI *
        2;

    let headZ = 0;
    let targetDistanceFromHead = -distanceFromHeadOnRun / 2;
    let targetUp = [0, 0, 1];

    // We have four time windows
    // 1. Before everithing starts | the camera z is same as first commt z | no
    //    movement.
    // 2. Camera starts moving ahead taking a certain distance from the current
    //    commit, the last commit is not reached yet.
    // 3. The latest commit is reached but the camera still moves to get the
    //    final position.
    // 4. Camera is in it's final position observing the last commit.
    if (clock.elapsedTime > timeToMove) {
      headZ = (clock.elapsedTime - timeToMove) * speed * commitsDistance;
      headZ = Math.min(headZ, (commitsCount - 1) * commitsDistance);
      targetDistanceFromHead = -distanceFromHeadOnRun;
    }

    if (clock.elapsedTime > timeToMove + 1 / speed) {
      targetUp = [0, 1, 0];
    }

    if (clock.elapsedTime > timeToAlmostEnd) {
      targetDistanceFromHead = -1;
    }

    if (clock.elapsedTime > timeToEnd - variationDuration / 2) {
      targetUp = [-1, 0, 0];
    }

    distanceFromHead.current +=
      (targetDistanceFromHead - distanceFromHead.current) *
      DISTANCE_FROM_HEAD_DAMPING;

    // calc new position
    const newX = x + xVariation * Math.cos(alpha);
    const newY = y + yVariation * Math.sin(alpha);
    const newZ = headZ + 1 + distanceFromHead.current;

    const headX = 0;

    const [upX, upY, upZ] = camera.up.toArray();
    const newUp = [
      upX + (targetUp[0] - upX) * CAMERA_UP_DAMPING,
      upY + (targetUp[1] - upY) * CAMERA_UP_DAMPING,
      upZ + (targetUp[2] - upZ) * CAMERA_UP_DAMPING
    ];

    // update spring
    set({
      position: [newX, newY, newZ],
      lookPosition: [headX, 0.1, headZ]
    });

    // update position
    camera.position.set(...spring.position.getValue());

    // update look position
    camera.lookAt(...spring.lookPosition.getValue());
    camera.up.set(...newUp);
  });

  return null;
};

export default CameraOperator;
