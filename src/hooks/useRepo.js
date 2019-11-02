import { useState, useEffect } from "react";
import { fetchCommits } from "api";

const getRepoParamsFromPath = () => {
  const parts = window.location.pathname.replace(/^\/+|\/+$/g, "").split("/");
  if (parts.length < 2) {
    return false;
  }

  return {
    owner: parts[0],
    repo: parts[1]
  };
};

export default () => {
  const [commits, setCommits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { owner, repo } = getRepoParamsFromPath();

  if (!repo) {
    return false;
  }

  useEffect(() => {
    async function fetch() {
      try {
        setIsLoading(true);
        const cc = await fetchCommits(owner, repo);
        setCommits(cc);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (owner !== "" && repo !== "") {
      fetch();
    }
  }, [owner, repo]);

  return { owner, repo, commits, isLoading, error };
};
