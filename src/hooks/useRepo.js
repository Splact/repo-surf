import { useState, useEffect } from "react";

import { fetchCommits } from "api";

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

export default () => {
  const [state, setState] = useState({
    commits: [],
    isLoading: true,
    error: null
  });

  const { owner = "splact", repo = "morbido" } = getRepoParamsFromPath();

  if (!repo) {
    return { owner, repo, commits: [], isLoading: false, error: true };
  }

  useEffect(() => {
    async function fetch() {
      try {
        let commits = await fetchCommits(owner, repo);
        // commits = commits.slice(41, 60);
        // commits.forEach((c, i) => (c.index = commits.length - i - 1));

        setState(state => ({
          ...state,
          commits,
          isLoading: false
        }));
      } catch (error) {
        setState(state => ({ ...state, isLoading: false, error }));
      }
    }

    if (owner !== "" && repo !== "") {
      fetch();
    }
  }, [owner, repo]);

  return { owner, repo, ...state };
};
