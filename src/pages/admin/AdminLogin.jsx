import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { siteConfig } from "@/lib/siteConfig";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const returnTo = params.get("returnTo") || "/admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = returnTo;
    } catch (err) {
      setError("Your email or password is incorrect.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <img
            src={siteConfig.images.logo}
            alt="Wade Preston"
            className="h-14 w-auto mx-auto mb-6 object-contain"
          />
          <p className="text-[11px] uppercase tracking-playbill text-primary mb-3">
            Backstage
          </p>
          <h1 className="font-display font-light text-4xl">Admin Sign In</h1>
        </div>

        <div className="bg-card border border-border/60 rounded-sm p-7 sm:p-9">
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-center gap-2 p-3 rounded-sm bg-destructive/10 border border-destructive/30 text-destructive text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-[11px] uppercase tracking-playbill text-muted-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-sm pl-10 pr-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-[11px] uppercase tracking-playbill text-muted-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-sm pl-10 pr-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-[11px] uppercase tracking-playbill rounded-sm hover:brass-glow transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-[11px] uppercase tracking-playbill text-muted-foreground hover:text-primary transition-colors">
            ← Back to site
          </Link>
        </div>
      </motion.div>
    </div>
  );
}