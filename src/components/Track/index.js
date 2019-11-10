import React, { useRef, useEffect, useCallback } from "react";
import { useFrame } from "react-three-fiber";
import { useSpring, a } from "react-spring/three";

import { useConfig } from "utils/config";

const Track = () => {
  const ref = useRef();

  const speed = useConfig(config => config.speed);
  const commitsDistance = useConfig(config => config.commitsDistance);
  const { width, color, emissiveIntensity } = useConfig(config => config.track);

  const [spring, set] = useSpring(() => ({
    // scale: [1, 1, 0],
    rotation: [-Math.PI / 2, 0, 0],
    config: { mass: 10, friction: 20, tension: 150 }
  }));

  const handlePointerOver = useCallback(
    e => {
      // set({ scale: [0.95, 1.05, 1] });
    },
    [set]
  );
  const handlePointerMove = useCallback(
    e => {
      set({ rotation: [-Math.PI / 2, (Math.PI / 24) * e.point.x, 0] });
    },
    [set]
  );
  const handlePointerOut = useCallback(
    e => {
      set({ rotation: [-Math.PI / 2, 0, 0], scale: [1, 1, 1] });
    },
    [set]
  );

  useFrame(({ clock }) => {
    ref.current.scale.y = Math.max(clock.elapsedTime * speed - 1, 0);
    ref.current.position.z =
      (clock.elapsedTime * speed * commitsDistance - commitsDistance) / 2;
    ref.current.rotation.x = -Math.PI / 2;
  });

  return (
    <mesh
      ref={ref}
      onPointerOver={handlePointerOver}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    >
      <planeBufferGeometry attach="geometry" args={[width, commitsDistance]} />
      <meshLambertMaterial
        attach="material"
        emissive={color}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
};

export default Track;
