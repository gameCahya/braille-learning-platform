import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Braille English Learning Platform",
  description: "Learn English with Braille - An accessible learning platform for visually impaired students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-center"
          richColors
          closeButton
          aria-live="polite"
        />
      </body>
    </html>
  );
}