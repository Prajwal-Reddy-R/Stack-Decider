# ⚡ StackDecider — Next.js Edition

AI-powered tech stack recommender. Built for [Digital Heroes](https://digitalheroesco.com).

## What changed from the Claude.ai Artifact version

The original artifact called `api.anthropic.com` directly from the browser — that only works inside Claude.ai's proxy. This version moves the API call to a **Next.js API route** (`pages/api/recommend.js`), so your Anthropic key stays on the server and the app deploys anywhere.

```
Browser (React)
    │
    │  POST /api/recommend  { prompt: "..." }
    ▼
Next.js API Route  ← ANTHROPIC_API_KEY lives here (env variable)
    │
    ▼
Anthropic API → response back to browser
```

---

## Local development

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API key
```bash
cp .env.local.example .env.local
# then edit .env.local and paste your key from platform.anthropic.com
```

### 3. Run the dev server
```bash
npm run dev
# open http://localhost:3000
```

---

## Deploy to Vercel (free)

### Option A — Vercel CLI
```bash
npm i -g vercel
vercel
# Follow the prompts — it auto-detects Next.js
```

Then add your environment variable in the Vercel dashboard:
- **Settings → Environment Variables**
- Name: `ANTHROPIC_API_KEY`
- Value: `sk-ant-...`
- Environments: Production, Preview, Development

### Option B — GitHub + Vercel dashboard
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add `ANTHROPIC_API_KEY` in the environment variables section
4. Click **Deploy**

That's it. Every `git push` auto-deploys.

---

## Rate limiting

The API route includes a simple in-memory rate limiter (20 requests/IP/minute). For production, replace it with [Upstash Redis](https://upstash.com) for persistence across serverless invocations.

## Cost control

Set a monthly spend limit on [platform.anthropic.com](https://platform.anthropic.com) → Billing → Usage limits. The app uses `claude-sonnet-4-6` with `max_tokens: 1000` per request.

## Project structure

```
stack-decider/
├── pages/
│   ├── _app.jsx          # Next.js app wrapper
│   ├── index.jsx         # Main React app (all UI + rule engine)
│   └── api/
│       └── recommend.js  # ← API route: Anthropic key lives here
├── styles/
│   └── globals.css
├── .env.local.example    # Copy to .env.local and add your key
├── .gitignore            # .env.local is gitignored — key is safe
├── next.config.js
├── vercel.json
└── package.json
```
