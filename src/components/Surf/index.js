import React from "react";

import CameraOperator from "components/CameraOperator";
import Commit from "components/Commit";
import Track from "components/Track";
import useRepo from "hooks/useRepo";

const Surf = () => {
  const { owner, repo, commits, isLoading, error } = useRepo();
  console.log("Surf render", { owner, repo, commits, isLoading, error });

  return (
    <>
      {commits.map((c, i) => (
        <Commit key={c.sha} index={i} branchIndex={c.branchIndex} />
      ))}
      <Track />

      <CameraOperator />
    </>
  );
};

export default Surf;
