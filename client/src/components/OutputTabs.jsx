import React, { useState } from "react";
import OutputCard from "./OutputCard";
import "./OutputTabs.css";

const TABS = [
  { id: "readme", label: "README.md", icon: "📄" },
  { id: "linkedin", label: "LinkedIn", icon: "💼" },
  { id: "resume", label: "Resume", icon: "📝" },
];

export default function OutputTabs({ result }) {
  const [activeTab, setActiveTab] = useState("readme");

  const contentMap = {
    readme: result.readme,
    linkedin: result.linkedin,
    resume: result.resume,
  };

  return (
    <div className="tabs-wrap">
      <div className="tabs-bar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      <OutputCard
        content={contentMap[activeTab]}
        filename={activeTab === "readme" ? "README.md" : null}
        tabId={activeTab}
      />
    </div>
  );
}
