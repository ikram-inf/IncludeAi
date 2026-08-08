import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// Helper to call Gemini with automatic fallback models for high-demand spikes (e.g. 503 errors)
async function generateGeminiContentWithFallback(ai: GoogleGenAI, options: { contents: any; config?: any }) {
  const models = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-2.0-flash"];
  let lastError: any = null;

  for (const model of models) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });
      return res;
    } catch (err: any) {
      console.warn(`Gemini model '${model}' error, attempting fallback:`, err?.message || err);
      lastError = err;
    }
  }
  throw lastError;
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

    const response = await generateGeminiContentWithFallback(ai, {
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
    res.json({
      reply: "I'm experiencing a brief high-demand spike right now, but I'm still right here with you! ✨\n\n**Try this next:**\n1. Pick one tiny, 3-minute subtask for your current topic.\n2. Set a 5-minute timer.\n3. Take a deep breath and begin!",
    });
  }
});

// AI Micro-step generator for To-Do tasks with learning guidance & time estimates
app.post("/api/microsteps", async (req, res) => {
  try {
    const { taskTitle } = req.body;
    if (!taskTitle) {
      return res.status(400).json({ error: "taskTitle is required" });
    }

    const ai = getGeminiClient();
    const response = await generateGeminiContentWithFallback(ai, {
      contents: `You are an expert ADHD study coach. Break down this task/topic into 3-4 structured, step-by-step learning micro-steps with specific subtopics and study time allocations (in minutes): "${taskTitle}".

Return ONLY a raw JSON array of objects with keys "text" (string subtopic/step guidance) and "suggestedMinutes" (number, between 5 and 25).
Do not include markdown code block syntax if possible, just JSON.
Example:
[
  {"text": "Study key concepts & overview (10 mins)", "suggestedMinutes": 10},
  {"text": "Read chapter summary & write 3 main points", "suggestedMinutes": 15},
  {"text": "Practice 2 example problems", "suggestedMinutes": 10}
]`,
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
        { text: `Review overview & setup for ${taskTitle}`, suggestedMinutes: 10 },
        { text: `Focus on core subtopic for 15 mins`, suggestedMinutes: 15 },
        { text: `Quick review & summarize key points`, suggestedMinutes: 5 },
      ];
    }

    res.json({ steps });
  } catch (error: any) {
    console.error("Error in /api/microsteps:", error);
    res.json({
      steps: [
        { text: `Open materials for this topic`, suggestedMinutes: 5 },
        { text: `Read and study primary concept`, suggestedMinutes: 15 },
        { text: `Summarize main takeaways`, suggestedMinutes: 5 },
      ],
    });
  }
});

// AI Endpoint: Organize To-Do List to Stop Distraction and Restore Focus
app.post("/api/organize-distraction", async (req, res) => {
  const { thoughtText, tasks } = req.body || {};
  if (!thoughtText) {
    return res.status(400).json({ error: "thoughtText is required" });
  }

  try {
    const ai = getGeminiClient();
    const taskTitles = Array.isArray(tasks) ? tasks.map((t: any) => t.title).join(", ") : "";

    const response = await generateGeminiContentWithFallback(ai, {
      contents: `A student got distracted by: "${thoughtText}".
Their current study tasks are: "${taskTitles || 'General Study Session'}".

Goal: DO NOT create a to-do item for the distraction or writing about the distraction.
Instead, organize and restructure their STUDY TO-DO LIST to overcome the distraction and make resuming study frictionless!
Break down their primary study task into 3 tiny, 3-to-5 minute micro-steps that give immediate focus momentum.

Return ONLY a raw JSON object with keys:
- "title": (string, concise study focus task title, e.g. "Focus Restart: Research Paper Introduction")
- "priority": (string, "High")
- "microSteps": array of objects with "text" (string) and "suggestedMinutes" (number).

Example:
{
  "title": "Focus Restart: Study & Outline Notes",
  "priority": "High",
  "microSteps": [
    {"text": "Take 1 deep breath & open current study material", "suggestedMinutes": 2},
    {"text": "Write just 1 key bullet point for current section", "suggestedMinutes": 5},
    {"text": "Set a quick 10-minute focus timer to keep momentum", "suggestedMinutes": 10}
  ]
}`,
    });

    let text = response.text?.trim() || "{}";
    if (text.startsWith("```")) {
      text = text.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    }

    let taskData = null;
    try {
      taskData = JSON.parse(text);
    } catch {
      taskData = {
        title: `Focus Restart: Study Session`,
        priority: "High",
        microSteps: [
          { text: "Take 1 deep breath & clear desk", suggestedMinutes: 2 },
          { text: "Complete 1 micro-bullet point on main topic", suggestedMinutes: 5 },
          { text: "Set 10-min timer to rebuild study momentum", suggestedMinutes: 10 },
        ],
      };
    }

    res.json({ task: taskData });
  } catch (error: any) {
    console.error("Error in /api/organize-distraction:", error);
    res.json({
      task: {
        title: `Focus Restart: Study Session`,
        priority: "High",
        microSteps: [
          { text: "Take 1 deep breath & refocus workspace", suggestedMinutes: 2 },
          { text: "Write 1 key line for main study task", suggestedMinutes: 5 },
          { text: "Start 10-min timer", suggestedMinutes: 10 },
        ],
      },
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
