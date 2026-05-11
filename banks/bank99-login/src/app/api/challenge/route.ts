import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// TODO(persistence): заменить in-memory store на Redis/БД,
// чтобы число переживало рестарты и шарилось между инстансами.
const store = globalThis as unknown as { __b99Challenge?: number };
if (store.__b99Challenge === undefined) {
  store.__b99Challenge = 21;
}

export async function GET() {
  return Response.json({ number: store.__b99Challenge });
}

export async function POST(req: NextRequest) {
  // TODO(auth): заменить на нормальную авторизацию (JWT / сессии админа).
  // Сейчас простой shared-secret через заголовок `x-admin-secret`.
  const expected = process.env.ADMIN_SECRET ?? "change-me";
  if (req.headers.get("x-admin-secret") !== expected) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { number?: unknown } | null;
  const num = Number(body?.number);
  if (!Number.isInteger(num) || num < 0 || num > 999) {
    return Response.json({ error: "invalid number" }, { status: 400 });
  }

  store.__b99Challenge = num;
  return Response.json({ number: store.__b99Challenge });
}
