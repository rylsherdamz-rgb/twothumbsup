import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import { ExternalLink, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Two Thumbs Up.",
};

export default function ContactPage() {
  return (
    <PageTransition>
      <div className="app-shell py-10">
        <div className="max-w-xl">
          <p className="eyebrow mb-3">Contact</p>
          <h1 className="headline text-3xl md:text-5xl mb-4">Get in Touch</h1>
          <p className="body-text mb-10">
            Have a question or just want to say hello? We&apos;d love to hear from you.
          </p>

          <div className="space-y-3">
            <a
              href="https://www.facebook.com/twothumbsupwithmenchie"
              target="_blank"
              rel="noopener noreferrer"
              className="panel rounded-xl p-5 flex items-center gap-4 hover:border-[var(--text)] transition-all group"
            >
              <div className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:bg-[var(--text)] group-hover:text-[var(--bg)] transition-all">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Facebook</p>
                <p className="text-xs text-[var(--text-muted)]">Follow Two Thumbs Up on Facebook</p>
              </div>
            </a>

            <div className="panel p-5 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:bg-[var(--text)] group-hover:text-[var(--bg)] transition-all">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Email</p>
                <p className="text-xs text-[var(--text-muted)]">Send us a message anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}