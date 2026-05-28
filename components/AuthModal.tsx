"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, signupSchema, sanitizeInput } from "@/lib/schemas";
import { useAuth } from "@/components/AuthProvider";
import { X, Eye, EyeOff } from "lucide-react";
import type { z } from "zod";

type AuthMode = 'login' | 'signup' | null;

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export default function AuthModal({ children }: { children: ReactNode }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check URL params on mount to show modal
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authParam = params.get('auth');
    if (authParam === 'login' || authParam === 'signup') {
      setMode(authParam);
      // Clean URL without reload
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const signupForm = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const handleLogin = async (data: LoginForm) => {
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(sanitizeInput(data.email), sanitizeInput(data.password));
    if (err) setError(err);
    else setMode(null);
    setLoading(false);
  };

  const handleSignup = async (data: SignupForm) => {
    setError(null);
    setLoading(true);
    const { error: err } = await signUp(
      sanitizeInput(data.email),
      sanitizeInput(data.password),
      sanitizeInput(data.displayName)
    );
    if (err) {
      setError(err);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const closeModal = () => {
    setMode(null);
    setError(null);
    setSuccess(false);
    loginForm.reset();
    signupForm.reset();
  };

  if (!mode) return <>{children}</>;

  return (
    <>
      {children}
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
        
        {/* Modal Content */}
        <div className="relative panel rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 rounded-full text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {mode === 'login' && !success && (
            <>
              <h1 className="headline text-2xl mb-2">Welcome back</h1>
              <p className="text-[var(--muted)] text-sm mb-6">Sign in to manage your posts</p>

              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Email</label>
                  <input
                    type="email"
                    {...loginForm.register("email")}
                    className="field"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                  {loginForm.formState.errors.email && <p className="text-sm text-[var(--danger)] mt-1">{loginForm.formState.errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...loginForm.register("password")}
                      className="field pr-10"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && <p className="text-sm text-[var(--danger)] mt-1">{loginForm.formState.errors.password.message}</p>}
                </div>

                {error && (
                  <div className="text-[var(--danger)] text-sm bg-red-50 dark:bg-red-950/20 rounded-lg p-3">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="button-primary rounded-full w-full">
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="text-center text-sm text-[var(--muted)] mt-6">
                Don&apos;t have an account?{" "}
                <button onClick={() => { setMode('signup'); setError(null); }} className="text-[var(--primary)] font-semibold hover:underline">
                  Sign up
                </button>
              </p>
            </>
          )}

          {mode === 'signup' && !success && (
            <>
              <h1 className="headline text-2xl mb-2">Create account</h1>
              <p className="text-[var(--muted)] text-sm mb-6">Join Two Thumbs Up</p>

              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Display name</label>
                  <input
                    type="text"
                    {...signupForm.register("displayName")}
                    className="field"
                    placeholder="Your name"
                    disabled={loading}
                  />
                  {signupForm.formState.errors.displayName && <p className="text-sm text-[var(--danger)] mt-1">{signupForm.formState.errors.displayName.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Email</label>
                  <input
                    type="email"
                    {...signupForm.register("email")}
                    className="field"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                  {signupForm.formState.errors.email && <p className="text-sm text-[var(--danger)] mt-1">{signupForm.formState.errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Password</label>
                  <input
                    type="password"
                    {...signupForm.register("password")}
                    minLength={6}
                    className="field"
                    placeholder="At least 6 characters"
                    disabled={loading}
                  />
                  {signupForm.formState.errors.password && <p className="text-sm text-[var(--danger)] mt-1">{signupForm.formState.errors.password.message}</p>}
                </div>

                {error && (
                  <div className="text-[var(--danger)] text-sm bg-red-50 dark:bg-red-950/20 rounded-lg p-3">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="button-primary rounded-full w-full">
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <p className="text-center text-sm text-[var(--muted)] mt-6">
                Already have an account?{" "}
                <button onClick={() => { setMode('login'); setError(null); }} className="text-[var(--primary)] font-semibold hover:underline">
                  Sign in
                </button>
              </p>
            </>
          )}

          {success && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 dark:bg-green-950/20 text-green-600 rounded-xl p-6">
                <p className="font-semibold text-lg mb-2">Check your email</p>
                <p className="text-sm">We&apos;ve sent you a confirmation link.</p>
              </div>
              <button onClick={closeModal} className="button-primary rounded-full w-full">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}