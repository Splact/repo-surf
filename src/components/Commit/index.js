import React, { useRef, useEffect } from "react";
import { useFrame } from "react-three-fiber";

import { useConfig } from "utils/config";

const span = 150;

const Commit = () => {
  const ref = useRef();
  const movement = useRef(0);
  const { radius, color, emissiveIntensity } = useConfig(state => state.commit);
  const speed = useConfig(state => state.speed);

  useEffect(() => {
    ref.current.rotation.x = -Math.PI / 2;
    ref.current.position.y = 0.1;
  }, []);

  useFrame(() => {
    movement.current = Math.abs((movement.current + speed) % span);
    ref.current.position.z = -span + movement.current;
  });

  return (
    <mesh
      ref={ref}
      onClick={e => console.log("click")}
      onPointerOver={e => console.log("hover")}
      onPointerOut={e => console.log("unhover")}
    >
      <circleBufferGeometry attach="geometry" args={[radius, 24]} />
      <meshLambertMaterial
        attach="material"
        emissive={color}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
};

export default Commit;
