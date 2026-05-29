"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type Profile = {
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  role: "admin" | "member";
};

type AuthState = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.from("profiles").select("username, display_name, avatar_url, role").eq("id", userId).single();
      if (error) {
        console.error("Profile fetch error:", error);
      }
      if (data) {
        setProfile(data as Profile);
      } else {
        console.warn("No profile data found for user:", userId);
      }
    } catch (err) {
      console.error("Profile fetch exception:", err);
    }
  }, []);

  useEffect(() => {
    let supabase;
    try {
      supabase = createBrowserSupabaseClient();
    } catch {
      setLoading(false);
      return;
    }

    const safetyTimer = setTimeout(() => setLoading(false), 6000);

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(safetyTimer);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) await fetchProfile(session.user.id);
      setLoading(false);
    }).catch(() => {
      clearTimeout(safetyTimer);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) await fetchProfile(session.user.id);
      else setProfile(null);
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err?.message ?? "Unable to connect. Please check your internet and try again." };
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err?.message ?? "Unable to connect. Please check your internet and try again." };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
    } catch {}
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}