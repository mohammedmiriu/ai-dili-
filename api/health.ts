export default function handler(_req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    status: "ok",
    app: "Dili Ai Serverless",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
}
