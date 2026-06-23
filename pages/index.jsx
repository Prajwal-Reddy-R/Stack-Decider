import { useState, useEffect, useRef } from "react";

// ─── THEME TOKENS ───────────────────────────────────────────────────
const T = {
  dark: {
    bg:"#07091A", bgSurface:"#0D1128", bgCard:"#111830", bgInput:"#0A0D20",
    border:"#1E2748", borderHover:"#3B4680", text:"#E8ECFF", textSub:"#9BA3C8",
    textMuted:"#5C6490", accent:"#6366F1", accentAlt:"#22D3EE",
    accentGlow:"rgba(99,102,241,0.18)", tagBg:"#181E3F", tagText:"#A5B4FC",
    green:"#10B981", amber:"#F59E0B", red:"#EF4444",
    shadow:"0 2px 16px rgba(0,0,0,0.5)", shadowLg:"0 6px 40px rgba(0,0,0,0.6)",
    inputPlaceholder:"#3D4470",
  },
  light: {
    bg:"#F4F6FF", bgSurface:"#FFFFFF", bgCard:"#FFFFFF", bgInput:"#F8F9FF",
    border:"#DDE2F5", borderHover:"#9BA3C8", text:"#0D1128", textSub:"#3B4560",
    textMuted:"#6B7280", accent:"#4F46E5", accentAlt:"#0891B2",
    accentGlow:"rgba(79,70,229,0.12)", tagBg:"#EEF2FF", tagText:"#4338CA",
    green:"#059669", amber:"#D97706", red:"#DC2626",
    shadow:"0 2px 16px rgba(79,70,229,0.08)", shadowLg:"0 6px 40px rgba(79,70,229,0.12)",
    inputPlaceholder:"#9BA3C8",
  },
};

