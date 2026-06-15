import { useState, useEffect } from "react";

// ─── COLOUR + TYPE TOKENS ────────────────────────────────────────────────────
// Dark terminal aesthetic, kept from original but tightened
// Accent: acid-green #00ff87 (primary), blue #60a5fa, amber #f59e0b,
//         violet #a78bfa, rose #f43f5e, emerald #34d399, cyan #22d3ee, orange #fb923c
// Signature element: SVG flow-diagrams on the left panel that animate in
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
  foundation:    "#00ff87",
  backend:       "#60a5fa",
  llm:           "#f59e0b",
  rag:           "#a78bfa",
  agents:        "#f43f5e",
  deployment:    "#34d399",
  data:          "#fb923c",
  system:        "#22d3ee",
};

// ─── ROADMAP DATA ─────────────────────────────────────────────────────────────
// Ordered by learning sequence (Phase 1 → Phase 8)
// Each item has: id, text, done (already know), note (tooltip detail), tag
const roadmapData = [
  {
    key: "foundation",
    phase: "01",
    label: "PYTHON FOUNDATION",
    color: COLORS.foundation,
    timeline: "Already done",
    goal: "Write production-quality Python without second-guessing yourself",
    items: [
      { id: 1,  text: "Core syntax, OOP, decorators, generators", done: true,  note: "Decorators critical for FastAPI & LangChain internals", tag: "core" },
      { id: 2,  text: "Data structures — lists, dicts, sets, comprehensions", done: true, note: "Dict operations are everywhere in LLM response parsing", tag: "core" },
      { id: 3,  text: "File I/O, JSON, environment variables (.env)", done: true, note: "Every AI app reads .env for API keys", tag: "core" },
      { id: 4,  text: "Error handling — try/except, custom exceptions", done: true, note: "LLM APIs fail in creative ways; robust error handling is non-negotiable", tag: "core" },
      { id: 5,  text: "Virtual environments — venv, pip, requirements.txt", done: true, note: "You isolate deps per project — good habit already", tag: "tooling" },
      { id: 6,  text: "Git & GitHub — commits, branches, PRs, clean history", done: true, note: "Interviewers check your commit messages too", tag: "tooling" },
      { id: 7,  text: "Linux CLI — navigate, pipe, grep, permissions, processes", done: true, note: "Docker + server debugging requires this daily", tag: "tooling" },
    ]
  },
  {
    key: "backend",
    phase: "02",
    label: "BACKEND CORE",
    color: COLORS.backend,
    timeline: "Mostly done — 1 gap",
    goal: "Build and deploy production APIs; FastAPI is the one remaining gap",
    items: [
      { id: 8,  text: "Django — models, views, ORM, middleware", done: true, note: "Your RAGBot foundation. You know this well.", tag: "done" },
      { id: 9,  text: "Django REST Framework — serializers, viewsets, routers", done: true, note: "Used in RAGBot and TableFlow both", tag: "done" },
      { id: 10, text: "JWT Auth — access/refresh tokens, protected routes", done: true, note: "TableFlow uses this with SimpleJWT", tag: "done" },
      { id: 11, text: "PostgreSQL — schema design, indexing, normalization", done: true, note: "TableFlow on Railway uses pg; you know this", tag: "done" },
      { id: 12, text: "RESTful API design — CRUD, pagination, filtering", done: true, note: "Basic REST is fully solid", tag: "done" },
      { id: 13, text: "Celery + Redis — async task queues, background jobs", done: true, note: "RAGBot uses Celery for heavy doc processing", tag: "done" },
      { id: 14, text: "WebSockets basics — real-time communication", done: true, note: "Good to have for streaming LLM responses", tag: "done" },
      { id: 15, text: "FastAPI — routes, Pydantic models, async endpoints, dependency injection", done: false, note: "⚡ THIS IS YOUR NEXT PRIORITY. Most AI backends use FastAPI. 1 week to get job-ready here. Build a FastAPI wrapper around your RAG pipeline.", tag: "critical" },
    ]
  },
  {
    key: "llm_core",
    phase: "03",
    label: "LLM & GENAI CORE",
    color: COLORS.llm,
    timeline: "Week 1–2",
    goal: "Understand what LLMs actually do so you can engineer around their limits",
    items: [
      { id: 16, text: "How LLMs work — tokens, context window, temperature, top-p, system prompts", done: false, note: "Know token limits for GPT-4o (128k), Claude (200k). Context window size directly affects your RAG chunking strategy.", tag: "theory" },
      { id: 17, text: "OpenAI API — chat completions, function calling, streaming responses", done: true, note: "You've used this in RAGBot. Deepen: learn streaming + function/tool calling if not done", tag: "done" },
      { id: 18, text: "Prompt engineering — zero-shot, few-shot, chain-of-thought, role prompting", done: false, note: "Not fluff — bad prompts kill RAG quality. Learn structured output prompting (JSON mode) and system prompt design.", tag: "important" },
      { id: 19, text: "Embeddings — cosine similarity, semantic search, embedding models", done: true, note: "You use this in RAGBot with FAISS. Understand WHY cosine similarity works (unit vectors).", tag: "done" },
      { id: 20, text: "SentenceTransformers — loading models, encoding text, comparing vectors", done: true, note: "Know the difference between bi-encoders (fast, for retrieval) and cross-encoders (slow, for reranking)", tag: "done" },
      { id: 21, text: "HuggingFace — Hub, pipeline API, loading open-source models locally", done: false, note: "Load Mistral/Llama2 locally via pipeline(). Use for offline RAG when you can't use OpenAI API.", tag: "important" },
      { id: 22, text: "LLM evaluation — hallucination, faithfulness, relevance, groundedness", done: false, note: "Know the 4 Ragas metrics: faithfulness, answer_relevancy, context_precision, context_recall. These are interview questions.", tag: "important" },
      { id: 23, text: "Ragas library — automated RAG evaluation pipeline", done: false, note: "pip install ragas. Takes 1 day to learn. Shows up in job descriptions. Add to RAGBot.", tag: "important" },
    ]
  },
  {
    key: "rag",
    phase: "04",
    label: "RAG SYSTEMS (DEEP)",
    color: COLORS.rag,
    timeline: "Week 2–5 — CORE FOCUS",
    goal: "Build RAG from raw Python first. Then abstract to LangChain. Then go advanced.",
    items: [
      // ── RAW RAG (build without frameworks first) ──
      { id: 24, text: "RAG pipeline from scratch — load → chunk → embed → store → retrieve → generate", done: true, note: "You know the architecture. Now code it from scratch without LangChain first. CLI tool on a PDF.", tag: "foundation" },
      { id: 25, text: "Chunking strategies — fixed size, recursive, sentence, semantic chunking", done: false, note: "Chunk size changes retrieval quality dramatically. 512 tokens ≠ 1024 tokens. Experiment with both on the same doc.", tag: "important" },
      { id: 26, text: "Vector databases — FAISS (done) → now add Chroma + pgvector", done: true, note: "Chroma is easiest to start; pgvector stores vectors inside PostgreSQL (no separate DB needed in prod).", tag: "expand" },
      { id: 27, text: "Metadata filtering — filter by date, source, doc type before vector search", done: false, note: "Critical for multi-tenant RAG. Each client's data has a metadata tag; filter to their namespace only.", tag: "important" },
      // ── ADVANCED RAG TECHNIQUES ──
      { id: 28, text: "Hybrid Search — BM25 keyword search + vector search combined", done: false, note: "BM25 catches exact matches (names, codes); vector catches semantic matches. Together = best recall. Use RRF (Reciprocal Rank Fusion) to merge results.", tag: "advanced" },
      { id: 29, text: "Reranking — cross-encoders, Cohere Rerank API, improving retrieval precision", done: false, note: "After retrieval gets top-20 chunks, reranker picks the best 3-5. Massive quality boost for free. Learn both Cohere API and local cross-encoder.", tag: "advanced" },
      { id: 30, text: "Parent-Child chunking — retrieve small chunks, return large context", done: false, note: "Small chunks = precise retrieval. Parent chunk = full context for the LLM. Solves the chunk-size tradeoff.", tag: "advanced" },
      { id: 31, text: "HyDE — generate a hypothetical answer, embed it, use that for retrieval", done: false, note: "Hypothetical Document Embeddings. Good for vague queries. Controversial but works well in practice.", tag: "advanced" },
      { id: 32, text: "Query decomposition — break complex questions into sub-queries", done: false, note: "\"Compare X and Y\" → two separate retrievals → combine answers. LangChain MultiQueryRetriever does this.", tag: "advanced" },
      // ── LANGCHAIN (after raw RAG) ──
      { id: 33, text: "LangChain LCEL — pipe syntax, chains, DocumentLoaders, TextSplitters", done: false, note: "Learn LCEL (LangChain Expression Language) NOT the old chain API. Modern LangChain = retriever | prompt | llm | parser.", tag: "framework" },
      { id: 34, text: "LangChain Retrievers — MultiQuery, ContextualCompression, EnsembleRetriever", done: false, note: "These are the advanced retrieval patterns wrapped in LangChain. Learn after you've built them raw.", tag: "framework" },
      { id: 35, text: "Multi-document RAG — multiple sources, source attribution, citations", done: true, note: "You've built this in RAGBot. Add source citations to every answer (show which chunk answered the question).", tag: "done" },
      { id: 36, text: "Conversational RAG — chat history + retrieval, memory management", done: false, note: "Store last N messages. Reformulate the question with chat history before retrieval. LangChain has create_history_aware_retriever for this.", tag: "important" },
    ]
  },
  {
    key: "langsmith",
    phase: "05",
    label: "LANGSMITH — OBSERVABILITY",
    color: "#e879f9",
    timeline: "Week 5 — 3–4 days",
    goal: "See what's happening inside your RAG pipeline; measure before you optimize",
    items: [
      { id: 37, text: "LangSmith setup — tracing your LangChain chains end-to-end", done: false, note: "Add LANGCHAIN_TRACING_V2=true to .env. Free tier is enough. See every chunk retrieved, every prompt sent, every token used.", tag: "tooling" },
      { id: 38, text: "Trace analysis — reading trace trees, spotting bad retrievals", done: false, note: "You'll see WHY an answer was wrong: wrong chunk retrieved? Prompt not specific enough? LLM hallucinated despite good chunks?", tag: "important" },
      { id: 39, text: "Dataset creation + evaluation runs — test RAG quality systematically", done: false, note: "Create a test set: 20 question-answer pairs. Run your RAG pipeline. Score with Ragas. This is how pros measure quality.", tag: "important" },
      { id: 40, text: "Prompt versioning — track which system prompt version performs best", done: false, note: "LangSmith Hub lets you version prompts. A/B test system prompts. Track which gives better faithfulness scores.", tag: "advanced" },
    ]
  },
  {
    key: "agents",
    phase: "06",
    label: "LLM AGENTS & LANGGRAPH",
    color: COLORS.agents,
    timeline: "Week 6–8",
    goal: "Build AI systems that make decisions, not just answer questions",
    items: [
      { id: 41, text: "What agents are — ReAct pattern, tool calling, planning loop", done: false, note: "ReAct = Reason + Act. LLM decides which tool to call based on question. Loop: think → call tool → observe → think again.", tag: "theory" },
      { id: 42, text: "OpenAI function/tool calling — structured outputs, JSON schemas", done: false, note: "Define tools as JSON schemas. Model returns structured JSON telling you which function to call with which args. Foundation of all agents.", tag: "core" },
      { id: 43, text: "Build a simple agent from scratch — file reader + calculator + web search", done: false, note: "Build this WITHOUT LangChain first. Write the tool-calling loop manually. Makes LangGraph make sense after.", tag: "important" },
      { id: 44, text: "LangGraph basics — nodes, edges, conditional routing, State object", done: false, note: "LangGraph = graph of functions. State flows between nodes. Edges are conditional (if retrieval bad → retrieve again). This is the hottest skill in AI engineering right now.", tag: "critical" },
      { id: 45, text: "Corrective RAG with LangGraph — grade retrieved docs, rewrite query if bad", done: false, note: "The killer project: retrieve → grade (are these chunks relevant?) → if no: rewrite query + retrieve again → if yes: generate answer. Real production pattern.", tag: "critical" },
      { id: 46, text: "Multi-step reasoning — break tasks into sub-tasks automatically", done: false, note: "Router node → specialist node (RAG node, search node, code node) → aggregator node. Build this as your LangGraph portfolio piece.", tag: "advanced" },
    ]
  },
  {
    key: "deployment",
    phase: "07",
    label: "DEPLOYMENT & MLOPS",
    color: COLORS.deployment,
    timeline: "Week 8–9",
    goal: "Ship AI features to production; make them observable and cost-controlled",
    items: [
      { id: 47, text: "Docker — write Dockerfiles from scratch, multi-stage builds", done: false, note: "Dockerize your FastAPI + RAG pipeline. Multi-stage build: builder stage for deps, runtime stage for the app. Smaller image = faster deploy.", tag: "critical" },
      { id: 48, text: "Docker Compose — multi-service local dev (API + Redis + Postgres + vector DB)", done: true, note: "You use this already. Master: health checks, volumes, named networks, depends_on.", tag: "done" },
      { id: 49, text: "Deploy live — Railway/Render/EC2 with real domain + HTTPS", done: true, note: "TableFlow on Railway. Push this further: deploy RAGBot as a live demo with a subdomain.", tag: "done" },
      { id: 50, text: "Environment management in production — secrets, config vars, never commit keys", done: true, note: "Always use .env locally, platform env vars in prod. Never in git.", tag: "done" },
      { id: 51, text: "CI/CD — GitHub Actions auto-deploy on push to main", done: false, note: "Basic workflow: push → run tests → build Docker image → deploy to Railway. One .yml file. 1 day to learn.", tag: "important" },
      { id: 52, text: "AWS basics — EC2, S3, IAM roles (enough for deploy + file storage)", done: false, note: "S3 for storing uploaded PDFs in your RAG pipeline. EC2 for hosting. IAM roles so your app can access S3 without hardcoding keys.", tag: "important" },
      { id: 53, text: "Monitoring — structured logging, Sentry error tracking, uptime checks", done: false, note: "Log every LLM call: tokens used, latency, cost. Sentry catches unhandled exceptions in prod. Add to RAGBot.", tag: "important" },
    ]
  },
  {
    key: "system",
    phase: "08",
    label: "SYSTEM DESIGN FOR AI APPS",
    color: COLORS.system,
    timeline: "Week 9–10 (ongoing)",
    goal: "Design AI systems that are fast, cheap, scalable, and multi-tenant safe",
    items: [
      { id: 54, text: "Async architecture — why AI calls are async, handling timeouts gracefully", done: false, note: "LLM calls can take 5–30 seconds. Never block. Use async/await in FastAPI. Stream responses to the frontend while generating.", tag: "core" },
      { id: 55, text: "Semantic caching — cache LLM responses by query similarity, not exact match", done: false, note: "Redis + vector similarity: if new query is 95% similar to a cached one, return cached answer. Saves 60–80% API costs on repeated questions.", tag: "advanced" },
      { id: 56, text: "Rate limiting + cost management — token budgets, per-user limits", done: false, note: "Track tokens per user. Alert when approaching budget. Implement exponential backoff on OpenAI rate limit errors.", tag: "important" },
      { id: 57, text: "Streaming responses to frontend — Server-Sent Events or WebSocket", done: false, note: "Don't wait for full LLM response. Stream tokens as they arrive. Feels 10x faster to the user even if total time is the same.", tag: "important" },
      { id: 58, text: "Multi-tenancy in AI SaaS — isolate data per client, namespace vector DB", done: false, note: "Each RAGBot client gets their own namespace in FAISS/Chroma. Metadata filter ensures Client A never sees Client B's data. This is the RAGBot architecture.", tag: "critical" },
      { id: 59, text: "Scalability basics — when to add workers, queues, caching layers", done: false, note: "RAG is CPU + IO bound. Scale: add Celery workers for embedding jobs, Redis for caching, multiple API containers for serving.", tag: "advanced" },
    ]
  },
];

