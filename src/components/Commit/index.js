import React, { useEffect, useState } from "react";
import { useFrame } from "react-three-fiber";
import { useSpring, a } from "react-spring/three";

import { useConfig } from "utils/config";

const Commit = ({ index, branchIndex }) => {
  const speed = useConfig(c => c.speed);
  const waitOnFirstCommit = useConfig(c => c.waitOnFirstCommit);
  const commitsDistance = useConfig(c => c.commitsDistance);
  const branchesDistance = useConfig(c => c.branchesDistance);
  const { radius, color, emissiveIntensity } = useConfig(c => c.commit);

  const [isActive, setIsActive] = useState(false);

  const [spring, set] = useSpring(() => ({
    scale: [0.01, 0.01, 0.01],
    position: [0, 0.1, 0],
    rotation: [-Math.PI / 2, 0, 0]
  }));

  useEffect(() => {
    set({
      position: [branchIndex * branchesDistance, 0.1, index * commitsDistance]
    });
  }, [set, index, branchIndex, branchesDistance, commitsDistance]);

  useEffect(() => {
    if (isActive) {
      // open it
      set({ scale: [1, 1, 1] });
    } else {
      // close it
      set({ scale: [0.01, 0.01, 0.01] });
    }
  }, [isActive, set]);

  useFrame(({ clock }) => {
    if (!isActive) {
      if (
        // first commit show on start
        (!index && clock.elapsedTime * speed > index + 1) ||
        // for all the other commits {waitOnFirstCommit}s delay
        (clock.elapsedTime - waitOnFirstCommit) * speed > index + 1
      ) {
        setIsActive(true);
      }
    }
  });

  return (
    <a.mesh {...spring}>
      <circleBufferGeometry attach="geometry" args={[radius, 32]} />
      <meshLambertMaterial
        attach="material"
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        transparent
        opacity={isActive ? 1 : 0}
      />
    </a.mesh>
  );
};

export default Commit;
