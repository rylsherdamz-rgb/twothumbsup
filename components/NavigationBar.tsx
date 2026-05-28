"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import LetterAvatar from "@/components/LetterAvatar";
import { Menu, X, Sun, Moon, Search, User, LayoutDashboard, LogOut } from "lucide-react";
import gsap from "gsap";
import Image from "next/image";

const publicLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Quotes", href: "/quotes" },
  { label: "About", href: "/about" },
];

export default function NavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
    }
  }, []);

  useEffect(() => {
    if (mobileRef.current) {
      gsap.to(mobileRef.current, { x: mobileOpen ? 0 : "100%", duration: 0.3, ease: "power3.out" });
    }
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleAuthClick = () => {
    window.location.href = '/?auth=login';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) return null;

  const displayName = profile?.display_name || profile?.username || user?.email?.split("@")[0] || "User";

  return (
    <>
      <nav ref={navRef} className="top-nav sticky top-0 z-40">
        <div className="app-shell flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Two Thumbs Up" width={32} height={32} className="shrink-0 rounded-full" />
            <span className="font-serif font-bold text-lg tracking-tight hidden sm:block">Two Thumbs Up</span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  pathname === link.href ? "text-[var(--text)] bg-[var(--surface)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="field py-1.5 px-3 text-sm w-40 lg:w-56"
                  onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                />
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors" aria-label="Search">
                <Search className="w-4 h-4" />
              </button>
            )}

            <button onClick={toggleTheme} className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors" aria-label="Toggle theme">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="p-0.5 rounded-full border-2 border-transparent hover:border-[var(--text)] transition-colors"
                >
                  <LetterAvatar name={displayName} src={profile?.avatar_url} size={34} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 border border-[var(--border)] rounded-2xl bg-[var(--bg)] shadow-lg overflow-hidden z-50">
                    <div className="p-3 border-b border-[var(--border)]">
                      <p className="text-sm font-semibold truncate">{displayName}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      {profile?.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-[var(--border)] py-1">
                      <button
                        onClick={async () => { await signOut(); setDropdownOpen(false); router.push("/"); }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[var(--danger-bg)] w-full transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={handleAuthClick} className="button-primary text-sm py-1.5 px-3">
                Sign In
              </button>
            )}

            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text)]" aria-label="Menu">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div ref={mobileRef} className="fixed top-0 right-0 h-full w-64 z-50 md:hidden translate-x-full rounded-l-2xl overflow-hidden">
        <div className="h-full bg-[var(--bg)] border-l border-[var(--border)] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Two Thumbs Up" width={28} height={28} className="rounded-full" />
              <span className="font-serif font-bold text-base">Two Thumbs Up</span>
            </div>
            <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]">
              <X className="w-5 h-5" />
            </button>
          </div>

          {user && (
            <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 mb-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <LetterAvatar name={displayName} src={profile?.avatar_url} size={40} />
              <div>
                <p className="text-sm font-semibold">{displayName}</p>
                <p className="text-xs text-[var(--text-muted)]">{profile?.role === "admin" ? "Admin" : "Member"}</p>
              </div>
            </Link>
          )}

          <div className="flex flex-col gap-1 mb-3">
            <form onSubmit={handleSearch} className="px-2 mb-2">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="field py-1.5 px-3 text-sm w-full" />
            </form>
            {publicLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 text-sm font-medium rounded-xl ${pathname === link.href ? "text-[var(--text)] bg-[var(--surface)]" : "text-[var(--text-muted)]"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <hr className="border-[var(--border)] mb-3" />
          {user ? (
            <>
              {profile?.role === "admin" && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="button-primary text-sm py-2.5 text-center mb-2">
                  Dashboard
                </Link>
              )}
              <button onClick={async () => { await signOut(); setMobileOpen(false); router.push("/"); }} className="button-secondary text-sm py-2.5 text-center">
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => { setMobileOpen(false); handleAuthClick(); }} className="button-primary text-sm py-2.5 text-center">
              Sign In
            </button>
          )}
        </div>
      </div>
    </>
  );
}