const extras = [
  { text: "Selenium — real production scraper", color: COLORS.foundation },
  { text: "BeautifulSoup — HTML parsing", color: COLORS.foundation },
  { text: "MongoDB + Mongoose (Node.js)", color: COLORS.backend },
  { text: "Express.js — Node backend", color: COLORS.backend },
  { text: "React 18 + TypeScript + Vite + Tailwind", color: COLORS.rag },
  { text: "Arduino + ESP32 IoT hands-on", color: COLORS.llm },
  { text: "Cybersecurity — Nmap, Metasploit, web vulns", color: COLORS.agents },
  { text: "B2B SaaS — RAGBot (live product)", color: COLORS.deployment },
  { text: "Event management — 80+ volunteers, Progesterone", color: COLORS.system },
];

const bonusSkills = [
  { text: "LangGraph — stateful multi-agent workflows", color: COLORS.agents },
  { text: "Qdrant / Weaviate — production vector DB", color: COLORS.rag },
  { text: "vLLM — serve open-source LLMs on GPU", color: COLORS.llm },
  { text: "pgvector — vector search inside PostgreSQL", color: COLORS.deployment },
  { text: "Streamlit — rapid AI demo UIs", color: COLORS.system },
  { text: "Ragas + LangSmith — evaluation pipeline", color: "#e879f9" },
];

