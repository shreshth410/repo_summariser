const axios = require("axios");

const CODE_EXTENSIONS = [
  ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".go", ".cpp", ".c",
  ".cs", ".rb", ".php", ".swift", ".kt", ".rs", ".vue", ".html", ".css",
  ".scss", ".json", ".yaml", ".yml", ".toml", ".sh", ".md"
];

const IGNORE_PATHS = [
  "node_modules", ".git", "dist", "build", ".next", "__pycache__",
  "vendor", "coverage", ".cache", "package-lock.json", "yarn.lock"
];

const MAX_FILE_SIZE = 8000; // chars per file
const MAX_TOTAL_SIZE = 80000; // total chars to send to Ollama

function parseGithubUrl(url) {
  // Handle formats: https://github.com/owner/repo or github.com/owner/repo
  const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
  if (!match) throw new Error("Invalid GitHub URL. Format: https://github.com/owner/repo");
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

async function fetchRepoFiles(githubUrl) {
  const { owner, repo } = parseGithubUrl(githubUrl);

  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "RepoSummarizer",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }

  // Try main branch, fallback to master
  let treeData;
  for (const branch of ["main", "master", "HEAD"]) {
    try {
      const res = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        { headers }
      );
      treeData = res.data;
      break;
    } catch (e) {
      if (branch === "HEAD") throw new Error(`Could not find repository: ${owner}/${repo}`);
    }
  }

  const codeFiles = treeData.tree.filter((item) => {
    if (item.type !== "blob") return false;
    if (IGNORE_PATHS.some((ig) => item.path.includes(ig))) return false;
    return CODE_EXTENSIONS.some((ext) => item.path.endsWith(ext));
  });

  // Prioritize important files
  const prioritized = [
    ...codeFiles.filter(f => f.path.match(/^(README|package\.json|requirements\.txt|Dockerfile|\.env\.example)/i)),
    ...codeFiles.filter(f => !f.path.match(/^(README|package\.json|requirements\.txt|Dockerfile|\.env\.example)/i))
  ];

  let totalChars = 0;
  const fileContents = [];

  for (const file of prioritized) {
    if (totalChars >= MAX_TOTAL_SIZE) break;
    try {
      const res = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
        { headers }
      );
      const content = Buffer.from(res.data.content, "base64").toString("utf-8");
      const truncated = content.slice(0, MAX_FILE_SIZE);
      fileContents.push({ path: file.path, content: truncated });
      totalChars += truncated.length;
    } catch (e) {
      // skip unreadable files
    }
  }

  return {
    owner,
    repo,
    fileCount: fileContents.length,
    totalFiles: codeFiles.length,
    files: fileContents,
  };
}

module.exports = { fetchRepoFiles };
