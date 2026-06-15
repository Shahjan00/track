import { useState, useEffect, useRef } from "react";

// ─── STORAGE KEY ──────────────────────────────────────────────────────────────
const STORAGE_KEY = "shahjan_roadmap_v3";
const MS_PER_DAY = 86400000;

// ─── COLOURS ──────────────────────────────────────────────────────────────────
const C = {
  foundation: "#00ff87", backend: "#60a5fa", llm: "#f59e0b",
  rag: "#a78bfa", langsmith: "#e879f9", agents: "#f43f5e",
  deployment: "#34d399", system: "#22d3ee",
};

// ─── ROADMAP DATA ─────────────────────────────────────────────────────────────
const roadmapData = [
  {
    key: "foundation", phase: "01", label: "PYTHON FOUNDATION", color: C.foundation,
    goal: "Write production-quality Python without second-guessing yourself",
    diagram: {
      title: "Python Mental Model for AI Engineering",
      sections: [
        {
          heading: "Core Language → Used everywhere",
          color: C.foundation,
          rows: [
            { label: "Decorators", detail: "@app.get(), @celery.task() — FastAPI & Celery are built on these" },
            { label: "Generators", detail: "yield — streaming LLM responses use Python generators" },
            { label: "Async/Await", detail: "async def — every FastAPI endpoint, every LLM call" },
            { label: "OOP", detail: "class RAGPipeline — structure your AI code as classes" },
          ]
        },
        {
          heading: "Data Flow in AI Apps",
          color: "#60a5fa",
          flow: ["User Query (str)", "→ dict (JSON)", "→ List[chunks]", "→ np.array (vectors)", "→ dict (LLM response)"],
        },
        {
          heading: "Tooling That Matters",
          color: "#94a3b8",
          rows: [
            { label: ".env + python-dotenv", detail: "OPENAI_API_KEY, REDIS_URL — never hardcode" },
            { label: "requirements.txt", detail: "pin versions: langchain==0.2.1 or use poetry" },
            { label: "try/except chains", detail: "openai.RateLimitError → retry; openai.APIError → fallback" },
          ]
        }
      ]
    },
    items: [
      { id: 1,  text: "Core syntax, OOP, decorators, generators", done: true,  tag: "core",    note: "Decorators power FastAPI routes (@app.get) and Celery tasks (@celery.task). Generators power streaming responses (yield token). OOP helps you build a clean RAGPipeline class." },
      { id: 2,  text: "Data structures — lists, dicts, sets, comprehensions", done: true, tag: "core",    note: "LLM API responses are nested dicts. Chunks are lists. Vector search results are list-of-tuples. Master dict comprehensions and list slicing — you use them 50x a day." },
      { id: 3,  text: "File I/O, JSON, environment variables (.env)", done: true, tag: "core",    note: "Every AI app: load PDF → read bytes. Parse LLM response → json.loads(). Protect API keys → os.getenv('OPENAI_API_KEY'). These three patterns appear in literally every file you write." },
      { id: 4,  text: "Error handling — try/except, custom exceptions", done: true, tag: "core",    note: "LLM APIs fail creatively: rate limits, timeouts, invalid JSON, token overflow. You need RateLimitError → wait+retry, APIError → fallback model, JSONDecodeError → re-prompt. Custom exception classes make this clean." },
      { id: 5,  text: "Virtual environments — venv, pip, requirements.txt", done: true, tag: "tooling", note: "Isolation prevents 'it works on my machine'. Each project gets its own venv. Pin exact versions in requirements.txt. LangChain changes APIs frequently — pinned versions save you from surprise breakage." },
      { id: 6,  text: "Git & GitHub — commits, branches, PRs, clean history", done: true, tag: "tooling", note: "Interviewers read your commits. Atomic commits (one change per commit), clear messages ('feat: add hybrid search retriever'), feature branches. Your RAGBot and TableFlow repos are proof — keep them clean." },
      { id: 7,  text: "Linux CLI — navigate, pipe, grep, permissions, processes", done: true, tag: "tooling", note: "Daily in production: grep -r 'error' logs/, ps aux | grep celery, chmod 600 .env, tail -f app.log. Docker debugging is 90% CLI. Server is always Linux." },
    ]
  },
  {
    key: "backend", phase: "02", label: "BACKEND CORE", color: C.backend,
    goal: "Build production APIs. FastAPI is the one missing piece — all AI backends use it.",
    diagram: {
      title: "How Your Backend Stack Connects",
      sections: [
        {
          heading: "Request Lifecycle (FastAPI + RAG)",
          color: C.backend,
          flow: ["POST /chat {query}", "→ Auth (JWT middleware)", "→ Rate Limiter", "→ Celery Task (async)", "→ RAG Pipeline", "→ Redis Cache check", "→ OpenAI API call", "→ Stream response back"],
        },
        {
          heading: "Django vs FastAPI — When to use which",
          color: "#f59e0b",
          rows: [
            { label: "Django + DRF", detail: "Full web app, admin panel, complex ORM needs → RAGBot dashboard" },
            { label: "FastAPI", detail: "Pure API, AI endpoints, async performance → RAG query endpoint" },
            { label: "Pydantic models", detail: "class QueryRequest(BaseModel): query: str — auto validation + docs" },
            { label: "async def", detail: "Non-blocking — handle 100 LLM calls concurrently vs Django's 1-at-a-time" },
          ]
        },
        {
          heading: "Why FastAPI for AI",
          color: C.foundation,
          rows: [
            { label: "Native async", detail: "LLM calls take 5-30s — async prevents blocking entire server" },
            { label: "Auto Swagger docs", detail: "/docs — instant API explorer, great for demos" },
            { label: "Pydantic validation", detail: "Type-safe inputs/outputs — critical for LLM structured outputs" },
            { label: "Streaming support", detail: "StreamingResponse — send LLM tokens as they generate" },
          ]
        }
      ]
    },
    items: [
      { id: 8,  text: "Django — models, views, ORM, middleware", done: true,  tag: "done",     note: "Your RAGBot foundation. ORM lets you do Document.objects.filter(user=request.user) without raw SQL. Middleware handles auth for every request. You know this well." },
      { id: 9,  text: "Django REST Framework — serializers, viewsets, routers", done: true, tag: "done",     note: "RAGBot and TableFlow both use DRF. Serializers validate incoming data AND format outgoing JSON. Viewsets cut boilerplate by 60%. Routers auto-generate /api/v1/documents/ URLs." },
      { id: 10, text: "JWT Authentication — access/refresh tokens", done: true, tag: "done",     note: "TableFlow uses SimpleJWT. Access token (15min) + refresh token (7days). Protected routes check Authorization: Bearer <token>. Multi-tenant SaaS: JWT payload carries user_id → filter all queries by it." },
      { id: 11, text: "PostgreSQL — schema design, indexing, normalization", done: true, tag: "done",     note: "TableFlow on Railway. Index on foreign keys and frequently filtered columns. B-tree index for =, range queries. Add pgvector extension and you get vector search inside PostgreSQL — no separate vector DB needed." },
      { id: 12, text: "RESTful API design — CRUD, pagination, filtering", done: true, tag: "done",     note: "GET /api/docs/?page=2&source=pdf — cursor pagination for large datasets. Filter chains: queryset.filter(user=user, created_at__gte=since). Versioning: /api/v1/ vs /api/v2/ so you can upgrade without breaking clients." },
      { id: 13, text: "Celery + Redis — async task queues, background jobs", done: true, tag: "done",     note: "RAGBot: user uploads PDF → immediate 200 response → Celery worker processes PDF in background (chunk, embed, store). Without this, the HTTP request would time out. Redis is the message broker between Django and Celery workers." },
      { id: 14, text: "WebSockets — real-time communication", done: true, tag: "done",     note: "For streaming LLM responses: server sends tokens one by one as they generate. Alternative: Server-Sent Events (SSE) — simpler, one-way, works over HTTP. FastAPI supports both." },
      { id: 15, text: "FastAPI — routes, Pydantic models, async endpoints, dependency injection", done: false, tag: "critical",  note: "⚡ THIS IS YOUR ONLY REMAINING GAP. Most AI backends use FastAPI not Django. Build: async def query_rag(req: QueryRequest, db=Depends(get_db)) → StreamingResponse. 1 week = job-ready. Start: wrap your existing RAG pipeline in a FastAPI app." },
    ]
  },
  {
    key: "llm_core", phase: "03", label: "LLM & GENAI CORE", color: C.llm,
    goal: "Understand what LLMs actually do so you can engineer around their limits",
    diagram: {
      title: "LLM Internals That Affect Your Code",
      sections: [
        {
          heading: "Token Budget Math (affects chunking)",
          color: C.llm,
          rows: [
            { label: "GPT-4o context", detail: "128,000 tokens max ≈ 96,000 words ≈ ~300 pages" },
            { label: "1 token ≈", detail: "~4 chars in English. 'LangChain' = 3 tokens" },
            { label: "Chunk size rule", detail: "Chunk ≤ 512 tokens. Leave room for prompt + answer (~2k tokens)" },
            { label: "Cost math", detail: "$0.005 per 1k tokens. 1000 queries × 2k tokens = $10/day" },
          ]
        },
        {
          heading: "Temperature + Sampling",
          color: "#94a3b8",
          rows: [
            { label: "temperature=0", detail: "Deterministic — same input always gives same output. Use for RAG." },
            { label: "temperature=0.7", detail: "Creative — use for brainstorming, content generation" },
            { label: "top_p=0.1", detail: "Only pick from top 10% probability tokens — more focused" },
          ]
        },
        {
          heading: "Prompt Engineering Patterns",
          color: C.foundation,
          flow: ["System prompt (role + rules)", "→ Few-shot examples (2-3)", "→ Retrieved context (RAG chunks)", "→ User query", "→ 'Answer only from context above. Say I don't know if unsure.'"],
        }
      ]
    },
    items: [
      { id: 16, text: "How LLMs work — tokens, context window, temperature, system prompts", done: false, tag: "theory",    note: "Tokens ≠ words. 'unhappiness' = 3 tokens. Context window = max tokens in+out. Temperature 0 = factual RAG. Temperature 1 = creative writing. System prompt = personality + rules. Know GPT-4o (128k), Claude (200k), Gemini (1M) limits — they determine your chunk strategy." },
      { id: 17, text: "OpenAI API — completions, function calling, streaming", done: true, tag: "done",     note: "Used in RAGBot. Deepen: learn tool_choice='auto' for function calling. Use stream=True + for chunk in response: yield chunk.choices[0].delta.content for streaming. Know the messages format: [{role: system/user/assistant, content: ...}]" },
      { id: 18, text: "Prompt engineering — zero-shot, few-shot, chain-of-thought, role prompting", done: false, tag: "important", note: "Zero-shot: just ask. Few-shot: give 2-3 examples first. CoT: 'Think step by step.' Role: 'You are a senior Python engineer.' For RAG: always end with 'Answer ONLY from the context above. If the answer is not in the context, say I don't know.' Bad prompts = bad RAG quality regardless of retrieval." },
      { id: 19, text: "Embeddings — cosine similarity, semantic search, embedding models", done: true, tag: "done",     note: "You use this in RAGBot. Understand WHY: embeddings are unit vectors in 1536-dim space (OpenAI ada-002). Cosine similarity = dot product of unit vectors. text-embedding-3-small is cheaper+better than ada-002. Use for: semantic search, duplicate detection, clustering." },
      { id: 20, text: "SentenceTransformers — bi-encoders for retrieval, cross-encoders for reranking", done: true, tag: "done",     note: "Bi-encoder: encode query + doc separately → fast, used for retrieval. Cross-encoder: encode query+doc together → slow but accurate, used for reranking. all-MiniLM-L6-v2 is fast bi-encoder. cross-encoder/ms-marco-MiniLM-L-6-v2 is the reranker. Know this distinction — it's an interview question." },
      { id: 21, text: "HuggingFace — Hub, pipeline API, loading open-source models", done: false, tag: "important", note: "from transformers import pipeline; llm = pipeline('text-generation', model='mistralai/Mistral-7B-Instruct'). Use when: no budget for OpenAI API, need data privacy (on-premise), want to fine-tune. HF Hub has 500k+ models. Know how to load, run inference, and push your own model." },
      { id: 22, text: "LLM evaluation — hallucination, faithfulness, relevance, groundedness", done: false, tag: "important", note: "4 Ragas metrics: Faithfulness (is answer supported by context?), Answer Relevancy (does answer address the question?), Context Precision (are retrieved chunks actually used?), Context Recall (were all needed chunks retrieved?). These are interview questions. A score of 0.8+ faithfulness = good RAG." },
      { id: 23, text: "Ragas library — automated RAG evaluation pipeline", done: false, tag: "important", note: "pip install ragas. from ragas import evaluate; from ragas.metrics import faithfulness, answer_relevancy. Create dataset with question, answer, contexts, ground_truth. evaluate(dataset, metrics=[faithfulness]). Output: scores per question. Add this to RAGBot — it's a differentiator in your portfolio." },
    ]
  },
  {
    key: "rag", phase: "04", label: "RAG SYSTEMS (DEEP)", color: C.rag,
    goal: "Build RAG from raw Python first, then LangChain, then advanced techniques",
    diagram: {
      title: "Complete RAG Architecture",
      sections: [
        {
          heading: "Indexing Pipeline (runs once per document)",
          color: C.rag,
          flow: ["PDF/URL/Text input", "→ Document loader (pypdf, unstructured)", "→ Chunking (RecursiveCharacterTextSplitter)", "→ Embedding model (text-embedding-3-small)", "→ Vector store (FAISS/Chroma) + metadata", "→ BM25 index for keyword search", "→ Stored on disk / in database"],
        },
        {
          heading: "Query Pipeline (runs per user question)",
          color: "#60a5fa",
          flow: ["User query", "→ Query rewrite / decompose (optional)", "→ Hybrid: BM25 + Vector search (top-20)", "→ Reranker (cross-encoder → top-5)", "→ Parent doc expansion (small→large chunks)", "→ Prompt assembly: system + context + query", "→ LLM (stream=True)", "→ Answer + source citations"],
        },
        {
          heading: "Chunking Strategy Decision Tree",
          color: C.llm,
          rows: [
            { label: "Fixed size (512 tok)", detail: "Fast, simple. Works for homogeneous text like docs/manuals" },
            { label: "Recursive", detail: "Split by \\n\\n → \\n → . → ' ' — best default for mixed content" },
            { label: "Semantic", detail: "Split when topic changes (embedding distance spikes). Best quality." },
            { label: "Parent-Child", detail: "Index small (128 tok) chunks, retrieve parent (512 tok). Best of both." },
          ]
        },
        {
          heading: "LangChain LCEL (modern syntax only)",
          color: "#94a3b8",
          flow: ["chain = retriever", "| prompt_template", "| llm (ChatOpenAI)", "| StrOutputParser()", "chain.invoke({'query': user_input})"],
        }
      ]
    },
    items: [
      { id: 24, text: "RAG pipeline from scratch — no framework, pure Python", done: true,  tag: "foundation", note: "loader = PyPDFLoader(path); docs = loader.load(); splitter = RecursiveCharacterTextSplitter(chunk_size=512); chunks = splitter.split_documents(docs); embedder = OpenAIEmbeddings(); db = FAISS.from_documents(chunks, embedder); retriever = db.as_retriever(k=5). Build this first before any framework. CLI tool on a PDF. Forces you to understand each step." },
      { id: 25, text: "Chunking strategies — fixed, recursive, sentence, semantic", done: false, tag: "important",  note: "Chunk size is the #1 thing that affects RAG quality. Too small (128 tok): precise retrieval, but context-free chunks confuse LLM. Too large (2048 tok): LLM gets context but retrieval is imprecise. Sweet spot: 512 tok chunks with 50 tok overlap. Experiment: run same query with 256, 512, 1024 chunks and compare answers." },
      { id: 26, text: "Vector databases — FAISS → Chroma → pgvector", done: true,  tag: "expand",    note: "FAISS: in-memory, fast, no persistence by default. Save: db.save_local('faiss_index'). Chroma: persistent by default, has metadata filtering, easy to start. pgvector: vector search inside PostgreSQL — great for production (one less service). Production choice: pgvector for small scale, Qdrant/Weaviate for large scale." },
      { id: 27, text: "Metadata filtering — namespace per client, filter before vector search", done: false, tag: "important",  note: "faiss doesn't support metadata filtering well. Switch to Chroma: collection.query(query_texts=[q], where={'user_id': '123'}). This is how RAGBot isolates client data. Each document stored with metadata: {'user_id': uid, 'doc_id': doc_id, 'source': filename, 'created_at': timestamp}. Filter ensures Client A never sees Client B's chunks." },
      { id: 28, text: "Hybrid Search — BM25 keyword + vector search + RRF fusion", done: false, tag: "advanced",  note: "Problem: vector search misses exact matches (names, codes, acronyms). BM25 (keyword) catches exact matches but misses semantic meaning. Solution: run both, fuse with Reciprocal Rank Fusion: score = 1/(k+rank_bm25) + 1/(k+rank_vector). LangChain: EnsembleRetriever([bm25_retriever, vector_retriever], weights=[0.5, 0.5]). Typical improvement: +15-25% retrieval recall." },
      { id: 29, text: "Reranking — cross-encoders, Cohere Rerank, precision boost", done: false, tag: "advanced",  note: "Retrieve top-20 chunks (high recall, low precision). Reranker scores each chunk against the query (reads both together = more accurate). Keep top-5. Cross-encoder local: from sentence_transformers import CrossEncoder; model = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2'); scores = model.predict([[query, chunk] for chunk in chunks]). Or: Cohere API co.rerank(query, documents, top_n=5). Typical improvement: +20-30% answer quality." },
      { id: 30, text: "Parent-Child chunking — precise retrieval, full context", done: false, tag: "advanced",  note: "Index small chunks (128 tokens) for precise vector matching. When a small chunk is retrieved, fetch its parent (512 tokens) for LLM context. Implementation: store parent_id in metadata. After retrieval, replace small chunks with their parents. LangChain: ParentDocumentRetriever. This solves the fundamental chunk size tradeoff: retrieval accuracy vs context richness." },
      { id: 31, text: "HyDE — hypothetical document embeddings for vague queries", done: false, tag: "advanced",  note: "Problem: 'what's the return policy?' has a different embedding than the actual return policy text. HyDE: ask LLM to generate a hypothetical answer → embed that → use for retrieval. The hypothetical answer is closer in embedding space to real documents. Works best when queries are vague or phrased differently from document language. from langchain.chains import HypotheticalDocumentEmbedder." },
      { id: 32, text: "Query decomposition — break complex questions into sub-queries", done: false, tag: "advanced",  note: "'Compare Python and JavaScript for AI development' → ['What are Python's AI strengths?', 'What are JavaScript's AI strengths?'] → retrieve for each → combine. LangChain: MultiQueryRetriever — automatically generates N query variants, runs all, deduplicates results. Best for: comparison questions, multi-hop reasoning, ambiguous queries." },
      { id: 33, text: "LangChain LCEL — modern pipe syntax, loaders, splitters", done: false, tag: "framework",  note: "Modern LangChain is built on LCEL (pipe syntax). chain = retriever | prompt | llm | StrOutputParser(). Invoke: chain.invoke({'question': q}). Stream: for chunk in chain.stream({'question': q}): print(chunk). SKIP: LLMChain, RetrievalQAChain — deprecated. DocumentLoaders: PyPDFLoader, WebBaseLoader, CSVLoader, UnstructuredFileLoader. TextSplitters: RecursiveCharacterTextSplitter, SemanticChunker." },
      { id: 34, text: "LangChain Retrievers — MultiQuery, ContextualCompression, Ensemble", done: false, tag: "framework",  note: "MultiQueryRetriever: generates 3 query variants → retrieves for each → deduplicates. ContextualCompression: retrieves chunks then compresses them to only relevant sentences. EnsembleRetriever: combines BM25 + vector retriever with weighted scores. All are drop-in replacements for db.as_retriever() — same interface, smarter retrieval." },
      { id: 35, text: "Multi-document RAG — multiple sources, citations", done: true,  tag: "done",      note: "Done in RAGBot. Now add source attribution: every answer should say 'Source: document_name.pdf, page 3'. Store source metadata with each chunk. After retrieval, extract unique sources and append to answer. Makes the product trustworthy — users can verify answers." },
      { id: 36, text: "Conversational RAG — chat history + retrieval memory", done: false, tag: "important",  note: "Problem: 'Tell me more about that' — retriever doesn't know what 'that' refers to. Solution: reformulate the question using chat history before retrieval. LangChain: create_history_aware_retriever(llm, retriever, contextualize_q_prompt). Store history: last 5 messages in Redis or PostgreSQL. Include in API: messages: [{role, content}] list per session_id." },
    ]
  },
  {
    key: "langsmith", phase: "05", label: "LANGSMITH — OBSERVABILITY", color: C.langsmith,
    goal: "See inside your pipeline. Measure before you optimize. Catch bad retrievals.",
    diagram: {
      title: "Observability + Evaluation Loop",
      sections: [
        {
          heading: "What LangSmith Shows You",
          color: C.langsmith,
          rows: [
            { label: "Trace tree", detail: "Every chain step: input → output, latency, token count, cost" },
            { label: "Retrieved chunks", detail: "Exactly which 5 chunks were passed to the LLM" },
            { label: "Prompt sent", detail: "The full prompt including system + context + query" },
            { label: "LLM output", detail: "Raw response before parsing" },
            { label: "Total cost", detail: "$0.0023 per call — aggregate per day/user" },
          ]
        },
        {
          heading: "Evaluation Pipeline",
          color: "#60a5fa",
          flow: ["Build test set: 20 Q+A pairs", "→ Run RAG pipeline on all 20", "→ Ragas: score faithfulness, relevancy", "→ Identify lowest scoring answers", "→ LangSmith trace → find bad chunk", "→ Fix: chunking? prompt? retriever?", "→ Re-run eval → compare scores"],
        },
        {
          heading: "Setup (5 minutes)",
          color: C.foundation,
          rows: [
            { label: ".env", detail: "LANGCHAIN_TRACING_V2=true\nLANGCHAIN_API_KEY=ls__xxx\nLANGCHAIN_PROJECT=ragbot-eval" },
            { label: "That's it", detail: "Any LangChain chain you run is automatically traced. Go to smith.langchain.com to see it." },
          ]
        }
      ]
    },
    items: [
      { id: 37, text: "LangSmith setup — trace every LangChain call automatically", done: false, tag: "tooling",   note: "Add 3 lines to .env: LANGCHAIN_TRACING_V2=true, LANGCHAIN_API_KEY=your_key, LANGCHAIN_PROJECT=my_project. Every LangChain chain run is now automatically traced. No code changes needed. Go to smith.langchain.com and see the full trace tree: what was retrieved, what prompt was sent, what came back, how many tokens, cost per call." },
      { id: 38, text: "Trace analysis — read trace trees, find bad retrievals", done: false, tag: "important", note: "Open any failing answer in LangSmith. Expand the trace: click 'Retriever' → see the 5 chunks retrieved. Are they relevant? If no: your retrieval strategy is wrong (try hybrid search or reranking). Click 'LLM' → see the full prompt. Is the context actually helpful? If bad chunks were passed, even perfect prompting can't save it. This is how you debug RAG." },
      { id: 39, text: "Dataset creation + Ragas evaluation runs", done: false, tag: "important", note: "Create 20-50 golden Q&A pairs manually from your test documents. dataset = Dataset.from_dict({'question': [...], 'answer': [...], 'contexts': [...], 'ground_truth': [...]}). result = evaluate(dataset, metrics=[faithfulness, answer_relevancy, context_precision, context_recall]). Target: faithfulness > 0.8, answer_relevancy > 0.75. Below that — your RAG needs work." },
      { id: 40, text: "Prompt versioning — A/B test system prompts, track scores", done: false, tag: "advanced", note: "LangSmith Hub: push prompts with version tags (v1, v2, production). Run eval with prompt_v1 → score 0.72. Run with prompt_v2 → score 0.81. Promote v2 to production. This is how teams iterate on AI quality without guessing. from langchain import hub; prompt = hub.pull('shahjan/ragbot-system-prompt:v2')." },
    ]
  },
  {
    key: "agents", phase: "06", label: "LLM AGENTS & LANGGRAPH", color: C.agents,
    goal: "Build AI systems that make decisions, not just answer questions",
    diagram: {
      title: "Agents: From ReAct Loop to LangGraph",
      sections: [
        {
          heading: "ReAct Agent Loop",
          color: C.agents,
          flow: ["User: 'Summarize last 3 news articles about AI'", "→ LLM thinks: 'I need to search the web'", "→ Calls tool: web_search('AI news today')", "→ Observes: [article1, article2, article3]", "→ LLM thinks: 'Now I can summarize'", "→ Generates final answer", "→ Loop done"],
        },
        {
          heading: "LangGraph Node Structure",
          color: "#60a5fa",
          rows: [
            { label: "State (TypedDict)", detail: "class State: query: str; docs: list; answer: str; grade: str" },
            { label: "Nodes (functions)", detail: "def retrieve(state): ...; def grade_docs(state): ...; def generate(state): ..." },
            { label: "Edges (routing)", detail: "If grade='relevant' → generate. If grade='irrelevant' → rewrite_query" },
            { label: "Graph", detail: "graph.add_node('retrieve', retrieve). graph.add_conditional_edges('grade', route_fn)" },
          ]
        },
        {
          heading: "Corrective RAG (CRAG) — your portfolio project",
          color: C.rag,
          flow: ["Query in", "→ [retrieve] fetch top-5 chunks", "→ [grade_docs] LLM: are these relevant? (yes/no)", "→ if no: [rewrite_query] → loop back to retrieve", "→ if yes: [generate] build answer with context", "→ [grade_answer] is answer grounded? (hallucination check)", "→ if no: regenerate; if yes: output answer"],
        }
      ]
    },
    items: [
      { id: 41, text: "What agents are — ReAct pattern, tool calling, planning loop", done: false, tag: "theory",   note: "An agent is an LLM that can call tools (functions) in a loop until it decides it's done. ReAct = Reason + Act. Step 1: LLM reasons about what to do. Step 2: LLM calls a tool (search, calculator, database). Step 3: LLM observes the result. Step 4: repeat until done. Different from RAG: RAG is a fixed pipeline. Agent decides its own steps dynamically." },
      { id: 42, text: "Function/tool calling — JSON schemas, structured outputs", done: false, tag: "core",     note: "Define tools as JSON schemas: {name: 'search_web', description: '...', parameters: {query: {type: string}}}. Pass to API: openai.chat.completions.create(tools=[search_tool], tool_choice='auto'). Model returns: {tool_calls: [{function: {name: 'search_web', arguments: '{\"query\": \"AI news\"}'}}]}. Parse → call real function → pass result back as tool message. This is how all agents work under the hood." },
      { id: 43, text: "Simple agent from scratch — without any framework", done: false, tag: "important", note: "Build a loop: while True: response = llm.chat(messages); if response.tool_calls: result = execute_tool(response.tool_calls[0]); messages.append(tool_result); else: return response.content. Tools: get_current_time(), search_docs(query), calculate(expr). Building this raw makes LangGraph make complete sense. Don't skip this step." },
      { id: 44, text: "LangGraph — nodes, edges, State, conditional routing", done: false, tag: "critical",  note: "LangGraph is for when your AI needs to make decisions. State flows through a graph of nodes. Each node is a Python function that reads state and returns updated state. Edges are conditional: def route(state): return 'generate' if state['grade']=='good' else 'rewrite'. This pattern handles: retry logic, multi-step reasoning, human-in-the-loop, parallel branches. Hottest AI engineering skill right now in 2026." },
      { id: 45, text: "Corrective RAG with LangGraph (CRAG) — your killer project", done: false, tag: "critical",  note: "The project that gets you hired: build CRAG. Nodes: retrieve → grade_docs → [rewrite_query | generate] → grade_answer. grade_docs: pass retrieved chunks to LLM with prompt 'Are these chunks relevant to the query? Answer yes or no.' If no → rewrite query → retrieve again (max 3 retries). If yes → generate. grade_answer: 'Is this answer supported by the context? yes/no.' This is production-grade AI engineering." },
      { id: 46, text: "Multi-agent routing — router node dispatches to specialists", done: false, tag: "advanced", note: "Build a router: classify query type → route to specialist agent. Router prompt: 'Is this question about [code, data, general knowledge, web search]? Return one word.' Then: if code → CodeAgent (uses Python REPL tool); if data → DataAgent (uses SQL tool); if web → WebAgent (uses search tool). Assemble results. This is how real enterprise AI systems are built." },
    ]
  },
  {
    key: "deployment", phase: "07", label: "DEPLOYMENT & MLOPS", color: C.deployment,
    goal: "Ship AI features to production with monitoring, CI/CD, and cost tracking",
    diagram: {
      title: "Production AI Deployment Pipeline",
      sections: [
        {
          heading: "CI/CD Pipeline",
          color: C.deployment,
          flow: ["git push origin main", "→ GitHub Actions triggers (.github/workflows/deploy.yml)", "→ Run pytest (unit + integration tests)", "→ docker build -t ragbot:$SHA .", "→ docker push ghcr.io/shahjan/ragbot:$SHA", "→ Railway/EC2: pull new image + restart", "→ Health check: GET /health → 200", "→ Sentry alert if error rate spikes"],
        },
        {
          heading: "Dockerfile for AI App",
          color: "#94a3b8",
          rows: [
            { label: "Stage 1: builder", detail: "FROM python:3.11-slim AS builder\nRUN pip install --user -r requirements.txt" },
            { label: "Stage 2: runtime", detail: "FROM python:3.11-slim\nCOPY --from=builder /root/.local /root/.local\nCMD [\"uvicorn\", \"main:app\"]" },
            { label: "Why multi-stage", detail: "Build tools (gcc, build-essential) don't go in final image. 200MB → 80MB." },
          ]
        },
        {
          heading: "AWS for AI Apps",
          color: C.llm,
          rows: [
            { label: "S3", detail: "Store uploaded PDFs. s3.upload_file(path, bucket, key). Pre-signed URLs for direct client upload." },
            { label: "EC2 (t3.medium)", detail: "Host FastAPI + Celery workers. Use spot instances to cut cost by 70%." },
            { label: "IAM Role", detail: "EC2 instance role can read S3 — no hardcoded keys ever." },
            { label: "RDS (Postgres)", detail: "Managed PostgreSQL with pgvector. Automated backups. Easier than self-hosting." },
          ]
        }
      ]
    },
    items: [
      { id: 47, text: "Docker — Dockerfiles from scratch, multi-stage builds", done: false, tag: "critical",  note: "FROM python:3.11-slim. WORKDIR /app. COPY requirements.txt . RUN pip install -r requirements.txt. COPY . . CMD ['uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000']. Multi-stage: separate builder (installs deps) from runtime (runs app). Reduces image size. Add .dockerignore: __pycache__, .env, .git, *.pyc. Every AI app ships in Docker now." },
      { id: 48, text: "Docker Compose — multi-service local dev stack", done: true,  tag: "done",     note: "You use this already. Go deeper: healthcheck: test: ['CMD', 'curl', '-f', 'http://localhost:8000/health']. depends_on with condition: service_healthy. Named volumes for PostgreSQL data persistence. Environment variable files: env_file: .env. Restart policies: restart: unless-stopped." },
      { id: 49, text: "Deploy live — Railway/Render/EC2 with domain + HTTPS", done: true,  tag: "done",     note: "TableFlow on Railway. Now deploy RAGBot as a live public demo. Custom subdomain (ragbot.yourdomain.com). Railway auto-provisions HTTPS. For EC2: use Nginx as reverse proxy (SSL termination) → forwards to uvicorn on port 8000. Let's Encrypt for free SSL." },
      { id: 50, text: "Environment management — secrets in prod, never in git", done: true,  tag: "done",     note: "Local: .env file (in .gitignore). Railway/Render: platform env vars. EC2: AWS SSM Parameter Store or Secrets Manager → app reads at startup. Never: os.environ['KEY'] = 'hardcoded'. Pattern: settings = pydantic.BaseSettings() — auto-reads from env vars." },
      { id: 51, text: "CI/CD — GitHub Actions auto-deploy on push to main", done: false, tag: "important", note: "Create .github/workflows/deploy.yml. on: push: branches: [main]. jobs: test: runs-on: ubuntu-latest. steps: checkout, setup-python, pip install, pytest. deploy: needs: test. SSH to EC2 or use Railway CLI. 1 day to set up, saves hours every week. Shows maturity in your GitHub profile." },
      { id: 52, text: "AWS — EC2, S3, IAM roles for AI app hosting", done: false, tag: "important", note: "S3: store PDFs that users upload to your RAG app. boto3.client('s3').upload_fileobj(file, BUCKET, key). EC2 t3.medium: 2 vCPU, 4GB RAM — enough for FastAPI + Celery worker. IAM role on EC2: attach S3ReadWrite policy — no API keys needed in code, AWS handles auth automatically. Learn: security groups, key pairs, elastic IP." },
      { id: 53, text: "Monitoring — structured logs, Sentry, token cost tracking", done: false, tag: "important", note: "Structured logging: import structlog; log.info('llm_call', tokens=1234, latency_ms=2300, cost_usd=0.006). Sentry: sentry_sdk.init(dsn=...) — catches unhandled exceptions in prod, sends email alert. Track LLM costs: log every API call's token count → aggregate per user per day → alert if exceeding budget. Add /health endpoint that checks DB + Redis connectivity." },
    ]
  },
  {
    key: "system", phase: "08", label: "SYSTEM DESIGN FOR AI APPS", color: C.system,
    goal: "Design AI systems that are fast, cheap, scalable, and multi-tenant safe",
    diagram: {
      title: "Production AI SaaS Architecture",
      sections: [
        {
          heading: "Request Lifecycle with All Optimizations",
          color: C.system,
          flow: ["Client POST /chat {query, session_id}", "→ Rate limiter (10 req/min per user)", "→ Semantic cache: Redis lookup (cosine sim > 0.95) → HIT: return cached answer (0ms)", "→ MISS: Celery task dispatched", "→ RAG pipeline: hybrid search + rerank", "→ LLM call (stream=True)", "→ SSE stream tokens to client", "→ Store answer in Redis cache (TTL 1hr)", "→ Log: tokens, latency, cost, user_id"],
        },
        {
          heading: "Multi-Tenancy Architecture",
          color: "#60a5fa",
          rows: [
            { label: "Database isolation", detail: "Every query filtered by user_id. Row-level security in PostgreSQL." },
            { label: "Vector namespace", detail: "Chroma: collection per user. FAISS: separate index file per user." },
            { label: "Redis namespace", detail: "cache:{user_id}:{query_hash} → no cross-user cache contamination" },
            { label: "S3 prefix", detail: "s3://bucket/user-{uid}/docs/ — IAM policy restricts user to their prefix" },
          ]
        },
        {
          heading: "Cost Optimization",
          color: C.llm,
          rows: [
            { label: "Semantic cache", detail: "Cache similar queries. 1000 users ask similar things → 60-80% API cost savings" },
            { label: "Smaller models", detail: "GPT-4o-mini for retrieval grading. GPT-4o only for final answer." },
            { label: "Batch embeddings", detail: "Embed 100 chunks in one API call, not 100 calls. 10x faster, same cost." },
            { label: "Chunk dedup", detail: "Hash chunks before storing. Same doc uploaded twice → skip re-embedding." },
          ]
        }
      ]
    },
    items: [
      { id: 54, text: "Async architecture — async/await, non-blocking LLM calls", done: false, tag: "core",     note: "LLM calls block for 5-30s. In Django (sync): server thread is blocked, can't handle other requests. In FastAPI (async): async def chat() → await openai.chat.completions.acreate() → thread is freed while waiting → handles other requests concurrently. async + streaming = users see tokens appear immediately instead of waiting 10s for full response." },
      { id: 55, text: "Semantic caching — cache by similarity not exact match", done: false, tag: "advanced", note: "Redis stores: {query_embedding: vector, answer: text}. New query arrives → embed it → compare with cached embeddings (cosine sim). If similarity > 0.95: return cached answer (instant). If < 0.95: run full RAG pipeline → cache result. Tool: GPTCache library or build with Redis + FAISS. Result: ~60% API cost reduction for SaaS with many similar queries." },
      { id: 56, text: "Rate limiting + cost management — token budgets per user", done: false, tag: "important", note: "FastAPI: from slowapi import Limiter; @limiter.limit('10/minute'). Per-user token tracking: Redis INCR user:{uid}:tokens:2026-06-14 → if > 50000: return 429 with 'Daily limit reached'. Exponential backoff on OpenAI 429 errors: wait 1s, 2s, 4s, 8s before retrying. Log every call's token count for cost attribution." },
      { id: 57, text: "Streaming responses — SSE/WebSocket to frontend", done: false, tag: "important", note: "FastAPI SSE: async def stream_chat(): async for chunk in llm.astream(messages): yield f'data: {chunk}\\n\\n'. Frontend: const evtSource = new EventSource('/chat/stream'); evtSource.onmessage = e => appendToken(e.data). Effect: user sees tokens appear word by word. Feels 10x more responsive even if total time is identical. Critical for chat UI." },
      { id: 58, text: "Multi-tenancy — isolate data per client, namespace everything", done: false, tag: "critical",  note: "This is the RAGBot core architecture. Every DB query: WHERE user_id = current_user.id. PostgreSQL RLS: CREATE POLICY user_isolation ON documents FOR ALL USING (user_id = current_user_id()). Vector DB: Chroma collection per user OR metadata filter on every query. Redis keys: 'cache:{user_id}:{hash}'. S3: 'users/{user_id}/docs/'. Never mix user data." },
      { id: 59, text: "Scalability — workers, queues, caching layers", done: false, tag: "advanced", note: "Bottlenecks in AI apps: 1) Embedding large docs (CPU) → Celery workers, horizontal scale. 2) LLM API calls (IO) → async, connection pooling. 3) Vector search (RAM) → FAISS index sharding or Qdrant cluster. 4) Repeated queries (API cost) → semantic cache. Scale order: first cache, then async, then horizontal scale. Adding workers is easy; caching has the highest ROI." },
    ]
  },
];

