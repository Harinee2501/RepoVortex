import axios from "axios";

// Function to get the file tree (you already have this)
export const getRepoTree = async (owner: string, repo: string, branch: string = "main") => {
  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );
  return response.data.tree;
};

// Function to get the list of files in the repo
export const getRepoFiles = async (owner: string, repo: string, branch: string = "main") => {
  try {
    // Fetch the repository tree
    const tree = await getRepoTree(owner, repo, branch);

    // Filter out the files (i.e., items with 'type' of 'blob', which indicates a file)
    const files = tree.filter((item: any) => item.type === "blob");

    // Return a simplified array of file paths
    return files.map((file: any) => ({
      name: file.path.split('/').pop(),  // Extract file name
      path: file.path,  // Full path in the repo
    }));
  } catch (error) {
    console.error("Error fetching repo files:", error);
    return [];
  }
};

export const getFileContent = async (owner: string, repo: string, branch: string, filePath: string) => {
  const response = await axios.get(
    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`
  );
  return response.data;
};
