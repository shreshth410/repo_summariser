import React, { useState } from "react";
import "./UrlInput.css";

export default function UrlInput({ onAnalyze }) {
  const [url, setUrl] = useState("");
  const [focused, setFocused] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    onAnalyze(trimmed);
  }

  const isValid = url.trim().includes("github.com");

  return (
    <form className={`url-form ${focused ? "focused" : ""}`} onSubmit={handleSubmit}>
      <div className="url-input-wrap">
        <span className="url-prefix">github.com/</span>
        <input
          className="url-input"
          type="text"
          placeholder="owner/repository-name"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      <button
        className="url-submit"
        type="submit"
        disabled={!isValid}
      >
        <span>Analyze</span>
        <span className="btn-arrow">→</span>
      </button>
    </form>
  );
}
