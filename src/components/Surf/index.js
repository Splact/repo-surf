import React, { createContext, useState } from "react";
import { useFrame } from "react-three-fiber";

import Branch from "components/Branch";
import CameraOperator from "components/CameraOperator";
import useRepo from "hooks/useRepo";
import { useConfig } from "utils/config";

import useBranches from "./useBranches";

export const SurfContext = createContext({ currentCommit: -1 });

const Surf = () => {
  const { commits } = useRepo();
  const branches = useBranches(commits);

  const [currentCommit, setCurrentCommit] = useState(0);
  const speed = useConfig(c => c.speed);
  const waitOnFirstCommit = useConfig(c => c.waitOnFirstCommit);

  useFrame(({ clock }) => {
    const index = Math.min(
      Math.max(
        0,
        Math.round((clock.elapsedTime - waitOnFirstCommit) * speed) - 1
      ),
      commits.length - 1
    );

    if (currentCommit < index) {
      setCurrentCommit(index);
    }
  });

  return (
    <SurfContext.Provider value={{ currentCommit }}>
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
    </SurfContext.Provider>
  );
};

export default Surf;
