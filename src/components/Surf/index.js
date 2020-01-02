import React, { useMemo } from "react";
import { Vector3 } from "three";

import CameraOperator from "components/CameraOperator";
import Branch from "components/Branch";
import useRepo from "hooks/useRepo";
import { useConfig } from "utils/config";
import getBranchColor from "utils/getBranchColor";

const sortBranches = (ba, bb) => {
  const oldestACommit = ba.commits[ba.commits.length - 1].index;
  const oldestBCommit = bb.commits[bb.commits.length - 1].index;

  return oldestACommit > oldestBCommit ? 1 : -1;
};

const branchIndex2Position = index => {
  let position = Math.ceil(index / 2);
  if (index % 2 === 0) {
    position *= -1;
  }

  return position;
};

const getAvailableIndex = (currentBranch, branches) => {
  let positionIndex = -1;
  let position = null;

  do {
    positionIndex += 1;

    position = branchIndex2Position(positionIndex);
    console.log("Checking for position", position);
  } while (
    branches.find(
      // eslint-disable-next-line no-loop-func
      b => {
        const found =
          b.position === position &&
          ((b.range[0] > currentBranch.range[0] &&
            b.range[1] < currentBranch.range[1]) ||
            (b.range[0] < currentBranch.range[0] &&
              b.range[1] > currentBranch.range[0]) ||
            (b.range[0] < currentBranch.range[1] &&
              b.range[1] > currentBranch.range[1]));

        if (found) {
          console.log(
            ` Position ${position} not available: [${currentBranch.range[0]}, ${
              currentBranch.range[1]
            }] X [${b.range[0]}, ${b.range[1]}]`
          );
        }

        return found;
      }
    )
  );

  console.log(`%cPosition ${position} available`, "background: yellow;");

  return positionIndex;
};

const Surf = () => {
  const { owner, repo, commits, isLoading, error } = useRepo();
  const commitsDistance = useConfig(c => c.commitsDistance);
  const branchesDistance = useConfig(c => c.branchesDistance);

  console.log("Surf render", { owner, repo, commits, isLoading, error });

  const { branches } = useMemo(() => {
    const pendingBranches = commits.length
      ? commits[0].parents.map((_, i) => [commits[0].sha, i])
      : [];
    let branches = [];
    let currentBranch = {
      name: null,
      color: null,
      commits: [],
      index: null,
      position: null,
      range: [Infinity, 0]
    };
    const evaluatedCommits = [];

    while (pendingBranches.length) {
      const [sha, pathIndex] = pendingBranches.shift();
      const head = commits.find(c => c.sha === sha);

      if (head.parents.length <= pathIndex) {
        continue;
      }

      // that's the head/merge-commit
      currentBranch.commits.push(head);

      // update range
      if (currentBranch.range[0] > head.index) {
        currentBranch.range[0] = head.index;
      }
      if (currentBranch.range[1] < head.index) {
        currentBranch.range[1] = head.index;
      }

      let commit = commits.find(c => c.sha === head.parents[pathIndex]);

      if (!commit) {
        // commit was not found
        continue;
      }

      currentBranch.name = `${sha}--${pathIndex}`;

      console.groupCollapsed(`Branch ${currentBranch.name}`);
      console.log("head", head);
      console.groupCollapsed("Commits");

      while (commit && evaluatedCommits.indexOf(commit.sha) < 0) {
        currentBranch.commits.push(commit);
        evaluatedCommits.push(commit.sha);

        // update range
        if (currentBranch.range[0] > commit.index) {
          currentBranch.range[0] = commit.index;
        }
        if (currentBranch.range[1] < commit.index) {
          currentBranch.range[1] = commit.index;
        }

        console.log(`${commit.sha} #${commit.index}`, commit);

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
      }

      // Add fork commit if needed
      if (commit) {
        currentBranch.commits.push(commit);

        // update range
        if (currentBranch.range[0] > commit.index) {
          currentBranch.range[0] = commit.index;
        }
        if (currentBranch.range[1] < commit.index) {
          currentBranch.range[1] = commit.index;
        }

        if (branches.length && currentBranch.commits.length <= 2) {
          // this branch has only fork and merge commits
          // set index as the fork commit branch index

          console.log("This branch has only fork and merge commits");
          console.log("Searching for fork branch index...");

          const forkBranch = branches.find(b => {
            const i = b.commits.findIndex(c => c.sha === commit.sha);

            return b.index ? i > 0 && i < b.commits.length - 1 : i > -1;
          });

          if (forkBranch) {
            console.log(`... "${forkBranch.name}" found`, forkBranch);
            currentBranch.index = forkBranch.index;
          }
        }
      }
      console.groupEnd("Commits");

      if (currentBranch.index === null) {
        currentBranch.index = getAvailableIndex(currentBranch, branches);
      }

      currentBranch.position = branchIndex2Position(currentBranch.index);
      currentBranch.color = getBranchColor(currentBranch.index);

      console.log(
        `%ccolor ${currentBranch.color}`,
        `background-color: ${currentBranch.color}`
      );
      console.log("range", currentBranch.range);
      console.log("position", currentBranch.position);

      // eslint-disable-next-line no-loop-func
      currentBranch.commits.forEach(c => {
        if (c.position) {
          return;
        }

        c.position = new Vector3(
          currentBranch.position * branchesDistance,
          0,
          c.index * commitsDistance
        );
      });

      branches.push(currentBranch);
      console.groupEnd(`Branch ${currentBranch.name}`);

      currentBranch = {
        name: null,
        color: null,
        commits: [],
        index: null,
        position: null,
        range: [Infinity, 0]
      };
    }

    return { branches };
  }, [branchesDistance, commits, commitsDistance]);

  // console.log(branches);

  return (
    <>
      {branches.map(b => (
        <Branch
          key={b.name}
          name={b.name}
          index={b.index}
          color={b.color}
          commits={b.commits}
        />
      ))}

      <CameraOperator />
    </>
  );
};

export default Surf;
