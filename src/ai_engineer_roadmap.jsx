import { useState } from "react";

const roadmapData = {
  foundation: {
    label: "FOUNDATION",
    color: "#00ff87",
    items: [
      { id: 1, text: "Python — core syntax, OOP, decorators, generators", done: true },
      { id: 2, text: "Data structures in Python — lists, dicts, sets, comprehensions", done: true },
      { id: 3, text: "File I/O, JSON handling, environment variables (.env)", done: true },
      { id: 4, text: "Error handling — try/except, custom exceptions", done: true },
      { id: 5, text: "Virtual environments — venv, pip, requirements.txt", done: true },
      { id: 6, text: "Git & GitHub — commits, branches, PRs, clean history", done: true },
      { id: 7, text: "Linux CLI basics — navigate, pipe, permissions, processes", done: true },
    ]
  },
  backend: {
    label: "BACKEND CORE",
    color: "#60a5fa",
    items: [
      { id: 8, text: "Django — models, views, URLs, middleware, ORM", done: true },
      { id: 9, text: "Django REST Framework — serializers, viewsets, routers", done: true },
      { id: 10, text: "JWT Authentication — access/refresh tokens, protected routes", done: true },
      { id: 11, text: "PostgreSQL — schema design, indexing, normalization", done: true },
      { id: 12, text: "RESTful API design — CRUD, pagination, filtering, versioning", done: true },
      { id: 13, text: "Celery + Redis — async task queues, background jobs", done: true },
      { id: 14, text: "WebSockets basics — real-time communication", done: true },
      { id: 15, text: "FastAPI — routes, Pydantic models, async endpoints, dependency injection", done: false },
    ]
  },
  llm_core: {
    label: "LLM & GENAI CORE",
    color: "#f59e0b",
    items: [
      { id: 16, text: "How LLMs work — tokens, context window, temperature, system prompts", done: false },
      { id: 17, text: "OpenAI API — chat completions, function calling, streaming responses", done: true },
      { id: 18, text: "Prompt engineering — zero-shot, few-shot, chain-of-thought, role prompting", done: false },
      { id: 19, text: "Embeddings — what they are, cosine similarity, semantic search", done: true },
      { id: 20, text: "SentenceTransformers — loading models, encoding text, comparing vectors", done: true },
      { id: 21, text: "HuggingFace basics — Hub, pipeline API, loading open-source models", done: false },
      { id: 22, text: "LLM evaluation — hallucination, faithfulness, relevance scoring", done: false },
      { id: 23, text: "Ragas library — automated RAG evaluation metrics", done: false },
    ]
  },
  rag: {
    label: "RAG SYSTEMS",
    color: "#a78bfa",
    items: [
      { id: 24, text: "RAG architecture — retrieval, augmentation, generation pipeline", done: true },
      { id: 25, text: "Document chunking strategies — fixed, recursive, semantic chunking", done: false },
      { id: 26, text: "Vector databases — FAISS (done), now learn Chroma + pgvector", done: true },
      { id: 27, text: "Metadata filtering in vector search — hybrid search techniques", done: false },
      { id: 28, text: "Reranking — cross-encoders, Cohere rerank, improving retrieval quality", done: false },
      { id: 29, text: "LangChain — chains, retrievers, memory, document loaders", done: false },
      { id: 30, text: "LlamaIndex — nodes, indices, query engines (know at least one deeply)", done: false },
      { id: 31, text: "Multi-document RAG — handling multiple sources, source attribution", done: true },
      { id: 32, text: "Conversational RAG — chat history + retrieval, memory management", done: false },
    ]
  },
  agents: {
    label: "LLM AGENTS & ORCHESTRATION",
    color: "#f43f5e",
    items: [
      { id: 33, text: "What agents are — ReAct pattern, tool calling, planning", done: false },
      { id: 34, text: "Function/tool calling with OpenAI API — structured outputs", done: false },
      { id: 35, text: "Building a simple agent — file reader, calculator, search tool", done: false },
      { id: 36, text: "LangChain agents — AgentExecutor, tools, custom tools", done: false },
      { id: 37, text: "Multi-step reasoning — breaking tasks into sub-tasks automatically", done: false },
    ]
  },
  deployment: {
    label: "DEPLOYMENT & MLOPS BASICS",
    color: "#34d399",
    items: [
      { id: 38, text: "Docker — write Dockerfiles from scratch, build + run containers", done: false },
      { id: 39, text: "Docker Compose — multi-service apps (you use it, now master it)", done: true },
      { id: 40, text: "Deploy a live app — Railway / Render / AWS EC2 with real domain", done: true },
      { id: 41, text: "Environment management in production — secrets, config vars", done: true },
      { id: 42, text: "Basic CI/CD — GitHub Actions for auto-deploy on push", done: false },
      { id: 43, text: "AWS basics — EC2, S3, IAM roles (enough to deploy and store files)", done: false },
      { id: 44, text: "Monitoring basics — logging, error tracking (Sentry), uptime checks", done: false },
    ]
  },
  data: {
    label: "DATA & ML BASICS (just enough)",
    color: "#fb923c",
    items: [
      { id: 45, text: "NumPy — arrays, operations, broadcasting", done: true },
      { id: 46, text: "Pandas — DataFrames, groupby, merge, cleaning messy data", done: true },
      { id: 47, text: "Understanding ML concepts — classification, regression, overfitting", done: true },
      { id: 48, text: "Scikit-learn basics — train/test split, fit/predict, metrics", done: false },
      { id: 49, text: "Text preprocessing — tokenization, stopwords, TF-IDF (for NLP context)", done: false },
      { id: 50, text: "Fine-tuning basics — what it is, when to use vs RAG, LoRA concept", done: false },
    ]
  },
  system_design: {
    label: "SYSTEM DESIGN FOR AI APPS",
    color: "#22d3ee",
    items: [
      { id: 51, text: "Async architecture — why AI calls are async, handling timeouts", done: false },
      { id: 52, text: "Caching strategies for LLM responses — Redis semantic cache", done: false },
      { id: 53, text: "Rate limiting & cost management — OpenAI token budgets", done: false },
      { id: 54, text: "API design for AI features — streaming responses to frontend", done: false },
      { id: 55, text: "Multi-tenancy in AI SaaS — isolating data per client (your RAGBot)", done: false },
      { id: 56, text: "Scalability basics — when to add workers, queues, caching layers", done: false },
    ]
  }
};

