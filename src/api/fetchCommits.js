import delay from "utils/delay";

// temp solution
export default async (owner, repo) => {
  // const commits = await fetch(
  //   `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`
  // );

  await delay(1000 * Math.random());

  let commits = [];

  if (owner === "facebook" && repo === "react") {
    commits = require("data/facebook.react.master.json");
  } else {
    commits = require("data/mrdoob.three.js.master.json");
  }

  return commits;
};
