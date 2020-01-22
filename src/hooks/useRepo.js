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

  const { owner = "facebook", repo = "react" } = getRepoParamsFromPath();

  if (!repo) {
    return { owner, repo, commits: [], isLoading: false, error: true };
  }

  useEffect(() => {
    async function fetch() {
      try {
        let commits = await fetchCommits(owner, repo);

        // TEMP: limit to a small preview
        if (commits.length > 128) {
          commits = commits.slice(commits.length - 128);
        }

        setState(state => ({ ...state, commits, isLoading: false }));
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