const extras = [
  { text: "Selenium web scraping — real production scraper built", color: "#00ff87" },
  { text: "BeautifulSoup — HTML parsing", color: "#00ff87" },
  { text: "MongoDB + Mongoose (Node.js)", color: "#60a5fa" },
  { text: "Express.js — Node backend built", color: "#60a5fa" },
  { text: "React 18 + TypeScript + Vite + Tailwind — full frontend stack", color: "#a78bfa" },
  { text: "IoT — Arduino + ESP32 hands-on experience", color: "#f59e0b" },
  { text: "Cybersecurity foundation — Nmap, Metasploit, web vulnerability assessment", color: "#f43f5e" },
  { text: "B2B SaaS product built — RAGBot (embeddable chatbot widget)", color: "#34d399" },
];

const bonusSkills = [
  { text: "LangGraph — stateful multi-agent workflows (hottest skill in 2026)", color: "#f43f5e" },
  { text: "Qdrant or Weaviate — production-grade vector DB (beyond FAISS)", color: "#a78bfa" },
  { text: "vLLM — serving open source LLMs locally / on GPU", color: "#f59e0b" },
  { text: "Semantic Kernel (Microsoft) — enterprise AI orchestration", color: "#60a5fa" },
  { text: "pgvector — vector search inside PostgreSQL (no separate DB needed)", color: "#34d399" },
  { text: "Streamlit — rapid AI demo UIs, impress in interviews instantly", color: "#22d3ee" },
];

