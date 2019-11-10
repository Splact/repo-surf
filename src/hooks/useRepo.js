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
  const [state, setState] = useState({
    commits: [],
    isLoading: true,
    error: null
  });

  const { owner, repo } = getRepoParamsFromPath();

  if (!repo) {
    return false;
  }

  useEffect(() => {
    async function fetch() {
      try {
        const cc = await fetchCommits(owner, repo);
        const branches = [];

        if (cc.length) {
          branches.push([cc[0].sha]);

          cc.forEach((c, i) => {
            const branchIndex = branches.findIndex(
              b => !!b.find(sha => sha === c.sha)
            );

            c.branchIndex = branchIndex;

            c.parents.forEach((p, pi) => {
              if (branches.length < branchIndex + pi + 1) {
                branches[branchIndex + pi] = [];
              }
              branches[branchIndex + pi].push(p.sha);
            });
          });
        }

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
