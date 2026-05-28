"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import LetterAvatar from "@/components/LetterAvatar";
import Image from "next/image";
import { LayoutDashboard, FileText, PlusCircle, Image as ImageIcon, LogOut, Menu, X, ArrowLeft, User } from "lucide-react";

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Posts", href: "/admin/posts", icon: FileText },
  { label: "New Post", href: "/admin/posts/new", icon: PlusCircle },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--text)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = profile?.display_name || profile?.username || user.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-[var(--bg)] border-r border-[var(--border)] p-4 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Two Thumbs Up" width={28} height={28} className="rounded-full" />
            <span className="font-serif font-bold text-base">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 rounded-full hover:bg-[var(--surface)] text-[var(--text-muted)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <Link href="/profile" onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 mb-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]"
        >
          <LetterAvatar name={displayName} src={profile?.avatar_url} size={32} />
          <div>
            <p className="text-sm font-semibold truncate">{displayName}</p>
            <p className="text-xs text-[var(--text-muted)]">Admin</p>
          </div>
        </Link>

        <nav className="flex flex-col gap-0.5 flex-1">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                pathname === link.href
                  ? "text-[var(--text)] bg-[var(--surface)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[var(--border)] pt-3 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
          <button
            onClick={async () => { await signOut(); router.push("/"); }}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-[var(--danger)] hover:bg-[var(--danger-bg)] w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 md:ml-60">
        <div className="sticky top-0 z-20 bg-[var(--bg)] border-b border-[var(--border)] px-4 py-3 flex items-center md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text)]">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-3">
            <Image src="/logo.png" alt="Two Thumbs Up" width={24} height={24} className="rounded-full" />
            <span className="font-serif font-bold">Admin</span>
          </div>
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}