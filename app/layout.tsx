import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tasnumber.nrv.hu"), // ← állítsd saját domainre
  title: {
    default: "Adóazonosító jel — generátor és ellenőrző",
    template: "%s | Adóazonosító jel",
  },
  description:
    "Ingyenes online adóazonosító jel generátor és ellenőrző — magyar adóazonosító szám ellenőrzése, generálása és a születési dátum visszafejtése.",
  applicationName: "Adóazonosító eszköz",
  keywords: [
    "adóazonosító jel",
    "adóazonosító generátor",
    "adóazonosító ellenőrzés",
    "magyar adóazonosító",
    "ellenőrzőszám",
  ],
  alternates: {
    canonical: "/",
    languages: { hu: "/" },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Adóazonosító jel — generátor és ellenőrző",
    description:
      "Magyar adóazonosító szám ellenőrzése és generálása. Érvényesség, ellenőrzőszám, születési dátum visszafejtése.",
    siteName: "Adóazonosító jel",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Adóazonosító jel" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sajat_fiok", // ← ha nincs, töröld
    title: "Adóazonosító jel — generátor és ellenőrző",
    description: "Magyar adóazonosító szám ellenőrzése és generálása.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
