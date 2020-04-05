import React, { forwardRef, useEffect, useContext } from "react";
import { useSpring, a } from "react-spring/three";

import FlatText from "components/FlatText";
import { SurfContext } from "components/Surf";
import { useConfig } from "utils/config";

const Commit = forwardRef((props, ref) => {
  const { index, position, color, renderOrder = 0, sha, message } = props;
  const { radius, color: defaultColor, emissiveIntensity } = useConfig(
    c => c.commit
  );

  const { currentCommit } = useContext(SurfContext);
  const isActive = index < currentCommit + 1;
  const isCurrent = index > currentCommit - 2 && index <= currentCommit;

  const [spring, set] = useSpring(() => ({
    scale: [0.01, 0.01, 0.01],
    position: [0, 0, 0],
    rotation: [0, 0, 0]
  }));

  useEffect(() => {
    if (isActive) {
      // open it
      set({ scale: [1, 1, 1] });
    } else {
      // close it
      set({ scale: [0.01, 0.01, 0.01] });
    }
  }, [isActive, set]);

  useEffect(() => {
    if (isCurrent) {
      // open it
      set({ scale: [1.2, 1.2, 1.2], position: [0, 1, 0] });
    } else {
      // close it
      set({ scale: [1, 1, 1], position: [0, 0, 0] });
    }
  }, [isCurrent, set]);

  return (
    <group
      position={[position.x, position.y, position.z]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <FlatText
        active={isCurrent}
        position={[-radius, 0, 5]}
        rotation={[-Math.PI / 2, Math.PI, 0]}
        renderOrder={renderOrder + 1}
      >
        {sha.substr(0, 7)}
        {""}
        {message}
      </FlatText>

      <a.mesh {...spring} ref={ref} renderOrder={renderOrder}>
        <circleBufferGeometry attach="geometry" args={[radius, 32]} />
        <meshLambertMaterial
          attach="material"
          emissive={color || defaultColor}
          emissiveIntensity={emissiveIntensity}
          depthTest={false}
          transparent
          opacity={isActive ? 1 : 0}
        />
      </a.mesh>
    </group>
  );
});

export default Commit;
