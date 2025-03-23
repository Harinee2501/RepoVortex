import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { owner, repo, branch } = req.body;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "Missing GROQ API key" });
  }

  try {
    const prompt = `
      This is a GitHub repository: ${owner}/${repo}, branch: ${branch}.
      Summarize what this entire repository does in simple words and in detail.Very detailed explanation should be given
      Then, create a table listing the technology stack used (languages, frameworks, libraries).
    `;

    const groqResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1500,
      },
      { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
    );

    return res.status(200).json({ summary: groqResponse.data.choices[0].message.content });
  } catch (err) {
    console.error("Error generating repo summary:", err);
    res.status(500).json({ message: "Error generating summary" });
  }
}
