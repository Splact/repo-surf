import { useState, useEffect } from "react";

import { fetchCommits } from "api";

const getRepoParamsFromPath = () => {
  const parts = window.location.pathname.replace(/^\/+|\/+$/g, "").split("/");
  if (parts.length < 2) {
    return {
      owner: null,
      repo: null
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

  const { owner, repo } = getRepoParamsFromPath();

  if (!repo) {
    return { owner, repo, commits: [], isLoading: false, error: true };
  }

  useEffect(() => {
    async function fetch() {
      try {
        let cc = await fetchCommits(owner, repo);

        setState(state => ({ ...state, commits: cc, isLoading: false }));
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
