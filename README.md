# ⚡ StackDecider

> **AI-powered tech stack recommender** — describe your project idea in plain English and get a tailored stack with docs, learning curves, alternatives, and a week-by-week build roadmap.

Built by **Prajwal Reddy R** for the [Digital Heroes](https://digitalheroesco.com) hiring challenge.

![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Groq](https://img.shields.io/badge/AI-Groq%20%2B%20Llama%203.3-F55036?style=flat-square)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🔗 Live Demo

https://stack-decider.vercel.app/

---

## 📌 Table of Contents

- [What It Does](#-what-it-does)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Supported Project Types](#-supported-project-types)
- [Local Setup](#-local-setup)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🎯 What It Does

Paste any plain-English project description — like _"a food delivery app with real-time driver tracking"_ — and StackDecider instantly returns:

- ✅ **Recommended tech stack** — 5–7 tools covering Frontend, Backend, DB, Auth, and Hosting
- ✅ **Why each tool** — reasoning tied to your specific project, not generic marketing copy
- ✅ **Learning curve** — Gentle / Moderate / Steep with a visual progress bar
- ✅ **Official docs + tutorial links** for every tool
- ✅ **2 alternative stacks** with trade-off notes
- ✅ **Week-by-week build roadmap** — 4–6 milestones to ship
- ✅ **HTML report export** — downloadable and shareable
- ✅ **Dark / Light mode** toggle

---

## ✨ Features

### AI-Enhanced Recommendations
Powered by **Groq's Llama 3.3 70B** model via a secure server-side API route. The AI generates context-aware recommendations specific to your project description — not generic advice.

### Smart Fallback Engine
If the AI is unavailable, the app silently falls back to a hand-crafted **rule-based engine** covering 15+ project types. Users always get a high-quality result.

### Source Badge
Every result shows exactly where it came from:
- `✨ AI-Enhanced` — Groq + Llama 3.3
- `⚙️ Rule-based` — deterministic fallback engine
- `⚡ Cached` — instant repeat result from session cache

### In-Memory Cache
Identical prompts within a session are served from cache — no redundant API calls.

### Rate Limiting
Server-side rate limiter allows max **20 requests per IP per minute** to prevent abuse.

### PDF / HTML Export
One-click export of the full recommendation as a self-contained HTML report — printable and shareable.

---

## 🛠 Tech Stack

| Layer | Tool | Purpose |
|---|---|---|
| Framework | Next.js 14.2.3 | Full-stack React with API routes |
| UI | React 18 | Component-based frontend |
| AI Model | Llama 3.3 70B (via Groq) | Stack recommendations |
| AI API | Groq Cloud | Free, fast LLM inference |
| Styling | Vanilla CSS-in-JS | Zero-dependency theming |
| Hosting | Vercel | Serverless deployment |

No external UI library. No database. No auth required — intentionally lean.

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────┐
│                  Browser                     │
│                                             │
│  React UI (index.jsx)                       │
│   ├── Input → POST /api/recommend           │
│   ├── parseAIResponse() → renders result    │
│   └── On failure → detectStack() fallback   │
└──────────────────┬──────────────────────────┘
                   │ HTTP POST { prompt }
                   ▼
┌─────────────────────────────────────────────┐
│         Next.js API Route                    │
│         pages/api/recommend.js              │
│                                             │
│   1. Validate input                         │
│   2. Rate limit check (20 req/IP/min)       │
│   3. Call Groq API with system prompt       │
│   4. Return raw JSON text to browser        │
│                                             │
│   GROQ_API_KEY lives here ONLY              │
│   Never sent to the browser                 │
└──────────────────┬──────────────────────────┘
                   │ Bearer token
                   ▼
┌─────────────────────────────────────────────┐
│         Groq Cloud API                       │
│         llama-3.3-70b-versatile             │
│         max_tokens: 4000                    │
└─────────────────────────────────────────────┘
```

**Graceful degradation flow:**
```
User submits prompt
       │
       ▼
  Cache hit? ──Yes──▶ Return cached result (⚡ Cached)
       │
      No
       │
       ▼
  Call /api/recommend
       │
  Success? ──Yes──▶ parseAIResponse() ──Valid JSON?──Yes──▶ Show (✨ AI-Enhanced)
       │                                      │
      No                                     No
       │                                      │
       └──────────────┬───────────────────────┘
                      ▼
              detectStack(query) ──▶ Show (⚙️ Rule-based)
```

---

## 📦 Supported Project Types

The rule-based fallback engine covers all of these out of the box:

| Category | Example Keywords |
|---|---|
| 🎮 Game | game, multiplayer, unity, leaderboard |
| ⛓ Blockchain / Web3 | NFT, smart contract, DeFi, wallet, ethereum |
| 🤖 AI / LLM | chatbot, AI, LLM, RAG, PDF QA, embeddings |
| 📹 Video / Streaming | streaming, video, live, HLS, YouTube clone |
| 🌐 IoT | IoT, sensor, embedded, MQTT, raspberry pi |
| 🖥 Desktop App | desktop, electron, tauri, native app |
| 🍕 Food Delivery | food delivery, restaurant, takeaway, zomato, swiggy |
| 📱 Mobile App | mobile, Android, iOS, React Native, Flutter |
| ✍️ Blog / CMS | blog, CMS, content, articles, headless |
| 👥 Social Network | social, feed, followers, likes, profile |
| 💬 Chat / Messaging | chat, messaging, real-time, WhatsApp clone |
| 🛒 E-commerce | shop, store, cart, payments, product listing |
| 📊 SaaS / Dashboard | SaaS, dashboard, analytics, admin, B2B |
| 🔄 Realtime / Collaborative | collaborative, whiteboard, live editing |
| 🌍 Generic Web App | default fallback for anything else |

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18+
- A free Groq API key from [console.groq.com](https://console.groq.com)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/stack-decider.git
cd stack-decider

# 2. Install dependencies
npm install

# 3. Create environment file
# Create a file named .env.local in the root with:
GROQ_API_KEY=your-groq-key-here

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Getting a Groq API Key (Free)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with Google — no credit card needed
3. Click **API Keys** in the sidebar → **Create API Key**
4. Copy and paste into `.env.local`

---

## ☁️ Deployment

### Vercel (Recommended)

#### Option A — GitHub + Vercel Dashboard

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add environment variable:
   - **Key:** `GROQ_API_KEY`
   - **Value:** your Groq API key
4. Click **Deploy** — live URL ready in ~60 seconds

Every `git push` to `main` triggers an automatic redeploy.

#### Option B — Vercel CLI

```bash
npm i -g vercel
vercel
# Follow the prompts, then add GROQ_API_KEY in the Vercel dashboard
```

> ⚠️ **Never commit `.env.local`** — it is in `.gitignore`. Always add secrets through Vercel's Environment Variables UI.

---

## 📁 Project Structure

```
stack-decider/
├── pages/
│   ├── _app.jsx              # Next.js app wrapper
│   ├── index.jsx             # Main UI + rule engine + AI response parser
│   └── api/
│       └── recommend.js      # Server-side API route (Groq key lives here)
├── styles/
│   └── globals.css           # Minimal global reset
├── .env.local                # Your API key — gitignored, never commit
├── .gitignore
├── next.config.js
├── vercel.json
└── package.json
```

### Key Files Explained

**`pages/index.jsx`** — The entire frontend:
- `TECH` — library of 50+ pre-defined tools with docs, tags, and metadata
- `detectStack()` — rule-based engine matching keywords to project types
- `parseAIResponse()` — validates AI JSON, falls back gracefully on failure
- `callAI()` — calls `/api/recommend` and handles errors
- `StackDecider` — main React component with dark/light mode, history, and export

**`pages/api/recommend.js`** — The secure backend:
- Rate limiter (20 req/IP/min)
- Input validation
- Groq API call with structured JSON prompt
- Error handling with proper HTTP status codes

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Free key from [console.groq.com](https://console.groq.com) |

---

## ⚙️ How It Works

1. **User types** a project description and clicks Analyse
2. **Cache check** — if this exact query ran before in this session, return instantly
3. **API call** — frontend sends `POST /api/recommend` with the prompt
4. **Server validates** input, checks rate limit, then calls Groq with a strict JSON system prompt
5. **Groq returns** a JSON object with `summary`, `stack`, `alts`, and `roadmap`
6. **`parseAIResponse()`** validates the JSON shape — if invalid, falls back to `detectStack()`
7. **UI renders** the result with source badge, stack cards, learning curves, and roadmap
8. **Successful AI results** are cached in memory for the session

---

## 🗺 Roadmap

- [ ] Persist search history with localStorage or a lightweight DB
- [ ] Comparison mode — describe two projects, compare stacks side by side
- [ ] Replace in-memory rate limiter with [Upstash Redis](https://upstash.com) for serverless durability
- [ ] PDF export using Puppeteer for better print fidelity
- [ ] Share result via URL (encode prompt as query param)
- [ ] User accounts to save and revisit past recommendations

---

## 📄 License

MIT — free to use, modify, and deploy.

---

<div align="center">
  <strong>Built for the Digital Heroes Hiring Challenge · June 2026</strong><br/>
  <sub>by Prajwal Reddy R · Information Science Engineering, Cambridge Institute of Technology, Bengaluru</sub>
</div>
