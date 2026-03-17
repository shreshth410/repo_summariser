import React, { useState } from "react";
import "./OutputCard.css";

export default function OutputCard({ content, filename, tabId }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `${tabId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="output-card">
      <div className="output-toolbar">
        <div className="output-actions">
          <button className="action-btn" onClick={handleCopy}>
            {copied ? "✓ Copied!" : "Copy"}
          </button>
          <button className="action-btn" onClick={handleDownload}>
            ↓ Download
          </button>
        </div>
      </div>
      <pre className="output-content">{content || "No content generated."}</pre>
    </div>
  );
}