// ─── SVG DIAGRAMS ─────────────────────────────────────────────────────────────

function RagFlowDiagram({ color }) {
  const steps = [
    { label: "PDF / URL / Text", icon: "📄" },
    { label: "Chunking", icon: "✂️" },
    { label: "Embed → Vector", icon: "🧮" },
    { label: "Vector Store", icon: "🗄️" },
    { label: "Query + Retrieve", icon: "🔍" },
    { label: "LLM Generate", icon: "🤖" },
    { label: "Answer + Citations", icon: "✅" },
  ];
  return (
    <div style={{ padding: "12px 0" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 12px",
            background: i === 4 || i === 5 ? `${color}18` : "#0d1117",
            border: `1px solid ${i === 4 || i === 5 ? color : "#1e2d3d"}`,
            borderRadius: 5,
            fontSize: 11, color: i === 4 || i === 5 ? color : "#94a3b8",
            width: "100%", marginBottom: 0,
          }}>
            <span style={{ fontSize: 13 }}>{s.icon}</span>
            <span style={{ fontWeight: i === 4 || i === 5 ? 700 : 400 }}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 1, height: 10, background: "#1e2d3d", marginLeft: 20 }} />
          )}
        </div>
      ))}
      <div style={{ fontSize: 10, color: "#475569", marginTop: 8 }}>
        Steps 5–6 = the "RA" in RAG — your focus
      </div>
    </div>
  );
}

