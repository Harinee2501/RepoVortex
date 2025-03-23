interface ProgressListProps {
  repos: string[];
  onViewStructure: (repoUrl: string) => void;
}

export default function ProgressList({ repos, onViewStructure }: ProgressListProps) {
  return (
    <div className="mt-4">
      <h3 className="text-lg mb-2">Analyzed Repos:</h3>
      <ul>
        {repos.map((repo, index) => (
          <li key={index} className="flex justify-between items-center p-2 bg-white rounded shadow mb-2">
            <span>{repo}</span>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => onViewStructure(repo)}
            >
              View Structure
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
