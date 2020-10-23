import { useState, useEffect } from "react";

import loadingManager, { RESOURCE_TYPE_FETCH } from "utils/loadingManager";

const getRepoParamsFromPath = () => {
  const parts = window.location.pathname.replace(/^\/+|\/+$/g, "").split("/");
  if (parts.length < 2) {
    return {
      owner: undefined,
      repo: undefined
    };
  }

  return {
    owner: parts[0],
    repo: parts[1]
  };
};

const useRepo = () => {
  const [commits, setCommits] = useState([]);

  const { owner = "splact", repo = "morbido" } = getRepoParamsFromPath();

  useEffect(() => {
    async function fetch() {
      const fetchedCommitsResource = loadingManager.registerResource(
        `${process.env.REACT_APP_API_BASE_URL}/github/${owner}/${repo}`,
        RESOURCE_TYPE_FETCH
      );

      // get response as soon as available
      const fetchedCommits = await fetchedCommitsResource.get();
      // commits = commits.slice(41, 60);
      // commits.forEach((c, i) => (c.index = commits.length - i - 1));

      setCommits(fetchedCommits);
    }

    if (owner !== "" && repo !== "") {
      fetch();
    }
  }, [owner, repo]);

  return { owner, repo, commits };
};

export default useRepo;