const extras = [
  { text: "Selenium — production scraper built", color: C.foundation },
  { text: "BeautifulSoup — HTML parsing", color: C.foundation },
  { text: "MongoDB + Mongoose (Node.js)", color: C.backend },
  { text: "Express.js — Node backend", color: C.backend },
  { text: "React 18 + TypeScript + Vite + Tailwind", color: C.rag },
  { text: "Arduino + ESP32 IoT hands-on", color: C.llm },
  { text: "Cybersecurity — Nmap, Metasploit, web vulns", color: C.agents },
  { text: "B2B SaaS — RAGBot (live product)", color: C.deployment },
  { text: "Event mgmt — 80+ volunteers", color: C.system },
];

const bonusSkills = [
  { text: "LangGraph — stateful multi-agent workflows", color: C.agents },
  { text: "Qdrant / Weaviate — prod vector DB", color: C.rag },
  { text: "vLLM — serve OSS LLMs on GPU", color: C.llm },
  { text: "pgvector — vector search in PostgreSQL", color: C.deployment },
  { text: "Streamlit — rapid AI demo UIs", color: C.system },
  { text: "Ragas + LangSmith — eval pipeline", color: C.langsmith },
];

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const formatDayDelta = (value) => {
  if (Number.isInteger(value)) return `${value}`;
  return value.toFixed(1).replace(/\.0$/, "");
};

