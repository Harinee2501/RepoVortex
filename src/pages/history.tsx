import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";

export default function History() {
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      supabase.auth.getSession().then(({ data: sessionData }) => {
        if (sessionData?.session?.user) {
          setUserId(sessionData.session.user.id);
        } else {
          router.push("/login");
        }
      });
    }
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from("repo_history")
          .select("repo_name, explanation, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching repo history:", error);
        } else {
          setSearchHistory(data);
          setFilteredHistory(data);
        }
      }
    };

    fetchHistory();
  }, [userId]);

  const handleRepoClick = (repoName: string) => {
    localStorage.setItem("selectedRepo", repoName);
    router.push("/dashboard");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = searchHistory.filter((h) =>
      h.repo_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredHistory(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Your Repo Search History</h1>
      <input
        type="text"
        placeholder="Search for a repo..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-2 mb-4 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <div className="space-y-4">
        {filteredHistory.length === 0 && <p>No matching repositories found.</p>}
        {filteredHistory.map((history, index) => (
          <div
            key={index}
            onClick={() => handleRepoClick(history.repo_name)}
            className="p-4 bg-white rounded shadow-md hover:bg-purple-100 cursor-pointer transition-all"
          >
            <h3 className="text-xl font-semibold text-purple-700 underline">
              {history.repo_name}
            </h3>
            <p className="text-gray-700 mt-2">{history.explanation}</p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(history.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
