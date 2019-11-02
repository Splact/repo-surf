import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";

const speed = 1.5;

export default () => {
  const ref = useRef();
  const movement = useRef(0);

  useFrame(() => {
    ref.current.rotation.x = ref.current.rotation.y += 0.01;
    movement.current = Math.abs((movement.current + speed) % 300);
    ref.current.position.z = -200 + movement.current;
  });

  return (
    <mesh
      ref={ref}
      onClick={e => console.log("click")}
      onPointerOver={e => console.log("hover")}
      onPointerOut={e => console.log("unhover")}
    >
      <boxBufferGeometry attach="geometry" args={[10, 10, 10]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  );
};
