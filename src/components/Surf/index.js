import React, { useMemo } from "react";

import CameraOperator from "components/CameraOperator";
import Branch from "components/Branch";
import useRepo from "hooks/useRepo";
import getColor from "utils/getColor";

const sortBranches = (ba, bb) => {
  const oldestACommit = ba.commits[ba.commits.length - 1].index;
  const oldestBCommit = bb.commits[bb.commits.length - 1].index;

  return oldestACommit > oldestBCommit ? 1 : -1;
};

const Surf = () => {
  const { owner, repo, commits, isLoading, error } = useRepo();
  console.log("Surf render", { owner, repo, commits, isLoading, error });

  const { branches } = useMemo(() => {
    const pendingBranches = commits.length
      ? commits[0].parents.map((_, i) => [commits[0].sha, i])
      : [];
    const branches = [];
    let currentBranch = {
      name: null,
      color: null,
      commits: []
    };
    const evaluatedCommits = [];

    while (pendingBranches.length) {
      const [sha, pathIndex] = pendingBranches.shift();
      let commit = commits.find(c => c.sha === sha);

      if (commit.parents.length <= pathIndex) {
        break;
      }

      currentBranch.commits.push(commit);
      commit = commits.find(c => c.sha === commit.parents[pathIndex]);

      currentBranch.name = `${sha}--${pathIndex}`;
      currentBranch.color = getColor();
      // console.group("New branch");
      // console.log(`sha ${currentBranch.name}`);
      // console.log(
      //   `%ccolor ${currentBranch.color}`,
      //   `background-color: ${currentBranch.color}`
      // );
      // console.log("head", commit);
      // console.groupEnd("New branch");

      do {
        currentBranch.commits.push(commit);
        evaluatedCommits.push(commit.sha);

        // console.log(`Add commit "${commit.sha}" (${commit.index}) to branch`);

        if (commit.parents.length) {
          const nextCommitSha = commit.parents[0];

          for (let i = 1; i < commit.parents.length; i++) {
            // console.log(`%cFound new branch "${commit.sha}"`, "color: gold;");
            pendingBranches.push([commit.sha, i]);
          }

          commit = commits.find(c => c.sha === nextCommitSha);
        } else {
          commit = null;
        }
      } while (commit && evaluatedCommits.indexOf(commit.sha) < 0);

      // Add fork commit if needed
      if (commit) {
        currentBranch.commits.push(commit);
      }
      // console.log("%cEnd of branch (first commit read)", "color: red;");

      branches.push(currentBranch);
      currentBranch = { name: null, color: null, commits: [] };
    }

    return { branches: branches.sort(sortBranches) };
  }, [commits]);

  // console.log(branches);

  return (
    <>
      {branches.map(b => (
        <Branch key={b.name} color={b.color} commits={b.commits} />
      ))}

      <CameraOperator />
    </>
  );
};

export default Surf;
