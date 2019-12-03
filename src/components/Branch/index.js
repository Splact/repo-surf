import React, { useRef, useMemo } from "react";
import { useFrame, extend, useThree } from "react-three-fiber";
import { Vector3, BackSide } from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";

import Commit from "components/Commit";
import { useConfig } from "utils/config";

import BranchMaterial from "./BranchMaterial";

extend({ MeshLine, MeshLineMaterial, BranchMaterial });

const Branch = ({ commits }) => {
  const material = useRef();

  const speed = useConfig(c => c.speed);
  const waitOnFirstCommit = useConfig(c => c.waitOnFirstCommit);
  const commitsDistance = useConfig(c => c.commitsDistance);
  const branchesDistance = useConfig(c => c.branchesDistance);
  const { width, color } = useConfig(c => c.track);
  const { camera } = useThree();

  const preparedCommits = useMemo(
    () =>
      commits.map((c, i) => ({
        ...c,
        position: new Vector3(
          c.branchIndex * branchesDistance,
          0,
          (commits.length - i - 1) * commitsDistance
        )
      })),
    [commits, branchesDistance, commitsDistance]
  );

  useFrame(({ clock }) => {
    // update scale
    material.current.uniforms.dashOffset.value = Math.min(
      Math.max(
        ((clock.elapsedTime - waitOnFirstCommit) * speed - 0.66) /
          preparedCommits.length,
        0
      ),
      1
    );
  });

  const vertices = useMemo(() => preparedCommits.map(c => c.position), [
    preparedCommits
  ]);

  return (
    <>
      <mesh>
        {/* MeshLine and CMRCurve are a OOP factories, not scene objects */}
        <meshLine onUpdate={self => (self.parent.geometry = self.geometry)}>
          <geometry onUpdate={self => self.parent.setGeometry(self)}>
            <catmullRomCurve3
              args={[vertices]}
              onUpdate={self =>
                (self.parent.vertices = self.getPoints(vertices.length * 10))
              }
            />
          </geometry>
        </meshLine>

        <branchMaterial
          attach="material"
          ref={material}
          lineWidth={width}
          color={color}
          depthTest={false}
          transparent
          near={camera.near}
          far={camera.far}
          fog
          dashArray={2}
          dashRatio={0.5}
          side={BackSide}
        />
      </mesh>

      {preparedCommits.map((c, i) => (
        <Commit
          key={c.sha}
          position={c.position}
          index={commits.length - i - 1}
        />
      ))}
    </>
  );
};

export default Branch;
