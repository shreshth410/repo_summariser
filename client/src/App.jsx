import React, { useState } from "react";
import UrlInput from "./components/UrlInput";
import Loader from "./components/Loader";
import OutputTabs from "./components/OutputTabs";
import "./App.css";

export default function App() {
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [loadingStep, setLoadingStep] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleAnalyze(url) {
    setStatus("loading");
    setError("");
    setResult(null);
    setLoadingStep("Connecting to GitHub and fetching repository files...");

    try {
      const stepTimer = setTimeout(() => {
        setLoadingStep("Running local AI analysis — this takes 1–3 minutes...");
      }, 4000);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      clearTimeout(stepTimer);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setResult(data);
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  function handleReset() {
    setStatus("idle");
    setResult(null);
    setError("");
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⬡</span>
            <span className="logo-text">RepoSummarizer</span>
          </div>
          <span className="logo-tag">Powered by Ollama · Runs locally</span>
        </div>
      </header>

      <main className="main">
        {status === "idle" && (
          <div className="hero">
            <div className="hero-badge">Local AI · No API keys · Private</div>
            <h1 className="hero-title">
              Understand any repo<br />
              <span className="hero-accent">in seconds.</span>
            </h1>
            <p className="hero-sub">
              Paste a GitHub URL. Get a README, LinkedIn entry, and resume bullets —
              all generated on your machine using Ollama.
            </p>
            <UrlInput onAnalyze={handleAnalyze} />
          </div>
        )}

        {status === "loading" && (
          <Loader message={loadingStep} />
        )}

        {status === "error" && (
          <div className="error-state">
            <div className="error-icon">✕</div>
            <h2>Something went wrong</h2>
            <p className="error-msg">{error}</p>
            <button className="btn-primary" onClick={handleReset}>Try Again</button>
          </div>
        )}

        {status === "done" && result && (
          <div className="results">
            <div className="results-header">
              <div>
                <div className="repo-pill">{result.repo}</div>
                <p className="results-meta">
                  Analyzed <strong>{result.filesAnalyzed}</strong> of{" "}
                  <strong>{result.totalFiles}</strong> files
                </p>
              </div>
              <button className="btn-ghost" onClick={handleReset}>← New Repo</button>
            </div>
            {result.summary && (
              <div className="summary-card">
                <span className="summary-label">AI SUMMARY</span>
                <p>{result.summary}</p>
              </div>
            )}
            {result.techStack && result.techStack.length > 0 && (
              <div className="stack-chips">
                {result.techStack.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            )}
            <OutputTabs result={result} />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>RepoSummarizer · Runs entirely on your machine · No data sent to the cloud</p>
      </footer>
    </div>
  );
}
