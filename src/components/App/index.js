import React from "react";
import { Canvas } from "react-three-fiber";
import * as THREE from "three";

import Commit from "components/Commit";
import Effects from "components/Effects";
import OrbitControls from "components/OrbitControls";
import Stats from "components/Stats";
import Track from "components/Track";
import useRepo from "hooks/useRepo";
import { DatGui } from "utils/config";

import "./style.scss";

const cameraSettings = {
  position: [0, 25, 0],
  near: 0.01,
  far: 1000,
  fov: 70
};
const backgroundColor = new THREE.Color("#0C0E16");
const handleCameraInit = camera => {
  camera.position.set(...cameraSettings.position);
  camera.lookAt(0, 0, -25);
};
const handleCanvasCreate = ({ gl, camera }) => {
  gl.gammaInput = true;
  // gl.toneMapping = THREE.Uncharted2ToneMapping;
  gl.setClearColor(backgroundColor);
  handleCameraInit(camera);
};

const App = () => {
  const { owner, repo, commits, isLoading, error } = useRepo();
  console.log(owner, repo, commits, isLoading, error);

  return (
    <>
      <Canvas
        camera={cameraSettings}
        onCreated={handleCanvasCreate}
        pixelRatio={window.devicePixelRatio}
        updateDefaultCamera
      >
        <fog attach="fog" args={[backgroundColor, 50, 100]} />
        <ambientLight intensity={0.25} />

        <Commit />
        <Track />

        <Effects />

        <Stats />

        <OrbitControls
          cameraPosition={cameraSettings.position}
          cameraTarget={[0, 0, -25]}
        />
      </Canvas>

      <DatGui />
    </>
  );
};

export default App;
