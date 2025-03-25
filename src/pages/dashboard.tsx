import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/ui/Header";
import RepoInput from "@/components/ui/RepoInput";
import ProgressList from "@/components/ui/ProgressList";
import { getRepoTree } from "@/utils/github";
import RepoTree from "@/components/ui/RepoTree";
import { supabase } from "@/utils/supabaseClient";
import { FiEdit3, FiSend, FiMessageCircle } from "react-icons/fi";
import NotesModal from "@/components/ui/NotesModel";
import { fetchLLMResponse } from "@/utils/llmService";

export default function Dashboard() {
  const [showNotes, setShowNotes] = useState(false);
  const [repos, setRepos] = useState<string[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [repoTree, setRepoTree] = useState<any[]>([]);
  const [owner, setOwner] = useState<string>("");
  const [repo, setRepo] = useState<string>("");
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
      await supabase.from("repo_history").insert([{
        repo_name: repoUrl,
        explanation,
        user_id: user.id,
      }]);
      console.log("Repo analysis stored in history.");
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
    } catch (error) {
      console.error("Error fetching repo structure:", error);
    }
  };

  const handleViewHistory = () => {
    router.push("/history");
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = { sender: "You", text: currentMessage };
    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setLoading(true);

    try {
      const reply = await fetchLLMResponse(currentMessage);
      const botMessage = { sender: "Bot", text: reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "Bot", text: "Oops! Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 p-6">
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
        className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 p-5 rounded-full shadow-lg text-white"
        title="Take Notes"
      >
        <FiEdit3 size={24} />
      </button>

      {showNotes && <NotesModal onClose={() => setShowNotes(false)} />}

      {/* Chatbot UI */}
      <div>
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-6 right-24 bg-green-500 hover:bg-green-600 p-4 rounded-full shadow-lg text-white"
          title="Open Chatbot"
        >
          <FiMessageCircle size={24} />
        </button>

        {showChat && (
          <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-xl shadow-xl flex flex-col p-4">
            <div className="flex-1 overflow-y-auto mb-4 border p-2 rounded">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    msg.sender === "You"
                      ? "text-right text-blue-700"
                      : "text-left text-gray-800"
                  }`}
                >
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
              {loading && <div className="text-gray-500 italic">LLM is typing...</div>}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border p-2 rounded"
                placeholder="Ask me anything..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleSendMessage}
                disabled={loading}
              >
                {loading ? "Sending..." : <FiSend size={20} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
