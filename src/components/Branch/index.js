import React, { useRef, useMemo } from "react";
import { useFrame, extend, useThree } from "react-three-fiber";
import { Vector3, FrontSide } from "three";

import Commit from "components/Commit";
import { useConfig } from "utils/config";

import BranchGeometry from "./BranchGeometry";
import BranchMaterial from "./BranchMaterial";

extend({ BranchGeometry, BranchMaterial });

const Branch = ({
  name,
  index,
  color,
  commits,
  skipLastCommit,
  skipFirstCommit
}) => {
  const material = useRef();

  const speed = useConfig(c => c.speed);
  const commitsDistance = useConfig(c => c.commitsDistance);
  const waitOnFirstCommit = useConfig(c => c.waitOnFirstCommit);
  const { width, color: defaultColor } = useConfig(c => c.track);
  const { camera } = useThree();

  // console.log(`Render branch "${name}"`);

  const vertices = useMemo(() => {
    const vv = [];
    let lastIndex = commits[0].index - 1;

    commits.forEach((c, ci) => {
      const deltaIndex = lastIndex - c.index;

      if (deltaIndex > 1) {
        // if the gap is bigger then 1
        for (let i = deltaIndex - 1; i > 0; i--) {
          // add missing points
          vv.push(
            new Vector3(
              c.position.x,
              c.position.y,
              c.position.z + commitsDistance * i
            )
          );
        }
      }

      vv.push(c.position);

      lastIndex = c.index;
    });

    return vv;
  }, [commits, commitsDistance]);

  // commit are in reverse order
  const minIndex = commits[commits.length - 1].index;

  useFrame(({ clock }) => {
    const waitToBranch = minIndex / speed;
    // update dash offset
    material.current.uniforms.dashOffset.value = Math.min(
      Math.max(
        ((clock.elapsedTime - waitOnFirstCommit - waitToBranch) * speed -
          0.66) /
          vertices.length,
        0
      ),
      1
    );
  });

  return (
    <>
      <mesh renderOrder={1}>
        {/* MeshLine and CMRCurve are a OOP factories, not scene objects */}
        <branchGeometry
          onUpdate={self => (self.parent.geometry = self.geometry)}
        >
          <geometry onUpdate={self => self.parent.setGeometry(self)}>
            <catmullRomCurve3
              args={[vertices]}
              onUpdate={self =>
                (self.parent.vertices = self.getPoints(vertices.length * 10))
              }
            />
          </geometry>
        </branchGeometry>

        <branchMaterial
          attach="material"
          ref={material}
          lineWidth={width}
          color={color || defaultColor}
          emissive={color || defaultColor}
          depthTest={false}
          transparent
          near={camera.near}
          far={camera.far}
          fog
          dashArray={2}
          dashRatio={0.5}
          side={FrontSide}
        />
      </mesh>

      {commits.map((c, i) => {
        if (
          (!i && skipLastCommit) ||
          (i === commits.length - 1 && skipFirstCommit)
        ) {
          // do not render fork and merge commits (they have already been rendered their brnach)
          return null;
        }

        return (
          <Commit
            key={`commit--${c.sha}`}
            sha={c.sha}
            message={c.commit.message}
            position={c.position}
            color={color}
            index={c.index}
            renderOrder={2}
          />
        );
      })}
    </>
  );
};

export default Branch;
