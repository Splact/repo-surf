import { useFrame } from "react-three-fiber";

import { useConfig } from "utils/config";

const CameraOperator = () => {
  const { xVariation, yVariation, zVariation, variationDuration } = useConfig(
    state => state.camera
  );
  useFrame(state => {
    const { camera, clock } = state;

    const alpha = (clock.elapsedTime / variationDuration) * Math.PI * 2;

    // camera.position.set;
    camera.position.x = xVariation * Math.cos(alpha);
    camera.position.y = 25 + yVariation * Math.sin(alpha);
    camera.position.z = zVariation * Math.sin(alpha) * Math.cos(alpha);

    camera.lookAt(0, 0, -25);
  });

  return null;
};

export default CameraOperator;
