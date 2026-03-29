import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar/Navbar";
import { Toaster } from "sonner";
import WelcomeToast from "@/components/toast/WelcomeToast";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Flynotes - Your Lightweight Note-Taking Companion",
  description:
    "A fast, secure, and minimal note-taking app built for speed and simplicity. Capture your thoughts effortlessly with Flynotes.",
  applicationName: "Flynotes",
  authors: [{ name: "Soumyajit Karmakar" }],
  generator: "Next.js",
  keywords: [
    "notes",
    "productivity",
    "nextjs",
    "clerk",
    "drizzle",
    "sonner",
    "react",
    "typescript",
  ],
  referrer: "origin-when-cross-origin",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2b2b2b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable}`}>
        <Providers>
          <WelcomeToast />
          <Navbar />
          {children}
        </Providers>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
