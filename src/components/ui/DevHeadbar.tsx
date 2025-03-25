import Link from "next/link";

export default function Header() {
  return (
    <div className="flex justify-between items-center p-4 bg-purple-700 text-white">
      <h1 className="text-2xl font-bold">RepoVortex 🦝</h1>
      <div className="flex gap-4">
        <button
          onClick={() => window.location.href = "/history"}
          className="hover:underline"
        >
          View History
        </button>
      </div>
    </div>
  );
}
