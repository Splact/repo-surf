import { useState, useEffect } from "react";
import { Vector3 } from "three";

import { fetchCommits } from "api";
import { useConfig } from "utils/config";

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

  const commitsDistance = useConfig(c => c.commitsDistance);
  const branchesDistance = useConfig(c => c.branchesDistance);

  useEffect(() => {
    async function fetch() {
      try {
        let cc = await fetchCommits(owner, repo);
        const branches = [];

        if (cc.length) {
          cc = cc.map((c, i) => ({
            sha: c.sha,
            index: cc.length - i - 1,
            branchIndex: 0,
            commit: {
              authorDate: c.commit.author.date,
              date: c.commit.committer.date,
              message: c.commit.message,
              url: c.commit.url,
              commentCount: c.commit.comment_count
            },
            url: c.url,
            htmlUrl: c.html_url,
            author: c.author && {
              name: c.commit.author.name,
              username: c.author.login,
              picture: c.author.avatar_url,
              url: c.author.url,
              htmlUrl: c.author.html_url
            },
            committer: c.committer && {
              name: c.commit.committer.name,
              username: c.committer.login,
              picture: c.committer.avatar_url,
              url: c.committer.url,
              htmlUrl: c.committer.html_url
            },
            parents: c.parents.map(p => p.sha)
          }));

          branches.push([cc[0].sha]);

          cc.forEach(c => {
            const branchIndex = branches.findIndex(
              b => !!b.find(sha => sha === c.sha)
            );

            c.branchIndex = branchIndex;

            c.parents.forEach((p, pi) => {
              if (branches.length < branchIndex + pi + 1) {
                branches[branchIndex + pi] = [];
              }
              branches[branchIndex + pi].push(p);
            });

            c.position = new Vector3(
              c.branchIndex * branchesDistance,
              0,
              c.index * commitsDistance
            );
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
  }, [branchesDistance, commitsDistance, owner, repo]);

  return { owner, repo, ...state };
};
