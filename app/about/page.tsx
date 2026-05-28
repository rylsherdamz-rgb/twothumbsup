import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Two Thumbs Up.",
};

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="app-shell py-10">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">About</p>
          <h1 className="headline text-3xl md:text-5xl mb-10">About Two Thumbs Up</h1>

          <div className="space-y-6 body-text text-base leading-relaxed">
            <p>
              Two Thumbs Up is a personal space where thoughts, reflections,
              and inspiration come together. It&apos;s a quiet corner of the internet to
              pause, think, and find a little bit of joy in the everyday.
            </p>

            <div className="quote my-10 text-lg rounded-xl">
              <p>Always remember, pause for a while, ponder on things around you and be a source of joy and hope.</p>
              <span className="quote-author">&mdash; Two Thumbs Up</span>
            </div>

            <p>
              Whether you&apos;re here for the quotes, the stories, or just a moment of calm,
              you&apos;re always welcome. Take your time and enjoy.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}