import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { getCollection } from "./chroma.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const collection = await getCollection();

export async function ask(question, topK = 4) {
  // 1. Retrieve (Chroma embeds the question with our sentence-transformer)
  const results = await collection.query({
    queryTexts: [question],
    nResults: topK,
  });

  const docs = results.documents[0] ?? [];
  const metas = results.metadatas[0] ?? [];

  const context = docs
    .map((d, i) => `[${i + 1}] (${metas[i]?.source})\n${d}`)
    .join("\n\n");

  // 2. Generate
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: `CONTEXT:\n${context}\n\nQUESTION:\n${question}`,
    config: {
      systemInstruction:
        "Answer using only the provided context. If the answer is not in the context, say you don't know. Cite sources like [1].",
    },
  });

  return {
    answer: response.text,
    sources: metas,
  };
}