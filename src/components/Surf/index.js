import React, { createContext, useState } from "react";
import { useFrame } from "react-three-fiber";

import Branch from "components/Branch";
import CameraOperator from "components/CameraOperator";
import FlatText from "components/FlatText";
import useRepo from "hooks/useRepo";
import { useConfig } from "utils/config";

import useBranches from "./useBranches";

export const SurfContext = createContext({ currentCommit: -1 });

const Surf = () => {
  const { owner, repo, commits } = useRepo();
  const branches = useBranches(commits);

  const [currentCommit, setCurrentCommit] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const speed = useConfig(c => c.speed);
  const waitOnFirstCommit = useConfig(c => c.waitOnFirstCommit);

  useFrame(({ clock }) => {
    const ti = Math.max(
      0,
      Math.round((clock.elapsedTime - waitOnFirstCommit) * speed) - 1
    );
    const index = Math.min(ti, commits.length - 1);

    if (currentCommit < index) {
      setCurrentCommit(index);
    }

    if (!isEnded && ti > commits.length + 2) {
      setIsEnded(true);
    }
  });

  return (
    <SurfContext.Provider value={{ currentCommit, isEnded }}>
      {branches.map((b, i) => (
        <Branch
          key={b.name}
          name={b.name}
          index={b.index}
          color={b.color}
          commits={b.commits}
          skipFirstCommit={b.skipFirstCommit}
          skipLastCommit={b.skipLastCommit}
        />
      ))}

      {commits.length && <CameraOperator commitsCount={commits.length} />}

      {/* Repo name at the end of the experience */}
      {commits.length && (
        <FlatText
          active={isEnded}
          width={480}
          position={[
            commits[0].position.x + 3,
            commits[0].position.y,
            commits[0].position.z + 32
          ]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        >
          {repo}
          {`@${owner}`}
        </FlatText>
      )}
    </SurfContext.Provider>
  );
};

export default Surf;
