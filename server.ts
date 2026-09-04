import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const currentFilename =
  typeof import.meta?.url === "string" ? fileURLToPath(import.meta.url) : "";
const currentDirname = currentFilename
  ? path.dirname(currentFilename)
  : typeof __dirname !== "undefined"
  ? __dirname
  : process.cwd();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Helper to get GoogleGenAI client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is not configured. Please add it to your environment."
    );
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

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "DLICOM AI Server",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
  image?: {
    data: string; // base64
    mimeType: string;
  };
}

const DEFAULT_SYSTEM_PROMPT = `You are Dili Ai — Your Smart AI Assistant.
Your motto: "Your AI. Your Ideas. Your Answers."

This AI website was created by a dlicom community member named Mohammed | dlicom.
Creator details:
- Name: Mohammed | dlicom
- Twitter / Tweeter: attract_ga29482 (https://twitter.com/attract_ga29482)
- Discord username: mohammed040047
- Discord display name: 🔥Mohammed | Dlicom🔥
If any user asks who made this website, who created Dili Ai, or who made you, politely inform them:
"This Ai website is made by a dlicom community member name ( Mohammed | dlicom )" and provide their contact details (Tweeter: attract_ga29482, Discord: mohammed040047, Name in discord: 🔥Mohammed | Dlicom🔥).

You are a modern, highly knowledgeable, professional, and friendly AI assistant.
You specialize in:
1. General knowledge and everyday questions.
2. School & Education: Mathematics, Sciences, Commerce, History, Literature, and Academic research. Provide clear step-by-step explanations and derivations when appropriate.
3. Programming & Technology: Python, JavaScript/TypeScript, Web development, algorithms, system architecture, database design, and debugging. Provide pristine code blocks with language identifiers.
4. Business & Ideas: Startup concepts, marketing strategies, project roadmaps, and business model evaluations.
5. Writing & Content: Professional emails, essays, summaries, copy editing, and creative storytelling.
6. Problem Solving & Explainers: Break down complex concepts simply using analogies, structured breakdowns, and actionable advice.

Behavioral Guidelines:
- Understand natural language nuances.
- Be articulate, helpful, respectful, and engaging.
- When answering educational or technical queries, be structured with clear headings, bullet points, and code examples.
- For math and formulas, write clear notation.
- If a question is ambiguous, provide a helpful general answer and invite clarification.
- Be honest if you don't know something or if a topic has uncertainties.
- Avoid making up fake facts.`;