function AdvancedRagDiagram({ color }) {
  return (
    <div style={{ padding: "8px 0", fontSize: 11 }}>
      {[
        { label: "Query", note: "", top: true },
        { label: "Query Decompose / HyDE", note: "optional enhancement", highlight: false },
        { label: "Hybrid Search", note: "BM25 + Vector", highlight: true },
        { label: "Retrieved Chunks (top 20)", note: "", highlight: false },
        { label: "Reranker", note: "cross-encoder → top 5", highlight: true },
        { label: "Parent-Child Expansion", note: "small → large context", highlight: false },
        { label: "LLM with full context", note: "", highlight: false },
      ].map((s, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "5px 10px",
            background: s.highlight ? `${color}18` : "#0a0f15",
            border: `1px solid ${s.highlight ? color : "#1e2d3d"}`,
            borderRadius: 4, width: "100%",
            color: s.highlight ? color : "#94a3b8",
          }}>
            <span style={{ fontWeight: s.highlight ? 700 : 400 }}>{s.label}</span>
            {s.note && <span style={{ fontSize: 9, color: "#475569" }}>{s.note}</span>}
          </div>
          {i < 6 && <div style={{ width: 1, height: 8, background: "#1e2d3d", marginLeft: 16 }} />}
        </div>
      ))}
    </div>
  );
}

function LangChainDiagram({ color }) {
  return (
    <div style={{ fontSize: 11, padding: "8px 0" }}>
      <div style={{ color: "#475569", marginBottom: 8, fontSize: 10 }}>LCEL pipe syntax</div>
      {[
        { code: "retriever", label: "→ fetch relevant chunks" },
        { code: "prompt", label: "→ format with context" },
        { code: "llm", label: "→ generate answer" },
        { code: "StrOutputParser", label: "→ clean string output" },
      ].map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 3 }}>
          {i > 0 && <span style={{ color: color, marginRight: 4, fontWeight: 900 }}>|</span>}
          {i === 0 && <span style={{ color: "#475569", marginRight: 4, fontSize: 10 }}>chain = </span>}
          <span style={{
            padding: "3px 8px",
            background: `${color}15`,
            border: `1px solid ${color}33`,
            borderRadius: 3, color: color,
            fontFamily: "monospace",
          }}>{s.code}</span>
          <span style={{ color: "#475569", fontSize: 10, marginLeft: 6 }}>{s.label}</span>
        </div>
      ))}
      <div style={{ marginTop: 8, padding: "5px 10px", background: "#0d1117", border: "1px solid #1e2d3d", borderRadius: 4, color: "#94a3b8", fontSize: 10 }}>
        Skip old API: LLMChain, RetrievalQA — they're deprecated
      </div>
    </div>
  );
}

