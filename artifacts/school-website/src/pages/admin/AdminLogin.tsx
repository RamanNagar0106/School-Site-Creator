import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Lock, Eye, EyeOff } from "lucide-react";

export function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setLocation("/admin/dashboard");
      } else {
        const data = await res.json() as { error: string };
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-slate-50 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-xl">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-bold text-primary">M. B. Convent H. S. School</h1>
          <p className="text-slate-500 text-sm mt-1">Administration Portal</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="pb-4 pt-6 px-8">
            <CardTitle className="text-xl text-slate-800">Sign In</CardTitle>
            <CardDescription>Enter your admin credentials to continue</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoComplete="username"
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="h-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2"><span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> Signing in…</span>
                ) : (
                  <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Sign In</span>
                )}
              </Button>
            </form>
            <p className="text-center text-xs text-slate-400 mt-6 border-t pt-4">
              Authorised staff only · Secure access
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
