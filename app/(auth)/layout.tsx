import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Braille Learning Platform",
  description: "Sign in or create an account to start learning English with Braille",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Skip to main content — untuk pengguna screen reader */}
      <a
        href="#auth-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Langsung ke konten utama
      </a>

      <div id="auth-content">
        {children}
      </div>
    </div>
  );
}