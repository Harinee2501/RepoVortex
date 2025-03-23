import React from "react";
import ReactMarkdown from "react-markdown";
import styles from "../../styles/RepoSummary.module.css";

interface RepoSummaryProps {
  summary: string;
}

const RepoSummary: React.FC<RepoSummaryProps> = ({ summary }) => {
  // Function to render tables in the summary
  const renderTable = (text: string) => {
    const tableRegex = /(\|[^\n]+\|\n)(\|[-\s|]+\|\n)((?:\|[^\n]+\|\n?)+)/m;
    const match = text.match(tableRegex);

    if (!match) return null;

    const headers = match[1]
      .trim()
      .split("|")
      .filter((h) => h.trim() !== "")
      .map((h) => h.trim());

    const rows = match[3]
      .trim()
      .split("\n")
      .filter((row) => row.trim() !== "")
      .map((row) =>
        row
          .split("|")
          .filter((c) => c.trim() !== "")
          .map((c) => c.trim())
      );

    return (
      <table className={styles.techStackTable}>
        <thead>
          <tr>
            {headers.map((h, idx) => (
              <th key={idx}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, cIdx) => (
                <td key={cIdx}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Function to filter out the "Technology Stack" section
  const removeTechStackSection = (text: string) => {
    // Regular expression to remove the "Technology Stack" table or block
    const techStackRegex = /(?:Technology Stack|Stack:)([\s\S]*?)(?=\n|$)/m;
    return text.replace(techStackRegex, "");
  };

  // Remove the "Technology Stack" part from the summary
  const filteredSummary = removeTechStackSection(summary);

  const tableContent = renderTable(filteredSummary);

  return (
    <div className={styles.repoSummaryContainer}>
      <h3>📋 Repository Summary</h3>
      <div className={styles.rawSummary}>
        <ReactMarkdown>{filteredSummary}</ReactMarkdown>
      </div>
      {tableContent && (
        <>
          {tableContent}
        </>
      )}
    </div>
  );
};

export default RepoSummary;
