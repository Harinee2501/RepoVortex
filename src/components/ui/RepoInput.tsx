import { useState } from "react";

export default function RepoInput({ onSubmit }: { onSubmit: (url: string) => void }) {
  const [repoUrl, setRepoUrl] = useState("");

  const handleAnalyze = () => {
    if (repoUrl.trim() !== "") {
      onSubmit(repoUrl.trim());
      setRepoUrl(""); // clear after submission
    }
  };

  return (
    <div className="flex gap-2 p-4">
      <input
        type="text"
        placeholder="Enter GitHub repo URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        className="border rounded p-2 w-full"
      />
      <button
        onClick={handleAnalyze}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        Analyze
      </button>
    </div>
  );
}
