// lib/taxId.ts
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toUTCDate(y: number, m: number, d: number) {
  return new Date(Date.UTC(y, m, d));
}

const BASE_DATE_UTC = toUTCDate(1867, 0, 1);

export function daysSince18670101(date: Date): number {
  const dUTC = toUTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const diff = dUTC.getTime() - BASE_DATE_UTC.getTime();
  if (diff < 0) throw new Error("A születési dátum nem lehet 1867-01-01 előtt.");
  return Math.floor(diff / MS_PER_DAY);
}

export function calcChecksum(first9: string): number {
  if (!/^\d{9}$/.test(first9)) throw new Error("Az első 9 számjegynek számjegynek kell lennie.");
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(first9[i]) * (i + 1);
  return sum % 11;
}

/**
 * Adóazonosító generálás (magánszemély).
 * - 1. jegy: 8
 * - 2–6.: napok száma 1867-01-01-től (5 jegy, balra 0-val)
 * - 7–9.: sorszám (alapesetben 100), "000" tiltva
 * - 10.: ellenőrző szám (mod 11), "10" maradék tiltva -> új sorszámot keresünk
 */
export function generateTaxId(birthDate: Date, preferredSerial = 100): string {
  const first = "8";
  const days = daysSince18670101(birthDate);
  if (days < 0 || days > 99999) throw new Error("A napok száma nem fér bele 5 számjegybe.");
  const daysStr = String(days).padStart(5, "0");

  // először próbáljuk a preferált sorszámot (alap: 100), ha az ellenőrző maradék 10 lenne, fallback
  const trySerial = (serial: number) => {
    const serialStr = String(serial).padStart(3, "0");
    if (serialStr === "000") return null; // tiltott
    const first9 = first + daysStr + serialStr;
    const check = calcChecksum(first9);
    if (check === 10) return null; // tiltott maradék
    return first9 + String(check);
  };

  // 1) preferált sorszám
  const preferred = trySerial(preferredSerial);
  if (preferred) return preferred;

  // 2) fallback keresés 001..999 között (kivéve a preferáltat és a 000-t)
  for (let serial = 1; serial <= 999; serial++) {
    if (serial === preferredSerial) continue;
    const candidate = trySerial(serial);
    if (candidate) return candidate;
  }

  throw new Error("Nem található érvényes sorszám.");
}

export function birthDateFromDays(days5: string): Date {
  if (!/^\d{5}$/.test(days5)) throw new Error("A napok száma 5 számjegy legyen.");
  const days = Number(days5);
  const date = new Date(BASE_DATE_UTC.getTime() + days * MS_PER_DAY);
  return toUTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function validateTaxId(id: string): {
  valid: boolean;
  reason?: string;
  birthDate?: Date;
} {
  if (!/^\d{10}$/.test(id)) return { valid: false, reason: "Pontosan 10 számjegy szükséges." };
  if (id[0] !== "8") return { valid: false, reason: "Az első számjegynek 8-nak kell lennie (magánszemély)." };

  const days5 = id.slice(1, 6);
  const serial = id.slice(6, 9);
  const checkDigit = Number(id[9]);

  if (serial === "000") return { valid: false, reason: "A sorszám nem lehet 000." };

  const bd = birthDateFromDays(days5);
  const first9 = id.slice(0, 9);
  const check = calcChecksum(first9);

  if (check === 10) return { valid: false, reason: "Tiltott ellenőrző maradék (10)." };
  if (check !== checkDigit) return { valid: false, reason: "Hibás ellenőrző számjegy." };

  return { valid: true, birthDate: bd };
}
