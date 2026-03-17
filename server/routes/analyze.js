const express = require("express");
const router = express.Router();
const { fetchRepoFiles } = require("../services/githubFetcher");
const { summarizeWithOllama } = require("../services/ollamaSummarizer");

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "GitHub URL is required." });
  }

  try {
    // Step 1: Fetch files
    console.log(`📦 Fetching repo: ${url}`);
    const repoData = await fetchRepoFiles(url);
    console.log(`✅ Fetched ${repoData.fileCount} files from ${repoData.owner}/${repoData.repo}`);

    if (repoData.fileCount === 0) {
      return res.status(422).json({ error: "No code files found in this repository." });
    }

    // Step 2: Summarize
    const summary = await summarizeWithOllama(repoData);

    res.json({
      success: true,
      repo: `${repoData.owner}/${repoData.repo}`,
      filesAnalyzed: repoData.fileCount,
      totalFiles: repoData.totalFiles,
      ...summary,
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