function LangGraphDiagram({ color }) {
  const nodes = [
    { id: "query", label: "Query In", x: 80, y: 10 },
    { id: "retrieve", label: "Retrieve", x: 80, y: 70 },
    { id: "grade", label: "Grade Docs", x: 80, y: 130 },
    { id: "rewrite", label: "Rewrite Query", x: 5, y: 190 },
    { id: "generate", label: "Generate", x: 155, y: 190 },
    { id: "out", label: "Answer", x: 155, y: 250 },
  ];
  return (
    <div style={{ position: "relative", height: 290, fontSize: 10 }}>
      <svg width="240" height="290" style={{ position: "absolute", top: 0, left: 0 }}>
        {/* arrows */}
        {[
          [100, 28, 100, 62],
          [100, 88, 100, 122],
          [100, 148, 60, 182],
          [100, 148, 172, 182],
          [60, 208, 60, 82],   // rewrite loops back
          [172, 208, 172, 242],
        ].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={i === 2 ? "#f59e0b" : i === 3 ? color : "#2d3f52"}
            strokeWidth={1.5} strokeDasharray={i === 4 ? "4,3" : "none"}
            markerEnd="url(#arr)"
          />
        ))}
        <defs>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#2d3f52" />
          </marker>
        </defs>
        {/* conditional label */}
        <text x="68" y="170" fontSize="8" fill="#f59e0b">bad</text>
        <text x="122" y="170" fontSize="8" fill={color}>good</text>
        <text x="14" y="160" fontSize="8" fill="#475569">retry</text>
      </svg>
      {nodes.map(n => (
        <div key={n.id} style={{
          position: "absolute", left: n.x, top: n.y,
          padding: "5px 10px",
          background: n.id === "grade" ? `${color}20` : "#0d1117",
          border: `1px solid ${n.id === "grade" ? color : "#1e2d3d"}`,
          borderRadius: 4,
          color: n.id === "grade" ? color : "#94a3b8",
          fontSize: 10, fontWeight: n.id === "grade" ? 700 : 400,
          whiteSpace: "nowrap",
        }}>{n.label}</div>
      ))}
    </div>
  );
}

function AgentLoopDiagram({ color }) {
  const steps = ["Think (LLM)", "Pick Tool", "Call Tool", "Observe Result", "Think Again"];
  return (
    <div style={{ fontSize: 11, padding: "8px 0" }}>
      <div style={{ color: "#475569", marginBottom: 8, fontSize: 10 }}>ReAct loop</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{
              padding: "5px 12px",
              background: i === 0 || i === 4 ? `${color}18` : "#0a0f15",
              border: `1px solid ${i === 0 || i === 4 ? color : "#1e2d3d"}`,
              borderRadius: 4,
              color: i === 0 || i === 4 ? color : "#94a3b8",
              fontWeight: i === 0 || i === 4 ? 700 : 400,
            }}>{i + 1}. {s}</div>
            {i < steps.length - 1 && <div style={{ width: 1, height: 8, background: "#1e2d3d", marginLeft: 18 }} />}
          </div>
        ))}
        <div style={{ marginTop: 6, fontSize: 9, color: "#475569" }}>
          Loop repeats until LLM decides it's done
        </div>
      </div>
    </div>
  );
}

function DeployDiagram({ color }) {
  return (
    <div style={{ fontSize: 10, padding: "8px 0" }}>
      {[
        { label: "git push main", icon: "→", note: "triggers" },
        { label: "GitHub Actions CI", icon: "→", note: "runs tests" },
        { label: "Docker build", icon: "→", note: "creates image" },
        { label: "Push to registry", icon: "→", note: "ghcr.io" },
        { label: "Deploy to Railway/EC2", icon: "→", note: "zero downtime" },
        { label: "Sentry + Logs", icon: "", note: "monitors" },
      ].map((s, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column" }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            padding: "5px 10px",
            background: i === 0 || i === 4 ? `${color}15` : "#0a0f15",
            border: `1px solid ${i === 0 || i === 4 ? color : "#1e2d3d"}`,
            borderRadius: 4,
            color: i === 0 || i === 4 ? color : "#94a3b8",
          }}>
            <span>{s.label}</span>
            <span style={{ color: "#475569" }}>{s.note}</span>
          </div>
          {i < 5 && <div style={{ width: 1, height: 8, background: "#1e2d3d", marginLeft: 16 }} />}
        </div>
      ))}
    </div>
  );
}

