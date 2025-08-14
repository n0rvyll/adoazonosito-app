"use client";

import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import { generateTaxId, validateTaxId } from "@/lib/taxId";
import { LogoMonogramAJ } from "@/components/LogoMonogramAJ";

// Dev flag – apró, csak fejlesztésben alkalmazott késleltetéshez
const DEV = process.env.NODE_ENV === "development";

/** ----- SEO Head ----- */
function SEOHead() {
  const title = "Adóazonosító jel generátor és ellenőrző | Magyar adóazonosító";
  const description =
    "Ingyenes online adóazonosító jel generátor és ellenőrző. Születési dátum és sorszám alapján kiszámítja az érvényes magyar adóazonosítót, vagy visszafejti az adóazonosító jelből a születési dátumot.";
  const url = "https://sajat-domain.hu/"; // <-- CSERÉLD SAJÁTRA!
  const image = `${url}readme/preview.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Adóazonosító jel generátor",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "HUF" },
    description,
    url,
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="adóazonosító jel, adóazonosító generátor, adóazonosító ellenőrzés, magyar adóazonosító, adóazonosító számítás, születési dátum, adóazonosító jel generátor"
      />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content="Adóazonosító jel generátor és ellenőrző" />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@sajat_fiok" />
      <meta name="twitter:title" content="Adóazonosító jel generátor és ellenőrző" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <link rel="canonical" href={url} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Head>
  );
}

function fmt(date: Date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function Home() {
  // ÁLLAPOTOK
  const [dob, setDob] = useState("");
  const [serial, setSerial] = useState("100");
  const [genId, setGenId] = useState<string | null>(null);
  const [valInput, setValInput] = useState("");
  const [valMsg, setValMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [loadingGen, setLoadingGen] = useState(false);
  const [loadingVal, setLoadingVal] = useState(false);

  // Tooltip (fade-in/out kétlépcsős)
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLLabelElement | null>(null);

  // Élő előnézet
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Tooltip kezelők – katt kívülre + ESC zárás
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        closeTooltip();
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") closeTooltip();
    }
    if (tooltipVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [tooltipVisible]);

  const openTooltip = () => {
    setTooltipVisible(true);
    requestAnimationFrame(() => setTooltipOpen(true));
  };
  const closeTooltip = () => {
    setTooltipOpen(false);
    setTimeout(() => setTooltipVisible(false), 200);
  };
  const toggleTooltip = () => (tooltipVisible ? closeTooltip() : openTooltip());

  /** Reset – logó kattintására */
  const resetAll = () => {
    setDob("");
    setSerial("100");
    setGenId(null);
    setValInput("");
    setValMsg(null);
    setPreviewId(null);
    setPreviewError(null);
    closeTooltip();
  };

  // --- GENERÁLÁS ---
  const onGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoadingGen(true);
    setGenId(null);

    if (DEV) await new Promise((r) => setTimeout(r, 50)); // csak dev-ben miniflash

    try {
      const [y, m, d] = dob.split("-").map(Number);
      const id = generateTaxId(new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1)), Number(serial) || 100);
      setGenId(id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setGenId(`Hiba: ${msg}`);
    } finally {
      setLoadingGen(false);
    }
  };

  // --- ELLENŐRZÉS ---
  const onValidate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoadingVal(true);
    setValMsg(null);

    if (DEV) await new Promise((r) => setTimeout(r, 50)); // csak dev-ben miniflash

    const clean = valInput.replace(/\D/g, "");
    const res = validateTaxId(clean);
    if (!res.valid) {
      setValMsg({ text: `Érvénytelen: ${res.reason ?? "ismeretlen ok"}`, success: false });
    } else {
      setValMsg({
        text: `Az adóazonosító jel érvényes. A születési idő visszafejtve: ${fmt(res.birthDate!)}`,
        success: true,
      });
    }
    setLoadingVal(false);
  };

  // Automatikus ellenőrzés (10 számjegy → 200ms után fut)
  useEffect(() => {
    if (!valInput) return;
    const clean = valInput.replace(/\D/g, "");
    let t: ReturnType<typeof setTimeout> | undefined;
    if (clean.length === 10) {
      t = setTimeout(() => onValidate(), 200);
    } else {
      setValMsg(null);
    }
    return () => {
      if (t) clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valInput]);

  // Élő előnézet generálása
  useEffect(() => {
    setPreviewId(null);
    setPreviewError(null);
    if (!dob) return;
    try {
      const [y, m, d] = dob.split("-").map(Number);
      const id = generateTaxId(new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1)), Number(serial) || 100);
      setPreviewId(id);
      setPreviewError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Előnézet nem képezhető a megadott adatokkal.";
      setPreviewId(null);
      setPreviewError(msg);
    }
  }, [dob, serial]);

  const copyId = async () => {
    if (!genId) return;
    try {
      await navigator.clipboard.writeText(genId);
      alert("Kimásolva a vágólapra.");
    } catch {
      alert("Nem sikerült másolni.");
    }
  };

  const LoadingOverlay = ({ text }: { text: string }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
      <div className="animate-pulse font-medium text-blue-700 dark:text-blue-300">{text}</div>
      <div className="mt-2 flex space-x-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:150ms]"></span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:300ms]"></span>
      </div>
    </div>
  );

  return (
    <>
      <SEOHead />
      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* Fejléc (SSR-kor is azonnal látszik) */}
        <header className="mb-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={resetAll}
            aria-label="Adatok törlése"
            className="rounded-full p-1 outline-none focus:outline-none active:scale-95 transition text-blue-600 hover:text-blue-700"
            title="Kattints az adatok törléséhez"
          >
            <LogoMonogramAJ size={40} />
          </button>
          <h1 className="text-center text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-300">
            Adóazonosító jel generátor
          </h1>
        </header>

        {/* Szabályok kártya */}
        <section className="mb-8 mx-auto max-w-xl rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-relaxed text-justify shadow-md">
          <h2 className="mb-2 text-center font-semibold text-blue-800">
            Az adóazonosító jel képzésének szabályai
          </h2>
          <h3 className="sr-only">Képzési logika röviden</h3>
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li>Első számjegy: mindig <code>8</code>.</li>
            <li>2–6. számjegyek: születési dátum és 1867.01.01. között eltelt napok száma.</li>
            <li>7–9. számjegyek: sorszám (alapértelmezett <code>100</code>, „000” tiltott).</li>
            <li>10. számjegy: ellenőrző szám (mod 11; ha maradék 10 → új sorszám szükséges).</li>
          </ol>
        </section>

        {/* Két funkció kártya */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Generálás */}
          <section className="relative w-full rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-md transition hover:scale-[1.02] hover:shadow-lg dark:border-slate-600 dark:from-slate-800 dark:to-slate-700">
            {loadingGen && <LoadingOverlay text="Feldolgozás..." />}
            <h2 className="mb-1 text-lg font-medium">Generálás</h2>
            <p className="mb-4 text-center text-sm text-gray-700 dark:text-gray-300">
              Itt generálható az adóazonosító jel a születési dátum és sorszám alapján.
            </p>

            <form onSubmit={onGenerate} className="mt-4 grid gap-3">
              <label className="flex flex-col sm:w-64">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Születési idő megadása:</span>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="mt-1 h-12 rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 dark:border-slate-500 dark:bg-slate-800 dark:text-white"
                />
              </label>

              {/* Sorszám + tooltip */}
              <label className="relative flex flex-col sm:w-32" ref={tooltipRef}>
                <span className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sorszám:
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTooltip();
                    }}
                    className="ml-1 inline-flex cursor-pointer select-none items-center rounded px-1 text-blue-600 outline-none focus:outline-none"
                    aria-expanded={tooltipVisible}
                    aria-controls="serial-tip"
                    title="Mi az a sorszám?"
                  >
                    ℹ️
                  </button>
                </span>

                {/* Tooltip – fade-in / fade-out */}
                {tooltipVisible && (
                  <div
                    id="serial-tip"
                    role="tooltip"
                    className={`absolute left-1/2 top-full z-10 mt-2 w-56 -translate-x-1/2 rounded-md bg-gray-900 p-2 text-xs text-white shadow-lg transition duration-200 ease-out
                      ${tooltipOpen ? "opacity-100 translate-y-0 scale-100" : "pointer-events-none opacity-0 translate-y-1 scale-95"}
                      dark:bg-black`}
                  >
                    A sorszám az azonos napon születettek megkülönböztetésére szolgál. Alapértelmezett: 100. A „000” tiltott.
                  </div>
                )}

                <input
                  type="number"
                  min="1"
                  max="999"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  className="mt-1 h-12 rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 dark:border-slate-500 dark:bg-slate-800 dark:text-white"
                />
              </label>

              {/* Élő előnézet */}
              {(previewId || previewError) && (
                <div
                  className={`mt-2 rounded border p-2 text-center font-mono text-sm ${
                    previewId
                      ? "border-slate-300 bg-white/70 text-slate-700"
                      : "border-amber-300 bg-amber-50 text-amber-800"
                  }`}
                >
                  {previewId ? (
                    <>
                      <span className="font-semibold">Előnézet: </span>
                      <span>{previewId}</span>
                    </>
                  ) : (
                    <>{previewError}</>
                  )}
                </div>
              )}

              <div className="mt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={!dob || loadingGen}
                  className="h-12 flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm transition hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
                >
                  Generálás
                </button>
                {genId && (
                  <button
                    type="button"
                    onClick={copyId}
                    className="h-12 rounded-lg border border-slate-300 bg-white px-4 text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                  >
                    Másolás
                  </button>
                )}
              </div>

              {genId && (
                <div className="mt-4 rounded border border-green-300 bg-green-100 p-2 text-center font-mono text-lg text-green-800 dark:border-green-600 dark:bg-green-800 dark:text-green-100">
                  <span className="mb-1 block font-semibold">Generált adóazonosító jel:</span>
                  {genId}
                </div>
              )}
            </form>
          </section>

          {/* Ellenőrzés */}
          <section className="relative w-full rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-md transition hover:scale-[1.02] hover:shadow-lg dark:border-slate-600 dark:from-slate-800 dark:to-slate-700">
            {loadingVal && <LoadingOverlay text="Ellenőrzés..." />}
            <h2 className="mb-1 text-lg font-medium">Ellenőrzés</h2>
            <p className="mb-4 text-center text-sm text-gray-700 dark:text-gray-300">
              Itt ellenőrizhető az adóazonosító jel, és visszafejthető belőle a születési idő.
            </p>

            <form onSubmit={onValidate} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <input
                inputMode="numeric"
                pattern="\d*"
                placeholder="10 számjegy (pl. 8xxxxxxxxx)"
                value={valInput}
                onChange={(e) => setValInput(e.target.value.replace(/\D/g, ""))}
                className="h-12 rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 dark:border-slate-500 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={loadingVal}
                className="h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm transition hover:from-blue-600 hover:to-blue-700"
              >
                Ellenőrzés
              </button>
            </form>

            {valMsg && (
              <div
                className={`mt-4 rounded border p-2 text-center font-mono text-lg ${
                  valMsg.success
                    ? "border-green-300 bg-green-100 text-green-800 dark:border-green-600 dark:bg-green-800 dark:text-green-100"
                    : "border-red-300 bg-red-100 text-red-800 dark:border-red-600 dark:bg-red-800 dark:text-red-100"
                }`}
              >
                {valMsg.text}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
