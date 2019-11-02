import delay from "utils/delay";
import reactCommits from "data/facebook.react.master.json";

// temp solution
export default async () => {
  // const commits = await fetch(
  //   `https://api.github.com/repos/facebook/react/commits?per_page=100`
  // );

  await delay(1000 * Math.random());
  return reactCommits;
};
