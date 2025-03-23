import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  const result = await streamText({
    model: openrouter("deepseek/deepseek-r1:free"),
    messages,
  });
  return result.toDataStreamResponse();
}
