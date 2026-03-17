# ⬡ RepoSummarizer

AI-powered GitHub repository analyzer that runs **entirely on your machine** using Ollama. Paste a repo URL and get a README, LinkedIn project entry, and resume bullets — no API keys, no cloud, no cost.

---

## ✨ Features

- 📄 **Auto-generate README.md** — Professional markdown readme from your codebase
- 💼 **LinkedIn Entry** — Ready-to-paste project section for your LinkedIn profile
- 📝 **Resume Bullets** — 3 strong action-verb bullet points for your resume
- 🔒 **100% Local** — Runs on Ollama, your code never leaves your machine
- ⚡ **Fast Fetching** — Recursively fetches and filters relevant code files via GitHub API

---

## 🏗️ Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React + CSS             |
| Backend   | Node.js + Express       |
| AI        | Ollama (local LLM)      |
| Data      | GitHub REST API         |

---

## 🚀 Getting Started

### Prerequisites

1. **Install Ollama**: Download from [ollama.com](https://ollama.com/download)
2. **Pull a model**:
   ```bash
   ollama pull codellama
   # or
   ollama pull mistral
   ```
3. **Start Ollama**:
   ```bash
   ollama serve
   ```

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/reposummarizer
cd reposummarizer

# Install all dependencies
npm run install:all
```

### Configuration

Edit `server/.env`:
```env
PORT=5000
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=codellama        # or mistral, llama3
GITHUB_TOKEN=                 # optional, increases API rate limit
```

### Running

Open **two terminals**:

```bash
# Terminal 1 — Backend
npm run dev:server

# Terminal 2 — Frontend
npm run dev:client
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
reposummarizer/
├── client/                        # React frontend
│   └── src/
│       ├── components/
│       │   ├── UrlInput.jsx       # URL input form
│       │   ├── OutputTabs.jsx     # Tab switcher
│       │   ├── OutputCard.jsx     # Content display + copy/download
│       │   └── Loader.jsx         # Loading state
│       └── App.jsx
│
├── server/                        # Express backend
│   ├── routes/
│   │   └── analyze.js             # POST /api/analyze
│   ├── services/
│   │   ├── githubFetcher.js       # GitHub API file fetcher
│   │   └── ollamaSummarizer.js    # Ollama prompt + response
│   ├── index.js
│   └── .env
│
└── README.md
```

---

## ⚙️ Model Recommendations

| Model | Command | Size | Best For |
|-------|---------|------|----------|
| CodeLlama | `ollama pull codellama` | ~4GB | Code analysis ✅ |
| Mistral | `ollama pull mistral` | ~4GB | Fast + balanced ✅ |
| LLaMA 3 | `ollama pull llama3` | ~5GB | Best quality ✅ |

---

## 📝 License

MIT
