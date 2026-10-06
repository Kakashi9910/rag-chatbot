import "dotenv/config";
import express from "express";
import { ask } from "./rag.js";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "question is required" });
    res.json(await ask(question));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`RAG chatbot running on port ${process.env.PORT || 3000}`)
);
