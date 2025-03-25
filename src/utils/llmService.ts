export async function fetchLLMResponse(prompt: string): Promise<string> {
  const res = await fetch("/api/llm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error("Failed to get LLM response");
  }

  const data = await res.json();
  return data.reply;
}