// ─── TECH STACK LIBRARY ──────────────────────────────────────────────
// Each entry is a reusable building block that detectStack assembles per project
const TECH = {
  // Frontend
  nextjs: { cat:"Frontend", name:"Next.js 14", tags:["SSR","TypeScript","React"], curve:2, free:true, docs:"https://nextjs.org/docs", tut:"https://nextjs.org/learn" },
  react: { cat:"Frontend", name:"React + Vite", tags:["SPA","Fast HMR","TypeScript"], curve:2, free:true, docs:"https://react.dev", tut:"https://vitejs.dev/guide/" },
  flutter: { cat:"Frontend", name:"Flutter", tags:["Cross-platform","Dart","Native"], curve:3, free:true, docs:"https://docs.flutter.dev", tut:"https://docs.flutter.dev/get-started/codelab" },
  reactNative: { cat:"Mobile", name:"React Native + Expo", tags:["Cross-platform","OTA Updates","iOS/Android"], curve:2, free:true, docs:"https://docs.expo.dev", tut:"https://docs.expo.dev/tutorial/introduction/" },
  electron: { cat:"Desktop", name:"Electron + React", tags:["Desktop App","Node.js","Cross-OS"], curve:2, free:true, docs:"https://www.electronjs.org/docs/latest", tut:"https://www.electronjs.org/docs/latest/tutorial/quick-start" },
  astro: { cat:"Frontend", name:"Astro", tags:["Zero JS","SSG","Islands"], curve:2, free:true, docs:"https://docs.astro.build", tut:"https://docs.astro.build/en/tutorial/0-introduction/" },
  vue: { cat:"Frontend", name:"Vue 3 + Nuxt", tags:["SSR","Composition API","TypeScript"], curve:2, free:true, docs:"https://vuejs.org/guide", tut:"https://nuxt.com/docs/getting-started/installation" },
  svelte: { cat:"Frontend", name:"SvelteKit", tags:["No VDOM","SSR","TypeScript"], curve:2, free:true, docs:"https://kit.svelte.dev/docs", tut:"https://learn.svelte.dev" },
  unity: { cat:"Game Engine", name:"Unity", tags:["C#","2D/3D","Cross-platform"], curve:3, free:true, docs:"https://docs.unity3d.com", tut:"https://learn.unity.com" },
  godot: { cat:"Game Engine", name:"Godot 4", tags:["GDScript","2D/3D","Open Source"], curve:2, free:true, docs:"https://docs.godotengine.org", tut:"https://docs.godotengine.org/en/stable/getting_started/first_2d_game/" },
  threejs: { cat:"3D/WebGL", name:"Three.js", tags:["WebGL","3D","Animation"], curve:3, free:true, docs:"https://threejs.org/docs", tut:"https://threejs.org/manual/" },
  // Backend
  nodeExpress: { cat:"Backend", name:"Node.js + Express", tags:["REST API","Middleware","JS"], curve:2, free:true, docs:"https://nodejs.org/en/docs", tut:"https://expressjs.com/en/starter/installing.html" },
  nodeFastify: { cat:"Backend", name:"Node.js + Fastify", tags:["Fast REST","TypeScript","Plugins"], curve:2, free:true, docs:"https://fastify.dev/docs/latest", tut:"https://fastify.dev/docs/latest/Guides/Getting-Started/" },
  socketio: { cat:"Backend", name:"Node.js + Socket.io", tags:["WebSockets","Rooms","Real-time"], curve:2, free:true, docs:"https://socket.io/docs/v4/", tut:"https://socket.io/get-started/chat" },
  trpc: { cat:"Backend", name:"tRPC + Node.js", tags:["Type-safe","RPC","End-to-end"], curve:2, free:true, docs:"https://trpc.io/docs", tut:"https://trpc.io/docs/quickstart" },
  django: { cat:"Backend", name:"Django + DRF", tags:["Python","REST","ORM"], curve:2, free:true, docs:"https://docs.djangoproject.com", tut:"https://www.django-rest-framework.org/tutorial/quickstart/" },
  fastapi: { cat:"Backend", name:"FastAPI", tags:["Python","Async","Auto Docs"], curve:2, free:true, docs:"https://fastapi.tiangolo.com", tut:"https://fastapi.tiangolo.com/tutorial/" },
  golang: { cat:"Backend", name:"Go + Gin", tags:["High Performance","Concurrent","Compiled"], curve:3, free:true, docs:"https://gin-gonic.com/docs/", tut:"https://go.dev/doc/tutorial/web-service-gin" },
  laravel: { cat:"Backend", name:"Laravel", tags:["PHP","MVC","Eloquent ORM"], curve:2, free:true, docs:"https://laravel.com/docs", tut:"https://laravel.com/docs/11.x#your-first-laravel-project" },
  springboot: { cat:"Backend", name:"Spring Boot", tags:["Java","Enterprise","REST"], curve:3, free:true, docs:"https://docs.spring.io/spring-boot/index.html", tut:"https://spring.io/guides/gs/spring-boot" },
  graphql: { cat:"API", name:"GraphQL + Apollo", tags:["Flexible Queries","Type Schema","Federation"], curve:3, free:true, docs:"https://www.apollographql.com/docs", tut:"https://www.apollographql.com/tutorials/" },
  // Database
  postgres: { cat:"Database", name:"PostgreSQL + Prisma", tags:["SQL","ORM","Relations"], curve:2, free:true, docs:"https://www.prisma.io/docs", tut:"https://www.prisma.io/docs/getting-started" },
  mongo: { cat:"Database", name:"MongoDB + Mongoose", tags:["NoSQL","Flexible Schema","JSON"], curve:2, free:true, docs:"https://www.mongodb.com/docs", tut:"https://www.mongodb.com/docs/drivers/node/current/quick-start/" },
  redis: { cat:"Cache", name:"Redis", tags:["In-Memory","Pub/Sub","Sessions"], curve:2, free:true, docs:"https://redis.io/docs", tut:"https://redis.io/docs/getting-started/" },
  supabase: { cat:"Backend & DB", name:"Supabase", tags:["BaaS","Postgres","Realtime"], curve:1, free:true, docs:"https://supabase.com/docs", tut:"https://supabase.com/docs/guides/getting-started" },
  firebase: { cat:"Backend & DB", name:"Firebase", tags:["BaaS","Realtime","NoSQL"], curve:1, free:true, docs:"https://firebase.google.com/docs", tut:"https://firebase.google.com/docs/web/setup" },
  planetscale: { cat:"Database", name:"PlanetScale (MySQL)", tags:["Serverless","Branching","Scale"], curve:2, free:true, docs:"https://planetscale.com/docs", tut:"https://planetscale.com/docs/tutorials/connect-nextjs-app" },
  sqlite: { cat:"Database", name:"SQLite + Drizzle", tags:["Embedded","Zero Config","Lightweight"], curve:1, free:true, docs:"https://orm.drizzle.team/docs/overview", tut:"https://orm.drizzle.team/docs/get-started-sqlite" },
  pinecone: { cat:"Vector DB", name:"Pinecone", tags:["Embeddings","Semantic Search","AI"], curve:2, free:true, docs:"https://docs.pinecone.io", tut:"https://docs.pinecone.io/guides/get-started/quickstart" },
  // Auth
  clerk: { cat:"Auth", name:"Clerk", tags:["SSO","MFA","Orgs"], curve:1, free:true, docs:"https://clerk.com/docs", tut:"https://clerk.com/docs/quickstarts/nextjs" },
  nextauth: { cat:"Auth", name:"NextAuth.js", tags:["OAuth","JWT","Sessions"], curve:2, free:true, docs:"https://next-auth.js.org/getting-started/introduction", tut:"https://next-auth.js.org/getting-started/example" },
  supabaseAuth: { cat:"Auth", name:"Supabase Auth", tags:["OAuth","Magic Link","RLS"], curve:1, free:true, docs:"https://supabase.com/docs/guides/auth", tut:"https://supabase.com/docs/guides/auth/social-login/auth-google" },
  jwt: { cat:"Auth", name:"JWT + bcrypt", tags:["Stateless","Custom","Secure"], curve:2, free:true, docs:"https://jwt.io/introduction", tut:"https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs" },
  // Payments
  stripe: { cat:"Payments", name:"Stripe", tags:["PCI Compliant","Webhooks","Global"], curve:1, free:true, docs:"https://stripe.com/docs", tut:"https://stripe.com/docs/checkout/quickstart" },
  stripeBilling: { cat:"Payments", name:"Stripe Billing", tags:["Subscriptions","Invoices","Dunning"], curve:2, free:true, docs:"https://stripe.com/docs/billing", tut:"https://stripe.com/docs/billing/quickstart" },
  razorpay: { cat:"Payments", name:"Razorpay", tags:["India","UPI","Subscriptions"], curve:1, free:true, docs:"https://razorpay.com/docs", tut:"https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/quick-integration/" },
  // Hosting
  vercel: { cat:"Hosting", name:"Vercel", tags:["Serverless","CDN","Preview Deploys"], curve:1, free:true, docs:"https://vercel.com/docs", tut:"https://vercel.com/guides/deploying-nextjs-with-vercel" },
  railway: { cat:"Hosting", name:"Railway", tags:["Always-on","Managed DB","CI/CD"], curve:1, free:true, docs:"https://docs.railway.app", tut:"https://railway.app/guides" },
  flyio: { cat:"Hosting", name:"Fly.io", tags:["Global Edge","Always-on","Containers"], curve:2, free:true, docs:"https://fly.io/docs", tut:"https://fly.io/docs/getting-started/" },
  eas: { cat:"Distribution", name:"EAS Build + App Stores", tags:["iOS/Android","CI/CD","Store Submit"], curve:2, free:true, docs:"https://docs.expo.dev/eas", tut:"https://docs.expo.dev/build/setup/" },
  ghPages: { cat:"Hosting", name:"GitHub Pages / Netlify", tags:["Static","Free","CDN"], curve:1, free:true, docs:"https://docs.netlify.com", tut:"https://docs.netlify.com/site-deploys/create-deploys/" },
  aws: { cat:"Hosting", name:"AWS (EC2 + S3 + CloudFront)", tags:["Enterprise","Scalable","Full Control"], curve:3, free:false, docs:"https://docs.aws.amazon.com", tut:"https://aws.amazon.com/getting-started/guides/deploy-webapp-ec2/" },
  // Storage
  cloudinary: { cat:"Storage", name:"Cloudinary", tags:["CDN","Image Transform","Upload"], curve:1, free:true, docs:"https://cloudinary.com/documentation", tut:"https://cloudinary.com/documentation/node_image_and_video_upload" },
  s3: { cat:"Storage", name:"AWS S3 + CloudFront", tags:["Object Storage","CDN","Durable"], curve:2, free:false, docs:"https://docs.aws.amazon.com/s3", tut:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html" },
  uploadthing: { cat:"Storage", name:"UploadThing", tags:["File Upload","CDN","Next.js native"], curve:1, free:true, docs:"https://docs.uploadthing.com", tut:"https://docs.uploadthing.com/getting-started/appdir" },
  // AI / ML
  openaiSDK: { cat:"AI / LLM", name:"OpenAI API", tags:["GPT-4o","Embeddings","Chat"], curve:1, free:false, docs:"https://platform.openai.com/docs", tut:"https://platform.openai.com/docs/quickstart" },
  langchain: { cat:"AI Framework", name:"LangChain.js", tags:["Chains","RAG","Agents"], curve:3, free:true, docs:"https://js.langchain.com/docs", tut:"https://js.langchain.com/docs/tutorials/llm_chain" },
  huggingface: { cat:"AI / ML", name:"Hugging Face Transformers", tags:["Open Source","Fine-tuning","Inference"], curve:3, free:true, docs:"https://huggingface.co/docs", tut:"https://huggingface.co/docs/transformers/quicktour" },
  // Maps / Location
  googlemaps: { cat:"Maps", name:"Google Maps Platform", tags:["Geocoding","Routing","Live Map"], curve:2, free:true, docs:"https://developers.google.com/maps/documentation", tut:"https://developers.google.com/maps/documentation/javascript/tutorial" },
  mapbox: { cat:"Maps", name:"Mapbox GL JS", tags:["Custom Maps","3D","Vector Tiles"], curve:2, free:true, docs:"https://docs.mapbox.com/mapbox-gl-js", tut:"https://docs.mapbox.com/mapbox-gl-js/guides/" },
  // CMS
  sanity: { cat:"CMS", name:"Sanity.io", tags:["Headless","GROQ","Visual Editor"], curve:1, free:true, docs:"https://www.sanity.io/docs", tut:"https://www.sanity.io/docs/getting-started-with-sanity" },
  contentful: { cat:"CMS", name:"Contentful", tags:["Headless","API-first","CDN"], curve:1, free:true, docs:"https://www.contentful.com/developers/docs", tut:"https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/" },
  // State
  zustand: { cat:"State", name:"Zustand", tags:["Lightweight","Persist","Simple"], curve:1, free:true, docs:"https://docs.pmnd.rs/zustand", tut:"https://docs.pmnd.rs/zustand/guides/tutorials" },
  reactQuery: { cat:"State", name:"React Query (TanStack)", tags:["Server State","Cache","Async"], curve:2, free:true, docs:"https://tanstack.com/query/latest/docs/framework/react/overview", tut:"https://tanstack.com/query/latest/docs/framework/react/quick-start" },
  // Styling
  tailwind: { cat:"Styling", name:"Tailwind CSS", tags:["Utility","Responsive","Dark Mode"], curve:1, free:true, docs:"https://tailwindcss.com/docs", tut:"https://tailwindcss.com/docs/installation" },
  // Blockchain
  ethers: { cat:"Blockchain", name:"Ethers.js + Hardhat", tags:["EVM","Smart Contracts","Testing"], curve:3, free:true, docs:"https://docs.ethers.org", tut:"https://hardhat.org/tutorial" },
  solana: { cat:"Blockchain", name:"Solana Web3.js + Anchor", tags:["Fast","Low Fee","Rust"], curve:3, free:true, docs:"https://solana.com/docs", tut:"https://www.anchor-lang.com/docs/installation" },
  // Notifications
  expoPush: { cat:"Notifications", name:"Expo Notifications", tags:["Push","Local","Scheduling"], curve:1, free:true, docs:"https://docs.expo.dev/push-notifications/overview", tut:"https://docs.expo.dev/push-notifications/push-notifications-setup/" },
  // Other
  reactNav: { cat:"Navigation", name:"React Navigation", tags:["Stack","Tabs","Deep Links"], curve:1, free:true, docs:"https://reactnavigation.org/docs/getting-started", tut:"https://reactnavigation.org/docs/hello-react-navigation" },
  websocket: { cat:"Real-time", name:"Socket.io + Redis Pub/Sub", tags:["Rooms","Scalable","Events"], curve:3, free:true, docs:"https://socket.io/docs/v4", tut:"https://socket.io/get-started/chat" },
  elasticsearch: { cat:"Search", name:"Elasticsearch / Meilisearch", tags:["Full-text","Fast","Faceted"], curve:3, free:true, docs:"https://www.meilisearch.com/docs", tut:"https://www.meilisearch.com/docs/learn/getting_started/quick_start" },
  algolia: { cat:"Search", name:"Algolia", tags:["Instant Search","Free Tier","React"], curve:1, free:true, docs:"https://www.algolia.com/doc", tut:"https://www.algolia.com/doc/guides/building-search-ui/installation/react/" },
  ffmpeg: { cat:"Media Processing", name:"FFmpeg + BullMQ", tags:["Video","Transcoding","Queue"], curve:3, free:true, docs:"https://ffmpeg.org/documentation.html", tut:"https://github.com/fluent-ffmpeg/node-fluent-ffmpeg" },
  twilioVideo: { cat:"Video / Calling", name:"Twilio Video / LiveKit", tags:["WebRTC","Rooms","Recording"], curve:2, free:true, docs:"https://docs.livekit.io", tut:"https://docs.livekit.io/realtime/quickstarts/react/" },
  // IoT
  mqtt: { cat:"IoT Protocol", name:"MQTT + Mosquitto Broker", tags:["Low Power","Pub/Sub","IoT"], curve:2, free:true, docs:"https://mqtt.org/documentation", tut:"https://mosquitto.org/man/mosquitto-8.html" },
  // Data
  pandas: { cat:"Data Processing", name:"Python + Pandas + NumPy", tags:["Data Analysis","ETL","Jupyter"], curve:2, free:true, docs:"https://pandas.pydata.org/docs", tut:"https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html" },
  plotly: { cat:"Data Viz", name:"Plotly / D3.js", tags:["Interactive Charts","SVG","Custom"], curve:2, free:true, docs:"https://plotly.com/javascript", tut:"https://d3js.org/getting-started" },
  recharts: { cat:"Data Viz", name:"Recharts + shadcn/ui", tags:["React Charts","Responsive","Simple"], curve:1, free:true, docs:"https://recharts.org/en-US/api", tut:"https://recharts.org/en-US/examples" },
};

// ─── SMART PROFILE BUILDER ────────────────────────────────────────────
// Instead of fixed buckets, we detect multiple signals and compose a tailored stack

const SIGNALS = {
  // Core project types
  ecommerce:     ["shop","ecommerce","e-commerce","marketplace","sell online","buy","cart","checkout","woocommerce","product catalog","retail","storefront","inventory","catalogue"],
  food:          ["food delivery","restaurant","meal delivery","order food","kitchen","menu","takeaway","takeout","catering","swiggy","zomato","ubereats","dark kitchen","grocery delivery"],
  saas:          ["saas","dashboard","analytics","b2b","admin panel","metrics","multi-tenant","tenant","crm","erp","billing","invoicing","workspace","subscription platform","enterprise app"],
  social:        ["social network","social media","feed","follow","followers","posts","profile","stories","communities","twitter clone","instagram clone","facebook clone","tiktok clone"],
  chat:          ["chat","messaging","dm","direct message","inbox","conversation","slack clone","discord clone","group chat","instant message"],
  realtime:      ["real-time","realtime","live","multiplayer","collaborative","whiteboard","cursor","presence","typing indicator","co-edit","concurrent"],
  mobile:        ["mobile app","ios app","android app","react native","flutter app","phone app","native app","cross-platform app","play store","app store"],
  blog:          ["blog","cms","content management","article","news site","magazine","portfolio site","editorial","newsletter","headless cms","markdown","publication"],
  video:         ["video","streaming","youtube clone","vod","live stream","video call","webrtc","video conference","zoom clone","twitch clone","video upload","screenshare"],
  ai:            ["ai","artificial intelligence","llm","chatbot","gpt","machine learning","nlp","recommendation engine","semantic search","rag","vector","embedding","fine-tune","generative"],
  blockchain:    ["blockchain","web3","nft","smart contract","defi","crypto","dao","token","ethereum","solana","wallet","dapp","decentralized"],
  game:          ["game","gaming","2d game","3d game","multiplayer game","unity","godot","shooter","rpg","puzzle game","leaderboard","matchmaking"],
  iot:           ["iot","internet of things","sensor","smart home","embedded","arduino","raspberry pi","device","firmware","telemetry","mqtt"],
  desktop:       ["desktop app","electron","tauri","windows app","mac app","linux app","native desktop","system tray"],
  dataplatform:  ["data pipeline","etl","data warehouse","big data","analytics platform","bi tool","reporting","data visualization","dashboard analytics","apache spark"],
  // Feature modifiers
  payments:      ["payment","stripe","pay","checkout","billing","invoice","subscription","monetize","razorpay"],
  maps:          ["map","location","gps","geolocation","tracking","navigation","route","driver","delivery tracking","geocod"],
  search:        ["search","full-text search","instant search","algolia","elasticsearch","filter"],
  auth:          ["auth","login","signup","oauth","sso","social login","magic link","password","user account"],
  upload:        ["upload","file upload","image upload","video upload","storage","cdn","media"],
  notifications: ["notification","push notification","email alert","sms","in-app notification"],
};

function scoreInput(text) {
  const q = text.toLowerCase();
  const scores = {};
  for (const [signal, keywords] of Object.entries(SIGNALS)) {
    scores[signal] = keywords.filter(k => q.includes(k)).length;
  }
  return scores;
}

function detectStack(input) {
  const s = scoreInput(input);
  const q = input.toLowerCase();

  // ─ GAME ─
  if (s.game >= 1) {
    const is3D = q.includes("3d") || q.includes("three") || q.includes("unity");
    return {
      summary: { type: is3D ? "3D Game" : "2D Game", time: "10–24 weeks", team: "1–4 devs", difficulty: "Advanced" },
      note: "Ship a minimal playable prototype in week 2. Polish kills indie games — cut features before cutting quality.",
      stack: [
        { ...TECH[is3D ? "unity" : "godot"], why: is3D ? "Unity's asset store and massive community save weeks on 3D mechanics, physics, and cross-platform export." : "Godot 4's GDScript is Python-like and the engine ships zero royalties — perfect for indie 2D games." },
        { ...TECH.supabase, cat:"Backend", why:"Handles leaderboards, player profiles, and save data with a real-time Postgres backend and free auth." },
        { ...TECH.redis, why:"Low-latency session state for matchmaking queues, room presence, and game lobby management." },
        { ...TECH.websocket, why:"Real-time multiplayer state sync needs persistent WebSocket connections — Socket.io handles reconnection and rooms." },
        { cat:"Analytics", name:"GameAnalytics (Free)", tags:["Events","Funnels","Retention"], curve:1, free:true, docs:"https://gameanalytics.com/docs", tut:"https://gameanalytics.com/docs/item/unity-sdk", why:"Purpose-built game analytics: DAU, session length, level funnels. Free tier is generous and Unity SDK takes 15 minutes." },
        { ...(is3D ? TECH.aws : TECH.ghPages), why: is3D ? "3D games need asset streaming from S3 + CloudFront CDN. Static hosting can't handle large binary bundles." : "GitHub Pages deploys your Godot HTML5 export for free in minutes — perfect for browser-based 2D games." },
      ],
      alts: [
        { name:"Godot + Nakama", reason:"Open-source multiplayer server if you want full control over game backend", best:"Self-hosted or privacy-sensitive games" },
        { name:"PlayFab", reason:"Microsoft's all-in-one game backend: matchmaking, economy, leaderboards", best:"Teams that want managed game infrastructure" },
      ],
      roadmap: [
        { title:"Core Loop Prototype", detail:"Build the one mechanic that makes your game fun — nothing else", dur:"Week 1–2" },
        { title:"Art & Audio Pass", detail:"Placeholder art replaced with final assets; add sound effects and music", dur:"Week 3–6" },
        { title:"Multiplayer Layer", detail:"Rooms, matchmaking, sync game state over Socket.io", dur:"Week 7–10" },
        { title:"Progression & Saves", detail:"Levels, unlocks, leaderboards via Supabase", dur:"Week 11–14" },
        { title:"Playtesting & Polish", detail:"External playtest sessions, bug fixes, performance profiling", dur:"Week 15–20" },
        { title:"Launch & Live Ops", detail:"Store submission or web deploy, post-launch analytics review", dur:"Week 21–24" },
      ],
    };
  }

  // ─ BLOCKCHAIN / WEB3 ─
  if (s.blockchain >= 1) {
    const isSolana = q.includes("solana") || q.includes("sol");
    return {
      summary: { type:"Web3 / Blockchain App", time:"10–20 weeks", team:"2–4 devs", difficulty:"Advanced" },
      note: "Write and audit smart contracts before building UI. Security vulnerabilities in deployed contracts are irreversible — invest in testing.",
      stack: [
        { ...TECH.nextjs, why:"Server-side rendering for SEO on public pages; wallet connect hooks work seamlessly with Next.js." },
        { ...(isSolana ? TECH.solana : TECH.ethers), why: isSolana ? "Anchor framework simplifies Solana program development; Web3.js handles wallet connections and RPC calls." : "Ethers.js is the standard EVM wallet/contract interaction library; Hardhat provides a full local testing environment." },
        { cat:"Wallet", name:"WalletConnect / Phantom", tags:["Multi-wallet","Mobile","EVM/Solana"], curve:2, free:true, docs:"https://docs.walletconnect.com", tut:"https://docs.walletconnect.com/web3modal/nextjs/about", why:"Users expect to connect with MetaMask, Phantom, Coinbase Wallet etc. WalletConnect abstracts all of them." },
        { ...TECH.pinecone, why:"Store NFT metadata, token attributes, and user holdings for instant retrieval without on-chain calls." },
        { cat:"RPC / Indexer", name:"Alchemy / Helius", tags:["Node API","Webhooks","NFT API"], curve:1, free:true, docs:"https://docs.alchemy.com", tut:"https://docs.alchemy.com/docs/alchemy-quickstart-guide", why:"Free tier RPC node with 300M compute units/month, NFT indexing API, and webhook-based on-chain event listeners." },
        { ...TECH.vercel, why:"Zero-config Next.js deploys; your dApp frontend is just a static React app at the end of the day." },
      ],
      alts: [
        { name:"Thirdweb SDK", reason:"Pre-built contracts and UI components for NFT minting, marketplaces, and token gates", best:"Faster launch if using standard ERC standards" },
        { name:"The Graph Protocol", reason:"Decentralised indexing for complex on-chain queries", best:"Complex query patterns or when data decentralisation matters" },
      ],
      roadmap: [
        { title:"Smart Contract Design", detail:"Write, test, and audit contracts on local Hardhat/Anchor fork", dur:"Week 1–4" },
        { title:"Testnet Deploy", detail:"Deploy to Sepolia/Devnet, connect wallet, test all paths end to end", dur:"Week 5–7" },
        { title:"Frontend dApp", detail:"Next.js UI, wallet connection, transaction flows, error states", dur:"Week 8–12" },
        { title:"Security Audit", detail:"External audit or peer review before mainnet; fix all issues", dur:"Week 13–15" },
        { title:"Mainnet Launch", detail:"Deploy contracts, verify on Etherscan/Solscan, launch dApp", dur:"Week 16–20" },
      ],
    };
  }

  // ─ AI / LLM ─
  if (s.ai >= 1) {
    const isRAG = q.includes("rag") || q.includes("document") || q.includes("pdf") || q.includes("knowledge base") || q.includes("vector") || q.includes("semantic");
    return {
      summary: { type:"AI-Powered App", time:"6–14 weeks", team:"1–3 devs", difficulty:"Intermediate–Advanced" },
      note: "Prompt engineering and retrieval quality matter more than model choice. Nail your evaluation dataset before optimising anything else.",
      stack: [
        { ...TECH.nextjs, why:"App Router makes streaming LLM responses trivial with Server-Sent Events. The Vercel AI SDK was built for Next.js." },
        { ...TECH.openaiSDK, why:"GPT-4o for complex reasoning, GPT-4o-mini for cost-efficient tasks. Function calling handles structured outputs reliably." },
        ...(isRAG ? [
          { ...TECH.langchain, why:"Orchestrates retrieval chains: document chunking → embedding → vector search → prompt construction → LLM response." },
          { ...TECH.pinecone, why:"Stores high-dimensional embeddings for semantic search. Sub-10ms query latency at millions of vectors." },
        ] : [
          { ...TECH.supabase, why:"Stores conversation history, user sessions, and usage logs. pgvector extension adds vector search if you need it later." },
        ]),
        { cat:"AI SDK", name:"Vercel AI SDK", tags:["Streaming","React Hooks","Multi-model"], curve:1, free:true, docs:"https://sdk.vercel.ai/docs", tut:"https://sdk.vercel.ai/docs/getting-started/nextjs-app-router", why:"useChat, useCompletion, and streamText handle streaming UX and token counting so you don't re-invent it." },
        { ...TECH.redis, why:"Rate limit API calls per user, cache identical prompts, and store short-lived session context without hitting the DB." },
        { ...TECH.vercel, why:"Vercel's Edge Runtime streams AI responses globally with minimal cold starts. AI SDK deployments are first-class." },
      ],
      alts: [
        { name:"Anthropic Claude API", reason:"Often cheaper than GPT-4 for long contexts; Claude 3 Haiku is extremely fast for classification tasks", best:"Long document processing or cost-sensitive workloads" },
        { name:"Ollama + LlamaIndex", reason:"Run open-source models locally or on your server — no per-token costs", best:"Privacy-sensitive data or offline requirements" },
      ],
      roadmap: [
        { title:"Prototype & Eval", detail:"Build simplest possible version; create 20-case eval set to measure quality baseline", dur:"Week 1–2" },
        { title:"Core AI Feature", detail:"Implement main LLM flow with streaming, error handling, retry logic", dur:"Week 3–5" },
        ...(isRAG ? [{ title:"RAG Pipeline", detail:"Document ingestion, chunking strategy, embedding, vector retrieval tuning", dur:"Week 6–8" }] : []),
        { title:"Auth & Rate Limiting", detail:"User accounts, API key management, usage quotas, billing integration", dur:"Week 7–9" },
        { title:"UI Polish", detail:"Streaming UI, markdown rendering, code highlighting, conversation history", dur:"Week 10–11" },
        { title:"Launch", detail:"Deploy to Vercel, monitor token costs, set up alerts for failures", dur:"Week 12–14" },
      ],
    };
  }

  // ─ VIDEO / STREAMING ─
  if (s.video >= 1) {
    const isLive = q.includes("live stream") || q.includes("twitch") || q.includes("broadcast");
    return {
      summary: { type: isLive ? "Live Streaming Platform" : "Video Platform", time:"12–20 weeks", team:"3–5 devs", difficulty:"Advanced" },
      note: "Video transcoding is CPU-intensive and expensive. Use Mux or Cloudflare Stream for managed encoding — the DIY path takes months to get right.",
      stack: [
        { ...TECH.nextjs, why:"Server-side rendering for video pages boosts SEO. Built-in API routes handle webhooks from your video provider." },
        { cat:"Video", name: isLive ? "LiveKit + RTMP Ingest" : "Mux Video", tags: isLive ? ["WebRTC","RTMP","Scalable"] : ["Transcoding","HLS","Analytics"], curve:2, free:true,
          docs: isLive ? "https://docs.livekit.io" : "https://docs.mux.com",
          tut: isLive ? "https://docs.livekit.io/realtime/quickstarts/react/" : "https://docs.mux.com/guides/video/start-uploading-video",
          why: isLive ? "LiveKit handles RTMP ingest from OBS, multi-viewer scaling, and WebRTC playback with sub-second latency." : "Mux transcodes uploads to HLS with adaptive bitrate automatically; their player handles buffering, quality, and analytics." },
        { ...TECH.postgres, why:"Stores videos, channels, comments, likes, subscriptions — relational schema fits social video perfectly." },
        { ...TECH.redis, why:"Cache video metadata, view counts, trending scores. Essential for homepage feed performance at scale." },
        { ...TECH.clerk, why:"Handles creator and viewer accounts, OAuth login, and paid subscriber access control." },
        { ...TECH.flyio, why:"Always-on server for Socket.io live chat, Mux webhook processing, and background job queues." },
      ],
      alts: [
        { name:"Cloudflare Stream", reason:"Alternative managed video with per-minute pricing and a global CDN", best:"Cost-sensitive or Cloudflare-already-in-stack" },
        { name:"MediaSoup + FFmpeg", reason:"Self-hosted WebRTC SFU for full control over streams", best:"Very high scale or white-label requirements" },
      ],
      roadmap: [
        { title:"Video Pipeline", detail:"Upload → transcode → HLS playback working end to end on Mux/LiveKit", dur:"Week 1–3" },
        { title:"Auth & Channels", detail:"Creator accounts, channel pages, subscriber relationships", dur:"Week 4–5" },
        { title:"Social Features", detail:"Comments, likes, notifications, feed algorithm (chronological first)", dur:"Week 6–8" },
        { title:"Monetisation", detail:"Stripe for paid subscriptions, super chat or tip jar", dur:"Week 9–11" },
        { title:"Live Features", detail:"Live chat overlay, stream health dashboard, VOD recording", dur:"Week 12–15" },
        { title:"Scale & Launch", detail:"CDN optimisation, abuse reporting, mobile responsive, launch", dur:"Week 16–20" },
      ],
    };
  }

  // ─ IoT ─
  if (s.iot >= 1) {
    return {
      summary: { type:"IoT Platform", time:"10–18 weeks", team:"2–4 devs", difficulty:"Advanced" },
      note: "Design your data ingestion pipeline to handle device disconnects and duplicate messages from day one. MQTT QoS levels matter at scale.",
      stack: [
        { ...TECH.react, why:"Dashboard UI for real-time sensor visualisation. React's state model handles rapid data updates cleanly." },
        { ...TECH.fastapi, why:"Python backend for ingesting sensor data, running lightweight ML models, and serving dashboard API." },
        { ...TECH.mqtt, why:"Lightweight pub/sub protocol designed for constrained devices. Mosquitto broker handles thousands of device connections with minimal overhead." },
        { cat:"Time-Series DB", name:"InfluxDB / TimescaleDB", tags:["Time-series","Fast Writes","Queries"], curve:2, free:true, docs:"https://docs.influxdata.com", tut:"https://docs.influxdata.com/influxdb/cloud/get-started/", why:"Purpose-built for high-frequency sensor data. Downsampling policies automatically aggregate old data to save storage." },
        { ...TECH.redis, why:"Pub/sub bridge between MQTT broker and WebSocket server for real-time dashboard updates." },
        { ...TECH.flyio, why:"Always-on server for the MQTT broker and WebSocket relay. IoT can't use serverless — devices need persistent connections." },
      ],
      alts: [
        { name:"AWS IoT Core", reason:"Managed MQTT broker that scales to millions of devices with IAM security", best:"Production at large scale or existing AWS infrastructure" },
        { name:"Node-RED", reason:"Visual flow-based tool for wiring device events to actions without code", best:"Rapid prototyping or non-developer teams" },
      ],
      roadmap: [
        { title:"Device Protocol", detail:"MQTT broker setup, topic schema design, QoS level decisions", dur:"Week 1–2" },
        { title:"Data Ingestion API", detail:"FastAPI endpoints, InfluxDB write pipeline, data validation", dur:"Week 3–5" },
        { title:"Real-time Dashboard", detail:"React UI with live charts, device status, alert indicators", dur:"Week 6–9" },
        { title:"Alerting & Rules", detail:"Threshold alerts, anomaly detection, email/SMS notifications", dur:"Week 10–12" },
        { title:"Auth & Device Management", detail:"Device provisioning, API keys, user roles, device registry", dur:"Week 13–15" },
        { title:"Hardening & Launch", detail:"TLS for MQTT, rate limiting, load testing, production deploy", dur:"Week 16–18" },
      ],
    };
  }

  // ─ DESKTOP APP ─
  if (s.desktop >= 1) {
    return {
      summary: { type:"Desktop App", time:"8–16 weeks", team:"1–3 devs", difficulty:"Intermediate" },
      note: "Tauri is the modern alternative to Electron — 10x smaller bundles and lower RAM because it uses the OS webview instead of bundling Chromium.",
      stack: [
        { cat:"Framework", name:"Tauri + React", tags:["Rust Core","Small Bundle","Native APIs"], curve:2, free:true, docs:"https://tauri.app/v1/guides", tut:"https://tauri.app/v1/guides/getting-started/setup/", why:"Tauri apps are typically under 10MB vs Electron's 150MB+. Rust core gives you native OS APIs with memory safety." },
        { ...TECH.tailwind, why:"Utility CSS keeps styling fast. shadcn/ui gives you polished desktop-feeling components out of the box." },
        { ...TECH.sqlite, why:"SQLite is the right database for a desktop app — embedded, zero config, works offline, syncs trivially via file." },
        { ...TECH.zustand, why:"Lightweight state management that persists to disk via Tauri's store plugin for user preferences and app state." },
        { cat:"Auto Update", name:"Tauri Updater", tags:["OTA","Signed","Delta"], curve:1, free:true, docs:"https://tauri.app/v1/guides/distribution/updater", tut:"https://tauri.app/v1/guides/distribution/updater", why:"Built-in updater checks your GitHub releases and applies signed auto-updates with a single config option." },
        { cat:"Distribution", name:"GitHub Releases + Tauri Build", tags:["macOS","Windows","Linux"], curve:1, free:true, docs:"https://tauri.app/v1/guides/distribution", tut:"https://tauri.app/v1/guides/distribution/publishing", why:"GitHub Actions + Tauri Action builds signed installers for all three platforms in CI automatically." },
      ],
      alts: [
        { name:"Electron + React", reason:"Larger ecosystem, Chromium bundled so you control exact rendering", best:"Complex browser APIs or team already knows Electron" },
        { name:"Flutter Desktop", reason:"Single codebase for desktop and mobile", best:"Sharing code between mobile and desktop" },
      ],
      roadmap: [
        { title:"Tauri Setup + UI Shell", detail:"Init project, main window, menu bar, system tray if needed", dur:"Week 1–2" },
        { title:"Core Feature", detail:"Main app functionality wired to SQLite backend via Tauri commands", dur:"Week 3–7" },
        { title:"Native Integration", detail:"File system, clipboard, notifications, OS-native dialogs", dur:"Week 8–10" },
        { title:"Settings & Persistence", detail:"Preferences panel, SQLite migrations, auto-save", dur:"Week 11–12" },
        { title:"Build & Sign", detail:"Code signing for macOS/Windows, GitHub Actions CI, auto-updater", dur:"Week 13–14" },
        { title:"Beta & Launch", detail:"Beta testers, crash reporting, GitHub release", dur:"Week 15–16" },
      ],
    };
  }

  // ─ FOOD DELIVERY ─
  if (s.food >= 1) {
    const hasTracking = q.includes("track") || q.includes("driver") || q.includes("real-time") || q.includes("location");
    return {
      summary: { type:"Food Delivery App", time:"10–16 weeks", team:"2–4 devs", difficulty:"Advanced" },
      note: "Real-time driver tracking is the hardest part. Plan your WebSocket + Redis pub/sub architecture before writing a line of UI.",
      stack: [
        { ...TECH.react, why:"Fast HMR during development. Component model handles complex states: cart, live order, map, and driver status cleanly." },
        { ...TECH.socketio, why:"Persistent WebSockets push live driver GPS coordinates and order status updates to customers without polling." },
        { ...TECH.postgres, why:"Relational schema models restaurants, menus, orders, drivers, and users — all with strong foreign key relationships." },
        { ...TECH.redis, why:"Caches live driver positions for sub-millisecond reads. Acts as pub/sub layer between driver app and customer UI." },
        ...(hasTracking ? [{ ...TECH.googlemaps, why:"Geocoding restaurant and delivery addresses, route optimisation for drivers, and the live map component customers see." }] : []),
        { ...TECH[q.includes("india") || q.includes("indian") ? "razorpay" : "stripe"], why: q.includes("india") || q.includes("indian") ? "Razorpay supports UPI, Netbanking, and Indian cards — essential for Indian food delivery." : "Stripe handles split payments between platform and restaurants, refunds, and saved cards. Webhooks confirm payment before kitchen gets the order." },
        { ...TECH.railway, why:"Railway runs your Node/Socket.io server with persistent connections (Vercel serverless can't hold WebSocket state)." },
      ],
      alts: [
        { name:"Flutter + Firebase", reason:"Native iOS/Android apps with Firebase Realtime DB for driver tracking", best:"Mobile-first launch with native feel" },
        { name:"Next.js + Supabase Realtime", reason:"Supabase's built-in realtime channels simplify the architecture for smaller scale", best:"Solo dev or MVP with fewer drivers" },
      ],
      roadmap: [
        { title:"Auth + Roles", detail:"Customer, restaurant owner, and driver accounts with role-based access", dur:"Week 1–2" },
        { title:"Restaurant & Menu", detail:"CRUD for menus, categories, item availability, opening hours", dur:"Week 3–4" },
        { title:"Ordering & Payments", detail:"Cart flow, checkout, Stripe/Razorpay integration, order confirmation", dur:"Week 5–7" },
        { title:"Real-time Tracking", detail:"Socket.io GPS relay, live map for customers, driver location updates", dur:"Week 8–10" },
        { title:"Driver App", detail:"Driver-facing order queue, accept/reject, navigation deeplink", dur:"Week 11–13" },
        { title:"Testing & Launch", detail:"Load test WebSocket connections, mobile QA, production deploy", dur:"Week 14–16" },
      ],
    };
  }

  // ─ MOBILE APP ─
  if (s.mobile >= 1) {
    return {
      summary: { type:"Mobile App", time:"8–16 weeks", team:"1–3 devs", difficulty:"Intermediate–Advanced" },
      note: "For a solo developer, React Native + Expo is the fastest path to both stores. Flutter wins on animation performance and type safety from day one.",
      stack: [
        { ...TECH.reactNative, why:"Write once, ship to iOS and Android. Expo Go lets testers scan a QR and run your app instantly without Xcode/Android Studio." },
        { ...TECH.supabase, why:"Postgres, auth, real-time subscriptions, and file storage in one JS client that works natively in React Native." },
        { ...TECH.reactNav, why:"De-facto standard for React Native routing. Stack, tab, and drawer navigators cover every mobile pattern." },
        { ...TECH.zustand, why:"Minimal boilerplate; persists to AsyncStorage with one plugin — handles offline-first patterns that mobile apps need." },
        { ...TECH.expoPush, why:"Push notifications to both platforms through a single API. Free, no third-party service needed for most scales." },
        { ...TECH.eas, why:"Expo Application Services builds your IPA/APK in the cloud — no Mac needed for iOS builds. Submit directly to stores." },
      ],
      alts: [
        { name:"Flutter + Firebase", reason:"Superior animation performance, Dart is strongly typed from day one", best:"Highly animated UIs or gaming-adjacent apps" },
        { name:"Swift + Kotlin (Native)", reason:"Maximum performance and full platform API access", best:"AR, Bluetooth, or hardware-intensive features" },
      ],
      roadmap: [
        { title:"Expo Setup & Navigation", detail:"Init project, React Navigation tabs/stack, Supabase client", dur:"Week 1" },
        { title:"Auth Flow", detail:"Sign up, login, password reset, session persistence", dur:"Week 2" },
        { title:"Core Screens", detail:"Main feature screens with real data from Supabase", dur:"Week 3–7" },
        { title:"Offline & State", detail:"Zustand store, optimistic UI, error boundaries", dur:"Week 8–9" },
        { title:"Notifications & Deep Links", detail:"Push setup, deep link handling for notifications", dur:"Week 10–11" },
        { title:"Store Submission", detail:"EAS Build, TestFlight beta, App Store / Play Store review", dur:"Week 12–16" },
      ],
    };
  }

  // ─ BLOG / CMS ─
  if (s.blog >= 1) {
    return {
      summary: { type:"Blog / Content Site", time:"2–5 weeks", team:"1 dev", difficulty:"Beginner–Intermediate" },
      note: "Static generation + headless CMS is the modern winning combo. Editors get a nice UI; readers get sub-second page loads.",
      stack: [
        { ...TECH.astro, why:"Astro ships zero JS by default — fastest possible page loads for content sites. Markdown, MDX, and any UI framework supported." },
        { ...TECH.sanity, why:"Free hosted CMS with a visual editor writers actually enjoy. GROQ query language fetches exactly the fields you need." },
        { ...TECH.tailwind, why:"@tailwindcss/typography applies beautiful prose styles to your content with one class. Dark mode and responsive by default." },
        { ...TECH.algolia, why:"Instant search across all posts as you type. Free tier (10k records) covers most personal blogs and small publications." },
        { cat:"Comments", name:"Giscus", tags:["GitHub","No DB","Spam-proof"], curve:1, free:true, docs:"https://giscus.app", tut:"https://giscus.app", why:"GitHub Discussions-powered comments — no database, no moderation overhead, spam-proof since users need a GitHub account." },
        { ...TECH.ghPages, why:"Netlify or GitHub Pages deploys your Astro site for free with automatic rebuilds on CMS publish." },
      ],
      alts: [
        { name:"Next.js + Contentful", reason:"More interactivity support when content pages need dynamic features", best:"Blogs with search, filtering, or membership" },
        { name:"Ghost CMS", reason:"All-in-one: blog, newsletter, memberships — no external CMS needed", best:"Monetised newsletter + blog combo" },
      ],
      roadmap: [
        { title:"Sanity Schema", detail:"Define post, author, category content types in Sanity Studio", dur:"Day 1–2" },
        { title:"Astro + GROQ", detail:"Fetch posts at build time, dynamic routes for [slug]", dur:"Day 3–5" },
        { title:"Typography & Dark Mode", detail:"Tailwind prose styles, light/dark toggle, RSS feed", dur:"Day 6–8" },
        { title:"Search & Comments", detail:"Algolia indexing on publish, Giscus embed", dur:"Day 9–11" },
        { title:"SEO & Deploy", detail:"Open Graph images, sitemap.xml, Netlify deploy", dur:"Day 12–14" },
      ],
    };
  }

  // ─ SOCIAL NETWORK ─
  if (s.social >= 1) {
    return {
      summary: { type:"Social Network", time:"12–20 weeks", team:"3–5 devs", difficulty:"Advanced" },
      note: "Feed algorithm is the hardest problem. Start with chronological, ship fast, then layer ranking. Don't build the algorithm before you have users.",
      stack: [
        { ...TECH.nextjs, why:"SSR for public profiles boosts SEO significantly. App Router server components reduce JS bundle for logged-out pages." },
        { ...TECH.socketio, why:"Persistent connections for notifications, live feed updates, typing indicators, and online presence." },
        { ...TECH.postgres, why:"Relational schema is perfect for users, posts, follows, likes, and comments — all with efficient JOIN queries." },
        { ...TECH.redis, why:"Cache hot feeds, session data, unread counts. Sorted sets power the trending/ranking algorithm efficiently." },
        { ...TECH.cloudinary, why:"Profile photos, post images, and short videos need a CDN with auto-compression. Never serve from your app server." },
        { ...TECH.clerk, why:"OAuth sign-in (Google, Apple, GitHub) and email/password with zero setup. Users expect social login on social apps." },
        { ...TECH.flyio, why:"Always-on server for Socket.io. Also runs background jobs for notifications, feed fan-out, and email digests." },
      ],
      alts: [
        { name:"Supabase + Supabase Realtime", reason:"Simpler stack using Supabase's built-in realtime channels instead of Socket.io", best:"Solo dev or smaller expected scale" },
        { name:"ActivityPub + Mastodon", reason:"Federated protocol for interoperability with the Fediverse", best:"Open social / decentralised positioning" },
      ],
      roadmap: [
        { title:"Auth + Profiles", detail:"Sign up, profile pages, avatar upload, follow/unfollow", dur:"Week 1–3" },
        { title:"Posts & Feed", detail:"Create posts, chronological feed, image uploads, delete", dur:"Week 4–6" },
        { title:"Engagement Layer", detail:"Likes, comments, reposts, nested threads, notifications", dur:"Week 7–9" },
        { title:"Real-time", detail:"Socket.io live notifications, online presence, live feed inserts", dur:"Week 10–12" },
        { title:"Discovery", detail:"Search, hashtags, trending posts, suggested follows", dur:"Week 13–15" },
        { title:"Polish & Launch", detail:"Mobile responsive, content moderation basics, public beta", dur:"Week 16–20" },
      ],
    };
  }

  // ─ CHAT / MESSAGING ─
  if (s.chat >= 2 || (s.chat >= 1 && s.realtime >= 1)) {
    return {
      summary: { type:"Chat / Messaging App", time:"6–10 weeks", team:"1–3 devs", difficulty:"Advanced" },
      note: "WebSocket state is stateful — you cannot use serverless functions for the Socket.io server. Always-on infrastructure (Railway, Fly.io) is required.",
      stack: [
        { ...TECH.react, why:"React's state model handles rapid UI updates from WebSocket events without unnecessary re-renders." },
        { ...TECH.socketio, why:"Rooms, namespaces, and acknowledgements are built in. Socket.io abstracts WebSocket fallbacks seamlessly." },
        { ...TECH.redis, why:"Redis pub/sub scales Socket.io across multiple server instances. Stores ephemeral presence and unread counts." },
        { ...TECH.postgres, why:"Persists messages, channels, attachments, and user data. Full-text search over message history." },
        { ...TECH.jwt, why:"Stateless auth token passed in the WebSocket handshake identifies users without session DB lookups." },
        { ...TECH.uploadthing, why:"File and image sharing in chat needs a CDN. Never serve user uploads from your Socket.io server." },
        { ...TECH.flyio, why:"Fly.io keeps your Socket.io server always-on globally. Supabase handles Postgres." },
      ],
      alts: [
        { name:"Supabase Realtime", reason:"Supabase's built-in channels eliminate the separate Socket.io server for simpler architectures", best:"Smaller scale or solo dev" },
        { name:"Stream Chat SDK", reason:"Managed chat API with offline support, threads, reactions out of the box", best:"Speed to market over customisation" },
      ],
      roadmap: [
        { title:"Socket.io Server", detail:"Node server with namespaces, rooms, and event schema", dur:"Week 1" },
        { title:"Auth + Connections", detail:"JWT handshake on connect, user presence tracking, online list", dur:"Week 2" },
        { title:"Core Messaging", detail:"Send/receive messages, rooms/channels, read receipts", dur:"Week 3–5" },
        { title:"File Sharing", detail:"Image and file uploads via UploadThing, media previews", dur:"Week 6" },
        { title:"Notifications & History", detail:"Push notifications, message history pagination on reconnect", dur:"Week 7–8" },
        { title:"Scale & Deploy", detail:"Redis pub/sub for multi-server, deploy to Fly.io", dur:"Week 9–10" },
      ],
    };
  }

  // ─ ECOMMERCE ─
  if (s.ecommerce >= 1) {
    return {
      summary: { type:"E-Commerce Platform", time:"6–12 weeks", team:"2–3 devs", difficulty:"Intermediate" },
      note: "Server-side rendering on product pages is critical for SEO. Never client-render your catalogue — search engines won't index it properly.",
      stack: [
        { ...TECH.nextjs, why:"App Router gives server-side rendering per page — critical for product SEO. Built-in image optimisation handles product photos." },
        { ...TECH.nodeExpress, why:"Handles order processing, Stripe webhook events, and inventory updates with mature e-commerce libraries." },
        { ...TECH.postgres, why:"Relational schema perfectly models products, orders, users, and inventory. Prisma keeps queries type-safe and migrations painless." },
        { ...(q.includes("india") ? TECH.razorpay : TECH.stripe), why: q.includes("india") ? "Razorpay supports UPI, Netbanking, COD and all Indian payment methods — essential for Indian e-commerce." : "Industry standard for checkout, subscriptions, and refunds. Pre-built UI components mean you never store raw card data." },
        { ...TECH.cloudinary, why:"Product image uploads, auto-compression, and responsive resizing via URL parameters. Free tier covers most indie stores." },
        { ...TECH.vercel, why:"Zero-config Next.js deploys with preview URLs. Railway for the Express API and Postgres database." },
      ],
      alts: [
        { name:"Shopify + Hydrogen", reason:"Managed infrastructure, built-in payments, no custom backend required", best:"Non-technical clients or rapid launch" },
        { name:"WooCommerce + WordPress", reason:"Massive plugin ecosystem, familiar to non-developers", best:"Content-heavy stores or existing WordPress sites" },
      ],
      roadmap: [
        { title:"Auth & User Accounts", detail:"NextAuth, registration, login, protected routes, address book", dur:"Week 1" },
        { title:"Product Catalogue", detail:"Listings, detail pages, search, filters, Postgres + Prisma", dur:"Week 2–3" },
        { title:"Cart & Checkout", detail:"Client cart state, Stripe Checkout integration, order creation", dur:"Week 4–5" },
        { title:"Order Management", detail:"Admin dashboard, order status updates, email confirmations", dur:"Week 6–7" },
        { title:"Polish & Deploy", detail:"Mobile responsiveness, SEO meta tags, Vercel + Railway deploy", dur:"Week 8" },
      ],
    };
  }

  // ─ SAAS / DASHBOARD ─
  if (s.saas >= 1) {
    return {
      summary: { type:"SaaS / Dashboard", time:"10–18 weeks", team:"2–4 devs", difficulty:"Advanced" },
      note: "Multi-tenancy needs database row-level security from day one. Don't bolt it on later — retrofitting is a security nightmare.",
      stack: [
        { ...TECH.nextjs, why:"App Router server components reduce client JS. Tailwind's utility classes handle complex data-dense dashboard layouts." },
        { ...TECH.trpc, why:"End-to-end type safety between frontend and backend with no REST schemas. Eliminates runtime bugs in dashboard data fetching." },
        { ...TECH.postgres, why:"Row-level security on Postgres enforces tenant isolation at the DB layer. Prisma makes multi-tenant queries safe." },
        { ...TECH.clerk, why:"Handles org workspaces, SSO, and MFA — exactly what B2B buyers expect. Integrates with Next.js in minutes." },
        { ...TECH.stripeBilling, why:"Subscriptions, usage-based pricing, dunning emails, and billing portal pre-built. Saves weeks." },
        { ...TECH.recharts, why:"Recharts for charts, shadcn/ui for data tables and dialogs. Both integrate perfectly with Next.js App Router." },
        { cat:"Hosting", name:"Vercel + Supabase", tags:["Serverless","Managed DB","Preview"], curve:1, free:true, docs:"https://supabase.com/docs", tut:"https://supabase.com/docs/guides/getting-started", why:"Vercel auto-scales the Next.js app. Supabase provides hosted Postgres with built-in RLS, realtime, and an admin UI." },
      ],
      alts: [
        { name:"Remix + PlanetScale", reason:"Edge-deployed routes for global low-latency dashboards", best:"Global user base, performance-critical" },
        { name:"Vue + Laravel + MySQL", reason:"Mature full-stack with Blade UI or Inertia.js", best:"PHP teams or existing Laravel expertise" },
      ],
      roadmap: [
        { title:"Auth & Org Setup", detail:"Clerk integration, invite flow, role assignment (admin/member)", dur:"Week 1–2" },
        { title:"Core Data Models", detail:"Postgres schema with tenant_id, RLS policies, Prisma setup", dur:"Week 3–4" },
        { title:"Dashboard UI", detail:"Charts, data tables, filters, date ranges", dur:"Week 5–7" },
        { title:"Stripe Billing", detail:"Plan selection, checkout, webhook handlers, billing portal", dur:"Week 8–9" },
        { title:"Settings & Admin", detail:"Team management, usage limits, audit logs", dur:"Week 10–11" },
        { title:"Testing & Launch", detail:"E2E tests with Playwright, error monitoring via Sentry, deploy", dur:"Week 12–14" },
      ],
    };
  }

  // ─ REALTIME / COLLABORATIVE ─
  if (s.realtime >= 1) {
    return {
      summary: { type:"Real-time Collaborative App", time:"8–12 weeks", team:"2–3 devs", difficulty:"Advanced" },
      note: "WebSocket connections are stateful — serverless functions will NOT work for the connection handler. Always-on servers are mandatory.",
      stack: [
        { ...TECH.react, why:"React's state model handles rapid UI updates from WebSocket events cleanly." },
        { ...TECH.socketio, why:"Rooms, namespaces, and acknowledgements built in. Socket.io handles reconnection automatically." },
        { ...TECH.redis, why:"Pub/sub scales Socket.io across servers. Sorted sets track cursor positions and presence." },
        { ...TECH.postgres, why:"Persists collaboration history, snapshots, and user data long-term." },
        { ...TECH.jwt, why:"Stateless auth token in the WebSocket handshake — no session DB lookup per event." },
        { ...TECH.flyio, why:"Always-on global server for your Socket.io backend. Fly's anycast routing reduces latency." },
      ],
      alts: [
        { name:"Liveblocks", reason:"Managed real-time collaboration infrastructure with conflict-free sync built in", best:"Collaborative editors or complex CRDT needs" },
        { name:"Supabase Realtime", reason:"Simpler stack using Supabase's WebSocket channels", best:"Smaller teams or simpler sync requirements" },
      ],
      roadmap: [
        { title:"Socket.io Architecture", detail:"Server, rooms, event schema, Redis pub/sub setup", dur:"Week 1–2" },
        { title:"Auth & Presence", detail:"JWT handshake, online users list, typing indicators", dur:"Week 3" },
        { title:"Core Real-time Feature", detail:"Primary collaborative feature wired end to end", dur:"Week 4–7" },
        { title:"Persistence", detail:"Save events to Postgres, load state on reconnect", dur:"Week 8–9" },
        { title:"Scale & Deploy", detail:"Multi-server Redis pub/sub, Fly.io production deploy", dur:"Week 10–12" },
      ],
    };
  }

  // ─ DEFAULT: Generic Web App (but smarter) ─
  const wantsBackend = q.includes("backend") || q.includes("api") || q.includes("server") || q.includes("database");
  const isSimple = q.length < 60 && !wantsBackend;
  return {
    summary: { type: isSimple ? "Web App (Lean Stack)" : "Full-Stack Web App", time: isSimple ? "3–6 weeks" : "6–10 weeks", team: isSimple ? "1 dev" : "1–2 devs", difficulty: isSimple ? "Beginner" : "Intermediate" },
    note: "Next.js + Supabase is the fastest path to a production-ready app in 2025. Both have excellent free tiers and skip the need for a separate backend server.",
    stack: [
      { ...TECH.nextjs, why:"The most production-ready React framework. SSR, SSG, and ISR give you the right rendering strategy per page, with built-in image and font optimisation." },
      { ...TECH.supabase, why:"Hosted Postgres with a REST API auto-generated from your schema, built-in auth, realtime, and file storage. No separate backend needed for most apps." },
      { ...TECH.tailwind, why:"Utility-first CSS keeps styles co-located with components. Dark mode, responsive breakpoints, and animations are one class away." },
      { ...TECH.supabaseAuth, why:"Email, OAuth (Google/GitHub), and magic links work out of the box. Row-level security lets Postgres enforce who can see what." },
      { ...TECH.zustand, cat:"State", why:"Zustand for client state (UI, preferences). Pairs with React Query for server state — caching, background refetch, and loading states handled." },
      { ...TECH.vercel, why:"Zero-config Next.js deployments with preview URLs per pull request. Edge network ensures fast loads globally. Free Hobby plan covers most indie projects." },
    ],
    alts: [
      { name:"Remix + PlanetScale", reason:"Edge-first routing with MySQL; great for high-traffic global apps", best:"Performance-critical, globally distributed users" },
      { name:"Vue 3 + Nuxt + Firebase", reason:"Slightly gentler curve than React for some developers", best:"Teams with Vue experience or Firebase familiarity" },
    ],
    roadmap: [
      { title:"Project Setup", detail:"Next.js init, Tailwind, Supabase client, environment variables", dur:"Day 1–2" },
      { title:"Auth & Routing", detail:"Sign in/up pages, protected routes, user session handling", dur:"Day 3–5" },
      { title:"Core Feature Build", detail:"Main CRUD screens wired to Supabase tables with RLS", dur:"Week 2–3" },
      { title:"UI Polish", detail:"Responsive design, loading/error states, empty states", dur:"Week 4" },
      { title:"Testing & Deploy", detail:"Basic E2E tests, Vercel deployment, custom domain", dur:"Week 5" },
    ],
  };
}

// ─── ICONS ───────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const ExternalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

// ─── COLOUR MAP ───────────────────────────────────────────────────────
const CAT_COLOR = {
  Frontend:"#6366F1", Backend:"#06B6D4", Database:"#10B981",
  Hosting:"#F59E0B", Auth:"#EC4899", Storage:"#8B5CF6",
  State:"#14B8A6", Payments:"#22C55E", CMS:"#F97316",
  Maps:"#3B82F6", Navigation:"#A855F7", Notifications:"#EF4444",
  Media:"#F59E0B", Distribution:"#6366F1", Search:"#06B6D4",
  Comments:"#10B981", Styling:"#EC4899", "Backend & DB":"#06B6D4",
  "Game Engine":"#8B5CF6", "3D/WebGL":"#06B6D4", Blockchain:"#F59E0B",
  "AI / LLM":"#A855F7", "AI Framework":"#EC4899", "Vector DB":"#14B8A6",
  "API":"#06B6D4", Cache:"#F59E0B", Mobile:"#6366F1", Desktop:"#14B8A6",
  "Real-time":"#EF4444", Analytics:"#3B82F6", Wallet:"#F59E0B",
  "RPC / Indexer":"#8B5CF6", "AI SDK":"#A855F7", "Media Processing":"#F59E0B",
  "Video / Calling":"#EC4899", "Time-Series DB":"#10B981", "IoT Protocol":"#06B6D4",
  "Data Processing":"#3B82F6", "Data Viz":"#F59E0B", "Auto Update":"#10B981",
  "Framework":"#6366F1", Other:"#64748B",
};

const CURVE = ["", "Gentle", "Moderate", "Steep"];
const CURVE_C = ["", "#10B981", "#F59E0B", "#EF4444"];

// ─── PDF BUILDER ──────────────────────────────────────────────────────
function buildPrintHTML(query, rec) {
  const stackRows = rec.stack.map(item => {
    const cc = CAT_COLOR[item.cat] || "#64748B";
    return `<div style="border:1px solid #DDE2F5;border-radius:12px;padding:18px 20px;margin-bottom:12px;page-break-inside:avoid;position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${cc};"></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px;">
        <div>
          <span style="font-size:10px;font-weight:700;letter-spacing:1px;color:${cc};text-transform:uppercase;">${item.cat}</span>
          <h3 style="margin:5px 0 0;font-size:16px;font-weight:700;color:#0D1128;">${item.name}</h3>
        </div>
        ${item.free ? `<span style="font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;background:#D1FAE5;color:#059669;border:1px solid #A7F3D0;">FREE</span>` : ""}
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;">
        ${(item.tags||[]).map(tag => `<span style="font-size:11px;font-weight:600;font-family:monospace;padding:2px 8px;border-radius:6px;background:#EEF2FF;color:#4338CA;border:1px solid #DDE2F5;">${tag}</span>`).join("")}
      </div>
      <p style="margin:0 0 10px;font-size:13px;color:#3B4560;line-height:1.65;">${item.why}</p>
      <div style="font-size:12px;color:#6B7280;">Learning Curve: <strong style="color:${CURVE_C[item.curve]||'#6B7280'};">${CURVE[item.curve]||''}</strong></div>
      ${item.docs ? `<div style="font-size:12px;color:#6B7280;margin-top:4px;">📖 <a href="${item.docs}" style="color:#4F46E5;">${item.docs}</a></div>` : ""}
      ${item.tut ? `<div style="font-size:12px;color:#6B7280;margin-top:2px;">🎓 <a href="${item.tut}" style="color:#0891B2;">${item.tut}</a></div>` : ""}
    </div>`;
  }).join("");

  const altRows = (rec.alts||[]).map(a => `
    <div style="border:1px solid #DDE2F5;border-radius:10px;padding:12px 16px;margin-bottom:9px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;">
      <div style="flex:1;"><strong style="font-size:14px;color:#0D1128;">${a.name}</strong><p style="margin:4px 0 0;font-size:13px;color:#3B4560;">${a.reason}</p></div>
      <span style="font-size:11px;padding:3px 10px;border-radius:99px;background:#EEF2FF;color:#4338CA;font-weight:600;white-space:nowrap;border:1px solid #DDE2F5;">${a.best}</span>
    </div>`).join("");

  const roadRows = (rec.roadmap||[]).map((s, i) => `
    <div style="display:flex;gap:14px;margin-bottom:14px;">
      <div style="width:30px;height:30px;min-width:30px;border-radius:50%;background:linear-gradient(135deg,#4F46E5,#0891B2);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:13px;">${i+1}</div>
      <div><div style="font-weight:700;font-size:14px;color:#0D1128;">${s.title}</div><div style="font-size:13px;color:#3B4560;margin-top:3px;">${s.detail}</div><div style="font-size:12px;color:#0891B2;font-weight:700;margin-top:3px;">${s.dur}</div></div>
    </div>`).join("");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',sans-serif;background:#fff;color:#0D1128;}
  .page{max-width:800px;margin:0 auto;padding:44px 44px 60px;}
  h2{font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:700;color:#0D1128;margin:28px 0 14px;}
  @media print{@page{margin:18mm 14mm}body{padding:0}.page{padding:0;max-width:100%;}}
</style></head><body>
<div class="page">
  <div style="border-bottom:3px solid #4F46E5;padding-bottom:20px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:12px;">
    <div>
      <div style="font-size:22px;font-weight:800;font-family:'Space Grotesk',sans-serif;color:#4F46E5;">⚡ StackDecider</div>
      <div style="font-size:12px;color:#6B7280;margin-top:4px;">Tech Stack Recommendation Report</div>
    </div>
    <div style="font-size:12px;color:#6B7280;text-align:right;">Generated ${new Date().toLocaleDateString("en-IN",{year:"numeric",month:"long",day:"numeric"})}</div>
  </div>
  <div style="background:#F4F6FF;border-radius:12px;padding:16px 20px;margin-bottom:28px;border-left:4px solid #4F46E5;">
    <div style="font-size:10px;font-weight:700;color:#4F46E5;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Project Description</div>
    <p style="font-size:15px;color:#0D1128;font-weight:500;line-height:1.5;">${query}</p>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
    ${[{icon:"🏗️",label:"Project Type",val:rec.summary.type},{icon:"⏱️",label:"Build Time",val:rec.summary.time},{icon:"👥",label:"Team Size",val:rec.summary.team},{icon:"🎯",label:"Difficulty",val:rec.summary.difficulty}].map(m=>`
    <div style="background:#F8F9FF;border:1px solid #DDE2F5;border-radius:10px;padding:13px 15px;">
      <div style="font-size:18px;">${m.icon}</div>
      <div style="font-size:10px;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;margin-top:6px;">${m.label}</div>
      <div style="font-size:15px;font-weight:700;color:#0D1128;margin-top:3px;">${m.val}</div>
    </div>`).join("")}
  </div>
  ${rec.note ? `<div style="border-left:3px solid #4F46E5;padding-left:14px;margin-bottom:28px;font-size:13px;color:#3B4560;line-height:1.65;">${rec.note}</div>` : ""}
  <h2>🧩 Recommended Tech Stack</h2>${stackRows}
  <h2>🔀 Alternative Stacks</h2>${altRows}
  <h2>🗺️ Build Roadmap</h2>${roadRows}
  <div style="margin-top:40px;padding-top:18px;border-top:1px solid #DDE2F5;font-size:12px;color:#6B7280;">⚡ StackDecider — digitalheroesco.com</div>
</div>
</body></html>`;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────
function StackCard({ item, idx, t }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVis(true), idx * 90);
    return () => clearTimeout(timer);
  }, [idx]);
  const cc = CAT_COLOR[item.cat] || "#64748B";
  return (
    <div style={{
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)",
      transition:"opacity 0.4s ease, transform 0.4s ease",
      background: t.bgCard, border:`1px solid ${t.border}`,
      borderRadius:14, padding:"20px 20px 18px", boxShadow: t.shadow,
      display:"flex", flexDirection:"column", gap:10, position:"relative", overflow:"hidden",
    }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:cc, borderRadius:"14px 14px 0 0" }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <div style={{ flex:1 }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:1.2, color:cc, textTransform:"uppercase" }}>{item.cat}</span>
          <h3 style={{ margin:"5px 0 0", fontSize:17, fontWeight:700, color:t.text, fontFamily:"'Space Grotesk',sans-serif", lineHeight:1.2 }}>{item.name}</h3>
        </div>
        {item.free && (
          <span style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:99, background:"#10B98120", color:t.green, border:`1px solid ${t.green}40`, flexShrink:0, marginTop:2 }}>FREE</span>
        )}
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
        {(item.tags||[]).map(tag => (
          <span key={tag} style={{ fontSize:11, fontWeight:600, fontFamily:"monospace", padding:"2px 8px", borderRadius:6, background:t.tagBg, color:t.tagText, border:`1px solid ${t.border}` }}>{tag}</span>
        ))}
      </div>
      <p style={{ margin:0, fontSize:13.5, color:t.textSub, lineHeight:1.65 }}>{item.why}</p>
      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:11, fontWeight:600, color:t.textMuted, textTransform:"uppercase", letterSpacing:0.6 }}>Learning Curve</span>
          <span style={{ fontSize:11, fontWeight:700, color:CURVE_C[item.curve]||t.textMuted }}>{CURVE[item.curve]||""}</span>
        </div>
        <div style={{ height:6, borderRadius:99, background:t.border, overflow:"hidden" }}>
          <div style={{ width:`${((item.curve||1)/3)*100}%`, height:"100%", background:CURVE_C[item.curve]||t.textMuted, borderRadius:99, transition:"width 1.1s ease" }}/>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:2 }}>
        {item.docs && (
          <a href={item.docs} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, fontWeight:600, color:t.accent, textDecoration:"none", display:"flex", alignItems:"center", gap:4, padding:"5px 12px", borderRadius:7, border:`1px solid ${t.accent}40`, transition:"all 0.18s" }}
            onMouseEnter={e=>{ e.currentTarget.style.background=t.accentGlow; e.currentTarget.style.borderColor=t.accent; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=`${t.accent}40`; }}
          >Docs <ExternalIcon/></a>
        )}
        {item.tut && (
          <a href={item.tut} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, fontWeight:600, color:t.accentAlt, textDecoration:"none", display:"flex", alignItems:"center", gap:4, padding:"5px 12px", borderRadius:7, border:`1px solid ${t.accentAlt}40`, transition:"all 0.18s" }}
            onMouseEnter={e=>{ e.currentTarget.style.background=`${t.accentAlt}18`; e.currentTarget.style.borderColor=t.accentAlt; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=`${t.accentAlt}40`; }}
          >Tutorial <ExternalIcon/></a>
        )}
      </div>
    </div>
  );
}

function SummaryPanel({ s, note, t }) {
  const items = [
    { icon:"🏗️", label:"Project Type", val:s.type },
    { icon:"⏱️", label:"Build Time", val:s.time },
    { icon:"👥", label:"Team Size", val:s.team },
    { icon:"🎯", label:"Difficulty", val:s.difficulty },
  ];
  return (
    <div style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:14, padding:"20px 22px", boxShadow:t.shadow, display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10 }}>
        {items.map(m => (
          <div key={m.label} style={{ background:t.bgSurface, borderRadius:10, padding:"12px 14px", border:`1px solid ${t.border}` }}>
            <div style={{ fontSize:20 }}>{m.icon}</div>
            <div style={{ fontSize:10, color:t.textMuted, textTransform:"uppercase", letterSpacing:0.6, fontWeight:700, marginTop:6 }}>{m.label}</div>
            <div style={{ fontSize:14, fontWeight:700, color:t.text, marginTop:3 }}>{m.val}</div>
          </div>
        ))}
      </div>
      {note && <p style={{ margin:0, fontSize:13.5, color:t.textSub, lineHeight:1.65, borderLeft:`3px solid ${t.accent}`, paddingLeft:12 }}>{note}</p>}
    </div>
  );
}

function AltsPanel({ alts, t }) {
  if (!alts?.length) return null;
  return (
    <div style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:14, padding:"20px 22px", boxShadow:t.shadow }}>
      <h3 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700, color:t.text, fontFamily:"'Space Grotesk',sans-serif" }}>🔀 Alternative Stacks</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
        {alts.map((a, i) => (
          <div key={i} style={{ background:t.bgSurface, border:`1px solid ${t.border}`, borderRadius:10, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14, color:t.text }}>{a.name}</div>
              <div style={{ fontSize:13, color:t.textSub, marginTop:3 }}>{a.reason}</div>
            </div>
            <span style={{ fontSize:11, padding:"3px 10px", borderRadius:99, background:t.tagBg, color:t.tagText, fontWeight:600, whiteSpace:"nowrap", border:`1px solid ${t.border}` }}>{a.best}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoadmapPanel({ steps, t }) {
  if (!steps?.length) return null;
  return (
    <div style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:14, padding:"20px 22px", boxShadow:t.shadow }}>
      <h3 style={{ margin:"0 0 18px", fontSize:15, fontWeight:700, color:t.text, fontFamily:"'Space Grotesk',sans-serif" }}>🗺️ Build Roadmap</h3>
      {steps.map((s, i) => (
        <div key={i} style={{ display:"flex", gap:14 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ width:32, height:32, borderRadius:"50%", flexShrink:0, background:`linear-gradient(135deg,${t.accent},${t.accentAlt})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:13 }}>{i+1}</div>
            {i < steps.length-1 && <div style={{ width:2, flex:1, background:t.border, margin:"4px 0", minHeight:20 }}/>}
          </div>
          <div style={{ paddingBottom: i < steps.length-1 ? 18 : 0, flex:1 }}>
            <div style={{ fontWeight:700, fontSize:14, color:t.text }}>{s.title}</div>
            <div style={{ fontSize:13, color:t.textSub, marginTop:3, lineHeight:1.5 }}>{s.detail}</div>
            <div style={{ fontSize:12, color:t.accentAlt, marginTop:4, fontWeight:700 }}>{s.dur}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────
const EXAMPLES = [
  "A food delivery app with real-time driver tracking",
  "A multiplayer 2D browser game with leaderboards",
  "An AI chatbot that answers questions from my PDF docs",
  "A Web3 NFT marketplace on Ethereum",
  "A SaaS analytics dashboard with team workspaces",
  "A cross-platform mobile fitness tracker",
  "An IoT smart home dashboard for sensor data",
  "A video streaming platform like YouTube",
];

// ─── AI CACHE (in-memory, session-scoped) ────────────────────────────
const aiCache = new Map();

// ─── PARSE AI RESPONSE → rec shape ───────────────────────────────────
function parseAIResponse(text, fallbackRec) {
  try {
    // Try to extract JSON block if the model wrapped it
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
    const raw = jsonMatch ? jsonMatch[1] : text;
    const parsed = JSON.parse(raw.trim());
    // Validate minimum shape
    if (parsed.summary && Array.isArray(parsed.stack) && parsed.stack.length > 0) {
      // Merge docs/tut from our TECH library where name matches
      parsed.stack = parsed.stack.map(item => {
        const match = Object.values(TECH).find(t => t.name === item.name);
        return match ? { ...match, ...item } : item;
      });
      return { rec: parsed, source: "ai" };
    }
  } catch (_) { /* fall through */ }
  return { rec: fallbackRec, source: "fallback" };
}

// ─── CALL OUR OWN BACKEND ROUTE ──────────────────────────────────────
// The API key lives in .env.local on the server — never in the browser.
async function callAI(userInput) {
  const response = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: userInput }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const status = response.status;
    throw Object.assign(new Error(err?.error || "API error"), { status });
  }

  const data = await response.json();
  return data.text || "";
}

