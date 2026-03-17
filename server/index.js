require("dotenv").config();
const express = require("express");
const cors = require("cors");
const analyzeRouter = require("./routes/analyze");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/analyze", analyzeRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "RepoSummarizer server running" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🤖 Using Ollama model: ${process.env.OLLAMA_MODEL || "codellama"}`);
});
