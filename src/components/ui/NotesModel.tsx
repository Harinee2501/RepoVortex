import { useState } from "react";
import { jsPDF } from "jspdf";
import { FaTimes, FaDownload } from "react-icons/fa";

export default function NotesModal({ onClose }: { onClose: () => void }) {
  const [note, setNote] = useState("");

  const handleSavePDF = () => {
    const doc = new jsPDF();
    doc.text(note || "No notes written.", 10, 10);
    doc.save("my_notes.pdf");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-100 to-white rounded-2xl shadow-2xl w-96 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-bold text-purple-600 mb-4">📝 Your Notes</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write something creative..."
          className="w-full h-48 p-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-inner"
        />
        <div className="flex justify-end mt-4 gap-3">
          <button
            onClick={handleSavePDF}
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md flex items-center gap-2 shadow-md transition-transform hover:scale-105"
          >
            <FaDownload /> Save PDF
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
