import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt missing" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "Missing GROQ API key" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are a friendly and knowledgeable AI assistant that explains things step by step in simple, conversational language — just like ChatGPT. Always answer thoughtfully, provide examples if relevant, and help the user understand clearly.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    type GroqApiResponse = {
      choices: {
        message: {
          content: string;
        };
      }[];
    };

    const data = (await response.json()) as GroqApiResponse;
    const reply = data.choices[0]?.message?.content ?? "Hmm, I couldn't think of an answer!";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("LLM error:", err);
    return res.status(500).json({ message: "LLM request failed" });
  }
}
