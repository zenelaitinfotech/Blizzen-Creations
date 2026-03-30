import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import { STATIC_COURSES } from "@/pages/Courses";
import {
  Plus, Trash2, Loader2, BookOpen,
  X, Save, Search, Eye, EyeOff,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Topic { value: string; }
interface ModuleEntry { moduleName: string; topics: Topic[]; }

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  mentorshipType?: string;
  level: string;
  instructor: string;
  syllabus?: string;
  highlights: string[];
  curriculum?: Array<{ module: string; topics: string[] }>;
  courseOverview?: { title: string; content: string; showSection: boolean };
  whatYouLearn?: { title: string; items: string[]; showSection: boolean };
  showHeroSection?: boolean;
  showModulesSection?: boolean;
  showFeaturesSection?: boolean;
  showCtaSection?: boolean;
  isActive: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const emptyModule = (): ModuleEntry => ({ moduleName: "", topics: [{ value: "" }] });

// ─── Toggle Button ────────────────────────────────────────────────────────────

const Toggle = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
      value
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-muted text-muted-foreground border-border"
    }`}
  >
    {value ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
    {label}: {value ? "Visible" : "Hidden"}
  </button>
);

// ─── Inline Course Editor ─────────────────────────────────────────────────────

const CourseEditor = ({
  course,
  onSave,
  onClose,
}: {
  course: Course;
  onSave: () => void;
  onClose: () => void;
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState(course.title || "");
  const [slug, setSlug] = useState(course.slug || "");
  const [description, setDescription] = useState(course.description || "");
  const [duration, setDuration] = useState(course.duration || "");
  const [mentorshipType, setMentorshipType] = useState(course.mentorshipType || "Expert Mentorship");
  const [level, setLevel] = useState(course.level || "Beginner");
  const [instructor, setInstructor] = useState(course.instructor || "");
  const [syllabus, setSyllabus] = useState(course.syllabus || "");
  const [showHero, setShowHero] = useState(course.showHeroSection !== false);

  const [overviewTitle, setOverviewTitle] = useState(course.courseOverview?.title || "Course Overview");
  const [overviewContent, setOverviewContent] = useState(course.courseOverview?.content || course.description || "");
  const [showOverview, setShowOverview] = useState(course.courseOverview?.showSection !== false);

  const [learnTitle, setLearnTitle] = useState(course.whatYouLearn?.title || "What You'll Learn");
  const [learnItems, setLearnItems] = useState<string[]>(
    course.whatYouLearn?.items?.length
      ? course.whatYouLearn.items
      : course.highlights?.length
      ? course.highlights
      : [""]
  );
  const [showLearn, setShowLearn] = useState(course.whatYouLearn?.showSection !== false);

  const [showModules, setShowModules] = useState(course.showModulesSection !== false);
  const [showFeatures, setShowFeatures] = useState(course.showFeaturesSection !== false);
  const [showCta, setShowCta] = useState(course.showCtaSection !== false);

  const addLearnItem = () => setLearnItems((p) => [...p, ""]);
  const updateLearnItem = (i: number, val: string) =>
    setLearnItems((p) => p.map((x, idx) => (idx === i ? val : x)));
  const removeLearnItem = (i: number) =>
    setLearnItems((p) => p.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`${API_BASE_URL}/api/courses/${course._id}`, {
        title, slug, description, duration, mentorshipType, level, instructor, syllabus,
        showHeroSection: showHero,
        courseOverview: { title: overviewTitle, content: overviewContent, showSection: showOverview },
        whatYouLearn: { title: learnTitle, items: learnItems.filter((i) => i.trim()), showSection: showLearn },
        highlights: learnItems.filter((i) => i.trim()),
        showModulesSection: showModules,
        showFeaturesSection: showFeatures,
        showCtaSection: showCta,
      });
      toast({ title: "Saved", description: "Course updated — changes are live on website" });
      onSave();
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-2 border-primary/30 rounded-xl p-5 bg-primary/5 space-y-6">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Section Visibility — controls what shows on the website
        </p>
        <div className="flex flex-wrap gap-2">
          <Toggle label="Hero" value={showHero} onChange={setShowHero} />
          <Toggle label="Overview" value={showOverview} onChange={setShowOverview} />
          <Toggle label="What You'll Learn" value={showLearn} onChange={setShowLearn} />
          <Toggle label="Modules" value={showModules} onChange={setShowModules} />
          <Toggle label="Features" value={showFeatures} onChange={setShowFeatures} />
          <Toggle label="CTA" value={showCta} onChange={setShowCta} />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          🎯 Hero Section
          {!showHero && <Badge variant="secondary" className="text-xs">Hidden on website</Badge>}
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Course Title *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Front-End Web Development" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Slug (URL) *</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. front-end-web-development" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Duration</label>
            <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 3 Months" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Mentorship Type</label>
            <Input value={mentorshipType} onChange={(e) => setMentorshipType(e.target.value)} placeholder="e.g. Expert Mentorship" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {["Beginner", "Intermediate", "Advanced", "All Levels"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Instructor</label>
            <Input value={instructor} onChange={(e) => setInstructor(e.target.value)} placeholder="Instructor name" />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Hero Description</label>
          <RichTextEditor value={description} onChange={setDescription} rows={2} placeholder="Short description shown in hero banner" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Syllabus PDF URL</label>
          <Input value={syllabus} onChange={(e) => setSyllabus(e.target.value)} placeholder="https://..." />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          📋 Course Overview Section
          {!showOverview && <Badge variant="secondary" className="text-xs">Hidden on website</Badge>}
        </p>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Section Heading</label>
          <Input value={overviewTitle} onChange={(e) => setOverviewTitle(e.target.value)} placeholder="Course Overview" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Overview Content</label>
          <RichTextEditor value={overviewContent} onChange={setOverviewContent} rows={4} placeholder="Detailed course overview..." />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          ✅ What You'll Learn Section
          {!showLearn && <Badge variant="secondary" className="text-xs">Hidden on website</Badge>}
        </p>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Section Heading</label>
          <Input value={learnTitle} onChange={(e) => setLearnTitle(e.target.value)} placeholder="What You'll Learn" />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground block">Items — each one appears with a ✓ checkmark</label>
          {learnItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-5 flex-shrink-0">{i + 1}.</span>
              <Input value={item} onChange={(e) => updateLearnItem(i, e.target.value)} placeholder={`Learning point ${i + 1}`} className="h-9" />
              <button type="button" onClick={() => removeLearnItem(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addLearnItem} className="flex items-center gap-1 text-sm text-primary hover:underline mt-1">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      <div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground">
        <strong>Course Modules</strong> are managed in the <em>Course Modules</em> section below. &nbsp;|&nbsp;
        <strong>Course Features</strong> &amp; <strong>CTA</strong> content is fixed — use the toggles above to show/hide them.
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save & Go Live
        </Button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminCourses = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [savingModules, setSavingModules] = useState(false);

  // ── Course Modules search ─────────────────────────────────────────────────
  const [moduleSearch, setModuleSearch] = useState("");
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const moduleDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moduleDropdownRef.current && !moduleDropdownRef.current.contains(e.target as Node)) {
        setShowModuleDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [columns, setColumns] = useState<ModuleEntry[][]>([
    [emptyModule()], [emptyModule()], [emptyModule()],
  ]);

  const [addForm, setAddForm] = useState({
    title: "", slug: "", description: "", shortDescription: "",
    duration: "", instructor: "", level: "Beginner", price: 0,
  });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/courses`);
      const dbCourses: Course[] = response.data?.success ? response.data.data : [];
      // Merge DB courses with static courses (DB takes priority, static fills gaps)
      const staticAsDb = (STATIC_COURSES as any[]).filter(
        (sc) => !dbCourses.find((db) => db.slug === sc.slug)
      );
      setCourses([...dbCourses, ...staticAsDb]);
    } catch {
      // If API fails, fall back to static courses only
      setCourses(STATIC_COURSES as any[]);
      toast({ title: "Note", description: "Using offline course data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const SEED_COURSES = [
    { title: "Front-End Web Development", slug: "frontend-web-development", description: "HTML, CSS, JavaScript, React", level: "Beginner", duration: "3 Months", instructor: "", highlights: ["HTML", "CSS", "React"] },
    { title: "Python Programming", slug: "python-programming", description: "Learn Python from basics to advanced", level: "Beginner", duration: "2 Months", instructor: "", highlights: ["Python", "Logic", "Projects"] },
    { title: "Java Programming", slug: "java-programming", description: "Core Java + OOP concepts", level: "Beginner", duration: "3 Months", instructor: "", highlights: ["OOP", "Java", "Practice"] },
    { title: "C & C++ Programming", slug: "c-cpp-programming", description: "Programming fundamentals with C & C++", level: "Beginner", duration: "2 Months", instructor: "", highlights: ["C", "C++", "Logic"] },
    { title: "Data Analytics & Big Data", slug: "data-analytics-big-data", description: "Data analysis using modern tools", level: "Intermediate", duration: "3 Months", instructor: "", highlights: ["Data", "Analytics", "Tools"] },
    { title: "DevOps & Automation Engineering", slug: "devops-automation", description: "CI/CD, Docker, Automation", level: "Intermediate", duration: "3 Months", instructor: "", highlights: ["Docker", "CI/CD", "Automation"] },
    { title: "Artificial Intelligence", slug: "artificial-intelligence", description: "AI from fundamentals to advanced", level: "Advanced", duration: "4 Months", instructor: "", highlights: ["AI", "ML", "Deep Learning"] },
    { title: "iOS App Development", slug: "ios-development", description: "Swift & SwiftUI development", level: "Intermediate", duration: "3 Months", instructor: "", highlights: ["Swift", "iOS", "Apps"] },
    { title: "Deep Learning", slug: "deep-learning", description: "TensorFlow & Keras", level: "Advanced", duration: "3 Months", instructor: "", highlights: ["TensorFlow", "Keras", "AI"] },
    { title: "AWS Cloud & DevOps", slug: "aws-cloud-devops", description: "Cloud computing with AWS", level: "Intermediate", duration: "3 Months", instructor: "", highlights: ["AWS", "Cloud", "DevOps"] },
    { title: "Golang & REST API", slug: "golang-rest-api", description: "Backend development with Go", level: "Intermediate", duration: "2 Months", instructor: "", highlights: ["Go", "API", "Backend"] },
    { title: "Full Stack .NET Development", slug: "dotnet-development", description: "C#, ASP.NET Core & SQL", level: "Intermediate", duration: "4 Months", instructor: "", highlights: ["C#", ".NET", "SQL"] },
    { title: "Advanced PHP & MySQL", slug: "php-mysql", description: "Dynamic web development", level: "Intermediate", duration: "2 Months", instructor: "", highlights: ["PHP", "MySQL", "Web"] },
    { title: "Software Testing", slug: "software-testing", description: "Manual & Automation testing", level: "Beginner", duration: "2 Months", instructor: "", highlights: ["Selenium", "API", "Testing"] },
    { title: "Cybersecurity Fundamentals", slug: "cybersecurity", description: "Security basics & ethical hacking", level: "Intermediate", duration: "3 Months", instructor: "", highlights: ["Security", "Hacking", "Network"] },
    { title: "AI Prompt Engineering", slug: "prompt-engineering", description: "Master AI tools like ChatGPT", level: "Beginner", duration: "1 Month", instructor: "", highlights: ["AI", "Prompt", "Tools"] },
    { title: "UI / UX Design", slug: "ui-ux", description: "Design with Figma & user research", level: "Beginner", duration: "2 Months", instructor: "", highlights: ["Figma", "Design", "UX"] },
    { title: "Digital Marketing", slug: "digital-marketing", description: "SEO, Ads & Social Media", level: "Beginner", duration: "2 Months", instructor: "", highlights: ["SEO", "Ads", "Marketing"] },
    { title: "Spoken English Mastery", slug: "spoken-english", description: "Improve communication skills", level: "Beginner", duration: "2 Months", instructor: "", highlights: ["Speaking", "Grammar", "Fluency"] },
    { title: "Tally & GST", slug: "tally-gst", description: "Accounting with Tally & GST", level: "Beginner", duration: "2 Months", instructor: "", highlights: ["Tally", "GST", "Accounts"] },
    { title: "Graphic Design & Branding", slug: "graphic-design", description: "Creative design and branding", level: "Beginner", duration: "2 Months", instructor: "", highlights: ["Design", "Branding", "Creative"] },
    { title: "Advanced SAP", slug: "sap-course", description: "Enterprise resource planning tools", level: "Advanced", duration: "3 Months", instructor: "", highlights: ["SAP", "ERP", "Business"] },
  ];

  const [seeding, setSeeding] = useState(false);

  const handleSeedCourses = async () => {
    if (!confirm(`This will add all ${SEED_COURSES.length} static courses to your database. Continue?`)) return;
    setSeeding(true);
    let success = 0, failed = 0;
    for (const course of SEED_COURSES) {
      try {
        await axios.post(`${API_BASE_URL}/api/courses`, course);
        success++;
      } catch {
        failed++;
      }
    }
    toast({
      title: `Seeded ${success} courses`,
      description: failed > 0 ? `${failed} failed (may already exist)` : "All courses added to database!",
    });
    setSeeding(false);
    fetchCourses();
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAddLoading(true);
      await axios.post(`${API_BASE_URL}/api/courses`, addForm);
      toast({ title: "Created", description: "Course created successfully" });
      setAddForm({ title: "", slug: "", description: "", shortDescription: "", duration: "", instructor: "", level: "Beginner", price: 0 });
      fetchCourses();
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to create", variant: "destructive" });
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/courses/${id}`);
      toast({ title: "Deleted", description: "Course deleted" });
      if (selectedCourse?._id === id) {
        setSelectedCourse(null);
        setColumns([[emptyModule()], [emptyModule()], [emptyModule()]]);
      }
      fetchCourses();
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setModuleSearch("");
    if (course.curriculum && course.curriculum.length > 0) {
      const cols: ModuleEntry[][] = [[], [], []];
      course.curriculum.forEach((mod, i) => {
        cols[i % 3].push({
          moduleName: mod.module,
          topics: mod.topics.length ? mod.topics.map((t) => ({ value: t })) : [{ value: "" }],
        });
      });
      cols.forEach((col, i) => { if (!col.length) cols[i] = [emptyModule()]; });
      setColumns(cols);
    } else {
      setColumns([[emptyModule()], [emptyModule()], [emptyModule()]]);
    }
    setTimeout(() => document.getElementById("modules-section")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // Module helpers
  const updateModuleName = (ci: number, mi: number, val: string) =>
    setColumns((p) => p.map((col, c) => c === ci ? col.map((m, x) => x === mi ? { ...m, moduleName: val } : m) : col));
  const updateTopic = (ci: number, mi: number, ti: number, val: string) =>
    setColumns((p) => p.map((col, c) => c === ci ? col.map((m, x) => x === mi ? { ...m, topics: m.topics.map((t, y) => y === ti ? { value: val } : t) } : m) : col));
  const addTopic = (ci: number, mi: number) =>
    setColumns((p) => p.map((col, c) => c === ci ? col.map((m, x) => x === mi ? { ...m, topics: [...m.topics, { value: "" }] } : m) : col));
  const removeTopic = (ci: number, mi: number, ti: number) =>
    setColumns((p) => p.map((col, c) => c === ci ? col.map((m, x) => x === mi ? { ...m, topics: m.topics.filter((_, y) => y !== ti) } : m) : col));
  const addModule = (ci: number) => {
    if (columns[ci].length >= 20) { toast({ title: "Limit reached", description: "Max 20 modules per column", variant: "destructive" }); return; }
    setColumns((p) => p.map((col, c) => c === ci ? [...col, emptyModule()] : col));
  };
  const removeModule = (ci: number, mi: number) =>
    setColumns((p) => p.map((col, c) => c === ci ? col.filter((_, x) => x !== mi) : col));

  // Filtered list for module search — must be defined before handleSaveModules
  const filteredModuleCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(moduleSearch.toLowerCase())
  );

  const handleSaveModules = async () => {
    // Use already-selected course, or auto-pick if exactly one match
    const activeCourse = selectedCourse ?? (filteredModuleCourses.length === 1 ? filteredModuleCourses[0] : null);
    if (!activeCourse) {
      toast({ title: "No course selected", description: "Please click a course from the dropdown in Step 1.", variant: "destructive" });
      return;
    }
    if (!selectedCourse) handleSelectCourse(activeCourse);
    setSavingModules(true);
    try {
      const curriculum = columns.flatMap((col) =>
        col.filter((m) => m.moduleName.trim()).map((m) => ({
          module: m.moduleName.trim(),
          topics: m.topics.map((t) => t.value.trim()).filter(Boolean),
        }))
      );
      await axios.put(`${API_BASE_URL}/api/courses/${activeCourse._id}`, { curriculum });
      toast({ title: "Saved", description: "Modules are now live on the website" });
      fetchCourses();
    } catch {
      toast({ title: "Error", description: "Failed to save modules", variant: "destructive" });
    } finally {
      setSavingModules(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ══ 1. ADD NEW COURSE ══════════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> Add New Course</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSeedCourses}
              disabled={seeding}
              className="text-xs border-primary text-primary hover:bg-primary hover:text-white"
            >
              {seeding ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : "🌱"}
              {seeding ? "Seeding..." : `Seed All ${22} Static Courses`}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Course Title *</label>
                <Input placeholder="e.g. Front-End Web Development" value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Slug (URL) *</label>
                <Input placeholder="e.g. front-end-web-development" value={addForm.slug} onChange={(e) => setAddForm({ ...addForm, slug: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Full Description</label>
              <RichTextEditor placeholder="Full description" value={addForm.description} onChange={(v) => setAddForm({ ...addForm, description: v })} rows={3} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Short Description (shown on course listing cards)</label>
              <Input placeholder="Brief one-liner for course cards" value={addForm.shortDescription} onChange={(e) => setAddForm({ ...addForm, shortDescription: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Duration</label>
                <Input placeholder="e.g. 3 Months" value={addForm.duration} onChange={(e) => setAddForm({ ...addForm, duration: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Instructor</label>
                <Input placeholder="Instructor name" value={addForm.instructor} onChange={(e) => setAddForm({ ...addForm, instructor: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Level</label>
                <select
                  value={addForm.level}
                  onChange={(e) => setAddForm({ ...addForm, level: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {["Beginner", "Intermediate", "Advanced", "All Levels"].map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={addLoading}>
                {addLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Create Course
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ══ 2. COURSE MODULES ════════════════════════════════════════════════ */}
      <Card id="modules-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> Course Modules</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Add/remove modules &amp; topics per course. Save to make them live instantly on the website.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Step 1 — Select Course */}
          <div className="border rounded-xl p-4 bg-muted/20">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Step 1 — Select a Course
            </p>

            {selectedCourse ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg">
                <span className="text-sm font-semibold text-primary flex-1">✓ {selectedCourse.title}</span>
                <button
                  onClick={() => { setSelectedCourse(null); setColumns([[emptyModule()], [emptyModule()], [emptyModule()]]); setModuleSearch(""); }}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative" ref={moduleDropdownRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Click here to see all courses or type to search..."
                  value={moduleSearch}
                  onChange={(e) => {
                    setModuleSearch(e.target.value);
                    setShowModuleDropdown(true);
                  }}
                  onFocus={() => setShowModuleDropdown(true)}
                  className="pl-9"
                />
                {showModuleDropdown && (
                  <div
                    className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {loading ? (
                      <p className="text-sm text-muted-foreground px-4 py-3 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Loading courses...</p>
                    ) : courses.length === 0 ? (
                      <p className="text-sm text-red-500 px-4 py-3">⚠ No courses loaded — check API connection or add a course above first.</p>
                    ) : filteredModuleCourses.length === 0 ? (
                      <p className="text-sm text-muted-foreground px-4 py-3">No courses match "{moduleSearch}"</p>
                    ) : (
                      filteredModuleCourses.map((course) => (
                        <button
                          key={course._id}
                          onMouseDown={() => { handleSelectCourse(course); setShowModuleDropdown(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between border-b last:border-0"
                        >
                          <span>{course.title}</span>
                          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                            {course.curriculum?.length ? `${course.curriculum.length} modules` : "No modules yet"}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 2 — Module Editor */}
          <div className="border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Step 2 — Add / Edit Modules &amp; Topics
                </p>
                {selectedCourse ? (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Editing: <span className="font-semibold text-primary">{selectedCourse.title}</span>
                  </p>
                ) : (
                  // ── Shown as a soft hint, NOT blocking Add Module actions ──
                  <p className="text-sm text-amber-600 font-medium mt-0.5">
                    ⚠️ Search and select a course in Step 1 above
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {selectedCourse && (
                  <Button variant="outline" size="sm" onClick={() => { setSelectedCourse(null); setColumns([[emptyModule()], [emptyModule()], [emptyModule()]]); }}>
                    <X className="w-4 h-4 mr-1" /> Clear
                  </Button>
                )}
                <Button size="sm" onClick={handleSaveModules} disabled={savingModules}>
                  {savingModules ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                  Save Modules
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {columns.map((col, ci) => (
                <div key={ci} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Column {ci + 1}</h4>
                    <span className="text-xs text-muted-foreground">{col.length}/20</span>
                  </div>

                  {col.map((mod, mi) => (
                    <div key={mi} className="border rounded-lg p-3 space-y-2 bg-background">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-5 flex-shrink-0 font-medium">{mi + 1}.</span>
                        <Input
                          placeholder={`Module ${mi + 1} name`}
                          value={mod.moduleName}
                          onChange={(e) => updateModuleName(ci, mi, e.target.value)}
                          className="h-8 text-sm font-medium"
                        />
                        <button onClick={() => removeModule(ci, mi)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-1 pl-5">
                        {mod.topics.map((topic, ti) => (
                          <div key={ti} className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground w-3 flex-shrink-0">•</span>
                            <Input
                              placeholder={`Topic ${ti + 1}`}
                              value={topic.value}
                              onChange={(e) => updateTopic(ci, mi, ti, e.target.value)}
                              className="h-7 text-xs"
                            />
                            <button onClick={() => removeTopic(ci, mi, ti)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button onClick={() => addTopic(ci, mi)} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1 transition-colors">
                          <Plus className="w-3 h-3" /> Add Topic
                        </button>
                      </div>
                    </div>
                  ))}

                  {col.length < 20 ? (
                    <button
                      onClick={() => addModule(ci)}
                      className="w-full text-sm text-muted-foreground border-2 border-dashed rounded-lg py-2 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Module
                    </button>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center">Max 20 reached</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t">
              <Button onClick={handleSaveModules} disabled={savingModules}>
                {savingModules ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save All Modules
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCourses;
