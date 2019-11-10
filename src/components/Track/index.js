import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";

import { useConfig } from "utils/config";

const Track = () => {
  const ref = useRef();

  const speed = useConfig(config => config.speed);
  const commitsDistance = useConfig(config => config.commitsDistance);
  const { width, color, emissiveIntensity } = useConfig(config => config.track);

  useFrame(({ clock }) => {
    ref.current.scale.y = Math.max(clock.elapsedTime * speed - 1, 0.000001);
    ref.current.position.z =
      (clock.elapsedTime * speed * commitsDistance - commitsDistance) / 2;
    ref.current.rotation.x = -Math.PI / 2;
  });

  return (
    <mesh ref={ref}>
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
