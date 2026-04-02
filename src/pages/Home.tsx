import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Star, Loader2, CheckCircle } from "lucide-react";
import { apiService } from "@/services/api";
import CountUp from "@/components/CountUp";
import { sanitizeHtml } from "@/lib/html-sanitizer";
import { STATIC_COURSES } from "./Courses";
import EnquiryPopup from "@/components/EnquiryPopup";

interface HomeContent {
  _id: string;
  heroTitle: string;
  heroDescription: string;
  heroImage?: string;
  featuredCourses: string[];
  testimonials: Array<{ name: string; role: string; message: string; image?: string }>;
  stats: Array<{ label: string; value: string }>;
  callToAction: { title: string; description: string; buttonText: string };
}

interface Course {
  _id: string; title: string; slug: string; description: string;
  shortDescription: string; duration: string; level: string;
  instructor: string; image?: string; highlights: string[];
}

interface TrustStats {
  studentCount: string; studentLabel: string;
  ratingPlatforms: Array<{ name: string; rating: number; icon: string; color: string; isActive: boolean; desc?: string }>;
}

// ── Flip Rating Card ──
const FlipRatingCard = ({ platform }: { platform: { name: string; rating: number; color: string; desc?: string } }) => {
  const [flipped, setFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  const cardW = isMobile ? 150 : 220;
  const cardH = isMobile ? 160 : 200;
  return (
    <div onMouseEnter={() => setFlipped(true)} onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(f => !f)}
      style={{ width: cardW, height: cardH, perspective: '600px', cursor: 'pointer' }}>
      <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transition: 'transform 0.6s ease', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 16, border: '1.5px solid #e2e8f0', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: isMobile ? 32 : 44, fontWeight: 900, color: '#1e3a35', letterSpacing: '-2px', marginBottom: 4 }}>{platform.rating.toFixed(1)}</div>
          <div style={{ fontSize: isMobile ? 11 : 14, color: '#94a3b8', marginBottom: 8 }}>Ratings on</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Star size={isMobile ? 13 : 16} style={{ color: platform.color }} />
            <span style={{ fontWeight: 700, fontSize: isMobile ? 13 : 16, color: '#0f172a' }}>{platform.name}</span>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>{[...Array(5)].map((_, si) => <Star key={si} size={isMobile ? 10 : 12} style={{ color: '#facc15', fill: '#facc15' }} />)}</div>
        </div>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: '#1e3a35', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div style={{ fontSize: isMobile ? 28 : 44, fontWeight: 900, color: 'white', letterSpacing: '-2px', marginBottom: 6 }}>{platform.rating.toFixed(1)}</div>
          <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>{[...Array(5)].map((_, si) => <Star key={si} size={isMobile ? 10 : 12} style={{ color: '#facc15', fill: '#facc15' }} />)}</div>
          <p style={{ fontSize: isMobile ? 11 : 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>{platform.desc ?? `Based on verified reviews from our alumni on ${platform.name}`}</p>
        </div>
      </div>
    </div>
  );
};

