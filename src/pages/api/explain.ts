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

  // If doc or README
  if (docExtensions.includes(ext) || fileName.toLowerCase().includes("readme")) {
    try {
      const docSummaryResponse = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-70b-8192",
          messages: [
            {
              role: "user",
              content: `Summarize this documentation in simple terms:\n\n${fileContent}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 1000,
        },
        { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
      );

      return res.status(200).json({ explanation: docSummaryResponse.data.choices[0].message.content });
    } catch (error: any) {
      console.error("Error summarizing documentation:", error.response?.data || error.message);
      return res.status(500).json({ message: "Error generating documentation summary" });
    }
  }

  // Handle code file explanation
  try {
    const codePrompt = `
      You are an expert code explainer.  
      Given the following file name: ${fileName} and content:  
      \`\`\`
      ${fileContent}
      \`\`\`  
      Please provide:  
      1. A simple summary of what this file does.  
      2. A line-by-line explanation in easy terms.  
      3. If this file belongs to a config or dataset, explain that too.
    `;

    const codeResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: codePrompt }],
        temperature: 0.3,
        max_tokens: 1500,
      },
      { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
    );

    return res.status(200).json({ explanation: codeResponse.data.choices[0].message.content });
  } catch (error: any) {
    console.error("Error generating explanation:", error.response?.data || error.message);
    return res.status(500).json({ message: "Error generating code explanation" });
  }
}
