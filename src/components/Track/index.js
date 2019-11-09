import React, { useRef, useEffect, useCallback } from "react";
import { useConfig } from "utils/config";
import { useSpring, a } from "react-spring/three";

const Track = () => {
  const ref = useRef();

  const { width, length, color, emissiveIntensity } = useConfig(
    config => config.track
  );

  const [spring, set] = useSpring(() => ({
    scale: [1, 1, 1],
    position: [0, 0, -length / 2],
    rotation: [-Math.PI / 2, 0, 0],
    config: { mass: 10, friction: 20, tension: 150 }
  }));

  const handlePointerOver = useCallback(
    e => {
      set({ scale: [0.95, 1.05, 1] });
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

  useEffect(() => {
    set({ position: [0, 0, -length / 2] });
  }, [set, length]);

  return (
    <a.mesh
      ref={ref}
      {...spring}
      onPointerOver={handlePointerOver}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    >
      <planeBufferGeometry attach="geometry" args={[width, length]} />
      <meshLambertMaterial
        attach="material"
        emissive={color}
        emissiveIntensity={emissiveIntensity}
      />
    </a.mesh>
  );
};

export default Track;
