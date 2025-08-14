// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true, // segít a gyorsabb LCP-hez
});

export const metadata: Metadata = {
  title: "Adóazonosító jel generátor és ellenőrző",
  description:
    "Ingyenes online adóazonosító jel generátor és ellenőrző. Születési dátum és sorszám alapján kiszámítja az érvényes magyar adóazonosítót, vagy visszafejti az adóazonosító jelből a születési dátumot.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
