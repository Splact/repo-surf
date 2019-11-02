import React from "react";
import { Canvas } from "react-three-fiber";
import * as THREE from "three";

import DummyBlock from "components/DummyBlock";
import Effects from "components/Effects";
import useRepo from "hooks/useRepo";

import "./style.scss";

const cameraSettings = {
  position: [0, 25, 25],
  near: 0.01,
  far: 1000,
  fov: 70
};
const backgroundColor = new THREE.Color("#0C0E16");
const handleCameraInit = camera => {
  camera.lookAt(0, 0, 0);
};
const handleCanvasCreate = ({ gl, camera }) => {
  // gl.gammaInput = true;
  // gl.toneMapping = THREE.Uncharted2ToneMapping;
  gl.setClearColor(backgroundColor);
  handleCameraInit(camera);
};

const App = () => {
  const { owner, repo, commits, isLoading, error } = useRepo();

  console.log(owner, repo, commits, isLoading, error);

  return (
    <Canvas
      camera={cameraSettings}
      onCreated={handleCanvasCreate}
      pixelRatio={window.devicePixelRatio}
      updateDefaultCamera
    >
      <fog attach="fog" args={[backgroundColor, 100, 700]} />
      <ambientLight intensity={0.25} />

      <DummyBlock />

      <Effects />
    </Canvas>
  );
};

export default App;
