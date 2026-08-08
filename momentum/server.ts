import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // API route for Gemini AI coach
  app.post('/api/chat', async (req, res) => {
    try {
      const { prompt, systemInstruction, messages, mode } = req.body || {};
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY environment variable is missing.',
        });
      }

      let contents: any = prompt;

      if ((!contents || (typeof contents === 'string' && !contents.trim())) && Array.isArray(messages) && messages.length > 0) {
        // Map chat messages array to Gemini contents format
        contents = messages.map((m: any) => ({
          role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
          parts: [{ text: String(m.content || m.text || '') }],
        })).filter((c: any) => c.parts[0].text.trim().length > 0);
      }

      // Fallback if contents is empty
      if (!contents || (Array.isArray(contents) && contents.length === 0)) {
        contents = 'Hello! How can you help me stay focused today?';
      }

      let systemPrompt = systemInstruction || 'You are a warm, supportive ADHD Momentum & Focus Coach. Keep responses concise, encouraging, and actionable.';
      if (mode === 'explain') {
        systemPrompt += ' Explain concepts in super clear, bite-sized, gentle bullet points.';
      } else if (mode === 'task') {
        systemPrompt += ' Break down tasks into 3 simple, non-overwhelming micro-steps.';
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      const replyText = response.text || "I'm right here with you! What small step shall we focus on next?";
      return res.json({ reply: replyText, text: replyText });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      return res.status(500).json({ error: error.message || 'Failed to generate response' });
    }
  });

  // API route for task micro-steps
  app.post('/api/microsteps', async (req, res) => {
    let taskTitle = 'task';
    try {
      taskTitle = req.body?.taskTitle || 'task';
      if (!req.body?.taskTitle) {
        return res.status(400).json({ error: 'taskTitle is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback structured microsteps if API key is not configured yet
        return res.json({
          steps: [
            { text: `Define goal & break down scope for "${taskTitle}"`, suggestedMinutes: 10 },
            { text: `Focus on primary sub-task for 15 minutes`, suggestedMinutes: 15 },
            { text: `Review progress and organize next steps`, suggestedMinutes: 10 },
          ],
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      const prompt = `Break down the task "${taskTitle}" into 3 to 4 actionable, bite-sized micro-steps for someone with ADHD. Return strictly valid JSON array of objects with keys "text" (string description of the step) and "suggestedMinutes" (number between 5 and 25). Do not wrap in markdown code blocks.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      let text = response.text || '[]';
      text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

      const parsed = JSON.parse(text);
      const steps = Array.isArray(parsed) ? parsed : (parsed.steps || []);

      return res.json({ steps });
    } catch (error: any) {
      console.error('Microsteps API Error:', error);
      return res.json({
        steps: [
          { text: `Define scope & first step for "${taskTitle}"`, suggestedMinutes: 10 },
          { text: `Focus on main work block`, suggestedMinutes: 15 },
          { text: `Review and finalize task`, suggestedMinutes: 10 },
        ],
      });
    }
  });

  // Vite middleware setup for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = __dirname;
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