export default function Roadmap() {
  const [expanded, setExpanded] = useState({});
  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem("shahjan_roadmap_progress");
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    const init = {};
    Object.values(roadmapData).forEach(section =>
      section.items.forEach(item => { init[item.id] = item.done; })
    );
    return init;
  });

  const toggle = (key) => setExpanded(e => ({ ...e, [key]: !e[key] }));
  const toggleCheck = (id) => setChecked(c => {
    const updated = { ...c, [id]: !c[id] };
    try { localStorage.setItem("shahjan_roadmap_progress", JSON.stringify(updated)); } catch (_) {}
    return updated;
  });

  const totalItems = Object.values(roadmapData).reduce((a, s) => a + s.items.length, 0);
  const doneItems = Object.values(checked).filter(Boolean).length;
  const percent = Math.round((doneItems / totalItems) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c10",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      color: "#e2e8f0",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #00ff87; border-radius: 2px; }
        .section-header:hover { opacity: 0.85; cursor: pointer; }
        .item-row:hover { background: rgba(255,255,255,0.04) !important; }
        .check-btn { transition: all 0.15s ease; }
        .check-btn:hover { transform: scale(1.1); }
        .bar-fill { transition: width 1s cubic-bezier(0.4,0,0.2,1); }
        .glow { box-shadow: 0 0 20px rgba(0,255,135,0.15); }
        .tag { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0d1117 0%, #0f1923 100%)",
        borderBottom: "1px solid #1a2332",
        padding: "32px 24px 24px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: "#00ff87", letterSpacing: "0.2em", marginBottom: 6, fontWeight: 700 }}>
                SHAHJAN ALI · 7TH SEM · PARUL UNIVERSITY
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
                AI Application Engineer
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#00ff87", lineHeight: 1.1 }}>
                Roadmap · 2 Months
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#00ff87", lineHeight: 1 }}>{percent}%</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{doneItems} / {totalItems} mastered</div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: 20, background: "#1a2332", borderRadius: 2, height: 4, overflow: "hidden" }}>
            <div className="bar-fill" style={{ height: "100%", width: `${percent}%`, background: "linear-gradient(90deg, #00ff87, #60a5fa)", borderRadius: 2 }} />
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b" }}>
              <span style={{ color: "#00ff87", fontSize: 14 }}>✓</span> Already in your resume
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b" }}>
              <span style={{ color: "#475569", fontSize: 14 }}>○</span> To learn
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b" }}>
              <span style={{ fontSize: 10 }}>tap any item to track progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 40px" }}>
        {Object.entries(roadmapData).map(([key, section], si) => {
          const sectionDone = section.items.filter(i => checked[i.id]).length;
          const isOpen = expanded[key] !== false;
          return (
            <div key={key} style={{ marginBottom: 12 }} className="glow">
              {/* Section header */}
              <div
                className="section-header"
                onClick={() => toggle(key)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#0d1117",
                  border: `1px solid ${section.color}22`,
                  borderLeft: `3px solid ${section.color}`,
                  borderRadius: isOpen ? "6px 6px 0 0" : "6px",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 12, fontWeight: 800,
                    color: section.color,
                    letterSpacing: "0.15em"
                  }}>
                    {String(si + 1).padStart(2, '0')} {section.label}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: "#64748b" }}>{sectionDone}/{section.items.length}</span>
                  <span style={{ color: "#64748b", fontSize: 12, transition: "transform 0.2s", transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", display: "inline-block" }}>▼</span>
                </div>
              </div>

              {/* Items */}
              {isOpen && (
                <div style={{
                  border: `1px solid ${section.color}22`,
                  borderTop: "none",
                  borderRadius: "0 0 6px 6px",
                  overflow: "hidden",
                }}>
                  {section.items.map((item, idx) => {
                    const isDone = checked[item.id];
                    return (
                      <div
                        key={item.id}
                        className="item-row"
                        onClick={() => toggleCheck(item.id)}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 12,
                          padding: "10px 16px",
                          background: idx % 2 === 0 ? "#0a0f15" : "#080c10",
                          cursor: "pointer",
                          borderTop: idx === 0 ? "none" : "1px solid #0f1923",
                          transition: "background 0.15s",
                        }}
                      >
                        <div
                          className="check-btn"
                          style={{
                            width: 18, height: 18, minWidth: 18,
                            border: `1.5px solid ${isDone ? section.color : "#2d3f52"}`,
                            borderRadius: 3,
                            background: isDone ? section.color : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            marginTop: 1,
                            transition: "all 0.2s",
                          }}
                        >
                          {isDone && <span style={{ color: "#080c10", fontSize: 11, fontWeight: 900 }}>✓</span>}
                        </div>
                        <span style={{
                          fontSize: 13, lineHeight: 1.5,
                          color: isDone ? "#64748b" : "#cbd5e1",
                          textDecoration: isDone ? "line-through" : "none",
                          transition: "all 0.2s",
                        }}>
                          {item.text}
                        </span>
                        {item.done && !isDone && (
                          <span className="tag" style={{ background: `${section.color}22`, color: section.color, marginLeft: "auto", minWidth: "fit-content" }}>
                            IN RESUME
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Extra skills you already have */}
        <div style={{ marginTop: 32, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#00ff87", letterSpacing: "0.2em", fontWeight: 700, marginBottom: 4 }}>
            ⚡ EXTRA SKILLS YOU ALREADY HAVE
          </div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 16 }}>
            These aren't on the standard AI engineer checklist — but they differentiate you.
          </div>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8,
            padding: "16px", background: "#0d1117",
            border: "1px solid #1a2332", borderRadius: 6
          }}>
            {extras.map((e, i) => (
              <span key={i} className="tag" style={{
                background: `${e.color}15`, color: e.color,
                border: `1px solid ${e.color}33`,
                fontSize: 11, padding: "5px 10px", borderRadius: 4
              }}>
                ✓ {e.text}
              </span>
            ))}
          </div>
        </div>

        {/* Bonus skills */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11, color: "#f43f5e", letterSpacing: "0.2em", fontWeight: 700, marginBottom: 4 }}>
            🚀 BONUS SKILLS — DO THESE AND YOU'RE TOP 5%
          </div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 16 }}>
            Not required right now. But if you do even 2–3 of these, your salary ceiling moves up significantly.
          </div>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8,
            padding: "16px", background: "#0d1117",
            border: "1px solid #f43f5e22", borderRadius: 6
          }}>
            {bonusSkills.map((e, i) => (
              <span key={i} className="tag" style={{
                background: `${e.color}15`, color: e.color,
                border: `1px solid ${e.color}33`,
                fontSize: 11, padding: "5px 10px", borderRadius: 4
              }}>
                + {e.text}
              </span>
            ))}
          </div>
        </div>

        {/* Salary reminder */}
        <div style={{
          marginTop: 24, padding: "16px 20px",
          background: "linear-gradient(135deg, #00ff8710, #60a5fa08)",
          border: "1px solid #00ff8722", borderRadius: 6,
        }}>
          <div style={{ fontSize: 11, color: "#00ff87", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>
            WHERE THIS GETS YOU (2026 MARKET)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { label: "First Job", val: "₹8–12 LPA", sub: "with RAGBot portfolio" },
              { label: "2 Years In", val: "₹18–35 LPA", sub: "with LangChain + agents" },
              { label: "5 Years In", val: "₹40–70 LPA", sub: "LLM specialist" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em" }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#00ff87", margin: "4px 0" }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#2d3f52" }}>
          tick items as you complete them · built for shahjan ali · june 2026
        </div>
      </div>
    </div>
  );
}
