import React from "react";
import { Canvas } from "react-three-fiber";
import * as THREE from "three";

import Surf from "components/Surf";
import Effects from "components/Effects";
import OrbitControls from "components/OrbitControls";
import Stats from "components/Stats";
import { DatGui } from "utils/config";

import "./style.scss";

const cameraSettings = {
  near: 0.01,
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
      <fog attach="fog" args={[backgroundColor, 150, 200]} />
      <ambientLight intensity={0.25} />

      <Surf />

      <Effects />
      <Stats />
      <OrbitControls />
    </Canvas>

    <DatGui />
  </>
);

export default App;
