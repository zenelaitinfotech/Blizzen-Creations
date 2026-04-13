import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, Eye, EyeOff, Loader2, Shield } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = searchParams.get("token");

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    newUsername: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Verify token on load
  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setTokenValid(false);
      return;
    }
    const verify = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/admin-auth/verify-token?token=${token}`);
        const data = await res.json();
        setTokenValid(data.success);
      } catch {
        setTokenValid(false);
      }
      setVerifying(false);
    };
    verify();
  }, [token]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (form.newPassword.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    if (!form.newUsername.trim()) {
      toast({ title: "Error", description: "Username cannot be empty", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/admin-auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newUsername: form.newUsername,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
        toast({ title: "Success!", description: "Your credentials have been updated." });
        setTimeout(() => navigate('/admin'), 3000);
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to reset credentials.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">

      <Card className="w-full max-w-md shadow-2xl border-primary/20 animate-scale-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Reset Credentials</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Loading */}
          {verifying && (
            <div className="text-center py-8 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground text-sm">Verifying reset link...</p>
            </div>
          )}

          {/* Invalid token */}
          {!verifying && !tokenValid && (
            <div className="text-center py-8 space-y-4">
              <div className="text-4xl">❌</div>
              <div>
                <p className="font-semibold text-red-600">Invalid or Expired Link</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This reset link has expired or is invalid. Please request a new one.
                </p>
              </div>
              <Button onClick={() => navigate('/admin')} className="w-full bg-gradient-primary">
                Back to Login
              </Button>
            </div>
          )}

          {/* Success */}
          {done && (
            <div className="text-center py-8 space-y-4">
              <div className="text-4xl">✅</div>
              <div>
                <p className="font-semibold text-green-700">Credentials Updated!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Redirecting to login page in 3 seconds...
                </p>
              </div>
            </div>
          )}

          {/* Reset Form */}
          {!verifying && tokenValid && !done && (
            <form onSubmit={handleReset} className="space-y-5">
              <p className="text-sm text-muted-foreground text-center">
                Set your new admin username and password below.
              </p>

              {/* New Username */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4" /> New Username
                </Label>
                <Input
                  type="text"
                  placeholder="Enter new username"
                  value={form.newUsername}
                  onChange={(e) => setForm({ ...form, newUsername: e.target.value })}
                  required
                />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.newPassword}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                    required
                    className="pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                    className="pr-10"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300">
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</>
                ) : (
                  <><Lock className="w-4 h-4 mr-2" /> Update Credentials</>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Background decoration */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default ResetPassword;
