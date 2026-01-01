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
    <main className="min-h-screen">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
      >
        Skip to main content
      </a>

      <div id="main-content" role="main">
        {children}
      </div>
    </main>
  );
}