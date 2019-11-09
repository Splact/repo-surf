import React, { useRef } from "react";
import { useThree, extend } from "react-three-fiber";
import { OrbitControls as THREEOrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { useConfig } from "utils/config";

extend({ OrbitControls: THREEOrbitControls });

const OrbitControls = () => {
  const { camera, gl } = useThree();
  const ref = useRef(null);
  const isEnabled = useConfig(config => config.isOrbitControlsEnabled);

  return (
    <orbitControls
      ref={ref}
      args={[camera, gl.domElement]}
      enabled={isEnabled}
    />
  );
};

export default OrbitControls;
