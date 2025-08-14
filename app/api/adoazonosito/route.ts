// app/api/adoazonosito/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateTaxId, validateTaxId } from "@/lib/taxId";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const raw = String(body?.birthDate ?? "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return NextResponse.json({ error: "Adj meg ISO dátumot: YYYY-MM-DD" }, { status: 400 });
    }
    const [y, m, d] = raw.split("-").map(Number);
    const id = generateTaxId(new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1)));
    return NextResponse.json({ id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Ismeretlen hiba" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const value = (searchParams.get("value") ?? "").replace(/\D/g, "");
  if (!value) {
    return NextResponse.json({ error: "Hiányzik a 'value' paraméter." }, { status: 400 });
  }
  const res = validateTaxId(value);
  return NextResponse.json({
    valid: res.valid,
    reason: res.reason,
    birthDate: res.birthDate
      ? {
          iso: res.birthDate.toISOString().slice(0, 10),
          y: res.birthDate.getUTCFullYear(),
          m: res.birthDate.getUTCMonth() + 1,
          d: res.birthDate.getUTCDate(),
        }
      : null,
  });
}
