import { useState } from "react";
import { jsPDF } from "jspdf";

const contributionContent = `Guidelines for Open Source Contribution

1. What is Open Source?
Open-source projects are publicly available projects where anyone can view, use, modify, and contribute to the codebase.

2. Why Contribute to Open Source?
- Learn from real-world projects
- Improve your skills and portfolio
- Collaborate with the community
- Give back to the developer ecosystem

Step-by-Step Contribution Guide

Step 1: Create a GitHub Account
1. Go to github.com.
2. Sign up and verify your email address.

Step 2: Understand Key GitHub Terms
- **Repository (Repo):** A project's folder with all code & files.
- **Fork:** Your copy of a repository to make changes independently.
- **Clone:** Download the repo to your local machine.
- **Pull Request (PR):** A request to merge your changes into the main project.
- **Branch:** A version of the repository where you can make changes.

Step 3: Find a Project to Contribute To
- Check issues labeled as 'good first issue' or 'help wanted'.
- Explore repositories on GitHub Explore.
- Look for projects that align with your interest.

Step 4: Fork the Repository
1. On the repository page, click Fork (top-right corner).
2. This will create a copy of the repository under your account.

Step 5: Clone the Forked Repository

git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

Step 6: Create a Branch

git checkout -b feature/your-feature-name

Step 7: Make Your Changes Locally
- Write clean, understandable code.
- Follow the project's code style guidelines.
- Add comments and documentation if needed.

Step 8: Add and Commit Changes

git add .
git commit -m "Added feature: [Short description of changes]"

Step 9: Push Changes to GitHub

git push origin feature/your-feature-name

Step 10: Create a Pull Request (PR)
1. Go to your forked repo on GitHub.
2. Click Compare & Pull Request.
3. Fill in the PR description.
4. Click Create Pull Request.

Step 11: Respond to Review Feedback
- Be polite and receptive to suggestions.
- Make requested changes and update your PR.

Step 12: Keep Your Fork Updated

git remote add upstream https://github.com/<original-owner>/<repo-name>.git
git fetch upstream
git merge upstream/main
git push

Step 13: Celebrate Your Contribution!
- Share your contribution with your community.
- Keep learning and contributing!

Best Practices:
- Write clear commit messages and PR descriptions.
- Always pull latest changes before starting work.
- Add tests if possible.
- Respect project maintainers and community guidelines.

Common Git Commands Cheat Sheet:

| Command | Purpose |
|-------------------------------------|-----------------------------------|
| git clone <repo-url> | Clone a repo to your local machine |
| git checkout -b <branch-name> | Create a new branch and switch to it |
| git add . | Add all files to staging |
| git commit -m "message" | Commit changes with a message |
| git push origin <branch-name> | Push branch to GitHub |
| git pull upstream main | Pull latest changes from original repo |
| git merge <branch> | Merge another branch into current branch |

Learn More:
- [Git Handbook by GitHub](https://guides.github.com/introduction/git-handbook/)
- [Open Source Guides](https://opensource.guide/how-to-contribute/)
- [First Contributions Guide](https://firstcontributions.github.io)

🎉 End of document - Happy Contributing! 🎉`;

export default function Contribution() {
  const [loading, setLoading] = useState(false);

  const handleDownloadPDF = () => {
    setLoading(true);
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(12);
    doc.text(contributionContent, 10, 10, { maxWidth: 180 });
    doc.save("OpenSourceContribution.pdf");
    setLoading(false);
  };

  return (
    <div className="p-8 bg-gray-50 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Guidelines for Open Source Contribution</h1>
      <div className="bg-white p-6 rounded-lg shadow-md max-h-[500px] overflow-y-auto border border-gray-200">
        <pre className="whitespace-pre-wrap text-base leading-relaxed text-gray-800">{contributionContent}</pre>
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Generating PDF..." : "Download as PDF"}
        </button>
      </div>
    </div>
  );
}
