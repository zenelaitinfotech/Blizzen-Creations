import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Building2, TrendingUp, CheckCircle, Briefcase, Star } from "lucide-react";

// ── Mobile hook ──
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

const placementStats = [
  { value: "100%",   label: "Placement Rate",        desc: "Of our students land a job within 3 months of completing their course" },
  { value: "1,000+", label: "Students Placed",       desc: "Successful career transitions across IT and Non-IT tracks since 2015" },
  { value: "100+",   label: "Hiring Partners",       desc: "Top MNCs and product companies actively recruit from our batches" },
  { value: "₹5 LPA", label: "Avg. Starting Package", desc: "Average CTC offered to our placed students across all courses" },
];

const companies = [
  { name: "Zoho",            tier: "top" },
  { name: "HTC",             tier: "top" },
  { name: "FreshWorks",      tier: "top" },
  { name: "Kissflow",        tier: "top" },
  { name: "Infoview",        tier: "top" },
  { name: "Indium",          tier: "top" },
  { name: "Aspire",          tier: "mid" },
  { name: "Ramco",           tier: "mid" },
  { name: "Intellect",       tier: "mid" },
  { name: "Saksoft",         tier: "mid" },
  { name: "Waycool",         tier: "mid" },
  { name: "Payoda",          tier: "mid" },
  { name: "Prodapt",         tier: "mid" },
  { name: "Bahwan Cybertek", tier: "mid" },
  { name: "Gofrugal",        tier: "mid" },
  { name: "TVS NEXT",        tier: "mid" },
  { name: "ContusTech",      tier: "mid" },
  { name: "Ideas IT",        tier: "mid" },
];

const careerOpportunities = [
  { role: "Software Developer", icon: "💻", desc: "Build products at top IT companies and startups" },
  { role: "Web Developer",      icon: "🌐", desc: "Frontend, backend or full-stack development roles" },
  { role: "Digital Marketer",   icon: "📣", desc: "SEO, ads, social media & growth marketing" },
  { role: "Freelancer",         icon: "🧑‍💼", desc: "Work independently with global clients" },
  { role: "Startup Founder",    icon: "🚀", desc: "Launch your own venture with real-world skills" },
];

const hiringNetwork = [
  { type: "IT Companies",     icon: "🖥️", desc: "MNCs, service companies & product firms" },
  { type: "Non-IT Companies", icon: "🏢", desc: "Operations, marketing & digital roles" },
  { type: "Startups",         icon: "🚀", desc: "Fast-growing companies with great learning" },
  { type: "Agencies",         icon: "📱", desc: "Creative, digital & performance agencies" },
];

const whyValues = [
  { left: "Skills",     right: "Marks",         icon: "💡" },
  { left: "Practice",   right: "Theory",         icon: "🔧" },
  { left: "Real Work",  right: "Book Knowledge", icon: "🏗️" },
  { left: "Confidence", right: "Fear",           icon: "🎯" },
];

