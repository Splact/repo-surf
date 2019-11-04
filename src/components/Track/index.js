import React, { useRef, useEffect } from "react";
import { useConfig } from "utils/config";

const Track = () => {
  const ref = useRef();

  const { width, length, color, emissiveIntensity } = useConfig(
    config => config.track
  );

  useEffect(() => {
    ref.current.rotation.x = -Math.PI / 2;

    // ref.current.position.x = 0;
    // ref.current.position.y = 0;
    ref.current.position.z = -length / 2;
  }, [length]);

  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[width, length]} />
      <meshLambertMaterial
        attach="material"
        emissive={color}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
};

export default Track;
