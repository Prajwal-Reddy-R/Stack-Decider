// pages/api/recommend.js
// Uses Groq API (free tier — no credit card needed)
// Model: llama-3.3-70b-versatile

const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const max = 20;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }

  const entry = rateLimitMap.get(ip);
  if (now - entry.start > windowMs) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }

  if (entry.count >= max) return false;
  entry.count += 1;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.start > 60 * 1000) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Too many requests. Please wait a minute before trying again." });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
    return res.status(400).json({ error: "prompt is required and must be at least 3 characters." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server configuration error: GROQ_API_KEY not set." });
  }

  const systemPrompt = `You are a senior software architect. Given a plain-English project description, recommend the best tech stack.

Respond ONLY with valid JSON — no preamble, no markdown fences, no explanation outside the JSON.

JSON shape:
{
  "summary": { "type": "string", "time": "string", "team": "string", "difficulty": "string" },
  "note": "string (one critical architectural insight)",
  "stack": [
    {
      "cat": "string (e.g. Frontend, Backend, Database, Auth, Hosting)",
      "name": "string (exact tool name)",
      "tags": ["string"],
      "curve": 1,
      "free": true,
      "docs": "https://...",
      "tut": "https://...",
      "why": "string (2-3 sentences explaining WHY for this specific project)"
    }
  ],
  "alts": [
    { "name": "string", "reason": "string", "best": "string" }
  ],
  "roadmap": [
    { "title": "string", "detail": "string", "dur": "string" }
  ]
}

Rules:
- stack must have 5-7 items covering Frontend, Backend/BaaS, Database, Auth, and Hosting at minimum
- curve must be an integer: 1 for Gentle, 2 for Moderate, 3 for Steep
- free must be a boolean: true or false
- the "why" must reference the user's specific project, not generic benefits
- roadmap must have 4-6 milestones with realistic week-by-week durations
- alts must have exactly 2 entries
- Output ONLY the JSON object. No text before or after it.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Project description: ${prompt.trim()}` },
        ],
        max_tokens: 4000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errData?.error?.message || "Groq API error",
      });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ text });

  } catch (err) {
    console.error("Recommend API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}