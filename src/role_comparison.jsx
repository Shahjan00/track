import { useState } from "react";

const roles = [
  { id: "ai_eng", label: "AI Engineer", short: "AI Eng", color: "#00ff87", icon: "⚡" },
  { id: "ml_eng", label: "ML Engineer", short: "ML Eng", color: "#f59e0b", icon: "🧠" },
  { id: "aiml", label: "AI/ML Research", short: "AI/ML", color: "#a78bfa", icon: "🔬" },
  { id: "mlops", label: "MLOps Engineer", short: "MLOps", color: "#22d3ee", icon: "⚙️" },
  { id: "backend", label: "Backend Dev", short: "Backend", color: "#60a5fa", icon: "🛠️" },
  { id: "devops", label: "DevOps/SRE", short: "DevOps", color: "#fb923c", icon: "🔧" },
  { id: "data_sci", label: "Data Scientist", short: "Data Sci", color: "#f43f5e", icon: "📊" },
];

const params = [
  { key: "demand_now", label: "RN Demand (India)", icon: "📈" },
  { key: "demand_future", label: "Future Demand (3–5yr)", icon: "🚀" },
  { key: "campus_placement", label: "Campus Placement Chance", icon: "🎓" },
  { key: "salary_fresher", label: "Fresher Salary (India)", icon: "💰" },
  { key: "salary_3yr", label: "3yr Exp Salary (India)", icon: "💎" },
  { key: "salary_5yr", label: "5yr Exp Salary (India)", icon: "🏆" },
  { key: "abroad_salary", label: "Abroad Salary (US/EU)", icon: "✈️" },
  { key: "abroad_chance", label: "Abroad Job Chances", icon: "🌍" },
  { key: "intl_roi", label: "International ROI", icon: "📊" },
  { key: "learning_curve", label: "Learning Curve", icon: "📚" },
  { key: "entry_barrier", label: "Entry Barrier", icon: "🚧" },
  { key: "stability", label: "Job Stability", icon: "⚓" },
  { key: "risk", label: "Risk Level", icon: "⚠️" },
  { key: "drawback", label: "Key Drawback", icon: "🔴" },
  { key: "automation_risk", label: "AI Automation Risk", icon: "🤖" },
  { key: "startup_fit", label: "Startup Fit", icon: "🔥" },
  { key: "remote_chance", label: "Remote Work Chances", icon: "🏠" },
  { key: "your_fit", label: "Your Fit (Shahjan)", icon: "🎯" },
];

const scoreColors = (score) => {
  if (score >= 85) return "#00ff87";
  if (score >= 65) return "#f59e0b";
  if (score >= 45) return "#fb923c";
  return "#f43f5e";
};

