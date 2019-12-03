import React from "react";

import CameraOperator from "components/CameraOperator";
import Branch from "components/Branch";
import useRepo from "hooks/useRepo";

const Surf = () => {
  const { owner, repo, commits, isLoading, error } = useRepo();
  console.log("Surf render", { owner, repo, commits, isLoading, error });

  return (
    <>
      {commits.length && <Branch commits={commits} />}

      <CameraOperator />
    </>
  );
};

export default Surf;
