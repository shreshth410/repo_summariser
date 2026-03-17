const axios = require("axios");

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "codellama";

function buildPrompt(repoData) {
  const filesSummary = repoData.files
    .map((f) => `### FILE: ${f.path}\n\`\`\`\n${f.content}\n\`\`\``)
    .join("\n\n");

  return `You are a technical writer. Read the code below and generate a JSON object.

CODE FROM REPOSITORY "${repoData.owner}/${repoData.repo}":
${filesSummary}

NOW generate a JSON object. Do NOT repeat these instructions. Do NOT use placeholder text. Write real content based on the actual code above.

Return ONLY this JSON, nothing else, no markdown, no backticks:
{"projectName":"actual project name",
"techStack":["actual","technologies","found", "in","the","code"],
"readme":"# Project Title\\n\\nReal description based on the code...\\n\\n
## Features\\n- feature 1\\n\\n## Tech Stack\\n- tech 1\\n\\n
## Installation\\n\`\`\`bash\\nnpm install\\n\`\`\`\\n\\n
## License\\nMIT",
"linkedin":"Real LinkedIn entry for the projects section based on the code",
"resume":"Real bullet 1 based on code\\nReal bullet 2 based on code\\nReal bullet 3 based on code",
"summary":"Real 2-3 sentence summary of what this project actually does"}`;
}

async function summarizeWithOllama(repoData) {
  const prompt = buildPrompt(repoData);

  console.log(`🤖 Sending to Ollama (${OLLAMA_MODEL})... This may take 1-3 minutes.`);

  let response;
  try {
    response = await axios.post(
      `${OLLAMA_BASE_URL}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 3000,
        },
      },
      { timeout: 600000 } // 10 min timeout
    );
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      throw new Error(
        "Cannot connect to Ollama. Make sure Ollama is running: run `ollama serve` in your terminal."
      );
    }
    throw new Error(`Ollama error: ${err.message}`);
  }

  const raw = response.data.response;

  // Extract JSON from the response (model may wrap in markdown)
  let jsonStr = raw;
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) jsonStr = jsonMatch[0];

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    // If JSON parse fails, return a structured error with raw content
    console.error("Failed to parse JSON from model:", raw.slice(0, 500));
    throw new Error("Model returned invalid JSON. Try using a different model or re-run.");
  }
}

module.exports = { summarizeWithOllama };
