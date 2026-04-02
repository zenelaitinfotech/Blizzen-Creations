import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { Mail, Phone, MapPin, Clock, Loader2 } from "lucide-react";

// ── Mobile hook ──
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

interface ContactInfo {
  _id: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: Array<{ label: string; number: string }>;
  email: Array<{ label: string; address: string }>;
  officeHours: Record<string, string>;
  socialLinks?: Record<string, string>;
}

const Contact = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get("name");
    const phone = params.get("phone");
    if (name || phone) {
      setFormData(prev => ({ ...prev, name: name || "", phone: phone || "" }));
    }
  }, [location.search]);

  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", course: "",
    qualification: "", experience: "", placementRequired: "", message: "",
  });

  useEffect(() => { fetchContactInfo(); }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const data = await apiService.getContactInfo();
      if (data.success) setContactInfo(data.data);
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to fetch contact info", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const data = await apiService.postEnquiry(formData);
      if (data.success) {
        toast({ title: "Thank you for your interest!", description: "Our counselor will reach out to you within 24 hours." });
        setFormData({ name: "", email: "", phone: "", course: "", qualification: "", experience: "", placementRequired: "", message: "" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to submit enquiry. Please try again.", variant: "destructive" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 style={{ width: 32, height: 32, color: "#0d9488", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  // ── Icon box ──
  const IconBox = ({ icon }: { icon: React.ReactNode }) => (
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: "#1e3a35",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {icon}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#fff" }}>

      {/* ── Hero ── */}
      <section style={{ background: "linear-gradient(to bottom, rgba(13,148,136,0.07), #fff)", padding: isMobile ? "48px 16px 32px" : "64px 32px 48px", textAlign: "center" }}>
        <h1 style={{ fontSize: isMobile ? 28 : 48, fontWeight: 900, color: "#0f172a", marginBottom: 12, letterSpacing: "-1px" }}>
          Get In Touch
        </h1>
        <p style={{ fontSize: isMobile ? 15 : 18, color: "#64748b", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          Ready to start your IT career journey? Contact us today and let's discuss your goals.
        </p>
      </section>

      {/* ── Main Layout ── */}
      <section style={{ padding: isMobile ? "24px 16px 48px" : "48px 32px 64px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "320px 1fr",
          gap: isMobile ? 24 : 40,
          alignItems: "start",
        }}>

          {/* ── Info Cards — stacked vertically on both mobile & desktop ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Visit Us */}
            <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "20px 20px", display: "flex", gap: 16, alignItems: "flex-start", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <IconBox icon={<MapPin size={20} color="white" />} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Visit Us</p>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0, wordBreak: "break-word" }}>
                  {contactInfo?.companyName}<br />
                  {contactInfo?.address}<br />
                  {contactInfo?.city}, {contactInfo?.state} {contactInfo?.zipCode}
                </p>
              </div>
            </div>

            {/* Call Us */}
            <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "20px 20px", display: "flex", gap: 16, alignItems: "flex-start", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <IconBox icon={<Phone size={20} color="white" />} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Call Us</p>
                <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8 }}>
                  {contactInfo?.phone.map((p, idx) => (
                    <div key={idx}>
                      <a href={`tel:${p.number}`} style={{ color: "#64748b", textDecoration: "none" }}>{p.number}</a>
                    </div>
                  ))}
                  <div>
                    <a href="tel:9884264816" style={{ color: "#64748b", textDecoration: "none" }}>9884264816</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Us */}
            <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "20px 20px", display: "flex", gap: 16, alignItems: "flex-start", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <IconBox icon={<Mail size={20} color="white" />} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Email Us</p>
                <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8 }}>
                  {contactInfo?.email.map((e, idx) => (
                    <div key={idx} style={{ wordBreak: "break-all" }}>
                      <a href={`mailto:${e.address}`} style={{ color: "#64748b", textDecoration: "none" }}>{e.address}</a>
                    </div>
                  ))}
                  <div style={{ wordBreak: "break-all" }}>
                    <a href="mailto:blizzencreations@gmail.com" style={{ color: "#64748b", textDecoration: "none" }}>blizzencreations@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "20px 20px", display: "flex", gap: 16, alignItems: "flex-start", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <IconBox icon={<Clock size={20} color="white" />} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Office Hours</p>
                <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8 }}>
                  <div>Mon–Fri: {contactInfo?.officeHours?.monday}</div>
                  <div>Sat: {contactInfo?.officeHours?.saturday}</div>
                  <div>Sun: {contactInfo?.officeHours?.sunday}</div>
                </div>
              </div>
            </div>

          </div>

          {/* ── Enquiry Form ── */}
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: isMobile ? "24px 16px" : "36px 32px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontSize: isMobile ? 22 : 30, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
              Course Enquiry Form
            </h2>
            <p style={{ fontSize: isMobile ? 13 : 15, color: "#64748b", marginBottom: 24 }}>
              Fill out the form below and we'll get back to you shortly
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Name + Email */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                <div>
                  <Label htmlFor="name" style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Full Name *</Label>
                  <Input id="name" placeholder="Enter your full name" value={formData.name}
                    onChange={e => handleChange("name", e.target.value)} required
                    style={{ height: 44, fontSize: 14 }} />
                </div>
                <div>
                  <Label htmlFor="email" style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Email Address *</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" value={formData.email}
                    onChange={e => handleChange("email", e.target.value)} required
                    style={{ height: 44, fontSize: 14 }} />
                </div>
              </div>

              {/* Phone + Course */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                <div>
                  <Label htmlFor="phone" style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Phone Number *</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone}
                    onChange={e => handleChange("phone", e.target.value)} required
                    style={{ height: 44, fontSize: 14 }} />
                </div>
                <div>
                  <Label htmlFor="course" style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Course Interested In *</Label>
                  <Input id="course" placeholder="Type your course name" value={formData.course}
                    onChange={e => handleChange("course", e.target.value)} required
                    style={{ height: 44, fontSize: 14 }} />
                </div>
              </div>

              {/* Qualification + Experience */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                <div>
                  <Label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Highest Qualification</Label>
                  <Select value={formData.qualification} onValueChange={v => handleChange("qualification", v)}>
                    <SelectTrigger style={{ height: 44, fontSize: 14 }}>
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10th">10th Grade</SelectItem>
                      <SelectItem value="12th">12th Grade</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="postgraduate">Post Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Work Experience</Label>
                  <Select value={formData.experience} onValueChange={v => handleChange("experience", v)}>
                    <SelectTrigger style={{ height: 44, fontSize: 14 }}>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="college-student">College Student</SelectItem>
                      <SelectItem value="fresher">Fresher</SelectItem>
                      <SelectItem value="0-1">0–1 Year</SelectItem>
                      <SelectItem value="1-3">1–3 Years</SelectItem>
                      <SelectItem value="3-5">3–5 Years</SelectItem>
                      <SelectItem value="5+">5+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Placement */}
              <div>
                <Label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Placement Support Required?</Label>
                <Select value={formData.placementRequired} onValueChange={v => handleChange("placementRequired", v)}>
                  <SelectTrigger style={{ height: 44, fontSize: 14 }}>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="maybe">Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Additional Message (Optional)</Label>
                <Textarea id="message" placeholder="Tell us more about your goals and expectations..."
                  rows={4} value={formData.message}
                  onChange={e => handleChange("message", e.target.value)}
                  style={{ fontSize: 14, resize: "none" }} />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={formLoading}
                style={{
                  width: "100%", height: 48,
                  background: formLoading ? "#94a3b8" : "#1e3a35",
                  color: "white", border: "none", borderRadius: 10,
                  fontSize: isMobile ? 15 : 16, fontWeight: 700,
                  cursor: formLoading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => { if (!formLoading) (e.currentTarget as HTMLButtonElement).style.background = "#0d9488"; }}
                onMouseLeave={e => { if (!formLoading) (e.currentTarget as HTMLButtonElement).style.background = "#1e3a35"; }}
              >
                {formLoading ? (
                  <><Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> Submitting...</>
                ) : "Submit Enquiry"}
              </button>

            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;
