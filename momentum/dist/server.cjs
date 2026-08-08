var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }
    const ai = getGeminiClient();
    const lastMessage = messages[messages.length - 1].content;
    const history = messages.slice(0, -1).map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");
    const prompt = history ? `Previous conversation:
${history}

User: ${lastMessage}` : lastMessage;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are Momentum AI, a calm, warm, and highly structured ADHD study coach and momentum builder. Your goal is to help users overcome executive dysfunction, break intimidating tasks into simple 5-minute steps, and feel supported without cognitive overload.

Formatting Rules:
- Keep responses concise, warm, and clear.
- Start with a reassuring summary statement (e.g., "Absolutely \u2014 let's make this feel less tangled. \u2728").
- Use bold headings like "**The big idea:**" and "**Try this next:**".
- Provide 3-4 bite-sized, 5-minute actionable micro-steps.
- Keep tone gentle, encouraging, and clear of hype or overwhelming lists.`,
        temperature: 0.7
      }
    });
    const reply = response.text || "I'm right here with you. Let's take one tiny step together.";
    res.json({ reply });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: "Failed to generate AI response.",
      details: error?.message || "Unknown error"
    });
  }
});
app.post("/api/microsteps", async (req, res) => {
  try {
    const { taskTitle } = req.body;
    if (!taskTitle) {
      return res.status(400).json({ error: "taskTitle is required" });
    }
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Break down this task into 3-4 super small, non-intimidating, 5-minute micro-steps for someone with ADHD: "${taskTitle}".
Return ONLY a raw JSON array of strings representing the micro-steps. Do not include markdown code block syntax if possible, just JSON. Example: ["Open document and write the title", "Write 2 bullet points for section 1", "Find 1 reference link"]`
    });
    let text = response.text?.trim() || "[]";
    if (text.startsWith("```")) {
      text = text.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    }
    let steps = [];
    try {
      steps = JSON.parse(text);
    } catch {
      steps = [
        `Gather materials needed for ${taskTitle}`,
        `Spend 5 minutes on the easiest part of ${taskTitle}`,
        `Take a quick breather and review progress`
      ];
    }
    res.json({ steps });
  } catch (error) {
    console.error("Error in /api/microsteps:", error);
    res.json({
      steps: [
        `Open the main file or space for this task`,
        `Work on it for just 3 minutes with zero pressure`,
        `Celebrate getting started!`
      ]
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