function SystemDiagram({ color }) {
  return (
    <div style={{ fontSize: 10, padding: "8px 0" }}>
      <div style={{ color: "#475569", marginBottom: 8 }}>AI SaaS request lifecycle</div>
      {[
        { label: "Client Request", note: "HTTP / WS" },
        { label: "Rate Limiter", note: "per user token budget" },
        { label: "Semantic Cache", note: "Redis — skip LLM if hit" },
        { label: "RAG Pipeline", note: "retrieve + rerank" },
        { label: "LLM (streaming)", note: "token by token SSE" },
        { label: "Stream to Frontend", note: "feels instant" },
      ].map((s, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column" }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            padding: "5px 10px",
            background: i === 2 || i === 4 ? `${color}15` : "#0a0f15",
            border: `1px solid ${i === 2 || i === 4 ? color : "#1e2d3d"}`,
            borderRadius: 4,
            color: i === 2 || i === 4 ? color : "#94a3b8",
            fontWeight: i === 2 || i === 4 ? 600 : 400,
          }}>
            <span>{s.label}</span>
            <span style={{ color: "#475569" }}>{s.note}</span>
          </div>
          {i < 5 && <div style={{ width: 1, height: 8, background: "#1e2d3d", marginLeft: 16 }} />}
        </div>
      ))}
    </div>
  );
}

function GenericDiagram({ section }) {
  const c = section.color;
  return (
    <div style={{ fontSize: 10, color: "#64748b", padding: "8px 0", lineHeight: 1.8 }}>
      {section.items.slice(0, 5).map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <span style={{ color: c, fontSize: 9 }}>▸</span>
          <span style={{ color: "#64748b" }}>{item.text.split("—")[0].trim()}</span>
        </div>
      ))}
    </div>
  );
}

