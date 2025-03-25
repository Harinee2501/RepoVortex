import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { fileName, fileContent } = req.body;

  if (!fileName || !fileContent) {
    return res.status(400).json({ message: "Missing file name or content" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "Missing GROQ API key in environment variables" });
  }

  const ext = path.extname(fileName).toLowerCase();
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg"];
  const docExtensions = [".md", ".txt", ".rst"];

  // If image file
  if (imageExtensions.includes(ext)) {
    return res.status(200).json({
      explanation: `🖼 This file (${fileName}) is an image file and does not contain code or text to explain.`,
    });
  }

  // If doc or README file
  if (docExtensions.includes(ext) || fileName.toLowerCase().includes("readme")) {
    try {
      // Updated prompt for documentation files to give a concise summary
      const docSummaryPrompt = `Provide a brief summary (in 3-4 sentences) of the key points of the following documentation without technical jargon:\n\n${fileContent}`;

      const docSummaryResponse = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-70b-8192",
          messages: [
            {
              role: "user",
              content: docSummaryPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 250,  // Limiting token count to keep it brief
        },
        { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
      );

      return res.status(200).json({ explanation: docSummaryResponse.data.choices[0].message.content });
    } catch (error: any) {
      console.error("Error summarizing documentation:", error.response?.data || error.message);
      return res.status(500).json({ message: "Error generating documentation summary" });
    }
  }

  // Handle code file summary and key features
  try {
    // Updated prompt for code files to provide a concise summary of key features
    const codeSummaryPrompt = `Please summarize the key features and purpose of this code file in 3-4 sentences. Focus on the main functionality and important parts of the code, without getting into technical jargon:\n\n${fileContent}`;

    const codeResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: codeSummaryPrompt }],
        temperature: 0.7,
        max_tokens: 250,  // Limiting token count to keep it brief
      },
      { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
    );

    return res.status(200).json({ explanation: codeResponse.data.choices[0].message.content });
  } catch (error: any) {
    console.error("Error generating explanation:", error.response?.data || error.message);
    return res.status(500).json({ message: "Error generating code explanation" });
  }
}
