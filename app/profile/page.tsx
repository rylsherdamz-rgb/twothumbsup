"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import LetterAvatar from "@/components/LetterAvatar";
import PageTransition from "@/components/PageTransition";
import { Camera, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const { user, profile, signOut, refreshProfile, loading } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimeoutReached(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
    if (timeoutReached && loading && !user) router.push("/auth/login");
  }, [user, loading, router, timeoutReached]);

  if ((loading && !timeoutReached) || (loading && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--text)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const handleAvatarUpload = async (file: File) => {
    setUploading(true);
    const supabase = createBrowserSupabaseClient();
    const ext = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("images").upload(`avatars/${user.id}/${fileName}`, file, { upsert: true });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(`avatars/${user.id}/${fileName}`);
      await (supabase as any).from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
      await refreshProfile();
      setMessage("Avatar updated!");
      setTimeout(() => setMessage(null), 3000);
    }
    setUploading(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const supabase = createBrowserSupabaseClient();
    await (supabase as any).from("profiles").update({ display_name: displayName }).eq("id", user.id);
    await refreshProfile();
    setSaving(false);
    setMessage("Profile updated!");
    setTimeout(() => setMessage(null), 3000);
  };

  const displayNameShown = profile?.display_name || profile?.username || user?.email?.split("@")[0] || "User";

  return (
    <PageTransition>
      <div className="app-shell py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back home
        </Link>

        <div className="max-w-lg">
          <h1 className="headline text-3xl md:text-4xl mb-8">My Profile</h1>

          {message && (
            <div className="border border-[var(--border)] bg-[var(--surface)] p-3 text-sm mb-6">{message}</div>
          )}

          <div className="flex items-center gap-4 mb-8">
            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={displayNameShown}
                  width={80}
                  height={80}
                  className="object-cover"
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                <LetterAvatar name={displayNameShown} size={80} />
              )}
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
              {uploading && (
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50">
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                </div>
              )}
            </div>
            <div>
              <p className="font-serif font-bold text-xl">{displayNameShown}</p>
              <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
              <p className="text-xs text-[var(--text-dim)] mt-1 capitalize">{profile?.role ?? "Member"}</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatarUpload(file);
            }} />
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="field"
                placeholder="Your display name"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleSaveProfile} disabled={saving} className="button-primary text-sm">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={async () => { await signOut(); router.push("/"); }}
              className="button-secondary text-sm inline-flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}