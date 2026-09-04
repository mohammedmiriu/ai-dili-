import { GoogleGenAI } from "@google/genai";

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

async function parseRequestBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
      return req.body;
    }
    if (Buffer.isBuffer(req.body)) {
      try {
        return JSON.parse(req.body.toString("utf-8"));
      } catch {
        return {};
      }
    }
    if (typeof req.body === "string") {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
  }

  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk: any) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", () => {
      resolve({});
    });
  });
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  try {
    const body = await parseRequestBody(req);
    const {
      messages = [],
      toolMode = "general",
      stylePreference = "balanced",
      temperature = 0.7,
    } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Messages array is required." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({
        error:
          "GEMINI_API_KEY is not configured in Vercel Environment Variables. Please add GEMINI_API_KEY in your Vercel Project Settings > Environment Variables.",
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    let toolInstruction = "";
    if (toolMode === "study") {
      toolInstruction =
        "\n\n[Active Tool: Study Assistant] Focus on educational mastery. Break down concepts into clear, digestible steps, provide examples or test questions, and explain terms thoroughly.";
    } else if (toolMode === "ideas") {
      toolInstruction =
        "\n\n[Active Tool: Idea Generator] Focus on high-creativity, practical viability, distinct angles, target audiences, and innovative features.";
    } else if (toolMode === "writing") {
      toolInstruction =
        "\n\n[Active Tool: Writing Assistant] Focus on tone, clarity, compelling structure, flawless grammar, and persuasive phrasing.";
    } else if (toolMode === "coding") {
      toolInstruction =
        "\n\n[Active Tool: Coding Assistant] Focus on robust, production-ready code, best practices, comments, edge case handling, and complexity explanation.";
    } else if (toolMode === "explainer") {
      toolInstruction =
        "\n\n[Active Tool: Explain Anything] Use intuitive mental models, simple analogies, and structured summaries so that any audience can understand.";
    }

    let styleInstruction = "";
    if (stylePreference === "concise") {
      styleInstruction = "\nKeep answers concise, direct, and focused without unnecessary fluff.";
    } else if (stylePreference === "detailed") {
      styleInstruction = "\nProvide in-depth, thorough explanations with complete background context and details.";
    }

    const systemInstruction = `${DEFAULT_SYSTEM_PROMPT}${toolInstruction}${styleInstruction}`;

    const contents = messages.map((m: any) => {
      const role = m.role === "assistant" ? "model" : m.role;
      const parts: any[] = [];

      if (m.image?.data && m.image?.mimeType) {
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

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    if (typeof res.flushHeaders === "function") {
      res.flushHeaders();
    }

    const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];
    let streamedAnyChunk = false;
    let lastError: any = null;

    for (const modelName of candidateModels) {
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
          const text = chunk.text;
          if (text) {
            streamedAnyChunk = true;
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
            if (typeof (res as any).flush === "function") {
              (res as any).flush();
            }
          }
        }

        if (streamedAnyChunk) break;
      } catch (err: any) {
        lastError = err;
        if (streamedAnyChunk) break;
      }
    }

    if (streamedAnyChunk) {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } else {
      res.write(
        `data: ${JSON.stringify({
          error: lastError?.message || "Failed to generate AI response.",
          done: true,
        })}\n\n`
      );
      res.end();
    }
  } catch (err: any) {
    const errorMsg = err?.message || "An error occurred with Dili Ai.";
    if (!res.headersSent) {
      res.status(500).json({ error: errorMsg });
    } else {
      res.write(`data: ${JSON.stringify({ error: errorMsg, done: true })}\n\n`);
      res.end();
    }
  }
}