// ── TrustSection ──
const TrustSection = ({ isMobile, trustStats }: { isMobile: boolean; trustStats: TrustStats }) => {
  const platforms = trustStats.ratingPlatforms.filter(p => p.isActive);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove  = (e: React.TouchEvent) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd   = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setActiveIndex(i => Math.min(i + 1, platforms.length - 1));
      else          setActiveIndex(i => Math.max(i - 1, 0));
    }
  };
  return (
    <section style={{ padding: isMobile ? '40px 0' : '64px 0', background: '#ffffff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
        <p style={{ fontSize: isMobile ? 12 : 16, fontWeight: 900, color: '#1e3a35', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>Trusted By</p>
        <h2 style={{ fontSize: isMobile ? 24 : 34, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: 32 }}>
          Trusted by <span style={{ color: '#1e3a35' }}>{trustStats.studentCount}</span> {trustStats.studentLabel}
        </h2>
        {isMobile ? (
          <div>
            <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} style={{ overflow: 'hidden', width: '100%' }}>
              <div style={{ display: 'flex', transition: 'transform 0.4s ease', transform: `translateX(-${activeIndex * 100}%)` }}>
                {platforms.map((platform, i) => (
                  <div key={i} style={{ minWidth: '100%', display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                    <FlipRatingCard platform={platform} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              {platforms.map((_, i) => (
                <button key={i} onClick={() => setActiveIndex(i)} style={{ width: i === activeIndex ? 24 : 10, height: 10, borderRadius: 5, background: i === activeIndex ? '#1e3a35' : '#d4eae4', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            {platforms.map((platform, i) => <FlipRatingCard key={i} platform={platform} />)}
          </div>
        )}
      </div>
    </section>
  );
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

const Home = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [trustStats, setTrustStats] = useState<TrustStats>({
    studentCount: '1,000+', studentLabel: 'Students Alumni',
    ratingPlatforms: [
      { name: 'Trustpilot', rating: 4.8, icon: 'trustpilot', color: '#00b67a', isActive: true, desc: 'Based on 320+ verified reviews from our alumni' },
      { name: 'Google',     rating: 4.9, icon: 'google',     color: '#4285F4', isActive: true, desc: 'Highest rated IT institute in Anna Nagar, Chennai' },
      { name: 'Microsoft',  rating: 4.7, icon: 'microsoft',  color: '#00a4ef', isActive: true, desc: 'Recognized for excellence in tech education' },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  useEffect(() => { fetchHomeContent(); }, []);

  const fetchHomeContent = async () => {
    try {
      setLoading(true);
      const [homeData, coursesData, trustData] = await Promise.all([
        apiService.getHomeContent(), apiService.getCourses(), apiService.getTrustStats()
      ]);
      if (homeData.success) {
        setHomeContent({ ...homeData.data, stats: [
          { label: 'Students Trained', value: '1000+' },
          { label: 'Placement Rate',   value: '100%' },
          { label: 'Average Salary',   value: '₹5 LPA' },
        ]});
      }
      if (coursesData.success && coursesData.data.length > 0) {
        const apiCourses = coursesData.data.slice(0, 6);
        const merged = [...apiCourses];
        if (merged.length < 6) merged.push(...(STATIC_COURSES.slice(merged.length, 6) as any[]));
        setFeaturedCourses(merged);
      } else {
        setFeaturedCourses(STATIC_COURSES.slice(0, 6) as any[]);
      }
      if (trustData) {
        setTrustStats({
          ...trustData,
          ratingPlatforms: [
            ...(trustData.ratingPlatforms || []).map((p: any) => ({ ...p, desc: p.desc ?? `Based on verified reviews from our alumni on ${p.name}` })),
            { name: 'Microsoft', rating: 4.7, icon: 'microsoft', color: '#00a4ef', isActive: true, desc: 'Recognized for excellence in tech education' },
          ]
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to fetch content", variant: "destructive" });
    } finally { setLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#1e3a35' }} />
    </div>
  );

  if (!homeContent) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Content Not Found</h1>
        <p className="text-gray-500">Home page content is not available</p>
      </div>
    </div>
  );

  const courseIcons  = ['💻','📊','🔒','☁️','📢','🎨'];
  const courseColors = ['#d4eae4','#fef9c3','#fce7f3','#d4eae4','#fef3c7','#f3e8ff'];
  const companies    = ['Zoho','HTC','FreshWorks','Kissflow','Infoview','Indium','Aspire','Ramco','intellect','Saksoft','Waycool','Payoda','Prodapt','Bahwan Cybertek','Gofrugal','TVS NEXT','ContusTech','Ideas IT','cavinkare','Gofrugal','Data Patterns','Chargebee','Visteon','KaarTech'];
  const whyTags      = ['🎯 Job-Oriented Teaching','🚀 100% Placement','🏭 Industry Relevant Projects','🤝 Placement Support','📜 Industrial Top Certification','💳 No Cost EMI'];
const journeySteps = [
    { emoji: '📝', label: 'Enroll' },
    { emoji: '💡', label: 'Learn & Build' },
    { emoji: '📜', label: 'Get Certified' },
    { emoji: '🏆', label: 'Get Placed' },
];

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#ffffff', color: '#0f172a' }}>

      {/* ── ANNOUNCEMENT BAR ── */}
      <div style={{ background: '#c9953a', padding: isMobile ? '8px 12px' : '10px 16px', textAlign: 'center' }}>
        <span style={{ color: 'black', fontSize: isMobile ? '14px' : '18px', fontWeight: 900, letterSpacing: '0.3px' }}>
          🎓 New Batch Starting &nbsp;
          <span style={{ background: 'rgba(255,255,255,0.25)', padding: '2px 10px', borderRadius: '20px', fontWeight: 800, border: '1px solid rgba(255,255,255,0.4)' }}>April 10, 2026</span>
          &nbsp;— Limited Seats! &nbsp;
          <Link to="/contact" style={{ color: 'white', textDecoration: 'underline', fontWeight: 800 }}>Enroll Now →</Link>
        </span>
      </div>

      {/* ── HERO ── */}
      <section style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', minHeight: isMobile ? 'auto' : '90vh' }}>

        {/* LEFT */}
        <div style={{ background: '#1e3a35', padding: isMobile ? '32px 20px' : '24px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)' }} />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#a7c4bc', fontSize: isMobile ? 12 : 17, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '6px 14px', borderRadius: 30, width: 'fit-content', marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c9953a', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Chennai's Premier IT Institute
          </div>

          <h1 style={{ color: 'white', fontWeight: 900, fontSize: isMobile ? '28px' : 'clamp(28px,3.5vw,48px)', lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: 16 }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(homeContent.heroTitle) }} />

          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: isMobile ? 17 : 22, lineHeight: 1.8, marginBottom: 28, maxWidth: 580, fontWeight: 300 }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(homeContent.heroDescription) }} />

          {/* Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'auto auto', gap: 10, marginBottom: 36, width: isMobile ? '100%' : 'fit-content' }}>
            <Link to="/courses" style={{ display: 'block' }}>
              <button style={{ width: '100%', height: 52, background: 'white', color: '#1e3a35', border: 'none', borderRadius: 8, fontSize: isMobile ? 14 : 18, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap', padding: '0 16px' }}>
                Explore Courses <ArrowRight size={15} />
              </button>
            </Link>
            <Link to="/contact" style={{ display: 'block' }}>
              <button style={{ width: '100%', height: 52, background: 'transparent', color: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 8, fontSize: isMobile ? 14 : 18, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', padding: '0 16px' }}>
                Book Free Demo
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
            {homeContent.stats.slice(0, 3).map((stat, i) => {
              const match = stat.value.match(/^([\d,]+)(.*)$/);
              const number = match ? parseInt(match[1].replace(/,/g, '')) : 0;
              const suffix = match ? match[2] : stat.value;
              return (
                <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none', padding: '0 8px' }}>
                  <div style={{ fontSize: isMobile ? 22 : 30, fontWeight: 900, color: '#c9953a', letterSpacing: '-1px' }}>
                    {number > 0 ? <CountUp end={number} duration={2500} suffix={suffix} /> : stat.value}
                  </div>
                  <div style={{ fontSize: isMobile ? 10 : 14, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4 }}>{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* ── YOUR JOURNEY STARTS HERE ── */}
          <div style={{ marginTop: 28, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 22 }}>

            {/* Section label — same style as "Chennai's Premier IT Institute" badge text */}
            <p style={{ fontSize: isMobile ? 15 : 16, fontWeight: 800, color: 'white', letterSpacing: '2.5px', textTransform: 'uppercase', margin: '0 0 18px 0' }}>
              Your Journey Starts Here
            </p>

            {/* Steps */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {journeySteps.map((step, i) => (
                <>
                  <div key={step.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    {/* Circle — uses existing gold accent colour */}
                    <div style={{
                      width: isMobile ? 42 : 52,
                      height: isMobile ? 42 : 52,
                      borderRadius: '50%',
                      background: 'rgba(201,149,58,0.1)',
                      border: '1.5px solid rgba(201,149,58,0.45)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: isMobile ? 18 : 22,
                    }}>
                      {step.emoji}
                    </div>
                    {/* Label — muted white, same tone as stat labels */}
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: isMobile ? 11 : 13, fontWeight: 700, margin: 0, textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {step.label}
                    </p>
                  </div>

                  {/* Arrow — gold, same as stats value colour */}
                  {i < journeySteps.length - 1 && (
                    <div style={{ color: '#c9953a', fontSize: isMobile ? 16 : 18, fontWeight: 900, flexShrink: 0, marginBottom: 22, opacity: 0.6 }}>
                      →
                    </div>
                  )}
                </>
              ))}
            </div>

          </div>
        </div>

        {/* RIGHT — desktop only */}
        {!isMobile && (
          <div style={{ background: '#f0f7f5', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20, borderLeft: '4px solid #1e3a35' }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#94a3b8', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 4 }}>Book Free Demo</p>
            <div style={{ background: 'white', borderRadius: 14, padding: '20px 22px', border: '1px solid #a7c4bc', boxShadow: '0 2px 12px rgba(30,58,53,0.06)' }}>
              <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 15, marginBottom: 14 }}>Pick a Time Slot</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {['🌅 Morning\n9AM - 12PM', '☀️ Afternoon\n12PM - 3PM', '🌆 Evening\n5PM - 8PM', '📅 Weekend\nSpecial Batch'].map((slot, i) => {
                  const [emoji, time] = slot.split('\n');
                  return (
                    <button key={i} onClick={() => setSelectedSlot(slot)}
                      style={{ padding: '10px 8px', borderRadius: 10, border: selectedSlot === slot ? '2px solid #1e3a35' : '1.5px solid #d4eae4', background: selectedSlot === slot ? '#1e3a35' : '#f0f7f5', color: selectedSlot === slot ? 'white' : '#1e3a35', fontWeight: 700, fontSize: 13, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                      <div>{emoji}</div>
                      <div style={{ fontSize: 11, marginTop: 2, opacity: 0.85 }}>{time}</div>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setIsEnquiryOpen(true)} style={{ width: '100%', background: '#1e3a35', color: 'white', border: 'none', padding: '11px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Book My Free Demo →
              </button>
            </div>

            <p style={{ fontSize: 18, fontWeight: 700, color: '#94a3b8', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 4 }}>Quick Enquiry</p>
            <div style={{ background: 'white', borderRadius: 14, padding: '20px 22px', border: '1px solid #a7c4bc', boxShadow: '0 2px 12px rgba(30,58,53,0.06)' }}>
              <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 17, marginBottom: 16 }}>Get a Free Callback Today</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input value={enquiryName} onChange={e => setEnquiryName(e.target.value)} placeholder="Your Full Name"
                  style={{ border: '1.5px solid #d4eae4', background: '#f0f7f5', borderRadius: 8, padding: '10px 14px', fontSize: 15, width: '100%', outline: 'none', color: '#0f172a', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={enquiryPhone} onChange={e => setEnquiryPhone(e.target.value)} placeholder="Phone Number"
                    style={{ flex: 1, border: '1.5px solid #d4eae4', background: '#f0f7f5', borderRadius: 8, padding: '10px 14px', fontSize: 15, outline: 'none', color: '#0f172a', minWidth: 0 }} />
                  <Link to={`/contact?name=${encodeURIComponent(enquiryName)}&phone=${encodeURIComponent(enquiryPhone)}`}>
                    <button style={{ background: '#1e3a35', color: 'white', border: 'none', padding: '10px 18px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Call Me →</button>
                  </Link>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
              <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Alumni at</span>
              {['TCS','Infosys','Wipro','HCL','Cognizant'].map(c => (
                <span key={c} style={{ fontSize: 13, fontWeight: 700, color: '#1e3a35', background: '#d4eae4', padding: '3px 10px', borderRadius: 4 }}>{c}</span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── MOBILE: Book Demo & Enquiry ── */}
      {isMobile && (
        <section style={{ background: '#f0f7f5', padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: 16, borderTop: '4px solid #1e3a35' }}>
          <div style={{ background: 'white', borderRadius: 14, padding: '18px 16px', border: '1px solid #a7c4bc' }}>
            <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 15, marginBottom: 12 }}>Pick a Time Slot</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              {['🌅 Morning\n9AM - 12PM', '☀️ Afternoon\n12PM - 3PM', '🌆 Evening\n5PM - 8PM', '📅 Weekend\nSpecial Batch'].map((slot, i) => {
                const [emoji, time] = slot.split('\n');
                return (
                  <button key={i} onClick={() => setSelectedSlot(slot)}
                    style={{ padding: '10px 8px', borderRadius: 10, border: selectedSlot === slot ? '2px solid #1e3a35' : '1.5px solid #d4eae4', background: selectedSlot === slot ? '#1e3a35' : '#f0f7f5', color: selectedSlot === slot ? 'white' : '#1e3a35', fontWeight: 700, fontSize: 12, cursor: 'pointer', textAlign: 'center' }}>
                    <div>{emoji}</div>
                    <div style={{ fontSize: 10, marginTop: 2, opacity: 0.85 }}>{time}</div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setIsEnquiryOpen(true)} style={{ width: '100%', background: '#1e3a35', color: 'white', border: 'none', padding: '11px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Book My Free Demo →
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: 14, padding: '18px 16px', border: '1px solid #a7c4bc' }}>
            <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 15, marginBottom: 12 }}>Get a Free Callback Today</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input value={enquiryName} onChange={e => setEnquiryName(e.target.value)} placeholder="Your Full Name"
                style={{ border: '1.5px solid #d4eae4', background: '#f0f7f5', borderRadius: 8, padding: '10px 14px', fontSize: 14, width: '100%', outline: 'none', color: '#0f172a', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={enquiryPhone} onChange={e => setEnquiryPhone(e.target.value)} placeholder="Phone Number"
                  style={{ flex: 1, border: '1.5px solid #d4eae4', background: '#f0f7f5', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', color: '#0f172a', minWidth: 0 }} />
                <Link to={`/contact?name=${encodeURIComponent(enquiryName)}&phone=${encodeURIComponent(enquiryPhone)}`}>
                  <button style={{ background: '#1e3a35', color: 'white', border: 'none', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Call Me →</button>
                </Link>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Alumni at</span>
            {['TCS','Infosys','Wipro','HCL','Cognizant'].map(c => (
              <span key={c} style={{ fontSize: 12, fontWeight: 700, color: '#1e3a35', background: '#d4eae4', padding: '3px 8px', borderRadius: 4 }}>{c}</span>
            ))}
          </div>
        </section>
      )}

      {/* ── COMPANIES TICKER ── */}
      <div style={{ background: '#f1f5f9', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '14px 0' }}>
        <p style={{ textAlign: 'center', fontSize: isMobile ? 11 : 14, fontWeight: 700, color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>Our Alumni Work At</p>
        <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
          <div style={{ display: 'flex', width: 'max-content', animation: 'companiesTicker 60s linear infinite' }}>
            {[...companies, ...companies, ...companies, ...companies].map((co, i) => (
              <span key={i} style={{ fontSize: isMobile ? 13 : 15, fontWeight: 600, color: '#475569', background: 'white', border: '1px solid #e2e8f0', padding: '4px 12px', borderRadius: 6, flexShrink: 0, marginRight: 10, whiteSpace: 'nowrap' }}>{co}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS BAND ── */}
      <section style={{ background: '#1e3a35', padding: isMobile ? '28px 0' : '40px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            {homeContent.stats.map((stat, i) => {
              const match = stat.value.match(/^([\d,]+)(.*)$/);
              const number = match ? parseInt(match[1].replace(/,/g, '')) : 0;
              const suffix = match ? match[2] : stat.value;
              return (
                <div key={i} style={{ textAlign: 'center', padding: isMobile ? '12px 6px' : '16px 8px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                  <div style={{ fontSize: isMobile ? 24 : 40, fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>
                    {number > 0 ? <CountUp end={number} duration={2500} suffix={suffix} /> : stat.value}
                  </div>
                  <div style={{ fontSize: isMobile ? 10 : 14, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4 }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section style={{ padding: isMobile ? '40px 0' : '64px 0', background: '#ffffff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: isMobile ? 13 : 16, fontWeight: 900, color: '#1e3a35', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6 }}>What We Offer</p>
              <h2 style={{ fontSize: isMobile ? 26 : 40, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', margin: 0 }}>Our Courses</h2>
              <p style={{ fontSize: isMobile ? 13 : 18, color: '#64748b', marginTop: 6, letterSpacing: 0, wordSpacing: 0 }}>#1 IT & Non-IT Training Institute in Anna Nagar, Chennai</p>
            </div>
          </div>
          {featuredCourses.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: isMobile ? 10 : 14 }}>
              {featuredCourses.slice(0, 6).map((course, i) => (
                <div key={course._id} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: '20px 18px', position: 'relative', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1e3a35'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(30,58,53,0.1)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}>
                  <span style={{ position: 'absolute', top: 14, right: 18, fontSize: 36, fontWeight: 900, color: '#f0f7f5', lineHeight: 1, userSelect: 'none' }}>{String(i + 1).padStart(2, '0')}</span>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: courseColors[i] || '#d4eae4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>{courseIcons[i] || '📚'}</div>
                  <h4 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.title) }} />
                  <p style={{ fontSize: isMobile ? 14 : 15, color: '#64748b', lineHeight: 1.6, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.shortDescription || course.description) }} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={`/courses/${course.slug}`}><span style={{ fontSize: 18, fontWeight: 700, color: '#1e3a35' }}>→</span></Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>Loading courses...</div>
          )}
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/courses">
              <button style={{ background: '#1e3a35', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 8, fontSize: isMobile ? 15 : 18, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                View All Courses <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY BLIZZEN ── */}
      <section style={{ padding: isMobile ? '40px 0' : '64px 0', background: '#f0f7f5' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 60, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: isMobile ? 12 : 16, fontWeight: 900, color: '#1e3a35', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>Why Choose us</p>
              <h2 style={{ fontSize: isMobile ? 26 : 40, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: 14 }}>
                Not Just Training.<br /><span style={{ color: '#1e3a35' }}>Transformation.</span>
              </h2>
              <p style={{ fontSize: isMobile ? 14 : 17, color: '#64748b', lineHeight: 1.8, marginBottom: 20 }}>
                We don't just teach — we build careers. Every course at Blizzen is designed with one goal: get you placed in your dream company with a great salary.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {whyTags.map(tag => (
                  <span key={tag} style={{ fontSize: isMobile ? 12 : 14, fontWeight: 600, color: '#1e3a35', border: '1px solid #a7c4bc', padding: isMobile ? '7px 10px' : '6px 12px', borderRadius: 30, background: 'white', textAlign: 'center', lineHeight: 1.4 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { icon: '🎯', title: '100% Job-Oriented Teaching', desc: 'Every module mapped to real job descriptions and interview patterns from top companies.' },
                { icon: '🏭', title: 'Industry Relevant Projects',  desc: 'Work on real industry projects and build an impressive portfolio for interviews.' },
                { icon: '👨‍💼', title: 'Expert Trainers',             desc: 'Learn from professionals with 10+ years of hands-on MNC experience.' },
                { icon: '🚀', title: 'Placement Support',           desc: 'Mock interviews, resume building, and 100+ hiring partners to land your dream job.' },
              ].map((feat, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: isMobile ? '14px 12px' : '20px 18px', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1e3a35'; (e.currentTarget as HTMLDivElement).style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)'; }}>
                  <div style={{ fontSize: isMobile ? 18 : 22, marginBottom: 8 }}>{feat.icon}</div>
                  <h4 style={{ fontSize: isMobile ? 13 : 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{feat.title}</h4>
                  <p style={{ fontSize: isMobile ? 12 : 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <TrustSection isMobile={isMobile} trustStats={trustStats} />

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: isMobile ? '40px 0' : '64px 0', background: '#f0f7f5' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: isMobile ? 26 : 40, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', margin: 0 }}>Student Testimonials</h2>
            <p style={{ fontSize: isMobile ? 14 : 18, color: '#64748b', marginTop: 8 }}>Hear from our successful students</p>
          </div>
        </div>
        <div style={{ overflow: 'hidden', width: '100%' }}>
          <div style={{ display: 'flex', width: 'max-content', gap: 14, paddingLeft: 16, animation: 'testimonialsTicker 30s linear infinite' }}>
            {[...homeContent.testimonials, ...homeContent.testimonials].map((t, i) => (
              <div key={i} style={{ flexShrink: 0, width: isMobile ? 240 : 300, background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: '18px 16px' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, si) => <Star key={si} size={13} style={{ color: '#facc15', fill: '#facc15' }} />)}</div>
                <p style={{ fontSize: isMobile ? 13 : 15, color: '#64748b', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 16, minHeight: 60 }} dangerouslySetInnerHTML={{ __html: `"${sanitizeHtml(t.message)}"` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1e3a35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{t.name.charAt(0)}</div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#0f172a', fontSize: isMobile ? 13 : 15, margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: isMobile ? 12 : 13, color: '#94a3b8', margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: isMobile ? '40px 0' : '64px 0', background: '#2a5048' }}>
        <div style={{ maxWidth: isMobile ? '100%' : '70%', margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
          <p style={{ fontSize: isMobile ? 13 : 18, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>Get Started Today</p>
          <h2 style={{ fontSize: isMobile ? 26 : 40, fontWeight: 900, color: 'white', letterSpacing: '-1.5px', marginBottom: 14 }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(homeContent.callToAction.title) }} />
          <p style={{ fontSize: isMobile ? 14 : 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 28 }}>
            Join thousands of successful students and launch your IT, digital marketing, and software development careers with our industry-recognised training programs in Chennai.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <Link to="/courses" style={{ flex: isMobile ? '1 1 100%' : 'none' }}>
              <button style={{ width: isMobile ? '100%' : 'auto', background: 'white', color: '#1e3a35', border: 'none', padding: '13px 28px', borderRadius: 8, fontSize: isMobile ? 15 : 18, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {homeContent.callToAction.buttonText} <ArrowRight size={16} />
              </button>
            </Link>
            <Link to="/contact" style={{ flex: isMobile ? '1 1 100%' : 'none' }}>
              <button style={{ width: isMobile ? '100%' : 'auto', background: 'transparent', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)', padding: '13px 28px', borderRadius: 8, fontSize: isMobile ? 15 : 18, fontWeight: 600, cursor: 'pointer' }}>
                Contact Us
              </button>
            </Link>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 20px' }}>
            {['Free Demo Class','Weekdays & Weekend Batches','100% Placement Assistance','No Cost EMI','Recognised Certificate'].map(pt => (
              <span key={pt} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: isMobile ? 13 : 15, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                <CheckCircle size={13} style={{ color: 'white' }} /> {pt}
              </span>
            ))}
          </div>
        </div>
      </section>

      <EnquiryPopup isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />

      <style>{`
        @keyframes companiesTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes testimonialsTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};

export default Home;
