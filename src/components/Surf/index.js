import React from "react";
import { useFrame } from "react-three-fiber";

import CameraOperator from "components/CameraOperator";
import Commit from "components/Commit";
import Track from "components/Track";
import useRepo from "hooks/useRepo";

const Surf = ({}) => {
  const { owner, repo, commits, isLoading, error } = useRepo();
  console.log("app render", { owner, repo, commits, isLoading, error });

  useFrame(({ clock }) => {});

  return (
    <>
      <Commit />
      <Track />

      <CameraOperator />
    </>
  );
};

export default Surf;
