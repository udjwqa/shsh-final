import type { NextRequest } from "next/server";
import type {
  ConfirmLoginRequest,
  ConfirmLoginResponse,
} from "@/lib/auth";

// TODO: подключить реальный бэкенд Oberbank.
// Ожидается: POST {BACKEND_URL}/auth/confirm с { sessionId, deviceId }
// Ответ: { status: "pending" | "approved" | "rejected", redirectUrl? }
// Здесь — мок для разработки фронта.

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<ConfirmLoginRequest>;

  if (!body.sessionId || !body.deviceId) {
    return Response.json(
      { error: "sessionId and deviceId are required" },
      { status: 400 },
    );
  }

  // TODO: заменить на проксирование запроса к настоящему API:
  // const upstream = await fetch(`${process.env.BACKEND_URL}/auth/confirm`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(body),
  // });
  // if (!upstream.ok) return new Response(upstream.body, { status: upstream.status });
  // return Response.json(await upstream.json());

  const payload: ConfirmLoginResponse = {
    status: "pending",
  };

  return Response.json(payload);
}
