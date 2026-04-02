import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AdminHome from "@/components/admin/AdminHome";
import AdminCourses from "@/components/admin/AdminCourses";
import AdminPlacements from "@/components/admin/AdminPlacements";
import AdminContactInfo from "@/components/admin/AdminContactInfo";
import AdminAbout from "@/components/admin/AdminAbout";
import AdminEnquiries from "@/components/admin/AdminEnquiries";
import AdminTrustStats from "@/components/admin/AdminTrustStats";
import AdminFooter from "@/components/admin/AdminFooter";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminGallery from "@/components/admin/GalleryUpload";
import Pages from "@/components/admin/page";
import AdminAuth from "@/components/AdminAuth";
import {
  Home,
  BookOpen,
  Briefcase,
  Mail,
  Info,
  MessageSquare,
  LogOut,
  Shield,
  Star,
  Footprints,
  FileText,
  Menu,
  Image,
  Layout,
} from "lucide-react";

const TAB_ITEMS = [
  { value: "navbar",      label: "Navbar",      icon: Menu },
  { value: "home",        label: "Home",        icon: Home },
  { value: "courses",     label: "Courses",     icon: BookOpen },
  { value: "placements",  label: "Placements",  icon: Briefcase },
  { value: "blog",        label: "Blog",        icon: FileText },
  { value: "trust-stats", label: "Trust Stats", icon: Star },
  { value: "contact",     label: "Contact",     icon: Mail },
  { value: "about",       label: "About",       icon: Info },
  { value: "enquiries",   label: "Enquiries",   icon: MessageSquare },
  { value: "pages",       label: "Pages",       icon: Layout },
  { value: "gallery",     label: "Gallery",     icon: Image },
  { value: "footer",      label: "Footer",      icon: Footprints },
];

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const authStatus = localStorage.getItem("admin_authenticated");
    const loginTime = localStorage.getItem("admin_login_time");

    if (authStatus === "true" && loginTime) {
      const currentTime = Date.now();
      const sessionDuration = 24 * 60 * 60 * 1000;
      if (currentTime - parseInt(loginTime) < sessionDuration) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("admin_authenticated");
        localStorage.removeItem("admin_login_time");
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_login_time");
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Loading admin panel...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const activeItem = TAB_ITEMS.find((t) => t.value === activeTab);

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">

        {/* ── Header ── */}
        <div className="mb-6 flex justify-between items-start gap-4">
          <div className="animate-slide-right">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-tight">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground ml-12 sm:ml-14">
              Manage all site content from here
            </p>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="hover-glow animate-slide-left flex-shrink-0 text-xs sm:text-sm"
          >
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>

        {/* ── Tabs ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-fade-in">

          {/* ── DESKTOP TabsList (md+): original 12-col grid ── */}
          <TabsList className="hidden md:grid w-full grid-cols-12 mb-8 bg-white/50 backdrop-blur-sm border border-primary/20 shadow-soft">
            {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-1 lg:gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white transition-all duration-300 text-xs lg:text-sm px-1 lg:px-2"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden lg:inline truncate">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── MOBILE Tab Selector (< md): scrollable pill row + dropdown ── */}
          <div className="md:hidden mb-6">
            {/* Scrollable icon+label pill row */}
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-2 w-max">
                {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setActiveTab(value)}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex-shrink-0 min-w-[56px] border
                      ${activeTab === value
                        ? "bg-gradient-primary text-white border-transparent shadow-md"
                        : "bg-white/60 text-muted-foreground border-primary/10 hover:border-primary/30"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="leading-tight text-center">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active tab label indicator */}
            <div className="mt-3 flex items-center gap-2 px-1">
              {activeItem && (
                <>
                  <activeItem.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">{activeItem.label}</span>
                </>
              )}
            </div>
          </div>

          {/* ── Tab Content (shared for both) ── */}
          <TabsContent value="navbar">   <AdminNavbar />     </TabsContent>
          <TabsContent value="home">     <AdminHome />       </TabsContent>
          <TabsContent value="courses">  <AdminCourses />    </TabsContent>
          <TabsContent value="placements"><AdminPlacements /></TabsContent>
          <TabsContent value="blog">     <AdminBlog />       </TabsContent>
          <TabsContent value="trust-stats"><AdminTrustStats /></TabsContent>
          <TabsContent value="contact">  <AdminContactInfo /></TabsContent>
          <TabsContent value="about">    <AdminAbout />      </TabsContent>
          <TabsContent value="enquiries"><AdminEnquiries />  </TabsContent>
          <TabsContent value="gallery">  <AdminGallery />    </TabsContent>
          <TabsContent value="pages">    <Pages />           </TabsContent>
          <TabsContent value="footer">   <AdminFooter />     </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default Admin;