const Placement = () => {
  const isMobile = useIsMobile();

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#ffffff", color: "#0f172a", paddingTop: 2 }}>

      {/* ── PAGE HEADER ── */}
      <section style={{ background: "#1e3a35", padding: isMobile ? "40px 0 36px" : "72px 0 64px", position: "relative", overflow: "hidden" }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ position: "absolute", left: `${8 + i * 18}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.04)" }} />
        ))}
        <div style={{ position: "absolute", right: -100, top: -100, width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 16px" : "0 32px", position: "relative" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: isMobile ? 20 : 28, fontSize: isMobile ? 13 : 20, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>
            <Link to="/" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span style={{ color: "white" }}>Placements</span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 28 : 60,
            alignItems: "center",
          }}>
            {/* Left */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 30, padding: isMobile ? "4px 12px" : "5px 16px", marginBottom: 18 }}>
                <TrendingUp size={12} color="#93c5fd" />
                <span style={{ fontSize: isMobile ? 11 : 15, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#93c5fd" }}>100% Placement Support</span>
              </div>
              <h1 style={{ fontSize: isMobile ? "26px" : "clamp(30px, 4vw, 48px)", fontWeight: 800, color: "white", lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 14, fontFamily: "Georgia, serif" }}>
                We Don't Just Train You.<br />
                <span style={{ color: "#93c5fd" }}>We Transform You Into a Job-Ready Professional.</span>
              </h1>
              <p style={{ fontSize: isMobile ? 15 : 19, color: "rgba(255,255,255,0.55)", lineHeight: 1.85, maxWidth: 460, fontWeight: 300, margin: "0 0 24px" }}>
                Our dedicated placement team has successfully placed 1,000+ students across IT and Non-IT roles - with structured support from resume to offer letter.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/contact" style={isMobile ? { flex: 1 } : {}}>
                  <button style={{ width: isMobile ? "100%" : "auto", background: "white", color: "#1e3a35", border: "none", padding: isMobile ? "12px 16px" : "13px 28px", borderRadius: 8, fontSize: isMobile ? 14 : 16, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    Book Free Demo <ArrowRight size={15} />
                  </button>
                </Link>
                <Link to="/courses" style={isMobile ? { flex: 1 } : {}}>
                  <button style={{ width: isMobile ? "100%" : "auto", background: "transparent", color: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(255,255,255,0.3)", padding: isMobile ? "12px 16px" : "13px 28px", borderRadius: 8, fontSize: isMobile ? 14 : 16, fontWeight: 600, cursor: "pointer" }}>
                    View Courses
                  </button>
                </Link>
              </div>
            </div>

            {/* Right — trust points */}
            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 10 : 12 }}>
              {[
                { icon: "🎯", label: "Skill-based training aligned to real industry needs" },
                { icon: "🏗️", label: "Real-time project experience — not just theory" },
                { icon: "🎤", label: "Mock interviews & HR sessions with experts" },
                { icon: "📄", label: "Resume & portfolio building support included" },
                { icon: "🤝", label: "Direct interview opportunities with hiring partners" },
              ].map((pt, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: isMobile ? "12px 14px" : "14px 18px", transition: "all 0.25s ease", cursor: "default" }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = "white"; el.style.borderColor = "white"; el.style.transform = "scale(1.03)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                    const label = el.querySelector(".pt-label") as HTMLElement;
                    if (label) label.style.color = "#1e3a35";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = "rgba(255,255,255,0.06)"; el.style.borderColor = "rgba(255,255,255,0.1)"; el.style.transform = "scale(1)"; el.style.boxShadow = "none";
                    const label = el.querySelector(".pt-label") as HTMLElement;
                    if (label) label.style.color = "rgba(255,255,255,0.75)";
                  }}
                >
                  <span style={{ fontSize: isMobile ? 20 : 25, flexShrink: 0 }}>{pt.icon}</span>
                  <span className="pt-label" style={{ fontSize: isMobile ? 14 : 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, transition: "color 0.25s" }}>{pt.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PLACEMENT STATS ── */}
      <section style={{ padding: isMobile ? "48px 0" : "88px 0", background: "#f0f7f5" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 16px" : "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 52 }}>
            <p style={{ fontSize: isMobile ? 13 : 20, fontWeight: 700, color: "#1e3a35", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 10 }}>By The Numbers</p>
            <h2 style={{ fontSize: isMobile ? 26 : 44, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", margin: "0 0 10px", fontFamily: "Georgia, serif" }}>
              Placement That Speaks for Itself
            </h2>
            <p style={{ fontSize: isMobile ? 15 : 20, color: "#64748b", margin: 0 }}>Real numbers from real students — updated every semester</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 12 : 20 }}>
            {placementStats.map((s, i) => (
              <div
                key={i}
                style={{ background: i === 0 ? "#1e3a35" : "white", border: i === 0 ? "none" : "1.5px solid #e2e8f0", borderRadius: 18, padding: isMobile ? "20px 16px" : "32px 24px", transition: "all 0.2s", cursor: "default", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { if (i !== 0) { (e.currentTarget as HTMLDivElement).style.borderColor = "#1e3a35"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(30,58,138,0.09)"; } }}
                onMouseLeave={e => { if (i !== 0) { (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; } }}
              >
                {i === 0 && <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)" }} />}
                <div style={{ fontSize: isMobile ? 24 : 36, fontWeight: 800, color: i === 0 ? "#93c5fd" : "#1e3a35", letterSpacing: "-1px", marginBottom: 4, fontFamily: "Georgia, serif" }}>{s.value}</div>
                <div style={{ fontSize: isMobile ? 13 : 16, fontWeight: 700, color: i === 0 ? "rgba(255,255,255,0.85)" : "#0f172a", marginBottom: 8 }}>{s.label}</div>
                <div style={{ height: "0.5px", background: i === 0 ? "rgba(255,255,255,0.12)" : "#f1f5f9", marginBottom: 8 }} />
                <p style={{ fontSize: isMobile ? 12 : 16, color: i === 0 ? "rgba(255,255,255,0.5)" : "#64748b", lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE ENSURE YOUR PLACEMENT ── */}
      <section style={{ padding: isMobile ? "48px 0" : "88px 0", background: "#ffffff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 16px" : "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 52 }}>
            <p style={{ fontSize: isMobile ? 13 : 20, fontWeight: 700, color: "#1e3a35", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 10 }}>Our Promise</p>
            <h2 style={{ fontSize: isMobile ? 26 : 44, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", margin: "0 0 10px", fontFamily: "Georgia, serif" }}>
              How We Ensure Your Placement
            </h2>
            <p style={{ fontSize: isMobile ? 15 : 20, color: "#64748b", margin: 0 }}>Every step is designed to take you from learning to landing</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 12 : 20 }}>
            {[
              { icon: "📚", title: "Skill-Based Training",          desc: "Curriculum built around what companies actually hire for - practical, relevant, and always updated." },
              { icon: "🏗️", title: "Real-Time Project Experience",  desc: "You'll work on live projects that go straight into your portfolio and prove your skills to employers." },
              { icon: "🎤", title: "Mock Interviews & HR Sessions", desc: "Multiple rounds of mock technical and HR interviews so you walk into the real thing with full confidence." },
              { icon: "📄", title: "Resume & Portfolio Building",   desc: "Expert-crafted, ATS-friendly resumes and a strong portfolio that get shortlisted by recruiters." },
              { icon: "🤝", title: "Direct Interview Opportunities", desc: "We connect you directly with hiring partners - no middlemen, no delays, just real interviews." },
              { icon: "🔄", title: "Support Until You're Placed",   desc: "We stay with you through every round until you get your offer letter. Your success is our success." },
            ].map((item, i) => (
              <div
                key={i}
                style={{ background: "#f0f7f5", border: "1.5px solid #a7c4bc", borderRadius: 16, padding: isMobile ? "20px 16px" : "28px 24px", transition: "all 0.2s", cursor: "default", display: isMobile ? "flex" : "block", alignItems: isMobile ? "flex-start" : "unset", gap: isMobile ? 14 : 0 }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "#1e3a35"; (e.currentTarget as HTMLDivElement).style.borderColor = "#1e3a35"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(30,58,53,0.15)";
                  const title = (e.currentTarget as HTMLDivElement).querySelector(".card-title") as HTMLElement;
                  const desc = (e.currentTarget as HTMLDivElement).querySelector(".card-desc") as HTMLElement;
                  if (title) title.style.color = "white";
                  if (desc) desc.style.color = "rgba(255,255,255,0.6)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "#f0f7f5"; (e.currentTarget as HTMLDivElement).style.borderColor = "#a7c4bc"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  const title = (e.currentTarget as HTMLDivElement).querySelector(".card-title") as HTMLElement;
                  const desc = (e.currentTarget as HTMLDivElement).querySelector(".card-desc") as HTMLElement;
                  if (title) title.style.color = "#0f172a";
                  if (desc) desc.style.color = "#64748b";
                }}
              >
                <div style={{ fontSize: isMobile ? 28 : 38, marginBottom: isMobile ? 0 : 14, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <h3 className="card-title" style={{ fontSize: isMobile ? 15 : 15, fontWeight: 700, color: "#0f172a", marginBottom: 6, transition: "color 0.2s" }}>{item.title}</h3>
                  <p className="card-desc" style={{ fontSize: isMobile ? 14 : 16, color: "#64748b", lineHeight: 1.75, margin: 0, transition: "color 0.2s" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HIRING NETWORK ── */}
      <section style={{ padding: isMobile ? "48px 0" : "88px 0", background: "#f0f7f5" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 16px" : "0 32px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "340px 1fr",
            gap: isMobile ? 32 : 64,
            alignItems: "flex-start",
          }}>
            {/* Left sticky panel */}
            <div style={{ position: isMobile ? "static" : "sticky", top: 110 }}>
              <p style={{ fontSize: isMobile ? 13 : 20, fontWeight: 700, color: "#1e3a35", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 12 }}>Our Network</p>
              <h2 style={{ fontSize: isMobile ? 24 : 34, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 14, fontFamily: "Georgia, serif" }}>
                Our Hiring Network Gives You Multiple Career Opportunities
              </h2>
              <p style={{ fontSize: isMobile ? 15 : 18, color: "#64748b", lineHeight: 1.8, marginBottom: 20 }}>
                We are connected with companies across every sector — so wherever your ambition points, we have a door to open.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Active placement drives every month", "Direct HR referrals from partner companies", "On-campus & off-campus drives"].map((pt, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <CheckCircle size={14} color="#1e3a35" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: isMobile ? 14 : 15, color: "#475569", lineHeight: 1.6 }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — network grid + company pills */}
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 14, marginBottom: isMobile ? 24 : 40 }}>
                {hiringNetwork.map((item, i) => (
                  <div key={i} style={{ background: "white", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: isMobile ? "14px 12px" : "22px 20px", display: "flex", alignItems: "flex-start", gap: isMobile ? 10 : 14, transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1e3a35"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(30,58,53,0.08)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                  >
                    <span style={{ fontSize: isMobile ? 22 : 30, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: isMobile ? 13 : 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{item.type}</div>
                      <div style={{ fontSize: isMobile ? 12 : 14, color: "#64748b", lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: isMobile ? 12 : 16, fontWeight: 700, color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 13 }}>Top Recruiters</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 8 : 10, marginBottom: isMobile ? 16 : 28 }}>
                {companies.filter(c => c.tier === "top").map((co, i) => (
                  <div
                    key={i}
                    style={{ background: "#f0f7f5", border: "1.5px solid #a7c4bc", borderRadius: 10, padding: isMobile ? "8px 14px" : "11px 20px", fontSize: isMobile ? 12 : 13, fontWeight: 700, color: "#1e3a35", transition: "all 0.2s", cursor: "default", display: "flex", alignItems: "center", gap: 7 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "#1e3a35"; (e.currentTarget as HTMLDivElement).style.color = "white"; (e.currentTarget as HTMLDivElement).style.borderColor = "#1e3a35"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "#f0f7f5"; (e.currentTarget as HTMLDivElement).style.color = "#1e3a35"; (e.currentTarget as HTMLDivElement).style.borderColor = "#a7c4bc"; }}
                  >
                    <Briefcase size={12} />{co.name}
                  </div>
                ))}
              </div>

              <div style={{ height: "0.5px", background: "#e2e8f0", marginBottom: isMobile ? 16 : 24 }} />

              <p style={{ fontSize: isMobile ? 12 : 16, fontWeight: 700, color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>Also Hiring</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {companies.filter(c => c.tier === "mid").map((co, i) => (
                  <div
                    key={i}
                    style={{ background: "white", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: isMobile ? "7px 12px" : "9px 16px", fontSize: isMobile ? 11 : 12, fontWeight: 600, color: "#475569", transition: "all 0.2s", cursor: "default", display: "flex", alignItems: "center", gap: 6 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1e3a35"; (e.currentTarget as HTMLDivElement).style.color = "#1e3a35"; (e.currentTarget as HTMLDivElement).style.background = "#f0f7f5"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLDivElement).style.color = "#475569"; (e.currentTarget as HTMLDivElement).style.background = "white"; }}
                  >
                    <Building2 size={11} />{co.name}
                  </div>
                ))}
                <div style={{ background: "#f1f5f9", borderRadius: 8, padding: isMobile ? "7px 12px" : "9px 16px", fontSize: isMobile ? 11 : 12, fontWeight: 600, color: "#94a3b8" }}>+180 more</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLACEMENT GUARANTEE MINDSET ── */}
      <section style={{ padding: isMobile ? "48px 0" : "88px 0", background: "#1e3a35", position: "relative", overflow: "hidden" }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ position: "absolute", left: `${5 + i * 22}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.03)" }} />
        ))}
        <div style={{ position: "absolute", left: -80, bottom: -80, width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", right: -60, top: -60, width: 250, height: 250, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 16px" : "0 32px", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 56 }}>
            <p style={{ fontSize: isMobile ? 13 : 20, fontWeight: 700, color: "#93c5fd", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 10 }}>Our Mindset</p>
            <h2 style={{ fontSize: isMobile ? 26 : 44, fontWeight: 800, color: "white", letterSpacing: "-1px", margin: "0 0 10px", fontFamily: "Georgia, serif" }}>
              Placement Guarantee Mindset
            </h2>
            <p style={{ fontSize: isMobile ? 15 : 20, color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto" }}>
              We don't believe in fake promises. We believe in strong preparation + real opportunities = placement success.
            </p>
          </div>

          {/* Formula banner */}
          <div style={{
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20,
            padding: isMobile ? "20px 16px" : "28px 36px", marginBottom: isMobile ? 24 : 48,
            display: "flex", flexDirection: isMobile ? "column" : "row",
            alignItems: "center", justifyContent: "center", gap: isMobile ? 12 : 20, flexWrap: "wrap",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: isMobile ? 18 : 25, fontWeight: 800, color: "#93c5fd", fontFamily: "Georgia, serif" }}>Strong Preparation</div>
              <div style={{ fontSize: isMobile ? 12 : 16, color: "rgba(255,255,255,0.4)", marginTop: 4, letterSpacing: "1px", textTransform: "uppercase" }}>Your Foundation</div>
            </div>
            <div style={{ fontSize: isMobile ? 22 : 28, color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>+</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: isMobile ? 18 : 25, fontWeight: 800, color: "#93c5fd", fontFamily: "Georgia, serif" }}>Real Opportunities</div>
              <div style={{ fontSize: isMobile ? 12 : 16, color: "rgba(255,255,255,0.4)", marginTop: 4, letterSpacing: "1px", textTransform: "uppercase" }}>Our Network</div>
            </div>
            <div style={{ fontSize: isMobile ? 22 : 28, color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>=</div>
            <div style={{ textAlign: "center", background: "rgba(147,197,253,0.15)", border: "1px solid rgba(147,197,253,0.3)", borderRadius: 12, padding: isMobile ? "10px 18px" : "12px 24px" }}>
              <div style={{ fontSize: isMobile ? 18 : 25, fontWeight: 800, color: "white", fontFamily: "Georgia, serif" }}>Placement Success</div>
              <div style={{ fontSize: isMobile ? 12 : 16, color: "#93c5fd", marginTop: 4, letterSpacing: "1px", textTransform: "uppercase" }}>Guaranteed Result</div>
            </div>
          </div>

          {/* Support strip */}
          <div style={{ textAlign: "center", padding: isMobile ? "16px 0" : "24px 0", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: isMobile ? 0 : 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 30, padding: isMobile ? "8px 16px" : "10px 24px" }}>
              <span style={{ fontSize: 16 }}>🔄</span>
              <span style={{ fontSize: isMobile ? 14 : 18, fontWeight: 700, color: "white" }}>We support you <span style={{ color: "#93c5fd" }}>until you get placed</span> — no time limits, no shortcuts.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAREER OPPORTUNITIES ── */}
      <section style={{ padding: isMobile ? "48px 0" : "88px 0", background: "#f0f7f5" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 16px" : "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 52 }}>
            <p style={{ fontSize: isMobile ? 13 : 20, fontWeight: 700, color: "#1e3a35", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 10 }}>Your Future Awaits</p>
            <h2 style={{ fontSize: isMobile ? 26 : 44, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", margin: "0 0 10px", fontFamily: "Georgia, serif" }}>
              Career Opportunities After Training
            </h2>
            <p style={{ fontSize: isMobile ? 15 : 18, color: "#64748b", margin: 0 }}>Multiple paths, one destination — your success</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)", gap: isMobile ? 12 : 16 }}>
            {careerOpportunities.map((item, i) => (
              <div
                key={i}
                style={{ background: "white", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: isMobile ? "20px 14px" : "28px 18px", textAlign: "center", transition: "all 0.2s", cursor: "default" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "#1e3a35"; (e.currentTarget as HTMLDivElement).style.borderColor = "#1e3a35"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 36px rgba(30,58,53,0.18)";
                  const title = (e.currentTarget as HTMLDivElement).querySelector(".career-title") as HTMLElement;
                  const desc = (e.currentTarget as HTMLDivElement).querySelector(".career-desc") as HTMLElement;
                  if (title) title.style.color = "white";
                  if (desc) desc.style.color = "rgba(255,255,255,0.6)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "white"; (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  const title = (e.currentTarget as HTMLDivElement).querySelector(".career-title") as HTMLElement;
                  const desc = (e.currentTarget as HTMLDivElement).querySelector(".career-desc") as HTMLElement;
                  if (title) title.style.color = "#0f172a";
                  if (desc) desc.style.color = "#64748b";
                }}
              >
                <div style={{ fontSize: isMobile ? 28 : 35, marginBottom: 12 }}>{item.icon}</div>
                <div className="career-title" style={{ fontSize: isMobile ? 13 : 16, fontWeight: 700, color: "#0f172a", marginBottom: 6, transition: "color 0.2s" }}>{item.role}</div>
                <p className="career-desc" style={{ fontSize: isMobile ? 12 : 15, color: "#64748b", lineHeight: 1.7, margin: 0, transition: "color 0.2s" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY YOU WILL GET PLACED ── */}
      <section style={{ padding: isMobile ? "48px 0" : "88px 0", background: "#ffffff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 16px" : "0 32px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 28 : 64,
            alignItems: "center",
          }}>
            <div>
              <p style={{ fontSize: isMobile ? 13 : 20, fontWeight: 700, color: "#1e3a35", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 12 }}>Why It Works</p>
              <h2 style={{ fontSize: isMobile ? 26 : 45, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 16, fontFamily: "Georgia, serif" }}>
                Why You Will Get Placed From Here
              </h2>
              <p style={{ fontSize: isMobile ? 15 : 19, color: "#64748b", lineHeight: 1.85, marginBottom: 24 }}>
                Because we focus on what actually gets people hired — not just what looks good on paper. Every decision we make is designed with your career outcome in mind.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f0f7f5", border: "1.5px solid #a7c4bc", borderRadius: 12, padding: "16px 20px" }}>
                <Star size={16} color="#1e3a35" fill="#1e3a35" />
                <span style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: "#1e3a35" }}>We support you until you're placed — no time limits.</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 10 : 14 }}>
              {whyValues.map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", alignItems: "center", gap: isMobile ? 8 : 12, background: "#f0f7f5", border: "1.5px solid #a7c4bc", borderRadius: 14, padding: isMobile ? "12px 14px" : "16px 20px", transition: "all 0.3s ease", cursor: "default" }}
                  onMouseEnter={e => {
                    const card = e.currentTarget as HTMLDivElement;
                    card.style.background = "#1e3a35"; card.style.borderColor = "#1e3a35"; card.style.transform = "scale(1.03)"; card.style.boxShadow = "0 12px 32px rgba(30,58,53,0.2)";
                    const left = card.querySelector(".why-left") as HTMLElement;
                    if (left) left.style.color = "white";
                  }}
                  onMouseLeave={e => {
                    const card = e.currentTarget as HTMLDivElement;
                    card.style.background = "#f0f7f5"; card.style.borderColor = "#a7c4bc"; card.style.transform = "scale(1)"; card.style.boxShadow = "none";
                    const left = card.querySelector(".why-left") as HTMLElement;
                    if (left) left.style.color = "#1e3a35";
                  }}
                >
                  <div className="why-left" style={{ fontSize: isMobile ? 14 : 18, fontWeight: 800, color: "#1e3a35", transition: "color 0.3s" }}>✅ {item.left}</div>
                  <div style={{ textAlign: "center", fontSize: isMobile ? 16 : 18 }}>{item.icon}</div>
                  <div style={{ fontSize: isMobile ? 13 : 18, color: "#94a3b8", textDecoration: "line-through", textAlign: "right" }}>❌ {item.right}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section style={{ padding: isMobile ? "36px 0" : "64px 0", background: "#f0f7f5", borderTop: "1px solid #e2e8f0" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 16px" : "0 32px",
          display: "flex", flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center",
          flexWrap: "wrap", gap: isMobile ? 20 : 24,
        }}>
          <div>
            <h3 style={{ fontSize: isMobile ? 22 : 34, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: 6, fontFamily: "Georgia, serif" }}>Ready to get placed?</h3>
            <p style={{ fontSize: isMobile ? 15 : 20, color: "#64748b", margin: 0 }}>Book a free demo class and talk to our placement team today.</p>
          </div>
          <div style={{ display: "flex", gap: 12, width: isMobile ? "100%" : "auto" }}>
            <Link to="/contact" style={isMobile ? { flex: 1 } : {}}>
              <button
                style={{ width: isMobile ? "100%" : "auto", background: "#1e3a35", color: "white", border: "none", padding: isMobile ? "12px 16px" : "13px 28px", borderRadius: 8, fontSize: isMobile ? 14 : 16, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "#f59e0b")}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "#1e3a35")}
              >
                Book Free Demo <ArrowRight size={15} />
              </button>
            </Link>
            <Link to="/courses" style={isMobile ? { flex: 1 } : {}}>
              <button style={{ width: isMobile ? "100%" : "auto", background: "transparent", color: "#1e3a35", border: "1.5px solid #a7c4bc", padding: isMobile ? "12px 16px" : "13px 28px", borderRadius: 8, fontSize: isMobile ? 14 : 16, fontWeight: 700, cursor: "pointer" }}>
                Browse Courses
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Placement;
