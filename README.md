# RAG chatbot (Node.js + ChromaDB + Sentence Transformers)

1. `docker compose up -d`            # start ChromaDB on :8000
2. `npm install`
3. `npm run ingest`                  # chunk -> embed -> store in Chroma
4. `npm start`

Test:
curl -X POST localhost:3000/chat -H "Content-Type: application/json" \
  -d '{"question":"How many casual leaves do employees get?"}'
