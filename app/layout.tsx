import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Adóazonosító jel generátor",
  description: "Magánszemély adóazonosító jel generálása és ellenőrzése.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <body className="min-h-dvh bg-slate-50 text-slate-800 antialiased">
        
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mt-10 border-t bg-white/70">
          <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-slate-600 text-center">
            Fejlesztői eszköz | Csak tesztelési célra.
          </div>
        </footer>
      </body>
    </html>
  );
}
