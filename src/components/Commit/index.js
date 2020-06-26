import React, { useRef, useState, useEffect, useContext, useMemo } from "react";
import { useSpring, config } from "react-spring/three";
import { useFrame } from "react-three-fiber";
import { Mesh, CircleBufferGeometry, MeshLambertMaterial } from "three";

import FlatText from "components/FlatText";
import { useHUD } from "components/HUD";
import { SurfContext } from "components/Surf";
import { useConfig } from "utils/config";
import isInView from "utils/isInView";

const commitsBuffer = [];
const getAvailableCommitFromBuffer = () => {
  let commit = commitsBuffer.find(c => c.isAvailable);
  if (!commit) {
    commit = {
      index: commitsBuffer.length,
      mesh: makeCommitMesh(),
      isAvailable: false
    };
    commitsBuffer.push(commit);
  } else {
    commit.isAvailable = false;
  }

  return commit;
};
const makeCommitMesh = () => {
  // create geometry
  const geometry = new CircleBufferGeometry(5, 32);
  // create material
  const material = new MeshLambertMaterial({
    emissive: "#8ACB67",
    emissiveIntensity: 1,
    depthTest: false,
    transparent: true,
    opacity: 0
  });

  return new Mesh(geometry, material);
};
const freeCommitOnBuffer = commit => {
  if (!commit) {
    return;
  }

  commit.isAvailable = true;
};

const Commit = props => {
  const { index, position, color, renderOrder = 0, sha, message } = props;
  const { radius, color: defaultColor, emissiveIntensity } = useConfig(
    c => c.commit
  );

  const groupRef = useRef();
  const commitRef = useRef();
  const [isGone, setIsGone] = useState(false);
  const { currentCommit } = useContext(SurfContext);
  const { log } = useHUD();

  const isReady = index < currentCommit + 1;
  const isActive = index > currentCommit - 2 && index <= currentCommit;

  const [spring, set] = useSpring(() => ({
    scale: [0.01, 0.01, 0.01],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: config.slow
  }));

  useEffect(() => {
    if (isReady) {
      // open it
      set({ scale: [1, 1, 1] });
      window.readyCommitsCount = (window.readyCommitsCount || 0) + 1;
    }

    log({
      commitsBufferSize: commitsBuffer.length,
      readyCommitsCount: window.readyCommitsCount
    });
  }, [isReady, set, log]);

  useEffect(() => {
    if (isActive) {
      // open it
      set({ scale: [1.2, 1.2, 1.2], position: [0, 1, 0] });

      window.currentCommitsCount = (window.currentCommitsCount || 0) + 1;
    } else {
      // close it
      set({ scale: [1, 1, 1], position: [0, 0, 0] });
      window.currentCommitsCount = Math.max(
        (window.currentCommitsCount || 0) - 1,
        0
      );
    }
    log({ currentCommitsCount: window.currentCommitsCount });
  }, [isActive, set, log]);

  useFrame(({ camera }) => {
    if (isGone) {
      return;
    }

    if (!commitRef.current && isReady && isInView(groupRef.current, camera)) {
      // the commit needs to be positioned (is in view)
      commitRef.current = getAvailableCommitFromBuffer();
      groupRef.current.add(commitRef.current.mesh);
    } else if (commitRef.current && !isInView(commitRef.current.mesh, camera)) {
      // the commit is out of view can be recycled
      groupRef.current.remove(commitRef.current.mesh);
      freeCommitOnBuffer(commitRef.current);
      commitRef.current = null;
      setIsGone(true);
    }

    if (!commitRef.current) {
      return;
    }

    // update mesh
    commitRef.current.mesh.renderOrder = renderOrder;
    const scale = spring.scale.getValue();
    commitRef.current.mesh.scale.x = scale[0];
    commitRef.current.mesh.scale.y = scale[1];
    commitRef.current.mesh.scale.z = scale[2];
    const position = spring.position.getValue();
    commitRef.current.mesh.position.x = position[0];
    commitRef.current.mesh.position.y = position[1];
    commitRef.current.mesh.position.z = position[2];
    const rotation = spring.rotation.getValue();
    commitRef.current.mesh.rotation.x = rotation[0];
    commitRef.current.mesh.rotation.y = rotation[1];
    commitRef.current.mesh.rotation.z = rotation[2];

    // update geometry radius
    // commitRef.current.mesh.geometry.parameters.radius = radius;

    // update material
    commitRef.current.mesh.material.emissive.set(color || defaultColor);
    commitRef.current.mesh.material.emissiveIntensity = emissiveIntensity;
    commitRef.current.mesh.material.opacity = 1;
  });

  const textPosition = useMemo(() => [-radius, 0, 5], [radius]);
  const textRotation = useMemo(() => [-Math.PI / 2, Math.PI, 0], []);
  const text = useMemo(
    () => [`#${index}`, "", sha.substr(0, 7), "", message],
    []
  );

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <FlatText
        active={isActive}
        position={textPosition}
        rotation={textRotation}
        renderOrder={renderOrder + 1}
      >
        {text}
      </FlatText>
    </group>
  );
};

export default Commit;
