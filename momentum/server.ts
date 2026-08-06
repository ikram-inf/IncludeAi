import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client lazily / safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Chatbot endpoint (Momentum AI Focus Coach)
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiClient();

    // Format chat history for Gemini
    const lastMessage = messages[messages.length - 1].content;
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

    const prompt = history
      ? `Previous conversation:\n${history}\n\nUser: ${lastMessage}`
      : lastMessage;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are Momentum AI, a calm, warm, and highly structured ADHD study coach and momentum builder. Your goal is to help users overcome executive dysfunction, break intimidating tasks into simple 5-minute steps, and feel supported without cognitive overload.

Formatting Rules:
- Keep responses concise, warm, and clear.
- Start with a reassuring summary statement (e.g., "Absolutely — let's make this feel less tangled. ✨").
- Use bold headings like "**The big idea:**" and "**Try this next:**".
- Provide 3-4 bite-sized, 5-minute actionable micro-steps.
- Keep tone gentle, encouraging, and clear of hype or overwhelming lists.`,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I'm right here with you. Let's take one tiny step together.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: "Failed to generate AI response.",
      details: error?.message || "Unknown error",
    });
  }
});

// AI Micro-step generator for To-Do tasks
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
Return ONLY a raw JSON array of strings representing the micro-steps. Do not include markdown code block syntax if possible, just JSON. Example: ["Open document and write the title", "Write 2 bullet points for section 1", "Find 1 reference link"]`,
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
        `Take a quick breather and review progress`,
      ];
    }

    res.json({ steps });
  } catch (error: any) {
    console.error("Error in /api/microsteps:", error);
    res.json({
      steps: [
        `Open the main file or space for this task`,
        `Work on it for just 3 minutes with zero pressure`,
        `Celebrate getting started!`,
      ],
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