function SectionDiagram({ sectionKey, section }) {
  const props = { color: section.color };
  switch (sectionKey) {
    case "rag":        return (
      <div>
        <div style={{ fontSize: 10, color: "#475569", marginBottom: 6 }}>BASIC PIPELINE</div>
        <RagFlowDiagram {...props} />
        <div style={{ fontSize: 10, color: "#475569", marginTop: 12, marginBottom: 6 }}>ADVANCED TECHNIQUES</div>
        <AdvancedRagDiagram {...props} />
        <div style={{ fontSize: 10, color: "#475569", marginTop: 12, marginBottom: 6 }}>LANGCHAIN LCEL</div>
        <LangChainDiagram {...props} />
      </div>
    );
    case "langsmith":  return (
      <div style={{ fontSize: 10, padding: "8px 0" }}>
        <div style={{ color: "#475569", marginBottom: 8 }}>Observability stack</div>
        {["Your RAG chain runs", "LangSmith traces every step", "See: chunks retrieved, prompt sent, tokens used", "Run eval dataset (20 Q&A pairs)", "Ragas scores: faithfulness, relevance", "Identify weak points → fix → re-eval"].map((s,i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"5px 10px", background: i===2||i===4 ? `${section.color}15`:"#0a0f15", border:`1px solid ${i===2||i===4 ? section.color:"#1e2d3d"}`, borderRadius:4, color: i===2||i===4 ? section.color:"#94a3b8", marginBottom:0 }}>{s}</div>
            {i<5 && <div style={{ width:1, height:8, background:"#1e2d3d", marginLeft:16 }} />}
          </div>
        ))}
      </div>
    );
    case "agents":     return (
      <div>
        <AgentLoopDiagram {...props} />
        <div style={{ fontSize: 10, color: "#475569", marginTop: 12, marginBottom: 6 }}>LANGGRAPH — CORRECTIVE RAG</div>
        <LangGraphDiagram {...props} />
      </div>
    );
    case "deployment": return <DeployDiagram {...props} />;
    case "system":     return <SystemDiagram {...props} />;
    default:           return <GenericDiagram section={section} />;
  }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Roadmap() {
  const [expanded, setExpanded] = useState(
    Object.fromEntries(roadmapData.map(s => [s.key, true]))
  );
  const [checked, setChecked] = useState(() => {
    const init = {};
    roadmapData.forEach(s => s.items.forEach(item => { init[item.id] = item.done; }));
    return init;
  });
  const [activeNote, setActiveNote] = useState(null);
  const [diagramOpen, setDiagramOpen] = useState(
    Object.fromEntries(roadmapData.map(s => [s.key, true]))
  );

  const toggle = (key) => setExpanded(e => ({ ...e, [key]: !e[key] }));
  const toggleDiagram = (key) => setDiagramOpen(d => ({ ...d, [key]: !d[key] }));
  const toggleCheck = (id) => setChecked(c => ({ ...c, [id]: !c[id] }));

  const allItems = roadmapData.flatMap(s => s.items);
  const totalItems = allItems.length;
  const doneItems = allItems.filter(i => checked[i.id]).length;
  const percent = Math.round((doneItems / totalItems) * 100);

  const TAG_STYLE = {
    critical:    { bg: "#f43f5e22", text: "#f43f5e", label: "CRITICAL" },
    important:   { bg: "#f59e0b18", text: "#f59e0b", label: "IMPORTANT" },
    advanced:    { bg: "#a78bfa18", text: "#a78bfa", label: "ADVANCED" },
    framework:   { bg: "#60a5fa18", text: "#60a5fa", label: "FRAMEWORK" },
    done:        { bg: "#00ff8712", text: "#00ff87", label: "DONE" },
    core:        { bg: "#22d3ee15", text: "#22d3ee", label: "CORE" },
    theory:      { bg: "#64748b18", text: "#94a3b8", label: "THEORY" },
    tooling:     { bg: "#34d39915", text: "#34d399", label: "TOOLING" },
    foundation:  { bg: "#00ff8712", text: "#00ff87", label: "FOUNDATION" },
    expand:      { bg: "#60a5fa18", text: "#60a5fa", label: "EXPAND" },
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060a0e",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      color: "#e2e8f0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #060a0e; }
        ::-webkit-scrollbar-thumb { background: #00ff87; border-radius: 2px; }
        .sec-hdr:hover { opacity: 0.9; cursor: pointer; }
        .item-row:hover { background: rgba(255,255,255,0.035) !important; }
        .chk:hover { transform: scale(1.15); }
        .bar-fill { transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
        .note-popup { animation: fadeIn 0.15s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        .section-wrap { transition: opacity 0.2s; }
        .diag-toggle:hover { opacity: 0.7; cursor: pointer; }
      `}</style>

      {/* ── STICKY HEADER ─────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #0d1117 0%, #0a0f15 100%)",
        borderBottom: "1px solid #1a2332",
        padding: "28px 24px 20px",
        position: "sticky", top: 0, zIndex: 200,
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: "#00ff87", letterSpacing: "0.25em", marginBottom: 4, fontWeight: 700 }}>
                SHAHJAN ALI · CS (CYBER SECURITY) · PARUL UNIVERSITY · 7TH SEM
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                AI Application Engineer
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 900, color: "#00ff87", lineHeight: 1.2 }}>
                Complete Roadmap — 10 Weeks
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: "#00ff87", lineHeight: 1, fontFamily: "'Syne', sans-serif" }}>{percent}%</div>
              <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{doneItems} / {totalItems} items done</div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: 16, background: "#1a2332", borderRadius: 2, height: 3, overflow: "hidden" }}>
            <div className="bar-fill" style={{ height: "100%", width: `${percent}%`, background: "linear-gradient(90deg, #00ff87, #60a5fa, #a78bfa)", borderRadius: 2 }} />
          </div>
          {/* Legend */}
          <div style={{ display: "flex", gap: 20, marginTop: 10, flexWrap: "wrap" }}>
            {[
              { dot: "#f43f5e", label: "CRITICAL — do first" },
              { dot: "#f59e0b", label: "IMPORTANT" },
              { dot: "#a78bfa", label: "ADVANCED" },
              { dot: "#00ff87", label: "Already know" },
              { dot: "#94a3b8", label: "Note: tap any item for details" },
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#64748b" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: l.dot, display: "inline-block" }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TWO-PANEL BODY ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 16px 60px" }}>
        {roadmapData.map((section, si) => {
          const sectionDone = section.items.filter(i => checked[i.id]).length;
          const isOpen = expanded[section.key] !== false;
          const isDiagOpen = diagramOpen[section.key] !== false;

          return (
            <div key={section.key} className="section-wrap" style={{ marginTop: si === 0 ? 24 : 32 }}>

              {/* Section title bar */}
              <div
                className="sec-hdr"
                onClick={() => toggle(section.key)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 16px",
                  background: "#0d1117",
                  borderLeft: `3px solid ${section.color}`,
                  border: `1px solid ${section.color}22`,
                  borderLeft: `3px solid ${section.color}`,
                  borderRadius: isOpen ? "6px 6px 0 0" : "6px",
                  marginBottom: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 900, color: section.color, letterSpacing: "0.2em" }}>
                    PHASE {section.phase}
                  </span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 800, color: "#fff" }}>
                    {section.label}
                  </span>
                  <span style={{ fontSize: 10, color: "#475569", display: "none" }}>—</span>
                  <span style={{ fontSize: 10, color: "#475569" }}>{section.timeline}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 10, color: "#64748b" }}>{sectionDone}/{section.items.length}</span>
                  {/* mini bar */}
                  <div style={{ width: 50, height: 3, background: "#1a2332", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${(sectionDone / section.items.length) * 100}%`, height: "100%", background: section.color, borderRadius: 2, transition: "width 0.5s" }} />
                  </div>
                  <span style={{ color: "#64748b", fontSize: 12, transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", display: "inline-block", transition: "transform 0.2s" }}>▼</span>
                </div>
              </div>

              {isOpen && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "260px 1fr",
                  gap: 0,
                  border: `1px solid ${section.color}18`,
                  borderTop: "none",
                  borderRadius: "0 0 6px 6px",
                  overflow: "hidden",
                }}>

                  {/* ── LEFT: DIAGRAM PANEL ─────────────────────────── */}
                  <div style={{
                    background: "#080c10",
                    borderRight: `1px solid ${section.color}18`,
                    padding: "0",
                  }}>
                    {/* Goal */}
                    <div style={{
                      padding: "10px 14px",
                      borderBottom: `1px solid ${section.color}15`,
                      background: `${section.color}08`,
                    }}>
                      <div style={{ fontSize: 9, color: section.color, letterSpacing: "0.15em", fontWeight: 700, marginBottom: 3 }}>GOAL</div>
                      <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}>{section.goal}</div>
                    </div>

                    {/* Diagram toggle */}
                    <div
                      className="diag-toggle"
                      onClick={() => toggleDiagram(section.key)}
                      style={{ padding: "8px 14px", borderBottom: `1px solid #1a2332`, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <span style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em" }}>VISUAL / FLOW</span>
                      <span style={{ fontSize: 10, color: "#2d3f52" }}>{isDiagOpen ? "−" : "+"}</span>
                    </div>

                    {isDiagOpen && (
                      <div style={{ padding: "8px 14px 14px" }}>
                        <SectionDiagram sectionKey={section.key} section={section} />
                      </div>
                    )}
                  </div>

                  {/* ── RIGHT: CHECKLIST PANEL ──────────────────────── */}
                  <div>
                    {section.items.map((item, idx) => {
                      const isDone = checked[item.id];
                      const ts = TAG_STYLE[item.tag] || TAG_STYLE.core;
                      const isNoteOpen = activeNote === item.id;
                      return (
                        <div key={item.id}>
                          <div
                            className="item-row"
                            style={{
                              display: "flex", alignItems: "flex-start", gap: 10,
                              padding: "9px 14px",
                              background: idx % 2 === 0 ? "#0a0f15" : "#080c10",
                              borderTop: idx === 0 ? "none" : "1px solid #0d1520",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              toggleCheck(item.id);
                              setActiveNote(null);
                            }}
                          >
                            {/* Checkbox */}
                            <div className="chk" style={{
                              width: 16, height: 16, minWidth: 16,
                              border: `1.5px solid ${isDone ? section.color : "#2d3f52"}`,
                              borderRadius: 3,
                              background: isDone ? section.color : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              marginTop: 1, transition: "all 0.15s",
                            }}>
                              {isDone && <span style={{ color: "#060a0e", fontSize: 10, fontWeight: 900 }}>✓</span>}
                            </div>

                            {/* Text */}
                            <div style={{ flex: 1 }}>
                              <span style={{
                                fontSize: 12, lineHeight: 1.5,
                                color: isDone ? "#475569" : "#cbd5e1",
                                textDecoration: isDone ? "line-through" : "none",
                                transition: "all 0.2s",
                              }}>
                                {item.text}
                              </span>
                            </div>

                            {/* Tag + note toggle */}
                            <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: "fit-content" }}>
                              <span style={{
                                fontSize: 9, padding: "2px 6px", borderRadius: 3, fontWeight: 700, letterSpacing: "0.07em",
                                background: ts.bg, color: ts.text,
                              }}>{ts.label}</span>
                              <span
                                style={{ fontSize: 14, color: "#2d3f52", cursor: "pointer", userSelect: "none" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveNote(isNoteOpen ? null : item.id);
                                }}
                              >ℹ</span>
                            </div>
                          </div>

                          {/* Note popup */}
                          {isNoteOpen && (
                            <div className="note-popup" style={{
                              padding: "8px 14px 8px 40px",
                              background: `${section.color}08`,
                              borderLeft: `2px solid ${section.color}`,
                              borderTop: `1px solid ${section.color}20`,
                              fontSize: 11, color: "#94a3b8", lineHeight: 1.6,
                            }}>
                              {item.note}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ── EXTRA SKILLS ───────────────────────────────────────────────── */}
        <div style={{ marginTop: 40 }}>
          <div style={{ fontSize: 10, color: "#00ff87", letterSpacing: "0.2em", fontWeight: 700, marginBottom: 4 }}>
            ⚡ EXTRA SKILLS YOU ALREADY HAVE
          </div>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 12 }}>
            Not on the standard AI engineer checklist — but they differentiate you from the crowd.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "14px", background: "#0d1117", border: "1px solid #1a2332", borderRadius: 6 }}>
            {extras.map((e, i) => (
              <span key={i} style={{
                background: `${e.color}12`, color: e.color,
                border: `1px solid ${e.color}30`,
                fontSize: 10, padding: "4px 10px", borderRadius: 4, fontWeight: 600,
              }}>✓ {e.text}</span>
            ))}
          </div>
        </div>

        {/* ── BONUS SKILLS ───────────────────────────────────────────────── */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 10, color: "#f43f5e", letterSpacing: "0.2em", fontWeight: 700, marginBottom: 4 }}>
            🚀 BONUS SKILLS — DO 2–3 AND YOU'RE TOP 5%
          </div>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 12 }}>
            Not required right now. But each one meaningfully raises your salary ceiling.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "14px", background: "#0d1117", border: "1px solid #f43f5e18", borderRadius: 6 }}>
            {bonusSkills.map((e, i) => (
              <span key={i} style={{
                background: `${e.color}12`, color: e.color,
                border: `1px solid ${e.color}30`,
                fontSize: 10, padding: "4px 10px", borderRadius: 4, fontWeight: 600,
              }}>+ {e.text}</span>
            ))}
          </div>
        </div>

        {/* ── SALARY PROJECTION ─────────────────────────────────────────── */}
        <div style={{
          marginTop: 24, padding: "16px 20px",
          background: "linear-gradient(135deg, #00ff8708, #60a5fa06)",
          border: "1px solid #00ff8720", borderRadius: 6,
        }}>
          <div style={{ fontSize: 10, color: "#00ff87", fontWeight: 700, letterSpacing: "0.12em", marginBottom: 12 }}>
            WHERE THIS GETS YOU — 2026 MARKET
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { label: "First Job (you now)", val: "₹8–12 LPA", sub: "RAGBot portfolio + FastAPI" },
              { label: "2 Years In", val: "₹18–35 LPA", sub: "LangGraph + agents + LangSmith" },
              { label: "5 Years In", val: "₹40–70 LPA", sub: "LLM systems architect" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "12px", background: "#0d1117", borderRadius: 5, border: "1px solid #1a2332" }}>
                <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.1em", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#00ff87" }}>{s.val}</div>
                <div style={{ fontSize: 9, color: "#475569", marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 10, color: "#1e2d3d" }}>
          tap items to track · tap ℹ for details · built for shahjan ali · june 2026
        </div>
      </div>
    </div>
  );
}
