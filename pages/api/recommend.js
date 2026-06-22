/**
 * pages/api/recommend.js
 *
 * This is the ONLY place the Anthropic API key is used.
 * It lives in process.env on the server — never shipped to the browser.
 *
 * The frontend calls POST /api/recommend with { prompt: "..." }
 * and gets back the raw text from Claude.
 */

// Simple in-memory rate limiter: max 20 requests per IP per minute
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
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

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.start > 60 * 1000) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Too many requests. Please wait a minute before trying again." });
  }

  // Validate input
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
    return res.status(400).json({ error: "prompt is required and must be at least 3 characters." });
  }

  // Check API key is configured
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set in environment variables.");
    return res.status(500).json({ error: "Server configuration error: API key not set." });
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
      "curve": 1 | 2 | 3,
      "free": true | false,
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
- curve: 1=Gentle, 2=Moderate, 3=Steep
- the "why" must reference the user's specific project, not generic benefits
- roadmap must have 4-6 milestones with realistic week-by-week durations
- alts must have 2 entries`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: `Project description: ${prompt.trim()}` }],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errData?.error?.message || "Anthropic API error",
        status: response.status,
      });
    }

    const data = await response.json();
    const text = data.content?.map((b) => b.text || "").join("") || "";
    return res.status(200).json({ text });

  } catch (err) {
    console.error("Recommend API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
