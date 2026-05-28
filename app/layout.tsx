import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import AuthModal from "@/components/AuthModal";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://twothumbsup.local"),
  title: {
    default: "Two Thumbs Up",
    template: "%s | Two Thumbs Up",
  },
  description:
    "Always remember, pause for a while, ponder on things around you and be a source of joy and hope.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <AuthProvider>
          <AuthModal>
            <NavigationBar />
            <main className="pt-6">{children}</main>
            <Footer />
          </AuthModal>
        </AuthProvider>
      </body>
    </html>
  );
}