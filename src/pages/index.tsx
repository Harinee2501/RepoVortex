import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-200 to-white dark:from-gray-800 dark:to-gray-900">
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-6">
        Welcome to RepoVortex 🦝
      </h1>
      <p className="text-2xl text-gray-700 dark:text-gray-300 mb-12 text-center max-w-xl">
        Start contributing in hours, not weeks — RepoVortex 🦝 makes repo onboarding seamless and intuitive.
      </p>
      <div className="flex gap-10">
        <button
          onClick={() => router.push("/beginner")}
          className="px-8 py-4 bg-indigo-600 text-white text-xl rounded-lg shadow hover:bg-indigo-700 transition"
        >
          👉 Continue as Beginner
        </button>
        <button
          onClick={() => router.push("/developer")}
          className="px-8 py-4 bg-green-600 text-white text-xl rounded-lg shadow hover:bg-green-700 transition"
        >
          👉 Continue as Developer
        </button>
      </div>
    </div>
  );
}
