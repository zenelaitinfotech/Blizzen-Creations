import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { apiService } from "@/services/api";
import { sanitizeHtml } from "@/lib/html-sanitizer";

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

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image?: string;
  publishedAt: string;
  tags: string[];
}

const Blog = () => {
  const isMobile = useIsMobile();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getBlogs(selectedCategory);
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["all", ...Array.from(new Set(posts.map(post => post.category)))];

  const filteredPosts = selectedCategory === "all"
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">

      {/* ── Hero Section ── */}
      <section
        className="py-20 bg-gradient-to-b from-primary/5 to-background"
        style={{ padding: isMobile ? "40px 0 28px" : undefined }}
      >
        <div className="container mx-auto px-4" style={{ padding: isMobile ? "0 16px" : undefined }}>
          <div className="text-center mb-12 animate-fade-in" style={{ marginBottom: isMobile ? 24 : undefined }}>
            <h1
              className="font-bold mb-6"
              style={{ fontSize: isMobile ? 32 : undefined, marginBottom: isMobile ? 12 : undefined }}
            >
              Our Blog
            </h1>
            <p
              className="text-muted-foreground mx-auto"
              style={{ fontSize: isMobile ? 15 : undefined, maxWidth: isMobile ? "100%" : "48rem" }}
            >
              Stay updated with the latest trends, tips, and insights in technology and career development
            </p>
          </div>

          {/* Category Filter */}
          <div
            className="flex flex-wrap justify-center gap-3 mb-12"
            style={{ gap: isMobile ? 8 : undefined, marginBottom: isMobile ? 0 : undefined }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: isMobile ? "6px 16px" : "8px 24px",
                  fontSize: isMobile ? 13 : undefined,
                  borderRadius: 999,
                }}
                className={`transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog Posts Grid ── */}
      <section style={{ padding: isMobile ? "32px 0" : undefined }} className="py-20">
        <div className="container mx-auto px-4" style={{ padding: isMobile ? "0 16px" : undefined }}>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No blog posts found.</p>
            </div>
          ) : (
            <>
              {/* Results count */}
              <div
                className="mb-6 text-muted-foreground"
                style={{ fontSize: isMobile ? 13 : undefined, marginBottom: isMobile ? 16 : undefined }}
              >
                Showing {indexOfFirstPost + 1}–{Math.min(indexOfLastPost, filteredPosts.length)} of {filteredPosts.length} posts
              </div>

              {/* Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : undefined,
                  gap: isMobile ? 16 : undefined,
                }}
                className={isMobile ? "" : "grid md:grid-cols-2 lg:grid-cols-3 gap-8"}
              >
                {currentPosts.map((post, index) => (
                  <Link key={post._id} to={`/blog/${post.slug}`} className="group">
                    <Card
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up h-full"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {post.image && (
                        <div
                          className="relative overflow-hidden"
                          style={{ height: isMobile ? 180 : 192 }}
                        >
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Badge className="absolute top-4 right-4 bg-primary/90">
                            {post.category}
                          </Badge>
                        </div>
                      )}

                      <CardHeader style={{ padding: isMobile ? "14px 14px 8px" : undefined }}>
                        <div
                          className="flex items-center gap-4 text-sm text-muted-foreground mb-3"
                          style={{
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: isMobile ? "flex-start" : "center",
                            gap: isMobile ? 4 : undefined,
                            marginBottom: isMobile ? 8 : undefined,
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <Calendar size={13} />
                            <span style={{ fontSize: isMobile ? 12 : 14 }}>{formatDate(post.publishedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User size={13} />
                            <span style={{ fontSize: isMobile ? 12 : 14 }}>{post.author}</span>
                          </div>
                        </div>
                        <CardTitle
                          className="line-clamp-2 group-hover:text-primary transition-colors"
                          style={{ fontSize: isMobile ? 16 : undefined }}
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title) }}
                        />
                      </CardHeader>

                      <CardContent style={{ padding: isMobile ? "0 14px 14px" : undefined }}>
                        <p
                          className="text-muted-foreground line-clamp-3 mb-4"
                          style={{ fontSize: isMobile ? 13 : undefined, marginBottom: isMobile ? 10 : undefined }}
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.excerpt) }}
                        />
                        <div
                          className="flex flex-wrap gap-2 mb-4"
                          style={{ gap: isMobile ? 6 : undefined, marginBottom: isMobile ? 10 : undefined }}
                        >
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="outline" style={{ fontSize: isMobile ? 10 : undefined }}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div
                          className="flex items-center text-primary font-medium"
                          style={{ fontSize: isMobile ? 13 : 14 }}
                        >
                          Read More <ArrowRight size={15} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col items-center gap-4" style={{ marginTop: isMobile ? 28 : undefined }}>
                  <div
                    className="flex items-center gap-2"
                    style={{ gap: isMobile ? 6 : undefined, flexWrap: isMobile ? "wrap" : "nowrap", justifyContent: "center" }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{ fontSize: isMobile ? 13 : undefined }}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      {!isMobile && "Previous"}
                    </Button>

                    <div className="flex gap-2" style={{ gap: isMobile ? 4 : undefined }}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        const showPage =
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                        const showEllipsisBefore = pageNum === currentPage - 2 && currentPage > 3;
                        const showEllipsisAfter = pageNum === currentPage + 2 && currentPage < totalPages - 2;

                        if (showEllipsisBefore || showEllipsisAfter) {
                          return (
                            <span key={pageNum} className="px-2 py-1 text-muted-foreground">
                              ...
                            </span>
                          );
                        }

                        if (!showPage) return null;

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            style={{
                              minWidth: isMobile ? 32 : 40,
                              height: isMobile ? 32 : undefined,
                              padding: isMobile ? "0 8px" : undefined,
                              fontSize: isMobile ? 13 : undefined,
                            }}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{ fontSize: isMobile ? 13 : undefined }}
                    >
                      {!isMobile && "Next"}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>

                  <p
                    className="text-muted-foreground"
                    style={{ fontSize: isMobile ? 12 : 14 }}
                  >
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

    </div>
  );
};

export default Blog;
