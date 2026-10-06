export function chunkText(text, size = 800, overlap = 150) {
  const clean = text.replace(/\r\n/g, "\n").trim();
  const chunks = [];
  for (let start = 0; start < clean.length; start += size - overlap) {
    const piece = clean.slice(start, start + size).trim();
    if (piece) chunks.push(piece);
    if (start + size >= clean.length) break;
  }
  return chunks;
}
