import { NextRequest, NextResponse } from "next/server";
import { generateTaxId, validateTaxId } from "@/lib/taxId";

// Ha szeretnéd edge-en futtatni:
// export const runtime = "edge";

type GeneratePayload = {
  action: "generate";
  dob: string; // ISO date: YYYY-MM-DD
  serial?: number; // 1..999 (100 default)
};

type ValidatePayload = {
  action: "validate";
  id: string; // 10 digits
};

function isISODate(s: string): boolean {
  // gyorsteszt + Date ellenőrzés
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00.000Z`);
  return (
    !Number.isNaN(d.getTime()) &&
    s ===
      [
        String(d.getUTCFullYear()).padStart(4, "0"),
        String(d.getUTCMonth() + 1).padStart(2, "0"),
        String(d.getUTCDate()).padStart(2, "0"),
      ].join("-")
  );
}

function isGeneratePayload(x: unknown): x is GeneratePayload {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (o.action !== "generate") return false;
  if (typeof o.dob !== "string" || !isISODate(o.dob)) return false;
  if (o.serial == null) return true;
  return (
    typeof o.serial === "number" &&
    Number.isFinite(o.serial) &&
    o.serial >= 1 &&
    o.serial <= 999
  );
}

function isValidatePayload(x: unknown): x is ValidatePayload {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    o.action === "validate" && typeof o.id === "string" && /^\d{10}$/.test(o.id)
  );
}

export async function POST(req: NextRequest) {
  const body: unknown = await req.json();

  if (isGeneratePayload(body)) {
    const [y, m, d] = body.dob.split("-").map(Number);
    const serial = body.serial ?? 100;
    try {
      const id = generateTaxId(
        new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1)),
        serial
      );
      return NextResponse.json({ id });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ismeretlen hiba";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  if (isValidatePayload(body)) {
    const result = validateTaxId(body.id);
    if (!result.valid) {
      return NextResponse.json(
        { valid: false, reason: result.reason ?? "Érvénytelen" },
        { status: 200 }
      );
    }
    return NextResponse.json({
      valid: true,
      birthDate: result.birthDate?.toISOString().slice(0, 10) ?? null,
    });
  }

  return NextResponse.json(
    {
      error: "Hibás payload. Várható: { action: 'generate' | 'validate', ... }",
    },
    { status: 400 }
  );
}

// Opcionális GET támogatás query-vel:
// /api/adoazonosito?action=validate&id=8xxxxxxxxx
// /api/adoazonosito?action=generate&dob=YYYY-MM-DD&serial=123
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "validate") {
    const id = searchParams.get("id") ?? "";
    if (!/^\d{10}$/.test(id)) {
      return NextResponse.json(
        { error: "Hiányzó vagy hibás id (10 számjegy)" },
        { status: 400 }
      );
    }
    const result = validateTaxId(id);
    if (!result.valid) {
      return NextResponse.json({
        valid: false,
        reason: result.reason ?? "Érvénytelen",
      });
    }
    return NextResponse.json({
      valid: true,
      birthDate: result.birthDate?.toISOString().slice(0, 10) ?? null,
    });
  }

  if (action === "generate") {
    const dob = searchParams.get("dob") ?? "";
    const serialStr = searchParams.get("serial");
    const serial = serialStr ? Number(serialStr) : 100;
    if (!isISODate(dob)) {
      return NextResponse.json(
        { error: "Hibás dob (YYYY-MM-DD)" },
        { status: 400 }
      );
    }
    if (!(Number.isFinite(serial) && serial >= 1 && serial <= 999)) {
      return NextResponse.json(
        { error: "Hibás serial (1..999)" },
        { status: 400 }
      );
    }
    const [y, m, d] = dob.split("-").map(Number);
    try {
      const id = generateTaxId(
        new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1)),
        serial
      );
      return NextResponse.json({ id });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ismeretlen hiba";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  return NextResponse.json(
    { error: "Adj meg action paramétert (generate | validate)." },
    { status: 400 }
  );
}
