const fetchCommits = async (owner, repo) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_BASE_URL}/github/${owner}/${repo}`
  );

  return response.json();
};

export default fetchCommits;
