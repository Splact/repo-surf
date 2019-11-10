import { useFrame } from "react-three-fiber";

import { useConfig } from "utils/config";

const CameraOperator = () => {
  const speed = useConfig(config => config.speed);
  const commitsDistance = useConfig(config => config.commitsDistance);
  const isOrbitControlsEnabled = useConfig(
    config => config.isOrbitControlsEnabled
  );
  const {
    position: { x, y, z },
    xVariation,
    yVariation,
    zVariation,
    variationDuration
  } = useConfig(state => state.camera);

  useFrame(state => {
    if (isOrbitControlsEnabled) {
      return;
    }

    const { camera, clock } = state;

    const alpha = (clock.elapsedTime / variationDuration) * Math.PI * 2;

    const headZ = clock.elapsedTime * speed * commitsDistance - commitsDistance;

    camera.position.x = x + xVariation * Math.cos(alpha);
    camera.position.y = y + yVariation * Math.sin(alpha);
    camera.position.z =
      z + headZ + zVariation * Math.sin(alpha) * Math.cos(alpha);

    camera.lookAt(0, 0.1, headZ);
  });

  return null;
};

export default CameraOperator;