// ─── CALENDAR PLAN ────────────────────────────────────────────────────────────
// Each day: {label, topics: [{text, itemId (optional), phase, isRevision}], phase}
function buildCalendar(startDate) {
  const days = [];
  const add = (label, topics, phase, isRevision = false) =>
    days.push({ label, topics: topics.map(t => typeof t === 'string' ? { text: t, isRevision } : { ...t, isRevision }), phase });

  // Week 1 — Revision blitz (already-done topics, fast)
  add("Day 1", [
    { text: "Python OOP, decorators, generators — revise with examples", itemId: 1 },
    { text: "File I/O, JSON, .env, error handling", itemId: 3 },
  ], C.foundation, true);
  add("Day 2", [
    { text: "Git clean history, branching strategy", itemId: 6 },
    { text: "Linux CLI — grep, pipe, process management", itemId: 7 },
  ], C.foundation, true);
  add("Day 3", [
    { text: "Django ORM deep-dive — select_related, prefetch, annotations", itemId: 8 },
    { text: "DRF — nested serializers, custom permissions", itemId: 9 },
  ], C.backend, true);
  add("Day 4", [
    { text: "JWT auth flow — refresh rotation, logout blacklist", itemId: 10 },
    { text: "Celery + Redis — task retries, chord, chain patterns", itemId: 13 },
  ], C.backend, true);
  add("Day 5", [
    { text: "FastAPI Part 1 — routes, path/query params, Pydantic models", itemId: 15, isRevision: false },
    { text: "FastAPI Part 2 — dependency injection, middleware", itemId: 15 },
  ], C.backend);
  add("Day 6", [
    { text: "FastAPI Part 3 — async endpoints, background tasks, StreamingResponse", itemId: 15 },
    { text: "Rebuild one RAGBot endpoint in FastAPI", itemId: 15 },
  ], C.backend);
  add("Day 7", [
    { text: "REST — implement FastAPI CRUD with PostgreSQL + SQLAlchemy", itemId: 12 },
    { text: "Buffer / review day — catch up anything from week 1", itemId: null },
  ], C.backend);

  // Week 2 — LLM Core
  add("Day 8", [
    { text: "Tokens, context window, temperature — hands-on in OpenAI playground", itemId: 16 },
    { text: "Prompt engineering — zero-shot, few-shot, CoT", itemId: 18 },
  ], C.llm);
  add("Day 9", [
    { text: "OpenAI streaming API — stream tokens in FastAPI", itemId: 17 },
    { text: "Function/tool calling — JSON schemas, parse tool call responses", itemId: 42 },
  ], C.llm);
  add("Day 10", [
    { text: "Embeddings deep — why cosine similarity, model comparison", itemId: 19 },
    { text: "SentenceTransformers — bi-encoder vs cross-encoder difference", itemId: 20 },
  ], C.llm);
  add("Day 11", [
    { text: "HuggingFace Hub — load Mistral-7B, run local inference", itemId: 21 },
    { text: "HF pipeline API — text-generation, embeddings, classification", itemId: 21 },
  ], C.llm);
  add("Day 12", [
    { text: "LLM evaluation metrics — faithfulness, relevancy, precision, recall", itemId: 22 },
    { text: "Ragas library — setup, create test dataset, run evaluation", itemId: 23 },
  ], C.llm);
  add("Day 13", [
    { text: "Build RAG from scratch — PDF → FAISS → answer (no framework)", itemId: 24 },
    { text: "Experiment chunking: 256 vs 512 vs 1024 tokens, compare quality", itemId: 25 },
  ], C.rag);
  add("Day 14", [
    { text: "Chroma DB — persistent storage, metadata filtering", itemId: 26 },
    { text: "Add metadata: user_id, source, created_at to every chunk", itemId: 27 },
  ], C.rag);

  // Week 3 — Advanced RAG
  add("Day 15", [
    { text: "Hybrid Search — implement BM25 with rank_bm25 library", itemId: 28 },
    { text: "RRF fusion — combine BM25 + vector scores into single ranking", itemId: 28 },
  ], C.rag);
  add("Day 16", [
    { text: "Reranking — implement local cross-encoder with SentenceTransformers", itemId: 29 },
    { text: "Cohere Rerank API — compare quality vs local cross-encoder", itemId: 29 },
  ], C.rag);
  add("Day 17", [
    { text: "Parent-Child chunking — store small+large chunks, fetch parent on retrieval", itemId: 30 },
    { text: "HyDE — generate hypothetical answer, embed, use for retrieval", itemId: 31 },
  ], C.rag);
  add("Day 18", [
    { text: "Query decomposition — multi-query retrieval, deduplication", itemId: 32 },
    { text: "Conversational RAG — chat history reformulation before retrieval", itemId: 36 },
  ], C.rag);
  add("Day 19", [
    { text: "LangChain LCEL — pipe syntax, DocumentLoaders, TextSplitters", itemId: 33 },
    { text: "Rebuild basic RAG pipeline using LCEL chains", itemId: 33 },
  ], C.rag);
  add("Day 20", [
    { text: "LangChain Retrievers — MultiQueryRetriever, EnsembleRetriever", itemId: 34 },
    { text: "ContextualCompression — retrieve then compress to relevant sentences", itemId: 34 },
  ], C.rag);
  add("Day 21", [
    { text: "Multi-document RAG with citations — source attribution in every answer", itemId: 35 },
    { text: "Buffer / review — rebuild entire RAG pipeline end-to-end in LangChain", itemId: null },
  ], C.rag);

  // Week 4 — More RAG + LangSmith
  add("Day 22", [
    { text: "LangSmith setup — .env config, run first traced chain", itemId: 37 },
    { text: "Read trace tree — identify which chunks were retrieved for a query", itemId: 38 },
  ], C.langsmith);
  add("Day 23", [
    { text: "Build eval dataset — 20 Q&A pairs from your test documents", itemId: 39 },
    { text: "Run Ragas evaluation — score faithfulness + answer_relevancy", itemId: 39 },
  ], C.langsmith);
  add("Day 24", [
    { text: "Identify 3 low-scoring answers — trace back to root cause in LangSmith", itemId: 38 },
    { text: "Fix: better chunking or reranking → re-run eval → compare scores", itemId: 39 },
  ], C.langsmith);
  add("Day 25", [
    { text: "Prompt versioning — create v1 and v2 system prompts, compare scores", itemId: 40 },
    { text: "Document your evaluation results — add to RAGBot README", itemId: null },
  ], C.langsmith);
  add("Day 26", [
    { text: "ReAct agent theory — understand the think/act/observe loop", itemId: 41 },
    { text: "Function calling — define 3 tools as JSON schemas, test in playground", itemId: 42 },
  ], C.agents);
  add("Day 27", [
    { text: "Build agent from scratch — tool calling loop without any framework", itemId: 43 },
    { text: "Tools: web_search, read_file, calculate — test 5 multi-step queries", itemId: 43 },
  ], C.agents);
  add("Day 28", [
    { text: "Buffer / catch-up day — review agents basics or revisit LangSmith", itemId: null },
    { text: "pgvector — install extension, store+query vectors inside PostgreSQL", itemId: 26 },
  ], C.rag);

  // Week 5 — LangGraph
  add("Day 29", [
    { text: "LangGraph basics — State TypedDict, nodes as functions, graph.compile()", itemId: 44 },
    { text: "Build simplest graph: input → process → output", itemId: 44 },
  ], C.agents);
  add("Day 30", [
    { text: "Conditional edges — add_conditional_edges, routing function", itemId: 44 },
    { text: "Build: retrieve → grade → [rewrite | generate] branching graph", itemId: 44 },
  ], C.agents);
  add("Day 31", [
    { text: "CRAG Part 1 — grade_docs node (LLM scores chunk relevance)", itemId: 45 },
    { text: "CRAG Part 2 — rewrite_query node + loop back to retrieve", itemId: 45 },
  ], C.agents);
  add("Day 32", [
    { text: "CRAG Part 3 — grade_answer node (hallucination check)", itemId: 45 },
    { text: "End-to-end test CRAG with 10 tricky queries, trace in LangSmith", itemId: 45 },
  ], C.agents);
  add("Day 33", [
    { text: "Multi-agent router — classify query → dispatch to RAG or web agent", itemId: 46 },
    { text: "Add tools: RAG tool, web search tool, Python REPL tool", itemId: 46 },
  ], C.agents);
  add("Day 34", [
    { text: "Portfolio: wrap CRAG in FastAPI — /chat endpoint with streaming", itemId: 45 },
    { text: "Add LangSmith tracing to CRAG FastAPI app", itemId: 37 },
  ], C.agents);
  add("Day 35", [
    { text: "Buffer / deep dive — extend CRAG with web search fallback", itemId: null },
    { text: "Write README: architecture diagram + eval scores + setup guide", itemId: null },
  ], C.agents);

  // Week 6 — Deployment
  add("Day 36", [
    { text: "Docker — write Dockerfile for FastAPI + RAG app from scratch", itemId: 47 },
    { text: "Multi-stage build — builder stage for deps, runtime stage for app", itemId: 47 },
  ], C.deployment);
  add("Day 37", [
    { text: "Docker Compose — full stack: FastAPI + PostgreSQL + Redis + Chroma", itemId: 48 },
    { text: "Health checks, volumes, depends_on, named networks", itemId: 48 },
  ], C.deployment);
  add("Day 38", [
    { text: "AWS S3 — create bucket, upload/download with boto3, presigned URLs", itemId: 52 },
    { text: "AWS EC2 — launch t3.medium, security group, SSH in, run Docker", itemId: 52 },
  ], C.deployment);
  add("Day 39", [
    { text: "IAM role on EC2 — attach S3 policy, boto3 uses instance role (no keys)", itemId: 52 },
    { text: "Nginx as reverse proxy — SSL termination → forward to uvicorn:8000", itemId: 52 },
  ], C.deployment);
  add("Day 40", [
    { text: "GitHub Actions CI — run pytest on every push", itemId: 51 },
    { text: "GitHub Actions CD — build Docker, deploy to Railway on push to main", itemId: 51 },
  ], C.deployment);
  add("Day 41", [
    { text: "Sentry setup — SDK init, test error tracking, configure alerts", itemId: 53 },
    { text: "Structured logging — structlog, log every LLM call with tokens + cost", itemId: 53 },
  ], C.deployment);
  add("Day 42", [
    { text: "Deploy RAGBot to EC2 with Docker + Nginx + HTTPS (Let's Encrypt)", itemId: 49 },
    { text: "Smoke test the live deployment — run eval dataset against prod", itemId: null },
  ], C.deployment);

  // Week 7 — System Design
  add("Day 43", [
    { text: "Async deep dive — asyncio, event loop, concurrent LLM calls", itemId: 54 },
    { text: "SSE streaming in FastAPI — stream LLM tokens to frontend", itemId: 57 },
  ], C.system);
  add("Day 44", [
    { text: "Semantic cache — Redis + FAISS index for query similarity lookup", itemId: 55 },
    { text: "Integrate cache into FastAPI RAG endpoint — measure cost savings", itemId: 55 },
  ], C.system);
  add("Day 45", [
    { text: "Rate limiting — slowapi per-user limits, per-day token budget", itemId: 56 },
    { text: "Cost tracking — log tokens per call, aggregate per user, alert on budget", itemId: 56 },
  ], C.system);
  add("Day 46", [
    { text: "Multi-tenancy — PostgreSQL RLS, Chroma namespace, Redis key prefix", itemId: 58 },
    { text: "Test isolation: create 2 users, upload different docs, verify no cross-leak", itemId: 58 },
  ], C.system);
  add("Day 47", [
    { text: "Scalability — profile bottlenecks with locust load test", itemId: 59 },
    { text: "Add Celery workers for embedding jobs — scale horizontally", itemId: 59 },
  ], C.system);
  add("Day 48", [
    { text: "Interview prep — system design: 'design a RAG chatbot for 10k users'", itemId: null },
    { text: "Practice whiteboard: draw the full architecture from memory", itemId: null },
  ], C.system);
  add("Day 49", [
    { text: "Buffer / overflow from any week", itemId: null },
    { text: "Review LangGraph CRAG project — polish, test, document", itemId: null },
  ], C.agents);

  // Week 8 — Polish & Interview Prep
  add("Day 50", [
    { text: "Portfolio review — RAGBot: add eval scores, live demo link, architecture diagram", itemId: null },
    { text: "GitHub cleanup — pin repos, add READMEs, update profile README", itemId: null },
  ], C.foundation);
  add("Day 51", [
    { text: "DSA: Two Pointers + Sliding Window — 4 problems", itemId: null },
    { text: "DSA: Prefix Sum + HashMap patterns — 4 problems", itemId: null },
  ], C.backend);
  add("Day 52", [
    { text: "DSA: Trees — inorder, BFS, height, LCA — 4 problems", itemId: null },
    { text: "DSA: Binary Search patterns — 3 problems", itemId: null },
  ], C.backend);
  add("Day 53", [
    { text: "Interview Q prep: 'Explain RAG in 2 minutes' — practice out loud", itemId: null },
    { text: "Interview Q prep: 'How does LangGraph differ from LangChain?' — practice", itemId: null },
  ], C.rag);
  add("Day 54", [
    { text: "Mock system design: 'Build a document QA system for 1M docs'", itemId: null },
    { text: "Mock system design: 'How do you handle hallucinations in RAG?'", itemId: null },
  ], C.system);
  add("Day 55", [
    { text: "Wellfound applications — apply to 10 AI/backend startups", itemId: null },
    { text: "Update LinkedIn: add LangGraph CRAG project, Ragas eval scores", itemId: null },
  ], C.foundation);
  add("Day 56", [
    { text: "Full review — test your RAG + CRAG apps end to end", itemId: null },
    { text: "Celebrate + plan next month: LlamaIndex, Qdrant, or HF fine-tuning", itemId: null },
  ], C.foundation);

  return days.map((d, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return { ...d, date, dayIndex: i };
  });
}