export default function StackDecider() {
  const [dark, setDark] = useState(true);
  const t = dark ? T.dark : T.light;
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const resultRef = useRef(null);

  async function handleAnalyse() {
    if (!input.trim() || loading) return;
    const query = input.trim();
    const cacheKey = query.toLowerCase().replace(/\s+/g, " ");

    // ── 1. Cache hit ──────────────────────────────────────────────────
    if (aiCache.has(cacheKey)) {
      const entry = aiCache.get(cacheKey);
      setResult(entry);
      setHistory(prev => [entry, ...prev.filter(h => h.query !== query).slice(0, 4)]);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 80);
      return;
    }

    setLoading(true);
    setLoadingMsg("✨ Consulting AI architect…");

    let entry;
    try {
      // ── 2. Call AI API ──────────────────────────────────────────────
      const aiText = await callAI(query);
      const fallbackRec = detectStack(query);
      const { rec, source } = parseAIResponse(aiText, fallbackRec);
      entry = { query, rec, source };
    } catch (err) {
      // ── 3. Graceful fallback ────────────────────────────────────────
      const isQuota = err?.status === 429;
      const fallbackRec = detectStack(query);
      fallbackRec.note = (isQuota
        ? "⚠️ AI quota reached — showing rule-based recommendation. Results are still high quality."
        : "⚠️ AI enhancement unavailable right now — showing rule-based recommendation.")
        + (fallbackRec.note ? " " + fallbackRec.note : "");
      entry = { query, rec: fallbackRec, source: "fallback" };
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }

    // ── 4. Cache successful AI results ──────────────────────────────
    if (entry.source === "ai") aiCache.set(cacheKey, entry);

    setResult(entry);
    setHistory(prev => [entry, ...prev.filter(h => h.query !== query).slice(0, 4)]);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 80);
  }

  function handleDownloadPDF() {
    if (!result) return;
    const html = buildPrintHTML(result.query, result.rec);
    const blob = new Blob([html], { type:"text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stack-${result.query.slice(0,30).replace(/\s+/g,"-").toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const headerBg = dark ? "rgba(7,9,26,0.90)" : "rgba(244,246,255,0.92)";

  return (
    <div style={{ minHeight:"100vh", background:t.bg, color:t.text, fontFamily:"'Inter',sans-serif", transition:"background 0.3s,color 0.3s" }}>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box;}
        textarea::placeholder{color:${t.inputPlaceholder};}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${t.border};border-radius:99px}
      `}</style>

      <header style={{ position:"sticky", top:0, zIndex:100, background:headerBg, backdropFilter:"blur(18px)", borderBottom:`1px solid ${t.border}` }}>
        <div style={{ maxWidth:960, margin:"0 auto", height:58, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${t.accent},${t.accentAlt})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, animation:"floatY 3s ease-in-out infinite" }}>⚡</div>
            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:18, color:t.text, letterSpacing:-0.4 }}>Stack<span style={{ color:t.accent }}>Decider</span></span>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer"
              style={{ fontSize:13, fontWeight:700, padding:"7px 18px", borderRadius:9, background:`linear-gradient(135deg,${t.accent},${t.accentAlt})`, color:"#fff", textDecoration:"none", boxShadow:`0 2px 14px ${t.accentGlow}`, transition:"opacity 0.18s,transform 0.18s" }}
              onMouseEnter={e=>{e.currentTarget.style.opacity="0.85";e.currentTarget.style.transform="scale(1.03)"}}
              onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="scale(1)"}}
            >Built for Digital Heroes</a>
            <button onClick={()=>setDark(d=>!d)} title="Toggle theme" style={{ width:36, height:36, borderRadius:9, border:`1px solid ${t.border}`, background:t.bgCard, color:t.textSub, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.18s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=t.borderHover;e.currentTarget.style.color=t.text}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.textSub}}
            >{dark ? <SunIcon/> : <MoonIcon/>}</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth:960, margin:"0 auto", padding:"44px 20px 80px" }}>

        <div style={{ textAlign:"center", marginBottom:44, animation:"fadeUp 0.6s ease" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:t.tagBg, color:t.tagText, fontSize:11, fontWeight:700, padding:"5px 14px", borderRadius:99, border:`1px solid ${t.border}`, marginBottom:18, letterSpacing:0.5 }}>
            ✨ INSTANT · FREE 
          </div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(26px,5vw,44px)", fontWeight:800, margin:"0 0 14px", lineHeight:1.12, color:t.text }}>
            Stop debating stacks.{" "}
            <span style={{ color:t.accent }}>Ship faster.</span>
          </h1>
          <p style={{ fontSize:15.5, color:t.textSub, maxWidth:520, margin:"0 auto", lineHeight:1.72 }}>
            Describe your project in plain English. Get a tailored tech stack — with real docs, learning curves, and a week-by-week build roadmap.
          </p>
        </div>

        {/* INPUT CARD */}
        <div style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:18, padding:26, boxShadow:t.shadowLg, marginBottom:32, animation:"fadeUp 0.6s ease 0.08s both" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12, padding:"7px 12px", background:t.bgInput, borderRadius:8, border:`1px solid ${t.border}` }}>
            <span style={{ width:10, height:10, borderRadius:"50%", background:"#EF4444", display:"inline-block" }}/>
            <span style={{ width:10, height:10, borderRadius:"50%", background:"#F59E0B", display:"inline-block" }}/>
            <span style={{ width:10, height:10, borderRadius:"50%", background:"#10B981", display:"inline-block" }}/>
            <span style={{ fontSize:12, color:t.textMuted, marginLeft:6, fontFamily:"monospace" }}>describe-your-project.txt</span>
          </div>
          <textarea
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)) handleAnalyse(); }}
            placeholder="e.g. A real-time multiplayer strategy game with a leaderboard and mobile support..."
            rows={4}
            style={{ width:"100%", resize:"vertical", background:t.bgInput, color:t.text, border:`1px solid ${t.border}`, borderRadius:10, padding:"13px 15px", fontSize:14.5, lineHeight:1.65, fontFamily:"'Inter',sans-serif", outline:"none", transition:"border-color 0.2s" }}
            onFocus={e=>e.target.style.borderColor=t.accent}
            onBlur={e=>e.target.style.borderColor=t.border}
          />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:13, flexWrap:"wrap", gap:10 }}>
            <span style={{ fontSize:12, color:t.textMuted }}>⌘+Enter to analyse · {input.length} chars</span>
            <button onClick={handleAnalyse} disabled={!input.trim() || loading} style={{
              padding:"9px 26px", borderRadius:10, border:"none",
              background: (input.trim() && !loading) ? `linear-gradient(135deg,${t.accent},${t.accentAlt})` : t.border,
              color: (input.trim() && !loading) ? "#fff" : t.textMuted,
              fontWeight:700, fontSize:14, cursor: (input.trim() && !loading) ? "pointer" : "not-allowed",
              boxShadow: (input.trim() && !loading) ? `0 3px 14px ${t.accentGlow}` : "none",
              transition:"all 0.18s", display:"flex", alignItems:"center", gap:8,
            }}
            onMouseEnter={e=>{ if(input.trim()&&!loading) e.currentTarget.style.transform="scale(1.03)"; }}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
            >
              {loading
                ? <><span style={{ width:14, height:14, border:`2px solid rgba(255,255,255,0.4)`, borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }}/>{loadingMsg || "Analysing…"}</>
                : <>⚡ Get Stack Recommendation</>}
            </button>
          </div>
          <div style={{ marginTop:16, display:"flex", flexWrap:"wrap", gap:7 }}>
            <span style={{ fontSize:12, color:t.textMuted, alignSelf:"center" }}>Try:</span>
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={()=>setInput(ex)} style={{ fontSize:12, padding:"4px 11px", borderRadius:7, background:t.tagBg, color:t.tagText, border:`1px solid ${t.border}`, cursor:"pointer", fontWeight:500, transition:"all 0.16s" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=t.accent; e.currentTarget.style.color=t.accent; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=t.border; e.currentTarget.style.color=t.tagText; }}
              >{ex.length > 38 ? ex.slice(0,38)+"…" : ex}</button>
            ))}
          </div>
        </div>

        {/* RESULTS */}
        {result && (
          <div ref={resultRef} style={{ display:"flex", flexDirection:"column", gap:18, animation:"fadeUp 0.5s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
              <h2 style={{ margin:0, fontSize:18, fontWeight:800, fontFamily:"'Space Grotesk',sans-serif", color:t.text }}>🧩 Your Stack Recommendation</h2>
              {result.source && (
                <span style={{
                  fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:99,
                  background: result.source === "ai" ? `${t.accent}22` : `${t.amber}22`,
                  color: result.source === "ai" ? t.accent : t.amber,
                  border: `1px solid ${result.source === "ai" ? t.accent : t.amber}55`,
                  letterSpacing:0.4,
                }}>
                  {result.source === "ai" ? "✨ AI-Enhanced" : result.source === "fallback" ? "⚙️ Rule-based" : "⚡ Cached"}
                </span>
              )}
              <div style={{ display:"flex", gap:9 }}>
                <button onClick={()=>{setResult(null);setInput("");}} style={{ fontSize:13, fontWeight:600, padding:"7px 15px", borderRadius:9, border:`1px solid ${t.border}`, background:t.bgCard, color:t.textSub, cursor:"pointer", transition:"all 0.16s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=t.borderHover;e.currentTarget.style.color=t.text}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.textSub}}
                >↩ New Search</button>
                <button onClick={handleDownloadPDF} style={{ fontSize:13, fontWeight:700, padding:"7px 17px", borderRadius:9, border:"none", background:`linear-gradient(135deg,${t.accent},${t.accentAlt})`, color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:6, boxShadow:`0 2px 12px ${t.accentGlow}`, transition:"all 0.18s" }}
                  onMouseEnter={e=>e.currentTarget.style.opacity="0.88"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                ><DownloadIcon/> Download HTML Report</button>
              </div>
            </div>
            <div style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:12, padding:"12px 18px", boxShadow:t.shadow }}>
              <span style={{ fontSize:12, color:t.textMuted, fontWeight:600 }}>Project: </span>
              <span style={{ fontSize:13.5, color:t.text, fontWeight:600 }}>"{result.query}"</span>
            </div>
            <SummaryPanel s={result.rec.summary} note={result.rec.note} t={t}/>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:14 }}>
              {result.rec.stack.map((item, idx) => <StackCard key={idx} item={item} idx={idx} t={t}/>)}
            </div>
            <AltsPanel alts={result.rec.alts} t={t}/>
            <RoadmapPanel steps={result.rec.roadmap} t={t}/>
          </div>
        )}

        {/* HISTORY */}
        {!result && history.length > 0 && (
          <div style={{ marginTop:8 }}>
            <h3 style={{ fontSize:12, fontWeight:700, color:t.textMuted, marginBottom:10, textTransform:"uppercase", letterSpacing:0.6 }}>Recent Searches</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {history.map((h,i) => (
                <button key={i} onClick={()=>{setInput(h.query);setResult(h);}} style={{ textAlign:"left", background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:10, padding:"11px 15px", cursor:"pointer", color:t.textSub, fontSize:13, transition:"all 0.16s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.color=t.text}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.textSub}}
                >🔁 {h.query}</button>
              ))}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!result && (
          <div style={{ marginTop:56, textAlign:"center", animation:"fadeUp 0.6s ease 0.2s both" }}>
            <div style={{ display:"flex", justifyContent:"center", gap:"clamp(20px,4vw,40px)", flexWrap:"wrap", marginBottom:32 }}>
              {[
                { icon:"🎯", label:"Smart Detection", desc:"10+ project types: games, AI apps, IoT, Web3, mobile, and more" },
                { icon:"📚", label:"Real Resources", desc:"Official docs & tutorials for every tool recommended" },
                { icon:"🗺️", label:"Build Roadmap", desc:"Week-by-week plan so you know exactly what to build first" },
                { icon:"📄", label:"HTML Export", desc:"Download a full printable report to share or save offline" },
              ].map(f => (
                <div key={f.label} style={{ maxWidth:140 }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{f.icon}</div>
                  <div style={{ fontWeight:700, fontSize:13, color:t.text, marginBottom:4 }}>{f.label}</div>
                  <div style={{ fontSize:12, color:t.textMuted, lineHeight:1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:12, color:t.textMuted }}>
                Built by  <span style={{ color: "#4FC3F7", fontWeight: 600 }}> Prajwal Reddy R </span>  for
              <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer" style={{ color:t.accent, textDecoration:"none", fontWeight:600 }}> Digital Heroes</a>
              <br/>
              <a href="mailto:reddyrprajwal@gmail.com" style={{ color:t.accent, textDecoration:"none", fontWeight:600 }}>reddyrprajwal@gmail.com</a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
