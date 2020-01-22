import React from "react";
import { Canvas } from "react-three-fiber";
import * as THREE from "three";

import BlinkingBadge from "components/BlinkingBadge";
import Effects from "components/Effects";
import Stats from "components/Stats";
import Surf from "components/Surf";
import { DatGui } from "utils/config";
import { isDevelopment } from "utils/isEnvironment";

import "./style.scss";

const cameraSettings = {
  near: 0.001,
  far: 1000,
  fov: 70
};
const backgroundColor = new THREE.Color("#0C0E16");
const handleCanvasCreate = ({ gl }) => {
  gl.gammaInput = true;
  // gl.toneMapping = THREE.Uncharted2ToneMapping;
  gl.setClearColor(backgroundColor);
};

const App = () => (
  <>
    <Canvas
      camera={cameraSettings}
      onCreated={handleCanvasCreate}
      pixelRatio={window.devicePixelRatio}
      updateDefaultCamera
    >
      <fog attach="fog" args={[backgroundColor, 50, 250]} />
      <ambientLight intensity={0.25} />

      <Surf />

      <Effects />

      {isDevelopment && <Stats />}
    </Canvas>

    {isDevelopment && <DatGui />}

    <BlinkingBadge>Preview</BlinkingBadge>
  </>
);

export default App;
