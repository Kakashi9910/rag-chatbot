import fs from "node:fs/promises";
import path from "node:path";
import { getCollection } from "./chroma.js";
import { chunkText } from "./chunk.js";

const DOCS_DIR = "documents";
const BATCH = 64;

const collection = await getCollection();
const files = (await fs.readdir(DOCS_DIR)).filter((f) => /\.(txt|md)$/i.test(f));

for (const file of files) {
  const text = await fs.readFile(path.join(DOCS_DIR, file), "utf8");
  const chunks = chunkText(text);

  for (let i = 0; i < chunks.length; i += BATCH) {
    const slice = chunks.slice(i, i + BATCH);
    await collection.upsert({
      ids: slice.map((_, j) => `${file}-${i + j}`),
      documents: slice,
      metadatas: slice.map((_, j) => ({ source: file, chunk: i + j })),
    });
  }
  console.log(`Ingested ${file}: ${chunks.length} chunks`);
}
