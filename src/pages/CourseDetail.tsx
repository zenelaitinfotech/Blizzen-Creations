import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import { sanitizeHtml } from "@/lib/html-sanitizer";
import { STATIC_COURSES } from "./Courses";
import {
  Calendar,
  Clock,
  BarChart,
  Award,
  Briefcase,
  Download,
  CheckCircle2,
  Loader2,
  ArrowLeft
} from "lucide-react";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  mentorshipType: string;
  level: string;
  instructor: string;
  syllabus?: string;
  highlights: string[];
  curriculum: Array<{
    module: string;
    topics: string[];
  }>;
  prerequisites: string[];
  courseOverview: {
    title: string;
    content: string;
    showSection: boolean;
  };
  whatYouLearn: {
    title: string;
    items: string[];
    showSection: boolean;
  };
  showHeroSection: boolean;
  showModulesSection: boolean;
  showFeaturesSection: boolean;
  showCtaSection: boolean;
}

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/courses`);
      if (response.data.success) {
        const foundCourse = response.data.data.find((c: Course) => c.slug === slug);
        if (foundCourse) {
          setCourse(foundCourse);
        } else {
          const staticCourse = STATIC_COURSES.find((c) => c.slug === slug);
          if (staticCourse) {
            setCourse(staticCourse as any);
          }
        }
      }
    } catch (error: any) {
      const staticCourse = STATIC_COURSES.find((c) => c.slug === slug);
      if (staticCourse) {
        setCourse(staticCourse as any);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSyllabus = () => {
    if (course?.syllabus) {
      try {
        const link = document.createElement('a');
        link.href = course.syllabus;
        link.download = `${course.title}-Syllabus.pdf`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Download Started", description: "Syllabus download has been initiated" });
      } catch (error) {
        toast({ title: "Download Failed", description: "Failed to download syllabus. Please try again.", variant: "destructive" });
      }
    } else {
      toast({ title: "Syllabus Not Available", description: "Syllabus for this course is not available yet", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Link to="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const modules = course.curriculum && course.curriculum.length > 0 ? course.curriculum : [];

  const learnItems = course.whatYouLearn?.items && course.whatYouLearn.items.length > 0
    ? course.whatYouLearn.items
    : course.highlights && course.highlights.length > 0
      ? course.highlights
      : [
          "Comprehensive curriculum",
          "Expert instruction",
          "Hands-on projects",
          "Industry certification",
          "Placement support"
        ];

  const overviewContent = course.courseOverview?.content || course.description;
  const overviewTitle = course.courseOverview?.title || "Course Overview";
  const learnTitle = course.whatYouLearn?.title || "What You'll Learn";

  const showHero = course.showHeroSection !== false;
  const showOverview = course.courseOverview?.showSection !== false;
  const showLearn = course.whatYouLearn?.showSection !== false;
  const showModules = course.showModulesSection !== false;
  const showFeatures = course.showFeaturesSection !== false;
  const showCta = course.showCtaSection !== false;

  return (
    <div className="min-h-screen pt-20">

      {/* Back Button */}
      <div className="pt-4 pb-2">
        <div className="container mx-auto px-4">
          <Link to="/courses" className="flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>
      </div>

      {/* ── Hero Section ── */}
      {showHero && (
        <section className="py-8 sm:py-10 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-white text-center animate-fade-in">

              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                {course.level}
              </Badge>

              {/* Title: smaller on mobile */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.title) }}
              />

              {/* Description */}
              <p
                className="text-base sm:text-xl mb-6 text-justify text-white/90 px-1"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.description) }}
              />

              {/* Stats row — wraps naturally on mobile */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6">
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>{course.mentorshipType || 'Expert Mentorship'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <BarChart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>{course.level}</span>
                </div>
              </div>

              {/* CTA buttons — stacked on mobile, row on sm+ */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-glow"
                  >
                    Apply Now
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-black hover:bg-white hover:text-primary"
                  onClick={handleDownloadSyllabus}
                  disabled={!course?.syllabus}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Syllabus
                </Button>

                <Link to="/contact" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white text-black hover:bg-white hover:text-primary"
                  >
                    Get Free Demo
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ── Overview Section ── */}
      {showOverview && (
        <section className="py-6 sm:py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">

              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(overviewTitle) }}
              />
              <p
                className="text-base sm:text-lg text-muted-foreground leading-relaxed text-justify mb-4"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(overviewContent) }}
              />

              {/* What You'll Learn */}
              {showLearn && (
                <Card className="mb-4">
                  <CardHeader className="pb-3">
                    <CardTitle
                      className="text-xl sm:text-2xl"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(learnTitle) }}
                    />
                  </CardHeader>
                  <CardContent>
                    {/* 1 col mobile, 2 col md+ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {learnItems.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm sm:text-base">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>
          </div>
        </section>
      )}

      {/* ── Course Modules ── */}
      {showModules && (
        <section className="py-6 sm:py-8 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
                Course Modules
              </h2>

              {modules.length > 0 ? (
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-shadow animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-start sm:items-center gap-3 text-base sm:text-lg">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-primary text-white text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </span>
                          <span>{module.module}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {module.topics.map((topic, topicIndex) => (
                            <li
                              key={topicIndex}
                              className="flex items-start gap-3 text-muted-foreground"
                            >
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                              <span className="text-sm sm:text-base">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Course curriculum will be updated soon.</p>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* ── Course Features ── */}
      {showFeatures && (
        <section className="py-6 sm:py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
                Course Features
              </h2>

              {/* 1 col mobile, 3 col md+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <Award className="w-10 h-10 mx-auto mb-2 text-primary" />
                    <CardTitle className="text-lg">Certification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm sm:text-base text-left">
                      Receive an industry-recognized certificate upon successful completion
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <Briefcase className="w-10 h-10 mx-auto mb-2 text-primary" />
                    <CardTitle className="text-lg">Placement Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      100% job placement assistance with interview preparation
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow sm:col-span-2 md:col-span-1">
                  <CardHeader className="pb-2">
                    <Award className="w-10 h-10 mx-auto mb-2 text-primary" />
                    <CardTitle className="text-lg">Live Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm sm:text-base text-left">
                      Build 5+ real-world projects for your professional portfolio
                    </p>
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Section ── */}
      {showCta && (
        <section className="py-8 sm:py-10 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Ready to Start Your Journey?
            </h2>
            <p className="text-base sm:text-xl text-white/90 mb-6 max-w-2xl mx-auto px-2">
              Join thousands of successful students and launch your full-stack development career today
            </p>

            {/* Stacked on mobile, row on sm+ */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-glow"
                >
                  Enroll Now
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-black hover:bg-white hover:text-primary"
                >
                  Book Free Demo
                </Button>
              </Link>
            </div>

          </div>
        </section>
      )}

    </div>
  );
};

export default CourseDetail;
