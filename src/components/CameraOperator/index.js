import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Vector3 } from "three";

import { useConfig } from "utils/config";

const DAMPING_DURATION = 30;

const CameraOperator = ({ commitsCount }) => {
  const lookPosition = useRef(new Vector3(0, 0.1, 0));
  const dampingSpeed = useRef(0);
  const { camera } = useThree();

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

  useEffect(() => {
    camera.position.x = 0;
    camera.position.y = y;
    camera.position.z = 0;
  }, [camera, y]);

  // {waitOnFirstCommit}s wait + time to reach the second commit
  const timeToMove = useMemo(() => waitOnFirstCommit + 1 / speed, [
    waitOnFirstCommit,
    speed
  ]);

  useFrame(({ camera, clock }) => {
    if (isOrbitControlsEnabled) {
      // skip camera update
      return;
    }

    // angle used for position variation
    const alpha = (clock.elapsedTime / variationDuration) * Math.PI * 2;

    let headZ = 0;
    let cameraZ = 0;
    if (clock.elapsedTime > timeToMove) {
      headZ = (clock.elapsedTime - timeToMove) * speed * commitsDistance;
      cameraZ = Math.min(headZ, (commitsCount - 1) * commitsDistance - z);
    } else {
      cameraZ = Math.min(headZ, (commitsCount - 1) * commitsDistance);
    }
    headZ = Math.min(headZ, (commitsCount - 1) * commitsDistance);

    // update damping speed
    if (headZ < (commitsCount - 3) * commitsDistance) {
      dampingSpeed.current = Math.max(
        0.001,
        Math.min((clock.elapsedTime - timeToMove) / DAMPING_DURATION, 1)
      );
    } else {
      dampingSpeed.current = Math.max(
        0.005,
        Math.min(
          1 -
            (cameraZ - (commitsCount - 3) * commitsDistance) /
              (commitsDistance * 4),
          1
        )
      );
    }

    // calc new position
    const newX = xVariation * Math.cos(alpha);
    const newY = y + yVariation * Math.sin(alpha);
    const newZ = z + cameraZ;

    // apply damping and set position
    camera.position.x += (newX - camera.position.x) * dampingSpeed.current;
    camera.position.y += (newY - camera.position.y) * dampingSpeed.current;
    camera.position.z += (newZ - camera.position.z) * dampingSpeed.current;

    // update look position
    lookPosition.current.z +=
      (headZ - lookPosition.current.z) * dampingSpeed.current;
    camera.lookAt(lookPosition.current);

    // apply continuous roll
    camera.rotation.z = Math.PI - 0.0625 * Math.PI * Math.cos(alpha);
  });

  return null;
};

export default CameraOperator;
