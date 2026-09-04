import { GoogleGenAI } from "@google/genai";
import { ToolMode } from "../types";

const SYSTEM_PROMPT = `You are Dili Ai — Your Smart AI Assistant.
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

export function getClientGeminiApiKey(): string | null {
  // Check VITE_ prefix for client side
  const viteKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (viteKey && typeof viteKey === "string" && viteKey.trim().length > 0) {
    return viteKey.trim();
  }
  return null;
}

export async function generateClientSideGeminiStream({
  messages,
  toolMode,
  stylePreference,
  temperature = 0.7,
  onChunk,
}: {
  messages: Array<{
    role: string;
    content: string;
    image?: { data: string; mimeType: string };
  }>;
  toolMode: ToolMode;
  stylePreference?: string;
  temperature?: number;
  onChunk: (text: string) => void;
}): Promise<string> {
  const apiKey = getClientGeminiApiKey();
  if (!apiKey) {
    throw new Error("No client-side Gemini API key available.");
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: { "User-Agent": "aistudio-build" },
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
      "\n\n[Active Tool: Coding Assistant] Focus on robust, production-ready code, best practices, comments, and complexity explanation.";
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

  const systemInstruction = `${SYSTEM_PROMPT}${toolInstruction}${styleInstruction}`;

  const contents = messages.map((m) => {
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

    if (m.content) {
      parts.push({ text: m.content });
    } else if (parts.length === 0) {
      parts.push({ text: "Hello" });
    }

    return { role, parts };
  });

  const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];
  let fullText = "";
  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature,
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          fullText += chunk.text;
          onChunk(chunk.text);
        }
      }

      if (fullText.trim().length > 0) {
        return fullText;
      }
    } catch (err) {
      lastError = err;
      if (fullText.trim().length > 0) break;
    }
  }

  if (fullText.trim().length > 0) {
    return fullText;
  }

  throw lastError || new Error("Failed to generate client-side AI response.");
}
