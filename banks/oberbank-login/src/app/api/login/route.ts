import type { NextRequest } from "next/server";
import type {
  StartLoginRequest,
  StartLoginResponse,
} from "@/lib/auth";

// TODO: подключить реальный бэкенд Oberbank.
// Ожидается: POST {BACKEND_URL}/auth/start с { bankingNr, pin, lang }
// Ответ: { sessionId, pruefziffer, devices }
// Здесь — мок для разработки фронта.

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<StartLoginRequest>;

  if (!body.bankingNr || !body.pin) {
    return Response.json(
      { error: "bankingNr and pin are required" },
      { status: 400 },
    );
  }

  // TODO: заменить на проксирование запроса к настоящему API:
  // const upstream = await fetch(`${process.env.BACKEND_URL}/auth/start`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(body),
  // });
  // if (!upstream.ok) return new Response(upstream.body, { status: upstream.status });
  // return Response.json(await upstream.json());

  const payload: StartLoginResponse = {
    sessionId: crypto.randomUUID(),
    pruefziffer: Math.floor(100000 + Math.random() * 900000).toString(),
    devices: [{ id: "caro", label: "Caro" }],
  };

  return Response.json(payload);
}
