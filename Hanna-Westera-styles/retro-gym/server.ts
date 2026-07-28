import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3006;

  app.use(express.json());

  // Initialize Gemini AI Client lazily or safely
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Glute Coach & Custom Routine Generator API
  app.post("/api/ai/coach", async (req, res) => {
    try {
      const { prompt, userContext } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const ai = getAiClient();

      const systemInstruction = `You are "Coach Gluteus", an elite strength and conditioning specialist with a Master's in Exercise Biomechanics and extensive research in gluteal hypertrophy (Bret Contreras methodology, electromyography studies, hip thrust physics, and hip mobility mechanics).
You provide clear, encouraging, science-based, and actionable advice to help users build their glutes safely and effectively.
Context provided by user: ${JSON.stringify(userContext || {})}

Guidelines for your answers:
1. Focus on glute mechanics (Gluteus Maximus, Medius, Minimus), exercise selection (Stretch position like RDLs vs Shortened/Peak contraction like Hip Thrusts vs Abduction for Upper Shelf), and proper hip mobility.
2. Provide concrete set/rep/RPE recommendations when applicable.
3. Keep tone motivating, clear, and easy to read with bullet points and bold highlights.
4. If asked about injuries, gently recommend consulting a physical therapist while giving safe movement regressions.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI Coach error:", error);
      return res.status(500).json({
        error: error.message || "Failed to generate response from AI Coach.",
      });
    }
  });

  // AI Custom Workout Plan Generator
  app.post("/api/ai/generate-split", async (req, res) => {
    try {
      const { daysPerWeek, level, goal, equipment, focusAreas } = req.body;

      const ai = getAiClient();

      const prompt = `Generate a structured glute & lower body training split for a ${level || "intermediate"} lifter training ${daysPerWeek || 3} days per week.
Equipment available: ${equipment || "Full Gym (Barbells, Cables, Dumbbells, Machines)"}.
Focus areas: ${focusAreas ? focusAreas.join(", ") : "Balanced Glute Max, Medius & Shape"}.
Main Goal: ${goal || "Maximal Glute Hypertrophy and Hip Health"}.

Return a JSON structure matching this exact JSON schema (do not wrap in markdown or backticks, just raw JSON):
{
  "splitTitle": "string",
  "summary": "string",
  "weeklyFrequency": number,
  "keyPrinciples": ["string"],
  "days": [
    {
      "dayNumber": number,
      "title": "string",
      "focus": "string",
      "estimatedMinutes": number,
      "warmupMobility": ["string"],
      "exercises": [
        {
          "name": "string",
          "targetRegion": "Gluteus Maximus" | "Gluteus Medius" | "Gluteus Minimus" | "Hamstrings" | "Quads",
          "sets": number,
          "reps": "string",
          "rpe": "string",
          "restSeconds": number,
          "notes": "string"
        }
      ]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a biomechanics AI assistant specializing in personalized glute training splits. Always respond with strict, valid JSON.",
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (error: any) {
      console.error("Generate split error:", error);
      return res.status(500).json({
        error: error.message || "Failed to generate custom split.",
      });
    }
  });

  // Vite middleware setup
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
