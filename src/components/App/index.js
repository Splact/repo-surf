import React, { useState, useCallback, useEffect } from "react";
import { Canvas } from "react-three-fiber";
import * as THREE from "three";

import BlinkingBadge from "components/BlinkingBadge";
import Effects from "components/Effects";
import LoadingScreen from "components/LoadingScreen";
import Stats from "components/Stats";
import Surf from "components/Surf";
import useRepo from "hooks/useRepo";
import { DatGui, useConfig } from "utils/config";
import loadingManager, { useLoadingState } from "utils/loadingManager";
import { isDevelopment } from "utils/isEnvironment";

import "./style.scss";

const backgroundColor = new THREE.Color("#0C0E16");

const App = () => {
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { owner, repo, commits } = useRepo();
  const { progress } = useLoadingState();

  const handleCanvasCreate = useCallback(
    ({ gl }) => {
      gl.gammaInput = true;
      gl.setClearColor(backgroundColor);
      setIsCanvasReady(true);
    },
    [setIsCanvasReady]
  );

  useEffect(() => {
    loadingManager.load();
  }, []);

  useEffect(() => {
    if (!isLoaded && progress === 1) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 1000);
    }
  }, [isLoaded, progress]);

  const cameraSettings = useConfig(c => ({
    near: c.camera.near,
    far: c.camera.far,
    fov: c.camera.fov,
    position: [0, 0, -0.1]
  }));

  return (
    <>
      {isLoaded && progress === 1 && (
        <Canvas
          camera={cameraSettings}
          onCreated={handleCanvasCreate}
          pixelRatio={window.devicePixelRatio}
          updateDefaultCamera
        >
          <fog attach="fog" args={[backgroundColor, 50, 250]} />
          <ambientLight intensity={0.25} />

          <Surf owner={owner} repo={repo} commits={commits} />

          <Effects />

          {isDevelopment && <Stats />}
        </Canvas>
      )}

      <LoadingScreen loaded={isCanvasReady} progress={progress} />

      {isDevelopment && <DatGui />}

      <BlinkingBadge>Preview</BlinkingBadge>
    </>
  );
};

export default App;
