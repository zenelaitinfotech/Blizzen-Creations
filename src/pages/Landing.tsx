"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  Target,
  Award,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ================= DATA ================= */
const highlights = [
  { icon: Target, title: "Industry-Focused", description: "Curriculum designed with current market demands" },
  { icon: Users, title: "Expert Mentorship", description: "Learn from working IT professionals" },
  { icon: Award, title: "Job-Ready Skills", description: "Practical training with real projects" },
  { icon: Lightbulb, title: "Innovation First", description: "Stay ahead with latest technologies" },
];

/* ================= TYPES ================= */
type Course = { id: string; title: string; duration: string; careerOpportunities: string };
type Feature = { id: string; title: string; description: string };

type LandingData = {
  hero: { title: string; subtitle: string; cta: string };
  about: { description: string };
  courses: Course[];
  features: Feature[];
  contact: { phone: string; email: string; address: string };
};

export default function LandingPage() {
  const [data, setData] = useState<LandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* ================= BASE URL ================= */
  const BASE_URL =
    process.env.VITE_API_URL ||
    (typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://your-backend-url.com");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/landing`);
        if (!res.ok) throw new Error("Fetch failed");
        const json = await res.json();
        setTimeout(() => setData(json), 800);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 900);
      }
    };
    fetchData();
  }, [BASE_URL]);

  /* ================= CAROUSEL ================= */
  useEffect(() => {
    if (isPaused || !data?.courses.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % data.courses.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, data]);

  /* ================= LOADING UI ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-lg text-muted-foreground animate-pulse">
          Preparing your learning journey…
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl mt-10 px-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data)
    return <div className="p-10 text-center text-red-500">Failed to load page</div>;

  const prev = () =>
    setCurrentIndex((p) => (p - 1 + data.courses.length) % data.courses.length);
  const next = () =>
    setCurrentIndex((p) => (p + 1) % data.courses.length);

  const handleApplyNow = (course: string) => {
    const msg = encodeURIComponent(
      `Hi! I'm interested in the ${course} course at Blizzen Creations.`
    );
    window.open(`https://wa.me/919884264816?text=${msg}`, "_blank");
  };

  return (
    <main className="overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 text-center">
        <div className="w-full max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {data.hero.title}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-8 px-2">
            {data.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="#contact">
                Enroll Now <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <a href="https://wa.me/919884264816" target="_blank">
                <Play className="mr-2 w-4 h-4" /> Free Demo
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="scroll-mt-24 py-12 px-4 sm:px-6 md:px-10 bg-secondary/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-snug">
              Why Choose <span className="text-primary">Blizzen Creations</span>?
            </h2>
            <p className="text-muted-foreground leading-relaxed text-justify text-sm sm:text-base">
              {data.about.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="bg-background p-4 sm:p-6 rounded-xl border hover:shadow-lg transition-all"
              >
                <h.icon className="text-primary mb-3 w-5 h-5 sm:w-6 sm:h-6" />
                <h3 className="font-semibold text-sm sm:text-base">{h.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{h.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COURSES ================= */}
      <section id="courses" className="scroll-mt-24 py-16 px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Launch Your <span className="text-primary">IT Career</span>
          </h2>
        </div>

        <div
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* FIX: Arrows inside the container, not hanging outside */}
          <button
            onClick={prev}
            className="absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 z-10 bg-background border rounded-full p-1.5 sm:p-2 shadow hover:shadow-md transition"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 z-10 bg-background border rounded-full p-1.5 sm:p-2 shadow hover:shadow-md transition"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="overflow-hidden mx-8 sm:mx-6">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {data.courses.map((course) => (
                <div key={course.id} className="min-w-full px-1 sm:px-2">
                  <Card>
                    <CardHeader className="bg-primary text-white text-center py-5 px-4">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{course.title}</h3>
                    </CardHeader>

                    <CardContent className="space-y-5 p-4 sm:p-6">
                      <div className="flex flex-wrap gap-4 justify-center">
                        <div className="flex gap-2 items-center text-sm sm:text-base">
                          <Clock className="text-primary w-4 h-4" />
                          {course.duration}
                        </div>
                        <div className="flex gap-2 items-center text-sm sm:text-base">
                          <TrendingUp className="text-primary w-4 h-4" />
                          ₹4–12 LPA
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Career Opportunities</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {course.careerOpportunities.split(",").map((r, i) => (
                            <Badge key={i} variant="outline" className="text-xs sm:text-sm">
                              {r.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {[
                          "Real-time projects",
                          "Placement support",
                          "Interview preparation",
                          "Expert mentorship",
                        ].map((item, i) => (
                          <div key={i} className="flex gap-2 items-center text-sm sm:text-base">
                            <CheckCircle2 className="text-primary w-4 h-4 flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="justify-center pb-6">
                      <Button size="lg" onClick={() => handleApplyNow(course.title)} className="w-full sm:w-auto">
                        Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-5">
            {data.courses.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentIndex ? "bg-primary scale-125" : "bg-muted-foreground/30"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="py-16 px-4 sm:px-6 md:px-10 bg-gradient-to-b from-background to-muted/30">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <span className="inline-block text-primary font-semibold mb-4 uppercase tracking-wider text-xs sm:text-sm">
            Get In Touch
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            Start Your IT Career Journey Today
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Have questions? We'd love to hear from you. Send us a message and we'll
            respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {/* Phone */}
          {data.contact.phone && (
            <div className="group bg-background rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all border">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition text-lg sm:text-xl">
                📞
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-1">Call Us</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{data.contact.phone}</p>
            </div>
          )}

          {/* Email */}
          {data.contact.email && (
            <div className="group bg-background rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all border">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition text-lg sm:text-xl">
                ✉️
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-1">Email Us</h3>
              <p className="text-sm sm:text-base text-muted-foreground break-all">
                {data.contact.email}
              </p>
            </div>
          )}

          {/* Address */}
          {data.contact.address && (
            <div className="group bg-background rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all border sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition text-lg sm:text-xl">
                📍
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-1">Visit Us</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{data.contact.address}</p>
            </div>
          )}
        </div>
      </section>

    </main>
  );
}
