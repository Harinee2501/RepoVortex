import axios from "axios";

export const getRepoTree = async (owner: string, repo: string, branch: string = "main") => {
  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );
  return response.data.tree;
};

export const getFileContent = async (owner: string, repo: string, branch: string, filePath: string) => {
  const response = await axios.get(
    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`
  );
  return response.data;
};