// ─── TAG STYLES ───────────────────────────────────────────────────────────────
const TAG_STYLE = {
  critical:   { bg: "#f43f5e22", text: "#f43f5e",  label: "CRITICAL" },
  important:  { bg: "#f59e0b18", text: "#f59e0b",  label: "IMPORTANT" },
  advanced:   { bg: "#a78bfa18", text: "#a78bfa",  label: "ADVANCED" },
  framework:  { bg: "#60a5fa18", text: "#60a5fa",  label: "FRAMEWORK" },
  done:       { bg: "#00ff8712", text: "#00ff87",  label: "DONE" },
  core:       { bg: "#22d3ee15", text: "#22d3ee",  label: "CORE" },
  theory:     { bg: "#64748b18", text: "#94a3b8",  label: "THEORY" },
  tooling:    { bg: "#34d39915", text: "#34d399",  label: "TOOLING" },
  foundation: { bg: "#00ff8712", text: "#00ff87",  label: "FOUNDATION" },
  expand:     { bg: "#60a5fa18", text: "#60a5fa",  label: "EXPAND" },
};

// ─── DIAGRAM RENDERER ─────────────────────────────────────────────────────────
function DiagramPanel({ section }) {
  const d = section.diagram;
  if (!d) return null;
  return (
    <div>
      <div style={{ fontSize: 9, color: section.color, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 6 }}>{d.title.toUpperCase()}</div>
      {d.sections.map((sec, si) => (
        <div key={si} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 9, color: sec.color, letterSpacing: "0.1em", fontWeight: 700, marginBottom: 5, paddingBottom: 3, borderBottom: `1px solid ${sec.color}22` }}>
            {sec.heading.toUpperCase()}
          </div>
          {sec.flow && (
            <div>
              {sec.flow.map((f, fi) => (
                <div key={fi} style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{
                    padding: "4px 8px", fontSize: 10,
                    background: fi === 0 || fi === sec.flow.length - 1 ? `${sec.color}15` : "#0a0f15",
                    border: `1px solid ${fi === 0 || fi === sec.flow.length - 1 ? sec.color : "#1a2332"}`,
                    borderRadius: 3,
                    color: fi === 0 || fi === sec.flow.length - 1 ? sec.color : "#94a3b8",
                    fontFamily: "monospace",
                  }}>{f}</div>
                  {fi < sec.flow.length - 1 && <div style={{ width: 1, height: 6, background: "#1a2332", marginLeft: 14 }} />}
                </div>
              ))}
            </div>
          )}
          {sec.rows && sec.rows.map((r, ri) => (
            <div key={ri} style={{ marginBottom: 4, padding: "5px 8px", background: "#0a0f15", border: "1px solid #1a2332", borderRadius: 3, borderLeft: `2px solid ${sec.color}` }}>
              <div style={{ fontSize: 10, color: sec.color, fontWeight: 600, marginBottom: 1 }}>{r.label}</div>
              <div style={{ fontSize: 9, color: "#64748b", lineHeight: 1.4, fontFamily: "monospace" }}>{r.detail}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── CALENDAR COMPONENT ───────────────────────────────────────────────────────
function Calendar({ calDays, calProgress, setCalProgress, startTracking, stopTracking, resetTracking, isTracking, startDate }) {
  // clickedDay = pinned popup; hoveredDay = hover highlight only
  const [clickedDay, setClickedDay] = useState(null);
  const [popupPos, setPopupPos]     = useState({ x: 0, y: 0 });
  const [confirmReset, setConfirmReset] = useState(false);
  const popupRef = useRef(null);
  const [now, setNow] = useState(() => new Date());
  const today = startOfDay(now);

  // Close popup when clicking outside
  useEffect(() => {
    if (clickedDay === null) return;
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setClickedDay(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [clickedDay]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const daysPassed = isTracking ? Math.max(0, Math.floor((today - startDate) / MS_PER_DAY)) : 0;
  const currentDayNumber = Math.min(daysPassed + 1, calDays.length);
  const topicsScheduledByNow = isTracking
    ? calDays.reduce((count, day) => count + (startOfDay(day.date) < today ? day.topics.length : 0), 0)
    : 0;
  const topicsCompletedByNow = isTracking
    ? calDays.reduce((count, day) => count + day.topics.filter((_, ti) => calProgress[`${day.dayIndex}-${ti}`]).length, 0)
    : 0;
  const topicsPerDay = calDays[0]?.topics.length || 1;
  const topicsDelta = topicsCompletedByNow - topicsScheduledByNow;
  const daysDelta = Math.abs(topicsDelta) / topicsPerDay;
  const isAhead = isTracking && topicsDelta > 0;
  const isBehind = isTracking && topicsDelta < 0;

  const toggleCalTopic = (dayIndex, topicIndex) => {
    const key = `${dayIndex}-${topicIndex}`;
    setCalProgress(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getDayStatus = (day) => {
    const date = new Date(day.date); date.setHours(0, 0, 0, 0);
    const allDone  = day.topics.every((_, ti) => calProgress[`${day.dayIndex}-${ti}`]);
    const someDone = day.topics.some ((_, ti) => calProgress[`${day.dayIndex}-${ti}`]);
    const isPast   = isTracking && date < today;
    const isToday  = isTracking && date.getTime() === today.getTime();
    if (allDone)          return "complete";
    if (isPast && !allDone) return "missed";
    if (isToday)          return "today";
    if (someDone)         return "partial";
    return "upcoming";
  };

  const SC = {
    complete: { bg: "#00ff8718", border: "#00ff87", text: "#00ff87" },
    missed:   { bg: "#f43f5e14", border: "#f43f5e", text: "#f43f5e" },
    today:    { bg: "#f59e0b18", border: "#f59e0b", text: "#f59e0b" },
    partial:  { bg: "#60a5fa12", border: "#60a5fa", text: "#60a5fa" },
    upcoming: { bg: "#0d1117",   border: "#1a2332", text: "#475569" },
  };

  // Open popup pinned to the clicked day cell
  const handleDayClick = (di, e) => {
    e.stopPropagation();
    if (clickedDay === di) { setClickedDay(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    // Prefer below; flip above if not enough space
    const spaceBelow = window.innerHeight - rect.bottom;
    const popupH = 260;
    const y = spaceBelow > popupH + 12 ? rect.bottom + 6 : rect.top - popupH - 6;
    const x = Math.min(Math.max(rect.left, 8), window.innerWidth - 316);
    setPopupPos({ x, y });
    setClickedDay(di);
  };

  const activePopup = clickedDay !== null ? calDays[clickedDay] : null;

  return (
    <div style={{ marginTop: 40 }}>
      {/* ── Header + controls ───────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 10, color: "#00ff87", letterSpacing: "0.2em", fontWeight: 700, marginBottom: 3 }}>📅 2-MONTH EXECUTION PLAN</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>56 days · <strong style={{ color: "#94a3b8" }}>click</strong> any day to open its topic list · check topics off inside</div>
        </div>

        {/* Button cluster */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {/* START / STOP toggle */}
          <button
            onClick={isTracking ? stopTracking : startTracking}
            style={{
              padding: "8px 16px",
              background: isTracking
                ? "transparent"
                : "linear-gradient(135deg, #00ff87, #60a5fa)",
              border: isTracking ? "1px solid #f43f5e60" : "none",
              borderRadius: 5, color: isTracking ? "#f43f5e" : "#060a0e",
              fontFamily: "inherit", fontSize: 11, fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.2s",
            }}
          >
            {isTracking ? "⏹ STOP TRACKING" : "▶ START FOLLOWING PLAN"}
          </button>

          {/* RESET */}
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              style={{
                padding: "8px 14px", background: "transparent",
                border: "1px solid #2d3f52", borderRadius: 5, color: "#475569",
                fontFamily: "inherit", fontSize: 11, fontWeight: 600,
                cursor: "pointer", letterSpacing: "0.06em",
              }}
            >↺ RESET</button>
          ) : (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#f59e0b" }}>Sure? This clears calendar progress.</span>
              <button
                onClick={() => { resetTracking(); setConfirmReset(false); setClickedDay(null); }}
                style={{ padding: "6px 10px", background: "#f43f5e22", border: "1px solid #f43f5e60", borderRadius: 4, color: "#f43f5e", fontFamily: "inherit", fontSize: 10, fontWeight: 700, cursor: "pointer" }}
              >YES, RESET</button>
              <button
                onClick={() => setConfirmReset(false)}
                style={{ padding: "6px 10px", background: "#1a2332", border: "1px solid #2d3f52", borderRadius: 4, color: "#64748b", fontFamily: "inherit", fontSize: 10, cursor: "pointer" }}
              >CANCEL</button>
            </div>
          )}

          {/* Status badge when tracking */}
          {isTracking && !confirmReset && (
            <div style={{ fontSize: 10, color: "#00ff87", padding: "6px 10px", background: "#00ff8712", border: "1px solid #00ff8730", borderRadius: 5 }}>
              Day {currentDayNumber} / {calDays.length}
            </div>
          )}
        </div>
      </div>

      {/* ── Schedule health bar ─────────────────────────────────────────── */}
      {isTracking && (
        <div style={{
          padding: "10px 14px", marginBottom: 14,
          background: isAhead ? "#60a5fa10" : isBehind ? "#f43f5e10" : "#00ff8710",
          border: `1px solid ${isAhead ? "#60a5fa28" : isBehind ? "#f43f5e28" : "#00ff8728"}`,
          borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: isAhead ? "#60a5fa" : isBehind ? "#f43f5e" : "#00ff87" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: isAhead ? "#60a5fa" : isBehind ? "#f43f5e" : "#00ff87" }}>
              {isAhead ? "🚀 AHEAD OF SCHEDULE" : isBehind ? "⚠ BEHIND SCHEDULE" : "✓ ON TRACK"}
            </span>
            <span style={{ fontSize: 10, color: "#64748b" }}>
              {isAhead
                ? `${topicsCompletedByNow} topics done → ${formatDayDelta(daysDelta)} day${daysDelta !== 1 ? "s" : ""} ahead`
                : isBehind
                ? `${Math.abs(topicsDelta)} topics missed → ${formatDayDelta(daysDelta)} day${daysDelta !== 1 ? "s" : ""} late`
                : `${topicsCompletedByNow} topics done right on schedule`}
            </span>
          </div>
          <div style={{ fontSize: 10, color: "#475569" }}>
            {topicsCompletedByNow} done · {topicsScheduledByNow} should be done by now
          </div>
        </div>
      )}

      {/* ── Day-of-week headers ──────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 9, color: "#2d3f52", fontWeight: 700, letterSpacing: "0.05em" }}>{d}</div>
        ))}
      </div>

      {/* ── Calendar grid ───────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {calDays.map((day, di) => {
          const status   = getDayStatus(day);
          const sc       = SC[status];
          const doneCnt  = day.topics.filter((_, ti) => calProgress[`${day.dayIndex}-${ti}`]).length;
          const isActive = clickedDay === di;

          return (
            <div
              key={di}
              onClick={(e) => handleDayClick(di, e)}
              style={{
                padding: "6px 5px", borderRadius: 5, cursor: "pointer",
                background: isActive ? `${sc.border}22` : sc.bg,
                border: `1px solid ${isActive ? sc.border : sc.border}`,
                boxShadow: isActive ? `0 0 0 2px ${sc.border}55` : "none",
                minHeight: 54, transition: "all 0.12s", position: "relative",
                userSelect: "none",
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 700, color: sc.text, marginBottom: 1 }}>D{di + 1}</div>
              <div style={{ fontSize: 8, color: "#3d5166", marginBottom: 3 }}>
                {day.date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
              </div>
              <div style={{ fontSize: 8, color: sc.text }}>{doneCnt}/{day.topics.length} ✓</div>
              {status === "missed"   && <div style={{ position: "absolute", top: 3, right: 4, fontSize: 9, color: "#f43f5e", fontWeight: 900 }}>!</div>}
              {status === "complete" && <div style={{ position: "absolute", top: 3, right: 4, fontSize: 10, color: "#00ff87" }}>✓</div>}
              {status === "today"    && <div style={{ position: "absolute", top: 3, right: 4, width: 5, height: 5, borderRadius: "50%", background: "#f59e0b" }} />}
            </div>
          );
        })}
      </div>

      {/* ── Pinned popup (renders in-flow below the grid) ────────────────── */}
      {activePopup && (
        <div
          ref={popupRef}
          style={{
            position: "fixed",
            left: popupPos.x,
            top: popupPos.y,
            zIndex: 1200,
            width: 308,
            background: "#0b1118",
            border: `1px solid ${SC[getDayStatus(activePopup)].border}`,
            borderRadius: 8, padding: 14,
            boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
            animation: "fadeIn 0.13s ease",
          }}
        >
          {/* Popup header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: SC[getDayStatus(activePopup)].text }}>
                DAY {clickedDay + 1}
              </span>
              <span style={{ fontSize: 10, color: "#475569", marginLeft: 8 }}>
                {activePopup.date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
              </span>
            </div>
            <button
              onClick={() => setClickedDay(null)}
              style={{ background: "none", border: "none", color: "#475569", fontSize: 16, cursor: "pointer", lineHeight: 1 }}
            >×</button>
          </div>

          {/* Topic checklist — fully interactive */}
          {activePopup.topics.map((topic, ti) => {
            const key  = `${clickedDay}-${ti}`;
            const done = calProgress[key];
            return (
              <div
                key={ti}
                onClick={() => toggleCalTopic(clickedDay, ti)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 8,
                  padding: "7px 6px", borderRadius: 4,
                  borderBottom: ti < activePopup.topics.length - 1 ? "1px solid #0f1923" : "none",
                  cursor: "pointer", transition: "background 0.1s",
                  background: done ? "#00ff8708" : "transparent",
                }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 14, height: 14, minWidth: 14, marginTop: 1,
                  border: `1.5px solid ${done ? "#00ff87" : "#2d3f52"}`,
                  borderRadius: 3, background: done ? "#00ff87" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.12s", flexShrink: 0,
                }}>
                  {done && <span style={{ color: "#060a0e", fontSize: 9, fontWeight: 900 }}>✓</span>}
                </div>
                {/* Text */}
                <span style={{
                  fontSize: 10, lineHeight: 1.5,
                  color: done ? "#3d5166" : topic.isRevision ? "#64748b" : "#cbd5e1",
                  textDecoration: done ? "line-through" : "none",
                }}>
                  {topic.isRevision && <span style={{ color: "#2d4055", marginRight: 3 }}>[REV]</span>}
                  {topic.text}
                </span>
              </div>
            );
          })}

          {/* Progress mini-bar inside popup */}
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 2, background: "#1a2332", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 2, background: SC[getDayStatus(activePopup)].border,
                width: `${(activePopup.topics.filter((_, ti) => calProgress[`${clickedDay}-${ti}`]).length / activePopup.topics.length) * 100}%`,
                transition: "width 0.3s",
              }} />
            </div>
            <span style={{ fontSize: 9, color: "#475569" }}>
              {activePopup.topics.filter((_, ti) => calProgress[`${clickedDay}-${ti}`]).length}/{activePopup.topics.length}
            </span>
          </div>
        </div>
      )}

      {/* ── Legend ───────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14 }}>
        {[
          { color: "#00ff87", label: "Complete" },
          { color: "#f43f5e", label: "Missed" },
          { color: "#f59e0b", label: "Today" },
          { color: "#60a5fa", label: "Partial" },
          { color: "#475569", label: "Upcoming" },
        ].map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#64748b" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: `${l.color}18`, border: `1px solid ${l.color}` }} />
            {l.label}
          </div>
        ))}
        <div style={{ fontSize: 10, color: "#2d3f52" }}>· [REV] = revision · click any day cell to open</div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function Roadmap() {
  // Load from storage
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          checked: parsed.checked || {},
          expanded: parsed.expanded || Object.fromEntries(roadmapData.map(s => [s.key, true])),
          diagOpen: parsed.diagOpen || Object.fromEntries(roadmapData.map(s => [s.key, true])),
          calProgress: parsed.calProgress || {},
          isTracking: parsed.isTracking || false,
          hasTrackingStarted: parsed.hasTrackingStarted ?? parsed.isTracking ?? false,
          trackingStart: parsed.trackingStart ? new Date(parsed.trackingStart) : new Date(),
        };
      }
    } catch (e) {}
    const defaultChecked = {};
    roadmapData.forEach(s => s.items.forEach(item => { defaultChecked[item.id] = item.done; }));
    return {
      checked: defaultChecked,
      expanded: Object.fromEntries(roadmapData.map(s => [s.key, true])),
      diagOpen: Object.fromEntries(roadmapData.map(s => [s.key, true])),
      calProgress: {},
      isTracking: false,
      hasTrackingStarted: false,
      trackingStart: new Date(),
    };
  });

  const { checked, expanded, diagOpen, calProgress, isTracking, trackingStart, hasTrackingStarted } = state;

  // Save to storage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...state,
        trackingStart: state.trackingStart.toISOString(),
      }));
    } catch (e) {}
  }, [state]);

  const updateState = (patch) => setState(prev => ({ ...prev, ...patch }));

  const toggleCheck = (id) => setState(prev => ({ ...prev, checked: { ...prev.checked, [id]: !prev.checked[id] } }));
  const toggleSection = (key) => setState(prev => ({ ...prev, expanded: { ...prev.expanded, [key]: !prev.expanded[key] } }));
  const toggleDiag = (key) => setState(prev => ({ ...prev, diagOpen: { ...prev.diagOpen, [key]: !prev.diagOpen[key] } }));
  const setCalProgress = (fn) => setState(prev => ({ ...prev, calProgress: typeof fn === "function" ? fn(prev.calProgress) : fn }));

  const startTracking = () => {
    const today = startOfDay(new Date());
    setState(prev => ({
      ...prev,
      isTracking: true,
      hasTrackingStarted: true,
      trackingStart: prev.hasTrackingStarted ? prev.trackingStart : today,
    }));
  };

  const stopTracking = () => updateState({ isTracking: false });

  const resetTracking = () => updateState({
    calProgress: {},
    isTracking: false,
    hasTrackingStarted: false,
    trackingStart: startOfDay(new Date()),
  });

  const [activeNote, setActiveNote] = useState(null);

  const allItems = roadmapData.flatMap(s => s.items);
  const totalItems = allItems.length;
  const doneItems = allItems.filter(i => checked[i.id]).length;
  const percent = Math.round((doneItems / totalItems) * 100);

  const startDate = startOfDay(trackingStart);
  const calDays = buildCalendar(startDate);

  return (
    <div style={{
      minHeight: "100vh", background: "#060a0e",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: "#e2e8f0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: #060a0e; }
        ::-webkit-scrollbar-thumb { background: #00ff87; border-radius: 2px; }
        .sec-hdr:hover { opacity: 0.88; cursor: pointer; }
        .item-row:hover { background: rgba(255,255,255,0.03) !important; }
        .chk:hover { transform: scale(1.15); }
        .bar-fill { transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
        .note-pop { animation: fadeIn 0.12s ease; }
        @keyframes fadeIn { from { opacity:0;transform:translateY(-3px); } to { opacity:1;transform:translateY(0); } }
        .dg-toggle:hover { opacity: 0.65; cursor: pointer; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #0d1117, #0a0f15)",
        borderBottom: "1px solid #1a2332", padding: "28px 20px 20px",
        position: "sticky", top: 0, zIndex: 200,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: "#00ff87", letterSpacing: "0.25em", marginBottom: 4, fontWeight: 700 }}>
                SHAHJAN ALI · CS (CYBER SECURITY) · PARUL UNIVERSITY · 7TH SEM
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1 }}>AI Application Engineer</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 900, color: "#00ff87", lineHeight: 1.2 }}>Complete Roadmap — 10 Weeks</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 900, color: "#00ff87", lineHeight: 1 }}>{percent}%</div>
              <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{doneItems}/{totalItems} done</div>
            </div>
          </div>
          <div style={{ marginTop: 14, background: "#1a2332", borderRadius: 2, height: 3, overflow: "hidden" }}>
            <div className="bar-fill" style={{ height: "100%", width: `${percent}%`, background: "linear-gradient(90deg, #00ff87, #60a5fa, #a78bfa)", borderRadius: 2 }} />
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 10, flexWrap: "wrap" }}>
            {[
              { dot: "#f43f5e", label: "CRITICAL — do first" },
              { dot: "#f59e0b", label: "IMPORTANT" },
              { dot: "#a78bfa", label: "ADVANCED" },
              { dot: "#00ff87", label: "Already done" },
              { dot: "#64748b", label: "Tap ℹ for detailed explanation" },
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#64748b" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: l.dot, display: "inline-block" }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ───────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px 60px" }}>

        {roadmapData.map((section, si) => {
          const sectionDone = section.items.filter(i => checked[i.id]).length;
          const sectionTotal = section.items.length;
          const remaining = sectionTotal - sectionDone;
          const isOpen = expanded[section.key] !== false;
          const isDiagOpen = diagOpen[section.key] !== false;

          // Dynamic timeline label
          const timelineLabel = remaining === 0
            ? "✓ Complete"
            : sectionDone === 0
            ? `${remaining} topics to go`
            : `${remaining} left`;

          return (
            <div key={section.key} style={{ marginTop: si === 0 ? 24 : 28 }}>
              {/* Section header */}
              <div
                className="sec-hdr"
                onClick={() => toggleSection(section.key)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", background: "#0d1117",
                  border: `1px solid ${section.color}22`, borderLeft: `3px solid ${section.color}`,
                  borderRadius: isOpen ? "6px 6px 0 0" : "6px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 900, color: section.color, letterSpacing: "0.2em" }}>
                    PHASE {section.phase}
                  </span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 800, color: "#fff" }}>{section.label}</span>
                  <span style={{
                    fontSize: 9, padding: "2px 7px", borderRadius: 10,
                    background: remaining === 0 ? "#00ff8718" : "#f59e0b15",
                    color: remaining === 0 ? "#00ff87" : "#f59e0b",
                    border: `1px solid ${remaining === 0 ? "#00ff8730" : "#f59e0b25"}`,
                    fontWeight: 700,
                  }}>{timelineLabel}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, color: "#64748b" }}>{sectionDone}/{sectionTotal}</span>
                  <div style={{ width: 44, height: 3, background: "#1a2332", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${(sectionDone / sectionTotal) * 100}%`, height: "100%", background: section.color, transition: "width 0.4s" }} />
                  </div>
                  <span style={{ color: "#64748b", fontSize: 11, transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", display: "inline-block", transition: "transform 0.2s" }}>▼</span>
                </div>
              </div>

              {isOpen && (
                <div style={{
                  display: "grid", gridTemplateColumns: "280px 1fr",
                  border: `1px solid ${section.color}15`, borderTop: "none",
                  borderRadius: "0 0 6px 6px", overflow: "hidden",
                }}>
                  {/* LEFT — diagram */}
                  <div style={{ background: "#070b0f", borderRight: `1px solid ${section.color}15` }}>
                    <div style={{ padding: "10px 12px", borderBottom: `1px solid ${section.color}12`, background: `${section.color}07` }}>
                      <div style={{ fontSize: 9, color: section.color, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 3 }}>GOAL</div>
                      <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}>{section.goal}</div>
                    </div>
                    <div className="dg-toggle" onClick={() => toggleDiag(section.key)}
                      style={{ padding: "6px 12px", borderBottom: "1px solid #1a2332", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 9, color: "#2d3f52", letterSpacing: "0.1em" }}>FLOW / DIAGRAMS / HOW IT WORKS</span>
                      <span style={{ fontSize: 12, color: "#2d3f52" }}>{isDiagOpen ? "−" : "+"}</span>
                    </div>
                    {isDiagOpen && (
                      <div style={{ padding: "10px 12px 14px", overflowY: "auto" }}>
                        <DiagramPanel section={section} />
                      </div>
                    )}
                  </div>

                  {/* RIGHT — checklist */}
                  <div>
                    {section.items.map((item, idx) => {
                      const isDone = checked[item.id];
                      const ts = TAG_STYLE[item.tag] || TAG_STYLE.core;
                      const isNoteOpen = activeNote === item.id;
                      return (
                        <div key={item.id}>
                          <div
                            className="item-row"
                            onClick={() => { toggleCheck(item.id); setActiveNote(null); }}
                            style={{
                              display: "flex", alignItems: "flex-start", gap: 10,
                              padding: "9px 12px", cursor: "pointer",
                              background: idx % 2 === 0 ? "#0a0f15" : "#080c10",
                              borderTop: idx === 0 ? "none" : "1px solid #0c1520",
                            }}
                          >
                            <div className="chk" style={{
                              width: 15, height: 15, minWidth: 15, marginTop: 1,
                              border: `1.5px solid ${isDone ? section.color : "#2d3f52"}`,
                              borderRadius: 3, background: isDone ? section.color : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all 0.15s",
                            }}>
                              {isDone && <span style={{ color: "#060a0e", fontSize: 9, fontWeight: 900 }}>✓</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                              <span style={{
                                fontSize: 12, lineHeight: 1.5,
                                color: isDone ? "#3d5166" : "#cbd5e1",
                                textDecoration: isDone ? "line-through" : "none",
                                transition: "all 0.2s",
                              }}>{item.text}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: "fit-content" }}>
                              <span style={{ fontSize: 9, padding: "2px 5px", borderRadius: 3, fontWeight: 700, letterSpacing: "0.06em", background: ts.bg, color: ts.text }}>{ts.label}</span>
                              <span
                                title="Click for detailed explanation"
                                onClick={e => { e.stopPropagation(); setActiveNote(isNoteOpen ? null : item.id); }}
                                style={{ fontSize: 13, color: isNoteOpen ? section.color : "#2d3f52", cursor: "pointer", userSelect: "none", transition: "color 0.15s" }}
                              >ℹ</span>
                            </div>
                          </div>
                          {isNoteOpen && (
                            <div className="note-pop" style={{
                              padding: "8px 12px 8px 36px",
                              background: `${section.color}07`,
                              borderLeft: `2px solid ${section.color}`,
                              borderTop: `1px solid ${section.color}18`,
                              fontSize: 11, color: "#94a3b8", lineHeight: 1.65,
                            }}>{item.note}</div>
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

        {/* ── CALENDAR ───────────────────────────────────────────────────── */}
        <Calendar
          calDays={calDays}
          calProgress={calProgress}
          setCalProgress={setCalProgress}
          startTracking={startTracking}
          stopTracking={stopTracking}
          resetTracking={resetTracking}
          isTracking={isTracking}
          startDate={startDate}
        />

        {/* ── EXTRA SKILLS ─────────────────────────────────────────────── */}
        <div style={{ marginTop: 40 }}>
          <div style={{ fontSize: 10, color: "#00ff87", letterSpacing: "0.2em", fontWeight: 700, marginBottom: 4 }}>⚡ EXTRA SKILLS YOU ALREADY HAVE</div>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 10 }}>Not on the standard checklist — but they differentiate you.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "12px", background: "#0d1117", border: "1px solid #1a2332", borderRadius: 6 }}>
            {extras.map((e, i) => (
              <span key={i} style={{ background: `${e.color}12`, color: e.color, border: `1px solid ${e.color}28`, fontSize: 10, padding: "3px 9px", borderRadius: 4, fontWeight: 600 }}>✓ {e.text}</span>
            ))}
          </div>
        </div>

        {/* ── BONUS SKILLS ─────────────────────────────────────────────── */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, color: "#f43f5e", letterSpacing: "0.2em", fontWeight: 700, marginBottom: 4 }}>🚀 BONUS SKILLS — DO 2–3 AND YOU'RE TOP 5%</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "12px", background: "#0d1117", border: "1px solid #f43f5e15", borderRadius: 6 }}>
            {bonusSkills.map((e, i) => (
              <span key={i} style={{ background: `${e.color}12`, color: e.color, border: `1px solid ${e.color}28`, fontSize: 10, padding: "3px 9px", borderRadius: 4, fontWeight: 600 }}>+ {e.text}</span>
            ))}
          </div>
        </div>

        {/* ── SALARY ───────────────────────────────────────────────────── */}
        <div style={{ marginTop: 20, padding: "16px 18px", background: "linear-gradient(135deg, #00ff8707,#60a5fa06)", border: "1px solid #00ff8718", borderRadius: 6 }}>
          <div style={{ fontSize: 10, color: "#00ff87", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>WHERE THIS GETS YOU — 2026 MARKET</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "First Job (you now)", val: "₹8–12 LPA", sub: "RAGBot + FastAPI done" },
              { label: "2 Years In", val: "₹18–35 LPA", sub: "LangGraph + agents + evals" },
              { label: "5 Years In", val: "₹40–70 LPA", sub: "LLM systems architect" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "10px", background: "#0d1117", borderRadius: 5, border: "1px solid #1a2332" }}>
                <div style={{ fontSize: 9, color: "#64748b", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: "#00ff87" }}>{s.val}</div>
                <div style={{ fontSize: 9, color: "#475569", marginTop: 3 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 10, color: "#1a2332" }}>
          progress auto-saved · tap items to track · tap ℹ for details · built for shahjan ali · june 2026
        </div>
      </div>
    </div>
  );
}
