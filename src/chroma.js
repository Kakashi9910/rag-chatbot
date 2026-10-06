import "dotenv/config";
import { ChromaClient } from "chromadb";
import { embeddingFunction } from "./embeddings.js";

const client = new ChromaClient({
  host: process.env.CHROMA_HOST || "localhost",
  port: Number(process.env.CHROMA_PORT) || 8000,
});

export function getCollection() {
  return client.getOrCreateCollection({
    name: "documents",
    embeddingFunction,
    configuration: { hnsw: { space: "cosine" } },
  });
}
