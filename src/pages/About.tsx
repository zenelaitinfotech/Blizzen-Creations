import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, MapPin, Users, Award } from "lucide-react";
import img1 from "@/assets/img1.jpg";

// ── CountUp Component ──
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { value: 1000, suffix: "+",   label: "Students Trained" },
  { value: 100,  suffix: "%",   label: "Placement Rate" },
  { value: 100,  suffix: "+",   label: "Hiring Partners" },
  { value: 5,    suffix: " Yrs", label: "Of Excellence" },
];

const MAPS_URL = "https://www.google.com/maps/place/Blizzen+Creation%27s/@13.0856159,80.2101490,17z";

const About = () => {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#ffffff", color: "#0f172a" }}>

      {/* ── HERO ── */}
      <section style={{ background: "#1e3a35", padding: "30px 0 32px", position: "relative", overflow: "hidden" }}>

        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${img1})`,
          opacity: 0.6, backgroundSize: "cover", backgroundPosition: "center",
          backgroundRepeat: "no-repeat", pointerEvents: "none", zIndex: 0, filter: "blur(8px)",
        }} />

        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ position: "absolute", left: `${10 + i * 22}%`, top: 0, bottom: 0, width: "1px", background: "rgba(255,255,255,0.04)" }} />
          ))}
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", textAlign: "center", position: "relative", zIndex: 2 }}>

          <p style={{ fontSize: 32, fontWeight: 900, color: "black", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 6, textAlign: "center" }}>
            About Us
          </p>

          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "inline-block", marginBottom: 12 }}>
            <div
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 30, padding: "5px 16px", cursor: "pointer", transition: "background 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(201,149,58,0.18)"; (e.currentTarget as HTMLDivElement).style.borderColor = "#c9953a"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
            >
              <MapPin size={23} color="#c9953a" />
              <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "black" }}>Anna Nagar, Chennai</span>
            </div>
          </a>

          <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, color: "black", lineHeight: 1.08, letterSpacing: "-2px", marginBottom: 12 }}>
            We Build Careers,{" "}
            <span style={{ color: "#93c5fd" }}>Not Just Résumés.</span>
          </h1>

          <p style={{ fontSize: 20, color: "#1a1a1a", lineHeight: 1.8, marginBottom: 28, maxWidth: 900, margin: "0 auto 52px auto", fontWeight: 500 }}>
            BlizzenCreations is not just an institute — it's a career transformation hub.
            We are dedicated to building skilled professionals who are ready to face real-world challenges. Our training is designed with one goal:
            Every student should become employable and successful.
          </p>

          {/* ── Stats row with CountUp ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, borderTop: "2px solid rgba(0,0,0,0.8)", paddingTop: 20 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "0 16px", borderRight: i < 3 ? "2px solid rgba(0,0,0,0.8)" : "none" }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#000000", letterSpacing: "-1px", marginBottom: 6 }}>
                  <CountUp target={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 18, color: "white", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 800 }}>{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <section style={{ padding: "80px 0", background: "#ffffff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 45, fontWeight: 700, color: "#1e3a35", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>Who We Are</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
            <div>
              <h2 style={{ fontSize: 65, fontWeight: 1000, color: "#0f172a", letterSpacing: "-1.5px", marginBottom: 20, lineHeight: 1.1, marginTop: 100 }}>
                Chennai's Premier IT & Non-IT Training Institute
              </h2>
            </div>
            <div style={{ maxWidth: 900 }}>
              <p style={{ fontSize: 17, color: "#4a5568", lineHeight: 1.9, marginBottom: 20, letterSpacing: "0.01em", wordBreak: "normal", overflowWrap: "normal" }}>
                Our institute is dedicated to delivering high-quality education that empowers students with knowledge, skills, and confidence to excel in their careers. We combine academic excellence with practical learning to ensure our students are industry-ready from day one. With experienced faculty, modern infrastructure, and a student-centered approach, we strive to create a dynamic learning environment that fosters growth and innovation. We take pride in our strong placement support system — our dedicated team works closely with top companies to provide job opportunities, internships, and career guidance.
              </p>
              <p style={{ fontSize: 17, color: "#4a5568", lineHeight: 1.9, letterSpacing: "0.01em", wordBreak: "normal", overflowWrap: "normal" }}>
                We believe quality education should be accessible to everyone. To make learning more affordable, we offer a <strong style={{ color: "#2d6a4f" }}>No Cost EMI</strong> option — pay in convenient monthly installments with no hidden charges or interest. Having trained <strong style={{ color: "#1a202c" }}>1000+ students</strong> across IT and Non-IT tracks and partnered with <strong style={{ color: "#1a202c" }}>100+ companies</strong>, we maintain a near-perfect placement record — because every course is designed around what employers actually need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section style={{ padding: "80px 0", background: "#f0f7f5" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 45, fontWeight: 700, color: "#1e3a35", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>What Drives Us</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: "#0f172a", letterSpacing: "-1.5px", margin: 0 }}>Mission & Vision</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div style={{ background: "#1e3a35", borderRadius: 20, padding: "48px 40px", position: "relative", overflow: "hidden" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Users size={22} color="white" />
              </div>
              <p style={{ fontSize: 20, fontWeight: 900, color: "#93c5fd", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>Our Mission</p>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "white", lineHeight: 1.3, marginBottom: 16, letterSpacing: "-0.5px" }}>
                Empowering students with practical and affordable education.
              </h3>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, fontWeight: 300, margin: 0 }}>
                We provide high-quality, hands-on learning that focuses on real-world skills and industry requirements. Our goal is to help students build confidence, gain practical knowledge, and achieve their dream careers.
              </p>
            </div>

            <div style={{ background: "white", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: "48px 40px" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0f7f5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Award size={22} color="#1e3a35" />
              </div>
              <p style={{ fontSize: 20, fontWeight: 900, color: "#1e3a35", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>Our Vision</p>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.3, marginBottom: 16, letterSpacing: "-0.5px" }}>
                Becoming a leading institute for skill-based education and placements.
              </h3>
              <p style={{ fontSize: 19, color: "#64748b", lineHeight: 1.85, margin: 0 }}>
                We aim to create a strong learning ecosystem that bridges the gap between education and industry needs, helping students grow into successful professionals across India.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { icon: "🎯", title: "Job-Oriented Teaching", desc: "Every module mapped to real JDs" },
              { icon: "🏭", title: "Industrial Relevant Projects", desc: "Build a real-world portfolio" },
              { icon: "👨‍💼", title: "Expert Mentors", desc: "5+ years MNC experience" },
              { icon: "🚀", title: "100% Placement", desc: "100+ hiring partners" },
            ].map((v, i) => (
              <div key={i} style={{ background: "white", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "22px 20px", transition: "all 0.2s", cursor: "default" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1e3a35"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(30,58,53,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
                <div style={{ fontSize: 20, marginBottom: 10 }}>{v.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{v.title}</div>
                <div style={{ fontSize: 15, color: "#64748b", lineHeight: 1.5 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section style={{ padding: "64px 0", background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <h3 style={{ fontSize: 30, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: 6 }}>Ready to start your journey?</h3>
            <p style={{ fontSize: 20, color: "#64748b", margin: 0 }}>Book a free demo class — no commitment, no pressure.</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/contact">
              <button style={{ background: "#1e3a35", color: "white", border: "none", padding: "13px 28px", borderRadius: 8, fontSize: 18, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "background 0.2s" }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "#f59e0b")}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "#1e3a35")}>
                Book Free Demo <ArrowRight size={15} />
              </button>
            </Link>
            <Link to="/courses">
              <button style={{ background: "transparent", color: "#1e3a35", border: "1.5px solid #a7c4bc", padding: "13px 28px", borderRadius: 8, fontSize: 18, fontWeight: 700, cursor: "pointer" }}>
                Browse Courses
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;