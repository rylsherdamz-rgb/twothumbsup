import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="app-shell py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="Two Thumbs Up" width={28} height={28} className="rounded-full" />
              <span className="font-serif font-bold text-lg tracking-tight">Two Thumbs Up</span>
            </Link>
            <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              Always remember, pause for a while, ponder on things around you and be a source of joy and hope.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-dim)] mb-4">Navigate</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Blog", href: "/blog" },
                { label: "Quotes", href: "/quotes" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-dim)] mb-4">Connect</h4>
            <a
              href="https://www.facebook.com/twothumbsupwithmenchie"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border)] text-xs text-[var(--text-dim)]">
          &copy; {new Date().getFullYear()} Two Thumbs Up.
        </div>
      </div>
    </footer>
  );
}