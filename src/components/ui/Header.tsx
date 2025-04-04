import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center p-4 bg-purple-700 text-white">
      <h1 className="text-2xl font-bold">RepoVortex 🦝</h1>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/history")}
          className="hover:underline"
        >
          View History
        </button>

        <button
          onClick={() => router.push("/contribution")}
          className="hover:underline"
        >
          Contribution Guidelines
        </button>
      </div>
    </div>
  );
}
