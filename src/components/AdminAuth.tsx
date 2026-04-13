import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, Eye, EyeOff, Shield, Mail, ArrowLeft, Loader2 } from "lucide-react";

interface AdminAuthProps {
  onAuthenticated: () => void;
}

const AdminAuth = ({ onAuthenticated }: AdminAuthProps) => {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // ── Login ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 1. Check DB credentials first
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const dbRes = await fetch(`${apiUrl}/api/admin-auth/verify-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: credentials.username, password: credentials.password }),
      });
      const dbData = await dbRes.json();
      if (dbData.success) {
        setAuthSuccess(credentials.username);
        setLoading(false);
        return;
      }
    } catch (_) {
      // DB check failed, fall through to env check
    }

    // 2. Fall back to .env credentials
    const adminAccounts = [
      { username: import.meta.env.VITE_ADMIN_USERNAME_1, password: import.meta.env.VITE_ADMIN_PASSWORD_1 },
      { username: import.meta.env.VITE_ADMIN_USERNAME_2, password: import.meta.env.VITE_ADMIN_PASSWORD_2 },
      { username: import.meta.env.VITE_ADMIN_USERNAME || "strucureo", password: import.meta.env.VITE_ADMIN_PASSWORD || "admin@123#" },
    ].filter(a => a.username && a.password);

    const isValid = adminAccounts.some(
      a => credentials.username === a.username && credentials.password === a.password
    );

    if (isValid) {
      setAuthSuccess(credentials.username);
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const setAuthSuccess = (username: string) => {
    localStorage.setItem("admin_authenticated", "true");
    localStorage.setItem("admin_login_time", Date.now().toString());
    localStorage.setItem("admin_username", username);
    toast({ title: "Welcome Admin!", description: "Successfully authenticated." });
    setTimeout(() => onAuthenticated(), 500);
  };

  // ── Forgot Password ──
  const handleForgotPassword = async () => {
    setForgotLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/admin-auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setForgotSent(true);
        toast({ title: "Email Sent!", description: "Check blizzencreations@gmail.com for the reset link." });
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to send reset email. Check server connection.", variant: "destructive" });
    }
    setForgotLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* ── FORGOT PASSWORD CARD ── */}
      {showForgot ? (
        <Card className="w-full max-w-md shadow-2xl border-primary/20 animate-scale-in relative z-10">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-primary">Forgot Password?</CardTitle>
              <p className="text-muted-foreground mt-2 text-sm">
                We'll send a reset link to<br />
                <strong className="text-primary">blizzencreations@gmail.com</strong>
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {forgotSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">✅</span>
                </div>
                <div>
                  <p className="font-semibold text-green-700">Reset link sent!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Check <strong>blizzencreations@gmail.com</strong> for the password reset link. It expires in 1 hour.
                  </p>
                </div>
                <Button
                  onClick={() => { setShowForgot(false); setForgotSent(false); }}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                </Button>
              </div>
            ) : (
              <>
                <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  <p>A secure reset link will be sent to your registered admin email. Click the link to update your username and password.</p>
                </div>
                <Button
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  {forgotLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                  ) : (
                    <><Mail className="w-4 h-4 mr-2" /> Send Reset Link</>
                  )}
                </Button>
                <button
                  onClick={() => setShowForgot(false)}
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 mt-2"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to Login
                </button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (

        /* ── LOGIN CARD ── */
        <Card className="w-full max-w-md shadow-2xl border-primary/20 animate-scale-in relative z-10">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse-glow">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-primary">Admin Access</CardTitle>
              <p className="text-muted-foreground mt-2">
                Enter your credentials to access the admin dashboard
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                    className="pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Authenticating...
                  </div>
                ) : (
                  <><Lock className="w-4 h-4 mr-2" /> Access Dashboard</>
                )}
              </Button>

              {/* ── Forgot Password Link ── */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                🔒 Secure admin access • Session expires after 24 hours
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Background decoration */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default AdminAuth;
