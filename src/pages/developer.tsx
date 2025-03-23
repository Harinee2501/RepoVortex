"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";

export default function DeveloperHome() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-gray-900 shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-green-700">RepoVortex 🦝</h1>
          <nav className="flex gap-6 items-center text-lg">
            <Link href="/">Home</Link>
            <Link href="#about">About</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="ml-4"
              >
                {theme === "light" ? <Moon /> : <Sun />}
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-grow">
        <section className="text-center py-20 bg-gradient-to-b from-green-100 to-white dark:from-gray-800 dark:to-gray-900">
          <h2 className="text-5xl font-bold mb-4">
            Already a developer who loves to ship fast and smart?
          </h2>
          <p className="text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mt-6">
            Skip the deep dives — get instant repo insights, structure maps, and contributor guides.  
          </p>
        </section>

        {/* About */}
        <section id="about" className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-4xl font-bold text-center mb-10">About for Developers</h3>
            <ul className="text-xl space-y-6 text-gray-700 dark:text-gray-300 list-disc pl-6">
              <li>⚡ Get instant summaries and visual structure maps for any repo.</li>
              <li>📂 Quickly scan architecture diagrams and dependencies.</li>
              <li>📝 Access contributor guides to help others onboard faster.</li>
              <li>⭐ Mark frequently used repos for quick re-access.</li>
              <li>📊 See contribution analytics to identify impact zones.</li>
              <li>🚀 Work faster with AI explanations tailored for experts.</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="bg-green-700 text-white text-center p-4">
        © 2025 RepoVortex 🦝 — Fast, insightful, and contributor-friendly.
      </footer>
    </div>
  );
}
