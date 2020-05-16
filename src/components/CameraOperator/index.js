import { useRef, useMemo } from "react";
import { useFrame } from "react-three-fiber";
import { useSpring } from "react-spring/three";

import { useHUD } from "components/HUD";
import { useConfig } from "utils/config";

const DISTANCE_FROM_HEAD_DAMPING = 0.015;
const CAMERA_UP_DAMPING = 0.001;

const CameraOperator = ({ commitsCount }) => {
  const distanceFromHead = useRef(0);
  const speed = useConfig(c => c.speed);
  const waitOnFirstCommit = useConfig(c => c.waitOnFirstCommit);
  const commitsDistance = useConfig(c => c.commitsDistance);
  const isOrbitControlsEnabled = useConfig(c => c.isOrbitControlsEnabled);
  const {
    position: { y, z },
    xVariation,
    yVariation,
    variationDuration
  } = useConfig(c => c.camera);

  const { log } = useHUD();

  const [spring, set] = useSpring(() => ({
    position: [0, y, 1],
    lookPosition: [0, 0.1, 0],
    up: [0, 0, 1],
    config: {
      mass: 1,
      tension: 280,
      friction: 120
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
    const ttq = (tte % variationDuration) / variationDuration;

    if (ttq > 0 && ttq < 0.2) {
      return tte + (0.2 - ttq) * variationDuration;
    }

    if (ttq > 0 && ttq > 0.2) {
      return tte + (1.2 - ttq) * variationDuration;
    }

    return tte;
  }, [waitOnFirstCommit, speed, commitsCount, variationDuration]);

  useFrame(({ camera, clock }) => {
    if (isOrbitControlsEnabled) {
      // skip camera update
      return;
    }

    // angle used for position variation
    const alpha =
      (Math.min(clock.elapsedTime, timeToEnd) / variationDuration) *
      Math.PI *
      2;

    let headZ = 0;
    let targetDistanceFromHead = 0;
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
      targetDistanceFromHead = z;
    }

    if (clock.elapsedTime > timeToMove + 1 / speed) {
      targetUp = [0, 1, 0];
    }

    if (clock.elapsedTime > timeToAlmostEnd) {
      targetDistanceFromHead = 0;
    }

    if (clock.elapsedTime > timeToEnd - variationDuration / 2) {
      targetUp = [-1, 0, 0];
    }

    distanceFromHead.current +=
      (targetDistanceFromHead - distanceFromHead.current) *
      DISTANCE_FROM_HEAD_DAMPING;

    // calc new position
    const newX = xVariation * Math.cos(alpha);
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

    log({
      currentZ: camera.position.z,
      targetZ: newZ,
      zDiff: newZ - camera.position.z,
      currentRotationZ: camera.rotation.z,
      distanceFromHeadZ: distanceFromHead.current
    });

    // update position
    camera.position.set(...spring.position.getValue());
    // update look position
    camera.up.set(...newUp);
    camera.lookAt(...spring.lookPosition.getValue());
  });

  return null;
};

export default CameraOperator;
