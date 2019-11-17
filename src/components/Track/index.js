import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "react-three-fiber";

import { useConfig } from "utils/config";

const Track = () => {
  const ref = useRef();
  const [isActive, setIsActive] = useState(false);

  const speed = useConfig(c => c.speed);
  const waitOnFirstCommit = useConfig(c => c.waitOnFirstCommit);
  const commitsDistance = useConfig(c => c.commitsDistance);
  const { width, color, emissiveIntensity } = useConfig(c => c.track);

  useEffect(() => {
    ref.current.rotation.x = -Math.PI / 2;
  }, []);

  useFrame(({ clock }) => {
    // update scale
    ref.current.scale.y = Math.max(
      (clock.elapsedTime - waitOnFirstCommit) * speed - 1,
      0.01
    );
    // realign to 0
    ref.current.position.z = (ref.current.scale.y * commitsDistance) / 2;

    if (!isActive && ref.current.scale.y > 0.01) {
      setIsActive(true);
    }
  });

  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[width, commitsDistance]} />
      <meshLambertMaterial
        attach="material"
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        transparent
        opacity={isActive > 0.01 ? 1 : 0}
      />
    </mesh>
  );
};

export default Track;