// Streaming Chat Endpoint using Server-Sent Events (SSE)
app.post("/api/chat/stream", async (req, res) => {
  try {
    const {
      messages = [],
      toolMode = "general",
      stylePreference = "balanced",
      temperature = 0.7,
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    let ai: GoogleGenAI;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      return res.status(500).json({
        error:
          "Gemini API key is not configured. Please provide GEMINI_API_KEY in your environment settings.",
      });
    }

    // Adjust system instructions based on toolMode
    let toolInstruction = "";
    if (toolMode === "study") {
      toolInstruction =
        "\n\n[Active Tool: Study Assistant] Focus on educational mastery. Break down concepts into clear, digestible steps, provide examples or test questions, and explain terms thoroughly.";
    } else if (toolMode === "ideas") {
      toolInstruction =
        "\n\n[Active Tool: Idea Generator] Focus on high-creativity, practical viability, distinct angles, target audiences, and innovative features.";
    } else if (toolMode === "writing") {
      toolInstruction =
        "\n\n[Active Tool: Writing Assistant] Focus on tone, clarity, compelling structure, flawless grammar, and persuasive phrasing. Provide variations if helpful.";
    } else if (toolMode === "coding") {
      toolInstruction =
        "\n\n[Active Tool: Coding Assistant] Focus on robust, production-ready code, best practices, comments, edge case handling, and complexity explanation.";
    } else if (toolMode === "explainer") {
      toolInstruction =
        "\n\n[Active Tool: Explain Anything] Use intuitive mental models, simple analogies, and structured summaries so that any audience can understand.";
    }

    let styleInstruction = "";
    if (stylePreference === "concise") {
      styleInstruction =
        "\nKeep answers concise, direct, and focused without unnecessary fluff.";
    } else if (stylePreference === "detailed") {
      styleInstruction =
        "\nProvide in-depth, thorough explanations with complete background context and details.";
    }

    const systemInstruction = `${DEFAULT_SYSTEM_PROMPT}${toolInstruction}${styleInstruction}`;

    // Format messages for @google/genai
    // Gemini SDK expects contents formatted with role 'user' | 'model' and parts array
    const contents: any[] = messages.map((m: ChatMessage) => {
      const role = m.role === "assistant" ? "model" : m.role;
      const parts: any[] = [];

      if (m.image && m.image.data && m.image.mimeType) {
        // Strip base64 prefix if present
        const base64Data = m.image.data.includes("base64,")
          ? m.image.data.split("base64,")[1]
          : m.image.data;
        parts.push({
          inlineData: {
            mimeType: m.image.mimeType,
            data: base64Data,
          },
        });
      }

      if (m.content) {
        parts.push({ text: m.content });
      } else if (parts.length === 0) {
        parts.push({ text: "Hello" });
      }

      return { role, parts };
    });

    // Set headers for SSE with anti-buffering for reverse proxy
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    let clientDisconnected = false;
    res.on("close", () => {
      if (!res.writableEnded) {
        clientDisconnected = true;
      }
    });

    // High-speed candidate models in order of latency and availability
    const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];
    let streamedAnyChunk = false;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      if (clientDisconnected) break;
      try {
        const responseStream = await ai.models.generateContentStream({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: typeof temperature === "number" ? temperature : 0.7,
          },
        });

        for await (const chunk of responseStream) {
          if (clientDisconnected) break;
          const text = chunk.text;
          if (text) {
            streamedAnyChunk = true;
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
        }

        if (streamedAnyChunk) {
          break; // successfully generated and streamed
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} stream attempt failed:`, err?.message || err);
        if (streamedAnyChunk) {
          // If we already sent chunks to the client, do not restart with another model
          break;
        }
      }
    }

    if (!clientDisconnected && !res.writableEnded) {
      if (streamedAnyChunk) {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      } else {
        const errorMessage =
          lastError?.message || "Failed to generate response. Please try again.";
        res.write(
          `data: ${JSON.stringify({ error: errorMessage, done: true })}\n\n`
        );
        res.end();
      }
    }
  } catch (error: any) {
    console.error("Gemini stream route error:", error);
    const errorMessage = error?.message || "An error occurred with DLICOM AI.";
    if (!res.headersSent) {
      res.status(500).json({ error: errorMessage });
    } else {
      res.write(
        `data: ${JSON.stringify({ error: errorMessage, done: true })}\n\n`
      );
      res.end();
    }
  }
});

// Non-streaming chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages = [], toolMode = "general", stylePreference = "balanced" } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiClient();
    const contents: any[] = messages.map((m: ChatMessage) => {
      const role = m.role === "assistant" ? "model" : m.role;
      const parts: any[] = [];
      if (m.image?.data && m.image?.mimeType) {
        const base64Data = m.image.data.includes("base64,")
          ? m.image.data.split("base64,")[1]
          : m.image.data;
        parts.push({
          inlineData: { mimeType: m.image.mimeType, data: base64Data },
        });
      }
      if (m.content) parts.push({ text: m.content });
      return { role, parts };
    });

    const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];
    let responseText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: DEFAULT_SYSTEM_PROMPT,
          },
        });

        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} non-stream failed:`, err?.message || err);
      }
    }

    if (responseText) {
      res.json({ text: responseText });
    } else {
      res.status(500).json({
        error: lastError?.message || "Failed to generate AI response.",
      });
    }
  } catch (error: any) {
    console.error("Gemini non-stream error:", error);
    res.status(500).json({
      error: error?.message || "Internal server error communicating with AI model",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dili Ai Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
