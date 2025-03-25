import { useState } from "react";
import RepoSummary from "@/components/ui/Reposummary";

interface RepoTreeProps {
  treeData: any[];
  owner: string;
  repo: string;
  branch?: string;
}

export default function RepoTree({ treeData, owner, repo, branch = "main" }: RepoTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [fileExplanations, setFileExplanations] = useState<{ [key: string]: string }>({});
  const [loadingExplanations, setLoadingExplanations] = useState<{ [key: string]: boolean }>({});
  const [repoSummary, setRepoSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folder) ? prev.filter((f) => f !== folder) : [...prev, folder]
    );
  };

  const handleExplain = async (filePath: string) => {
    try {
      setLoadingExplanations((prev) => ({ ...prev, [filePath]: true }));
      
      // Fetch the content of the file
      const content = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`
      ).then((res) => res.text());

      const response = await fetch("/api/devrepo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: filePath, fileContent: content }),
      });

      const data = await response.json();
      setFileExplanations((prev) => ({ ...prev, [filePath]: data.explanation }));
    } catch (error) {
      console.error("Error explaining file:", error);
      setFileExplanations((prev) => ({
        ...prev,
        [filePath]: "❗ Failed to generate explanation. Please try again.",
      }));
    } finally {
      setLoadingExplanations((prev) => ({ ...prev, [filePath]: false }));
    }
  };

  const handleRepoSummary = async () => {
    setLoadingSummary(true);
    try {
      const response = await fetch("/api/repoSummary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo, branch }),
      });
      const data = await response.json();
      setRepoSummary(data.summary);
    } catch (err) {
      setRepoSummary("❗ Failed to generate repository summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const folders = treeData.filter((item) => item.type === "tree");
  const files = treeData.filter((item) => item.type === "blob" && !item.path.includes("/"));
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg"];
  const externalExtensions = [".pdf", ".ppt", ".pptx", ".doc", ".docx"];

  return (
    <div className="p-4">
      <h3 className="text-2xl mb-4 font-semibold">📚 Repository Structure</h3>

      {/* Loose files */}
      {files.length > 0 && (
        <div>
          <h4 className="text-xl mb-2 font-bold">Loose Files</h4>
          <ul className="pl-4 mb-4 border-l-2 border-gray-300">
            {files.map((file) => (
              <li key={file.path} className="mb-3">
                <div className="flex items-center justify-between">
                  <span>📄 {file.path}</span>
                  {imageExtensions.some((ext) => file.path.endsWith(ext)) ? (
                    <img
                      src={`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`}
                      alt={file.path}
                      className="max-w-[100px] max-h-[100px] object-contain border rounded"
                    />
                  ) : externalExtensions.some((ext) => file.path.endsWith(ext)) ? (
                    <a
                      href={`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Open File
                    </a>
                  ) : (
                    <button
                      onClick={() => handleExplain(file.path)}
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Explain
                    </button>
                  )}
                </div>
                {loadingExplanations[file.path] && (
                  <p className="text-gray-500 mt-1">⏳ Generating explanation...</p>
                )}
                {fileExplanations[file.path] && (
                  <pre className="bg-gray-100 p-3 rounded mt-2 text-sm whitespace-pre-wrap">
                    {fileExplanations[file.path]}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Folders */}
      {folders.map((folder) => (
        <div key={folder.path}>
          <div
            className="cursor-pointer font-bold text-lg mb-2 hover:underline"
            onClick={() => toggleFolder(folder.path)}
          >
            {expandedFolders.includes(folder.path) ? "📂" : "📁"} {folder.path}
          </div>

          {expandedFolders.includes(folder.path) && (
            <ul className="pl-6 mb-4 border-l-2 border-gray-300">
              {treeData
                .filter(
                  (f) =>
                    f.type === "blob" &&
                    f.path.startsWith(folder.path + "/") &&
                    f.path.split("/").length === folder.path.split("/").length + 1
                )
                .map((file) => (
                  <li key={file.path} className="mb-3">
                    <div className="flex items-center justify-between">
                      <span>📄 {file.path.split("/").pop()}</span>
                      {imageExtensions.some((ext) => file.path.endsWith(ext)) ? (
                        <img
                          src={`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`}
                          alt={file.path}
                          className="max-w-[100px] max-h-[100px] object-contain border rounded"
                        />
                      ) : externalExtensions.some((ext) => file.path.endsWith(ext)) ? (
                        <a
                          href={`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Open File
                        </a>
                      ) : (
                        <button
                          onClick={() => handleExplain(file.path)}
                          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          Explain
                        </button>
                      )}
                    </div>
                    {loadingExplanations[file.path] && (
                      <p className="text-gray-500 mt-1">⏳ Generating explanation...</p>
                    )}
                    {fileExplanations[file.path] && (
                      <pre className="bg-gray-100 p-3 rounded mt-2 text-sm whitespace-pre-wrap">
                        {fileExplanations[file.path]}
                      </pre>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>
      ))}

      {/* Summarize entire repo */}
      <div className="mt-6">
        <button
          onClick={handleRepoSummary}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Summarize Entire Repo
        </button>
        {loadingSummary && <p className="text-gray-500 mt-2">⏳ Generating summary...</p>}
        {repoSummary && <RepoSummary summary={repoSummary} />}
      </div>
    </div>
  );
}
