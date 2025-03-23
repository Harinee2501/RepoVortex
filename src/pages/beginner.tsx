"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";

export default function BeginnerHome() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-gray-900 shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-indigo-700">RepoVortex 🦝</h1>
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
        <section className="text-center py-20 bg-gradient-to-b from-indigo-100 to-white dark:from-gray-800 dark:to-gray-900">
          <h2 className="text-5xl font-bold mb-4">
            “Every big repo starts with a single line of code — let's break it down for you!”
          </h2>
          <p className="text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mt-6">
            Paste any repository link and get simple, line-by-line explanations like a mentor sitting beside you.
          </p>
        </section>

        {/* About / Instructions */}
        <section id="about" className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-4xl font-bold text-center mb-10">How It Works</h3>
            <ul className="text-xl space-y-6 text-gray-700 dark:text-gray-300 list-disc pl-6">
              <li>🔎 <b>Drop a GitHub Repo Link</b>: Paste any public repo URL — we’ll break it down line by line in simple words. No jargon, just clarity!</li>
              <li>🕰️ <b>Your Searches, Saved Forever</b>: Every repo you explore is saved in your search history — revisit, learn, and never lose track.</li>
              <li>📝 <b>Take Smart Notes & Export as PDF</b>: Jot down what you learn, your ideas, or code snippets — and save everything as a PDF for easy review.</li>
              <li>⭐ <b>Mark Favorite Projects</b>: Found something exciting? Mark it! Build your personal project store with a timeline of all your marked repositories.</li>
              <li>📈 <b>Get Contribution Insights</b>: Not sure where to contribute? We’ll suggest projects and beginner-friendly issues tailored just for you.</li>
              <li>📊 <b>Track Your Growth</b>: See how far you've come — from understanding code to making contributions — with progress tracking that keeps you motivated!</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="bg-indigo-700 text-white text-center p-4">
        © 2025 RepoVortex 🦝 — Helping you conquer open source!
      </footer>
    </div>
  );
}