const data = {
  ai_eng: {
    demand_now: { score: 88, text: "Very high. Every startup & enterprise is hiring. Roles called AI Engineer, LLM Engineer, GenAI Dev are exploding. ~10k+ openings in India right now." },
    demand_future: { score: 95, text: "Likely the #1 most demanded role in 2026–2030. As LLMs become infrastructure, someone needs to build on top of them. Not going anywhere." },
    campus_placement: { score: 40, text: "Poor via campus. Most colleges (including tier-2) don't have AI Eng pipelines. You'll almost never land this via campus drive — startups, Wellfound, LinkedIn are the real path." },
    salary_fresher: { score: 80, text: "₹8–15 LPA at startups. Well-funded startups pay ₹15–20 LPA for strong portfolios. MNCs lag behind." },
    salary_3yr: { score: 85, text: "₹20–40 LPA with agent/RAG expertise. Companies paying premium for LLM specialization is real right now." },
    salary_5yr: { score: 90, text: "₹45–80 LPA. LLM specialists at product companies & funded startups. Senior AI Eng at FAANG-India touching ₹1Cr+." },
    abroad_salary: { score: 90, text: "$180k–$280k in US (AI Engineer roles at OpenAI, Anthropic, Google, startups). EU pays €80k–€140k. Canada $130k–$180k CAD." },
    abroad_chance: { score: 82, text: "High if you have RAG/agents/LLM deployment experience. US H1B demand for AI engineers is among the highest right now. Remote-first US roles also accessible." },
    intl_roi: { score: 88, text: "Exceptional. Skills built in India are directly transferable to global market. No extra certifications or degree needed if portfolio is strong." },
    learning_curve: { score: 35, text: "Steep. You need backend + LLM theory + RAG + agents + deployment. Not a single-stack role. But Shahjan, you're already 40–50% there." },
    entry_barrier: { score: 45, text: "Medium-high. No clear degree path. Self-taught advantage is real here — portfolio > degree. But you MUST have deployed AI projects." },
    stability: { score: 72, text: "Decent. Newer role = more volatile. Companies may redefine scope. But demand is so high that finding next job is easy even if current one ends." },
    risk: { score: 55, text: "Medium. Field is moving FAST — skills you learn today may be abstracted in 2 years (LangChain already getting abstracted). Must keep updating." },
    drawback: { score: 0, text: "Constant relearning. LangChain → LangGraph → whatever's next. You can never stop studying. Also, most 'AI Engineer' jobs at low-tier companies are just prompt wrappers." },
    automation_risk: { score: 75, text: "Ironic — low-to-medium. The people building AI tools are less replaceable than those using them. But junior-level AI Eng tasks WILL get automated first." },
    startup_fit: { score: 95, text: "Best fit of all roles. Startups need exactly this stack — one person who can build RAG pipelines AND ship backend APIs. You're a one-person AI team." },
    remote_chance: { score: 88, text: "Excellent. Most AI-first companies are remote-native. US remote roles actively hire India-based engineers at $80k–$140k/yr." },
    your_fit: { score: 92, text: "THIS IS YOUR ROLE. RAGBot is the exact portfolio needed. Django backend + FAISS + embeddings + OpenAI = perfect story. Don't dilute this." },
  },
  ml_eng: {
    demand_now: { score: 72, text: "Solid demand but more saturated than AI Eng. Many ML Eng roles require deep math + PyTorch experience. India market is there but competitive." },
    demand_future: { score: 80, text: "Strong but shifting. Traditional ML (tabular, sklearn) is declining relative to LLM/GenAI. ML Eng who pivots to fine-tuning & model serving is future-proof." },
    campus_placement: { score: 55, text: "Better than AI Eng via campus. Some product companies (Flipkart, Meesho, Swiggy) hire ML Engs via campus. But still minority — mostly direct apply." },
    salary_fresher: { score: 70, text: "₹8–14 LPA. Similar to AI Eng but slightly lower at bottom end without strong math/research background." },
    salary_3yr: { score: 78, text: "₹18–32 LPA. Good ceiling but requires deep specialization (NLP, CV, recommendation systems)." },
    salary_5yr: { score: 82, text: "₹35–65 LPA. Strong ceiling at product companies. Fine-tuning LLMs = ₹60L+ easily." },
    abroad_salary: { score: 88, text: "$160k–$250k in US. ML Eng is one of highest paid roles globally. Strong PyTorch + model training experience required." },
    abroad_chance: { score: 78, text: "High but requires stronger math credentials. MS/PhD preferred for top US companies. Without it, you need exceptional project work." },
    intl_roi: { score: 82, text: "Very good. ML skills are globally portable. But you need deeper math than AI Eng role — linear algebra, probability, optimization." },
    learning_curve: { score: 25, text: "Very steep. Math-heavy (linear algebra, calculus, stats, probability). PyTorch from scratch. Model training pipelines. This is a 2+ year commitment seriously." },
    entry_barrier: { score: 35, text: "High. Most real ML Eng roles ask for strong math + Python + training experience. Campus ML roles almost always filter on CGPA and math scores." },
    stability: { score: 78, text: "Good. Companies that have ML teams rarely shut them down entirely. More stable than pure GenAI roles." },
    risk: { score: 48, text: "Medium. Risk of your specific model type becoming irrelevant (e.g. old CV techniques). Must specialize and keep updating." },
    drawback: { score: 0, text: "High math ceiling. If you don't enjoy calculus and probability deeply, this will feel like grinding. Also training infrastructure costs are massive — hard to demo without GPUs." },
    automation_risk: { score: 60, text: "Medium. AutoML is eating junior ML tasks. But model architecture work and novel research are safe for a long time." },
    startup_fit: { score: 68, text: "OK fit. Most startups can't afford dedicated ML teams. You'll end up as a 'ML + everything else' person." },
    remote_chance: { score: 80, text: "Good. US remote ML Eng roles exist but less common than AI Eng. Usually requires stronger credentials." },
    your_fit: { score: 58, text: "Possible but not optimal path for you right now. Your RAG/backend work is AI Eng territory, not classic ML. You'd need to rebuild from math fundamentals which delays placement." },
  },
  aiml: {
    demand_now: { score: 55, text: "Research roles in India are limited. Mostly IIT/IISc/Startups like Sarvam AI, Krutrim. Corporate research teams (Google DeepMind India, Microsoft Research) are rare openings." },
    demand_future: { score: 70, text: "Globally strong. India research ecosystem growing but slowly. Most high-end research still happens in US/UK." },
    campus_placement: { score: 25, text: "Brutal. Research roles almost never come via campus placement. Requires research papers, internships at research labs, or MS/PhD path." },
    salary_fresher: { score: 58, text: "₹6–12 LPA in India research roles. Research associate/RA positions often lower. Pure academia pays ₹3–6 LPA." },
    salary_3yr: { score: 65, text: "₹15–28 LPA if in industry research. Academic path stays low (₹8–12 LPA post-PhD in India)." },
    salary_5yr: { score: 75, text: "₹30–60 LPA if you transition to applied AI after research. Pure research in India is underpaid relative to effort." },
    abroad_salary: { score: 92, text: "$200k–$400k+ at top labs (OpenAI, DeepMind, Meta FAIR). Research scientists at FAANG are among highest paid in tech globally." },
    abroad_chance: { score: 60, text: "Needs MS/PhD from reputed university OR published papers at NeurIPS/ICML/ICLR. Hard path but the most respected globally." },
    intl_roi: { score: 72, text: "Highest ceiling possible IF you get to top labs. But the path is long (4–7 years of study/research) and uncertain. High variance career." },
    learning_curve: { score: 10, text: "Extreme. Deep math (measure theory, information theory, optimization theory), programming, research methodology, paper writing. A lifestyle, not a skill set." },
    entry_barrier: { score: 20, text: "Very high. Papers + strong math + top university almost required. CGPA matters here unlike other roles." },
    stability: { score: 65, text: "Academia is stable but underpaid. Industry research roles can disappear fast (Meta, Google cut research teams in 2023-24)." },
    risk: { score: 42, text: "High variance. Research can become irrelevant quickly. You can spend 3 years on a direction that gets solved by a GPT update." },
    drawback: { score: 0, text: "Long delayed payoff. You'll be studying/doing low-paid research for 5–7 years before seeing real money. Not viable if you need near-term placement." },
    automation_risk: { score: 35, text: "Low for now. Research creativity is hard to automate. But AI-assisted research is already compressing timelines — fewer researchers needed for same output." },
    startup_fit: { score: 45, text: "Poor fit unless it's an AI-native research startup. Most startups need builders, not researchers." },
    remote_chance: { score: 65, text: "Research can be remote but top labs want you in-person. Academic roles are location-locked." },
    your_fit: { score: 30, text: "Not your path right now. You want placement in 6–12 months. Research is a 4–7 year commitment before real payoff. Your hands-on builder instinct fits AI Eng better." },
  },
  mlops: {
    demand_now: { score: 78, text: "Growing fast. Every company that has ML in production needs MLOps. But market is smaller than Backend/DevOps — fewer total roles." },
    demand_future: { score: 82, text: "Strong future. As more companies productionize AI, MLOps becomes critical infrastructure. LLMOps (variant for LLMs) is an emerging specialization." },
    campus_placement: { score: 35, text: "Poor via campus. Very few companies recruit MLOps directly from campus. Usually hired from DevOps or ML Eng with infra experience." },
    salary_fresher: { score: 72, text: "₹8–14 LPA. Hard to enter as fresher — most MLOps roles want 1–2 years of DevOps or ML background first." },
    salary_3yr: { score: 80, text: "₹20–35 LPA. Good ceiling once you have MLflow, Kubeflow, model serving experience." },
    salary_5yr: { score: 82, text: "₹35–60 LPA. Niche enough that specialists are well paid. LLMOps engineers increasingly in demand." },
    abroad_salary: { score: 82, text: "$150k–$220k in US. Growing demand. Less flashy than ML Eng but very stable and well-compensated." },
    abroad_chance: { score: 72, text: "Good. MLOps skills are globally transferable. K8s + MLflow + cloud experience is a strong visa-application profile." },
    intl_roi: { score: 76, text: "Good ROI. Skills map directly to global market. Adding cloud certifications (AWS/GCP) amplifies value significantly." },
    learning_curve: { score: 45, text: "Steep but more structured than ML. Kubernetes, Docker, MLflow, Airflow, cloud platforms, CI/CD for models. Clear learning path exists." },
    entry_barrier: { score: 48, text: "Medium-high. Need DevOps fundamentals + ML understanding. Hybrid skill set takes time to build." },
    stability: { score: 85, text: "Very stable. Infrastructure roles are hard to eliminate — someone has to keep the models running. Last to be cut in downturns." },
    risk: { score: 62, text: "Medium. Risk that managed platforms (AWS SageMaker, Vertex AI) abstract away MLOps work, reducing headcount needed." },
    drawback: { score: 0, text: "Boring for creative people. It's mostly pipelines, monitoring, infra. If you love building products, this will feel like plumbing. Also a support role — glory goes to ML Eng." },
    automation_risk: { score: 55, text: "Medium. Managed cloud platforms are eating MLOps tasks. But complex, custom deployments still need humans." },
    startup_fit: { score: 60, text: "Medium. Early-stage startups don't need MLOps — too much overhead. Needed at Series B+ companies with real ML in production." },
    remote_chance: { score: 78, text: "Good. Infrastructure work is remote-friendly. Many US companies hire India-based MLOps engineers." },
    your_fit: { score: 55, text: "Possible bridge path — your Docker Compose + deployment work gives you a foundation. But you'd be moving away from building AI products, which is your strength." },
  },
  backend: {
    demand_now: { score: 92, text: "Highest raw demand. Every company needs backend. Node.js, Python/Django, Java Spring — massive volume of roles at every company size." },
    demand_future: { score: 70, text: "Demand stays high but role is being compressed. AI code generation tools are letting fewer backend devs do more. Volume of roles may shrink 20–30% in 5 years." },
    campus_placement: { score: 85, text: "Best campus placement of all roles. Most campus recruiters test DSA + backend basics. This is the mass-hiring funnel you're already in." },
    salary_fresher: { score: 65, text: "₹4–12 LPA. Wide range — mass hirers pay ₹4–6 LPA, product startups pay ₹10–18 LPA. Pure backend without AI = lower ceiling at top." },
    salary_3yr: { score: 70, text: "₹15–25 LPA typical. Senior at product company ₹28–40 LPA. Ceiling lower than AI-adjacent roles without upskilling." },
    salary_5yr: { score: 72, text: "₹25–50 LPA. Strong ceiling at big product companies. But AI Eng is pulling ahead at 5yr mark." },
    abroad_salary: { score: 78, text: "$140k–$200k in US for strong backend engineers. SWE-level at FAANG with specialization. Good but not exceptional." },
    abroad_chance: { score: 80, text: "High. Backend is the most common visa-sponsored role. Volume of openings globally is massive. DSA-strong profiles get interviews at top companies." },
    intl_roi: { score: 78, text: "Good but crowded. You're competing with millions globally. Backend + AI integration is the differentiator that moves you up the stack." },
    learning_curve: { score: 65, text: "Moderate. Well-documented path. DSA + system design + one backend stack. Predictable and learnable within 1–2 years." },
    entry_barrier: { score: 68, text: "Medium. Competitive but accessible. DSA performance in interviews is the main gate. No special degrees or hardware needed." },
    stability: { score: 88, text: "Highest stability. Every company needs backend. Recessions, AI waves, tech bubbles — backend engineering persists." },
    risk: { score: 70, text: "Relatively low individual risk. But role-category risk is growing as AI tools reduce the number of backend devs needed per team." },
    drawback: { score: 0, text: "Commoditized. Millions of backend devs globally. Salary ceiling is lower. In 5 years, AI-assisted coding may turn a 5-person backend team into a 2-person team." },
    automation_risk: { score: 40, text: "Highest automation risk of all roles listed here. Code generation AI (GitHub Copilot, Claude, Cursor) is directly compressing junior backend work. This is the most at-risk role by 2028." },
    startup_fit: { score: 82, text: "Good. Every startup needs backend. But you'll be doing CRUD APIs forever unless you add AI/ML skills to the stack." },
    remote_chance: { score: 85, text: "Excellent. Backend remote roles are everywhere. High supply of remote work globally." },
    your_fit: { score: 78, text: "You're already here and good at it. But don't STAY only here. Your Backend + AI Eng combo is the real moat. Pure backend alone undersells you by 2026." },
  },
  devops: {
    demand_now: { score: 85, text: "Very high demand. DevOps/SRE/Platform Eng are critical at every mid-to-large company. Cloud migration wave still ongoing in India." },
    demand_future: { score: 72, text: "Stable demand. Platform engineering and cloud-native skills stay relevant. But some DevOps tasks are being automated by AI Ops tools." },
    campus_placement: { score: 55, text: "Moderate. Some companies (Infosys, TCS, Wipro) hire freshers for DevOps-adjacent cloud roles. Pure DevOps is harder to land from campus." },
    salary_fresher: { score: 60, text: "₹5–10 LPA as fresher. Many companies hire DevOps fresher at ₹5–7 LPA in service companies, ₹10–15 LPA in product/SaaS companies." },
    salary_3yr: { score: 75, text: "₹15–28 LPA with AWS/GCP certifications and Kubernetes experience. Cloud architects at 5yr mark can touch ₹40L+." },
    salary_5yr: { score: 78, text: "₹30–55 LPA for Principal DevOps/Platform Eng. SRE at big tech ₹50–80 LPA." },
    abroad_salary: { score: 80, text: "$140k–$210k in US for experienced DevOps/SRE. Cloud architects at senior level touch $220k+. EU €75k–€120k." },
    abroad_chance: { score: 78, text: "Strong. AWS/GCP certified + Kubernetes experience is an easy visa story. Demand is globally consistent." },
    intl_roi: { score: 74, text: "Good. Cloud certifications + K8s are globally recognized credentials. Portable skillset, easier to verify in interviews than code-heavy roles." },
    learning_curve: { score: 55, text: "Moderate-steep. Linux deep dive, networking, cloud platforms, Kubernetes, Terraform, CI/CD, monitoring. Broad but not as deep as ML." },
    entry_barrier: { score: 52, text: "Medium. Linux + cloud fundamentals are learnable. But entry roles are often service-company DevOps which is not the same as product-company SRE." },
    stability: { score: 90, text: "Highest stability alongside backend. Infrastructure must be maintained — someone has to keep systems running. Very recession-resistant." },
    risk: { score: 65, text: "Medium. Risk that fully managed cloud platforms (serverless, PaaS) continue abstracting away DevOps complexity. Kubernetes expertise becoming a commodity." },
    drawback: { score: 0, text: "Not a product-building role. You maintain infrastructure that others use to build things. Can feel thankless. On-call culture in SRE is brutal — 3am incidents are real." },
    automation_risk: { score: 50, text: "Medium. AI Ops tools are automating incident detection, remediation, and capacity planning. But complex infra decisions stay human for now." },
    startup_fit: { score: 72, text: "Good at growth-stage startups. Early-stage startups use managed platforms so less need. Mid-stage companies value DevOps heavily." },
    remote_chance: { score: 82, text: "Very good. Infrastructure work is highly remote-compatible. Many US companies hire India DevOps engineers." },
    your_fit: { score: 50, text: "You have Docker + deploy experience which is a foundation. But pure DevOps is a detour from your AI Eng trajectory. Only worth adding as a supportive skill, not primary role." },
  },
  data_sci: {
    demand_now: { score: 65, text: "Declining from peak hype. Many 'Data Scientist' roles are actually data analysts. Real DS roles require statistics + domain expertise. Bubble partially popped." },
    demand_future: { score: 58, text: "Bifurcating. Analytics-level DS is being automated by AI tools. Research-level DS merges into ML Eng. The middle is being squeezed out." },
    campus_placement: { score: 60, text: "Moderate. Many companies hire DS from campus but often as data analysts (not true ML). BFSI, e-commerce, consulting are main recruiters." },
    salary_fresher: { score: 62, text: "₹5–10 LPA typical. Many 'DS' roles are actually analytics at ₹4–7 LPA. Real ML-heavy DS starts at ₹10–15 LPA." },
    salary_3yr: { score: 65, text: "₹14–22 LPA. Ceiling is lower than ML Eng or AI Eng unless you specialize into NLP, forecasting, or LLM work." },
    salary_5yr: { score: 68, text: "₹22–40 LPA. Decent but AI Eng and ML Eng are pulling ahead. Data Scientists who don't upskill into LLMs are being left behind." },
    abroad_salary: { score: 75, text: "$130k–$190k in US. Lower ceiling than ML Eng. DS at top tech companies can do better but it's a smaller pool." },
    abroad_chance: { score: 70, text: "Moderate. DS is a well-understood role globally but market is more crowded than AI Eng right now." },
    intl_roi: { score: 68, text: "Moderate. Skills are transferable but the role is being redefined globally. Strong stats + Python + one domain expertise (finance, healthcare) improves the story." },
    learning_curve: { score: 48, text: "Moderate. Stats, Python, SQL, ML algorithms, visualization, storytelling. Accessible but surface-level DS is easy to fake — depth takes years." },
    entry_barrier: { score: 58, text: "Medium. Many bootcamps pump out data scientists. The bar is lower at entry but the ceiling requires genuine depth." },
    stability: { score: 68, text: "Moderate. DS teams are often the first cut in downturns (seen in 2023 tech layoffs). Less critical infrastructure than backend/DevOps." },
    risk: { score: 45, text: "Medium-high. The 'just do EDA and sklearn models' DS role is being eaten by AutoML, ChatGPT-based analysis tools. Role is transforming." },
    drawback: { score: 0, text: "Identity crisis role. Half the DS jobs are actually data analyst jobs. You'll spend 80% time in Excel/SQL doing reporting, not building models. Overhyped vs reality." },
    automation_risk: { score: 35, text: "High. ChatGPT can already do basic EDA, model selection, and data visualization explanations. Analyst-level DS work is highly automatable." },
    startup_fit: { score: 62, text: "Decent. Startups need data insights. But early-stage startups don't have enough data for a full-time DS. Often a shared role." },
    remote_chance: { score: 75, text: "Good. DS work is laptop-native and remote-friendly." },
    your_fit: { score: 42, text: "Not your lane. You have the foundational knowledge (NumPy, Pandas, sklearn basics) but going deep into DS would pull you away from your AI Eng trajectory which is higher ceiling." },
  },
};

