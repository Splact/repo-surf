import React, { useRef, useEffect, useMemo } from "react";
import { useConfig } from "utils/config";
import { Vector3, Object3D } from "three";

const dummy = new Object3D();

const Debris = ({ commitsCount }) => {
  const instancedMesh = useRef();
  const commitsDistance = useConfig(c => c.commitsDistance);
  const debris = useMemo(
    () =>
      new Array(commitsCount * 35).fill().map((_, i) => {
        const t = Math.random();
        const radius = commitsDistance * 2;

        const position = new Vector3(
          -radius + Math.random() * radius * 2,
          -radius + Math.random() * radius * 2,
          commitsDistance * (i % commitsCount) -
            radius +
            Math.random() * radius * 2
        );

        const speed = 0.1 + Math.random();

        return {
          index: i,
          scale: 0.25 + Math.random() * 0.5,
          position,
          speed,
          radius,
          t
        };
      }),
    [commitsCount, commitsDistance]
  );

  useEffect(() => {
    debris.forEach(({ position, scale }, i) => {
      dummy.position.copy(position);
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(
        Math.sin(Math.random()) * Math.PI,
        Math.sin(Math.random()) * Math.PI,
        Math.cos(Math.random()) * Math.PI
      );
      dummy.updateMatrix();
      instancedMesh.current.setMatrixAt(i, dummy.matrix);
    });
    instancedMesh.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh
      ref={instancedMesh}
      args={[null, null, debris.length]}
      frustumCulled={false}
    >
      <coneBufferGeometry attach="geometry" args={[2, 2, 3]} />
      <meshStandardMaterial
        attach="material"
        color="#FFFFFF"
        emissive="#555555"
      />
    </instancedMesh>
  );
};

export default Debris;
