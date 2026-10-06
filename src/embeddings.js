import { pipeline } from "@huggingface/transformers";

let extractor;

async function getExtractor() {
  // Downloads the model on first run, then caches it locally
  extractor ??= await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  return extractor;
}

export async function embed(texts) {
  const ex = await getExtractor();
  const output = await ex(texts, { pooling: "mean", normalize: true });
  return output.tolist(); // number[][]
}

// Lets ChromaDB call our local sentence-transformer for add() and query()
export const embeddingFunction = {
  name: "local-minilm",
  generate: (texts) => embed(texts),
};