const PARAMS_PER_VIEW = params.length;

export default function RoleComparison() {
  const [activeRole, setActiveRole] = useState("ai_eng");
  const [compareMode, setCompareMode] = useState(false);
  const [compareRoles, setCompareRoles] = useState(["ai_eng", "backend"]);
  const [activeParam, setActiveParam] = useState(null);
  const [tab, setTab] = useState("overview");

  const toggleCompareRole = (id) => {
    setCompareRoles(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const getRole = (id) => roles.find(r => r.id === id);
  const getRoleData = (roleId, paramKey) => data[roleId]?.[paramKey];

  const overviewParams = ["demand_now", "demand_future", "campus_placement", "salary_fresher", "salary_3yr", "abroad_chance", "stability", "automation_risk", "your_fit"];
  const salaryParams = ["salary_fresher", "salary_3yr", "salary_5yr", "abroad_salary", "intl_roi"];
  const riskParams = ["risk", "drawback", "automation_risk", "stability", "entry_barrier"];
  const opportunityParams = ["demand_now", "demand_future", "startup_fit", "remote_chance", "campus_placement", "abroad_chance", "learning_curve"];

  const tabParams = tab === "salary" ? salaryParams : tab === "risk" ? riskParams : tab === "opportunity" ? opportunityParams : overviewParams;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030712",
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      color: "#e2e8f0",
      padding: "0",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-thumb { background: #1e293b; }
        ::-webkit-scrollbar-track { background: transparent; }
        .role-btn { transition: all 0.15s ease; }
        .role-btn:hover { transform: translateY(-1px); }
        .param-row { transition: background 0.1s; cursor: pointer; }
        .param-row:hover { background: #0f172a !important; }
        .score-bar { transition: width 0.5s ease; }
        .tab-btn { transition: all 0.15s; }
        .tab-btn:hover { border-color: #334155 !important; }
        .glow-text { text-shadow: 0 0 20px currentColor; }
        .compare-chip { transition: all 0.15s; cursor: pointer; }
        .compare-chip:hover { opacity: 0.8; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #0a0f1a 0%, #030712 100%)",
        borderBottom: "1px solid #0f172a",
        padding: "28px 24px 20px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "#475569", letterSpacing: "0.25em", marginBottom: 4 }}>BUILT FOR SHAHJAN ALI · JUNE 2026</div>
              <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(28px, 5vw, 48px)",
                letterSpacing: "0.05em",
                color: "#fff",
                lineHeight: 1,
                marginBottom: 4,
              }}>
                ROLE REALITY CHECK
              </h1>
              <div style={{ fontSize: 12, color: "#64748b" }}>No hype. Real numbers. What each path actually looks like.</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={() => { setCompareMode(false); }}
                style={{
                  padding: "8px 16px", fontSize: 11, letterSpacing: "0.1em",
                  border: `1px solid ${!compareMode ? "#00ff87" : "#1e293b"}`,
                  background: !compareMode ? "#00ff8715" : "transparent",
                  color: !compareMode ? "#00ff87" : "#64748b",
                  borderRadius: 4, cursor: "pointer",
                }}
              >SINGLE</button>
              <button
                onClick={() => { setCompareMode(true); }}
                style={{
                  padding: "8px 16px", fontSize: 11, letterSpacing: "0.1em",
                  border: `1px solid ${compareMode ? "#60a5fa" : "#1e293b"}`,
                  background: compareMode ? "#60a5fa15" : "transparent",
                  color: compareMode ? "#60a5fa" : "#64748b",
                  borderRadius: 4, cursor: "pointer",
                }}
              >COMPARE</button>
            </div>
          </div>

          {/* Role Pills */}
          <div style={{ display: "flex", gap: 6, marginTop: 16, flexWrap: "wrap" }}>
            {roles.map(role => {
              const isActive = compareMode ? compareRoles.includes(role.id) : activeRole === role.id;
              return (
                <button
                  key={role.id}
                  className="role-btn"
                  onClick={() => compareMode ? toggleCompareRole(role.id) : setActiveRole(role.id)}
                  style={{
                    padding: "6px 14px",
                    fontSize: 11, fontFamily: "inherit",
                    border: `1px solid ${isActive ? role.color : "#1e293b"}`,
                    background: isActive ? `${role.color}18` : "#080d14",
                    color: isActive ? role.color : "#475569",
                    borderRadius: 3,
                    cursor: "pointer",
                    letterSpacing: "0.08em",
                  }}
                >
                  {role.icon} {role.short}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 48px" }}>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 4, padding: "20px 0 16px", borderBottom: "1px solid #0f172a" }}>
          {[
            { key: "overview", label: "OVERVIEW" },
            { key: "salary", label: "SALARY" },
            { key: "risk", label: "RISK & STABILITY" },
            { key: "opportunity", label: "OPPORTUNITY" },
          ].map(t => (
            <button
              key={t.key}
              className="tab-btn"
              onClick={() => setTab(t.key)}
              style={{
                padding: "6px 14px", fontSize: 10, fontFamily: "inherit",
                letterSpacing: "0.12em",
                border: `1px solid ${tab === t.key ? "#334155" : "#0f172a"}`,
                background: tab === t.key ? "#0f172a" : "transparent",
                color: tab === t.key ? "#e2e8f0" : "#475569",
                borderRadius: 3, cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {!compareMode ? (
          /* SINGLE ROLE VIEW */
          <div style={{ paddingTop: 20 }}>
            {/* Role Header */}
            {(() => {
              const role = getRole(activeRole);
              const roleData = data[activeRole];
              const avgScore = Math.round(Object.values(roleData).reduce((a, b) => a + (b.score || 0), 0) / Object.values(roleData).length);
              return (
                <div style={{
                  display: "flex", alignItems: "center", gap: 20,
                  padding: "20px 24px",
                  background: `linear-gradient(135deg, ${role.color}0a, transparent)`,
                  border: `1px solid ${role.color}22`,
                  borderRadius: 6, marginBottom: 24,
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: `${role.color}20`,
                    border: `2px solid ${role.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24,
                  }}>{role.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: role.color, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}>
                      {role.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                      Composite Score: <span style={{ color: scoreColors(avgScore), fontWeight: 700 }}>{avgScore}/100</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      fontSize: 36, fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif",
                      color: scoreColors(avgScore),
                    }}>{avgScore}</div>
                    <div style={{ fontSize: 10, color: "#475569" }}>AVG SCORE</div>
                  </div>
                </div>
              );
            })()}

            {/* Params */}
            {tabParams.map((paramKey, idx) => {
              const param = params.find(p => p.key === paramKey);
              const d = getRoleData(activeRole, paramKey);
              const role = getRole(activeRole);
              if (!param || !d) return null;
              const isOpen = activeParam === paramKey;
              return (
                <div
                  key={paramKey}
                  className="param-row"
                  onClick={() => setActiveParam(isOpen ? null : paramKey)}
                  style={{
                    padding: "14px 20px",
                    borderBottom: "1px solid #0d1520",
                    background: idx % 2 === 0 ? "#060a10" : "#030712",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{param.icon}</span>
                    <span style={{ fontSize: 12, color: "#94a3b8", flex: 1, letterSpacing: "0.03em" }}>{param.label}</span>
                    <div style={{ width: 140, height: 4, background: "#0f172a", borderRadius: 2, overflow: "hidden" }}>
                      {d.score > 0 && (
                        <div
                          className="score-bar"
                          style={{
                            height: "100%",
                            width: `${d.score}%`,
                            background: `linear-gradient(90deg, ${scoreColors(d.score)}88, ${scoreColors(d.score)})`,
                            borderRadius: 2,
                          }}
                        />
                      )}
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: 700,
                      color: d.score > 0 ? scoreColors(d.score) : "#475569",
                      minWidth: 32, textAlign: "right",
                    }}>
                      {d.score > 0 ? d.score : "—"}
                    </span>
                    <span style={{ color: "#334155", fontSize: 10, marginLeft: 4 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                  {isOpen && (
                    <div style={{
                      marginTop: 12, marginLeft: 32,
                      padding: "12px 16px",
                      background: "#0a0f1a",
                      border: `1px solid ${role.color}22`,
                      borderRadius: 4,
                      fontSize: 12, color: "#94a3b8", lineHeight: 1.7,
                    }}>
                      {d.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* COMPARE MODE */
          <div style={{ paddingTop: 20 }}>
            {compareRoles.length === 0 && (
              <div style={{ textAlign: "center", padding: 48, color: "#334155", fontSize: 13 }}>
                Select 2–4 roles above to compare
              </div>
            )}
            {compareRoles.length > 0 && (
              <>
                {/* Column Headers */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `200px repeat(${compareRoles.length}, 1fr)`,
                  gap: 1,
                  marginBottom: 8,
                }}>
                  <div />
                  {compareRoles.map(roleId => {
                    const role = getRole(roleId);
                    const roleData = data[roleId];
                    const avgScore = Math.round(Object.values(roleData).reduce((a, b) => a + (b.score || 0), 0) / Object.values(roleData).length);
                    return (
                      <div key={roleId} style={{
                        padding: "12px 16px",
                        background: `${role.color}0d`,
                        border: `1px solid ${role.color}22`,
                        borderRadius: 6,
                        textAlign: "center",
                      }}>
                        <div style={{ fontSize: 18 }}>{role.icon}</div>
                        <div style={{ fontSize: 11, color: role.color, fontWeight: 600, marginTop: 4, letterSpacing: "0.05em" }}>{role.short}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: scoreColors(avgScore), fontFamily: "'Bebas Neue', sans-serif", marginTop: 2 }}>{avgScore}</div>
                        <div style={{ fontSize: 9, color: "#475569" }}>AVG</div>
                      </div>
                    );
                  })}
                </div>

                {/* Param Rows */}
                {tabParams.map((paramKey, idx) => {
                  const param = params.find(p => p.key === paramKey);
                  if (!param) return null;
                  const scores = compareRoles.map(r => getRoleData(r, paramKey)?.score || 0);
                  const maxScore = Math.max(...scores);
                  const isOpen = activeParam === paramKey;
                  return (
                    <div key={paramKey}>
                      <div
                        className="param-row"
                        onClick={() => setActiveParam(isOpen ? null : paramKey)}
                        style={{
                          display: "grid",
                          gridTemplateColumns: `200px repeat(${compareRoles.length}, 1fr)`,
                          gap: 1,
                          background: idx % 2 === 0 ? "#060a10" : "#030712",
                          borderBottom: "1px solid #0d1520",
                        }}
                      >
                        {/* Param Label */}
                        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12 }}>{param.icon}</span>
                          <span style={{ fontSize: 11, color: "#64748b" }}>{param.label}</span>
                        </div>

                        {/* Scores */}
                        {compareRoles.map(roleId => {
                          const role = getRole(roleId);
                          const d = getRoleData(roleId, paramKey);
                          const score = d?.score || 0;
                          const isWinner = score === maxScore && score > 0;
                          return (
                            <div key={roleId} style={{
                              padding: "12px 16px",
                              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                              background: isWinner ? `${role.color}08` : "transparent",
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{
                                  fontSize: 15, fontWeight: 700,
                                  color: score > 0 ? scoreColors(score) : "#334155",
                                }}>
                                  {score > 0 ? score : "—"}
                                </span>
                                {isWinner && score > 0 && <span style={{ fontSize: 9, color: role.color }}>▲</span>}
                              </div>
                              {score > 0 && (
                                <div style={{ width: "80%", height: 3, background: "#0f172a", borderRadius: 2 }}>
                                  <div style={{
                                    height: "100%", width: `${score}%`,
                                    background: scoreColors(score),
                                    borderRadius: 2,
                                  }} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Expanded detail row */}
                      {isOpen && (
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: `200px repeat(${compareRoles.length}, 1fr)`,
                          background: "#080d14",
                          borderBottom: "1px solid #1e293b",
                        }}>
                          <div />
                          {compareRoles.map(roleId => {
                            const role = getRole(roleId);
                            const d = getRoleData(roleId, paramKey);
                            return (
                              <div key={roleId} style={{
                                padding: "12px 16px",
                                borderLeft: `2px solid ${role.color}33`,
                                fontSize: 11, color: "#64748b", lineHeight: 1.6,
                              }}>
                                {d?.text}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* Bottom Verdict */}
        <div style={{
          marginTop: 40,
          padding: "24px",
          background: "linear-gradient(135deg, #00ff8708, #060a12)",
          border: "1px solid #00ff8722",
          borderRadius: 6,
        }}>
          <div style={{ fontSize: 11, color: "#00ff87", letterSpacing: "0.2em", fontWeight: 700, marginBottom: 16 }}>
            ▸ REAL TALK FOR SHAHJAN ALI
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {[
              {
                title: "Your actual position",
                color: "#00ff87",
                text: "You're a Backend Dev with AI Eng skills growing. RAGBot makes you an AI Engineer candidate today — not someday. Don't call yourself a backend dev in your next interview.",
              },
              {
                title: "Biggest risk you're ignoring",
                color: "#f59e0b",
                text: "Pure backend dev automation risk is real and accelerating. Every year you stay 'just backend', the floor drops. Your AI Eng trajectory is the escape hatch. Complete it.",
              },
              {
                title: "Campus placement reality",
                color: "#60a5fa",
                text: "Campus drives will hire you as a backend dev at ₹6–10 LPA. Your actual ceiling with AI Eng positioning on Wellfound/LinkedIn is ₹12–18 LPA. Different funnel entirely.",
              },
              {
                title: "The path that fits you",
                color: "#a78bfa",
                text: "AI Engineer > Backend Dev (financially and intellectually). You're already 50% there. LangChain + agents + FastAPI + Streamlit demo = interview-ready AI Eng profile by Aug 2026.",
              },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "16px",
                background: "#070c15",
                border: `1px solid ${item.color}22`,
                borderRadius: 4,
              }}>
                <div style={{ fontSize: 10, color: item.color, letterSpacing: "0.12em", marginBottom: 8, fontWeight: 600 }}>
                  {item.title.toUpperCase()}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 10, color: "#1e293b", letterSpacing: "0.1em" }}>
          ROLE REALITY CHECK · BUILT BY CLAUDE FOR SHAHJAN ALI · JUNE 2026
        </div>
      </div>
    </div>
  );
}
