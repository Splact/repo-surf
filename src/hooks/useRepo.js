// import { useState, useEffect } from "react";
// import loadingManager, { RESOURCE_TYPE_FETCH } from "utils/loadingManager";
import splactMorbidoMasterCommits from "data/splact.morbido.master.json";

// const getRepoParamsFromPath = () => {
//   const parts = window.location.pathname.replace(/^\/+|\/+$/g, "").split("/");
//   if (parts.length < 2) {
//     return {
//       owner: undefined,
//       repo: undefined
//     };
//   }

//   return {
//     owner: parts[0],
//     repo: parts[1]
//   };
// };

const useRepo = () => {
  // NOTE: backend has been dismantled, so custom repo targeting is turned off

  // const [commits, setCommits] = useState([]);
  // const { owner = "splact", repo = "morbido" } = getRepoParamsFromPath();

  // useEffect(() => {
  //   async function fetch() {
  //     const fetchedCommitsResource = loadingManager.registerResource(
  //       `${process.env.REACT_APP_API_BASE_URL}/github/${owner}/${repo}`,
  //       RESOURCE_TYPE_FETCH
  //     );

  //     // get response as soon as available
  //     const fetchedCommits = await fetchedCommitsResource.get();
  //     // commits = commits.slice(41, 60);
  //     // commits.forEach((c, i) => (c.index = commits.length - i - 1));

  //     setCommits(fetchedCommits);
  //   }

  //   if (owner !== "" && repo !== "") {
  //     fetch();
  //   }
  // }, [owner, repo]);

  const owner = "splact";
  const repo = "morbido";
  const commits = splactMorbidoMasterCommits;

  return { owner, repo, commits };
};

export default useRepo;
