import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/ui/DevHeadbar";
import RepoInput from "@/components/ui/RepoInput";
import ProgressList from "@/components/ui/ProgressList";
import { getRepoTree } from "@/utils/github";
import RepoTree from "@/components/ui/DevRepoTree";
import { supabase } from "@/utils/supabaseClient";
import { FiEdit3, FiMessageCircle } from "react-icons/fi"; // Notes & Chatbot buttons
import NotesModal from "@/components/ui/NotesModel";
import ChatModal from "@/components/ui/Chatbot"; // Chatbot modal
import axios from "axios";

export default function Dashboard() {
  const [showNotes, setShowNotes] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [repos, setRepos] = useState<string[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [repoTree, setRepoTree] = useState<any[]>([]);
  const [owner, setOwner] = useState<string>("");
  const [repo, setRepo] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn !== "true") {
      router.replace("/login");
    } else {
      const repoFromQuery = router.query.repo as string | undefined;
      const repoFromLocalStorage = localStorage.getItem("selectedRepo");

      if (repoFromQuery) {
        handleAnalyze(repoFromQuery);
        localStorage.removeItem("selectedRepo");
      } else if (repoFromLocalStorage) {
        handleAnalyze(repoFromLocalStorage);
        localStorage.removeItem("selectedRepo");
      }
    }
  }, [router]);

  const handleAnalyze = async (repoUrl: string) => {
    if (repos.includes(repoUrl)) return;
    setRepos((prev) => [...prev, repoUrl]);
    try {
      const explanation = "LLM-generated explanation will go here.";
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("No user session found");
        return;
      }

      const { data } = await axios.post("/api/devrepo", {
        fileName: repoUrl,
        fileContent: explanation,
      });

      await supabase.from("repo_history").insert([
        {
          repo_name: repoUrl,
          explanation: data.explanation || explanation,
          user_id: user.id,
        },
      ]);
    } catch (err) {
      console.error("Error during analyze:", err);
    }
  };

  const handleViewStructure = async (repoUrl: string) => {
    try {
      const parts = repoUrl.replace("https://github.com/", "").split("/");
      const ownerName = parts[0];
      const repoName = parts[1];
      const tree = await getRepoTree(ownerName, repoName);
      setOwner(ownerName);
      setRepo(repoName);
      setRepoTree(tree);
      setSelectedRepo(repoUrl);

      router.push(`/developer-dashboard?repo=${repoUrl}`);
    } catch (error) {
      console.error("Error fetching repo structure:", error);
    }
  };

  const handleViewHistory = () => {
    router.push("/history");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />

      <div className="mt-6">
        <RepoInput onSubmit={handleAnalyze} />
        <ProgressList repos={repos} onViewStructure={handleViewStructure} />

        {selectedRepo && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Structure of {selectedRepo}
            </h2>
            <RepoTree treeData={repoTree} owner={owner} repo={repo} branch="main" />
          </div>
        )}
      </div>

      <button
        onClick={handleViewHistory}
        className="mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        View History
      </button>

      <button
        onClick={() => setShowNotes(true)}
        className="fixed bottom-6 right-20 bg-pink-500 hover:bg-pink-600 p-5 rounded-full shadow-lg text-white"
        title="Take Notes"
      >
        <FiEdit3 size={24} />
      </button>

      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 p-5 rounded-full shadow-lg text-white"
        title="Chatbot"
      >
        <FiMessageCircle size={24} />
      </button>

      {showNotes && <NotesModal onClose={() => setShowNotes(false)} />}
      {showChat && <ChatModal onClose={() => setShowChat(false)} />}
    </div>
  );
}