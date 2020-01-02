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
        let cc = await fetchCommits(owner, repo);

        if (cc.length) {
          cc = cc.map((c, i) => ({
            sha: c.sha,
            index: cc.length - i - 1,
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
