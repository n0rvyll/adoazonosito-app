import type { Metadata } from "next";
import TaxNumberTool from "@/components/TaxNumberTool";

export const metadata: Metadata = {
  title: "Adóazonosító jel — generátor és ellenőrző",
  description:
    "Ellenőrizd vagy generáld a magyar adóazonosító jelet. A formátum és az ellenőrzőszám alapján történik az érvényesség vizsgálata.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl p-6 md:p-8" aria-labelledby="page-title">
      <header className="mb-8">
        <h1 id="page-title" className="text-3xl font-bold tracking-tight">
          Adóazonosító jel — generátor és ellenőrző
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ellenőrizd vagy generáld a magyar adóazonosító jelet. A szabályos
          formátum és az ellenőrzőszám alapján történik az érvényesség
          vizsgálata.
        </p>
      </header>
      <TaxNumberTool />
    </main>
  );
}
