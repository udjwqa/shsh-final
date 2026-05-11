import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { corsResponse, corsOptions } from "@/lib/cors";
import { Prisma } from "@/generated/prisma/client";

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ack = new URL(req.url).searchParams.get("ack");

  const result = await prisma.$transaction(async (tx) => {
    const session = await tx.bankSession.findUnique({
      where: { id },
      select: { id: true, pendingCommand: true, closedAt: true },
    });
    if (!session) return null;

    if (ack === "1" && session.pendingCommand) {
      await tx.bankSession.update({
        where: { id },
        data: { pendingCommand: Prisma.JsonNull, lastSeenAt: new Date() },
      });
    } else {
      await tx.bankSession.update({
        where: { id },
        data: { lastSeenAt: new Date() },
      });
    }
    return session;
  });

  if (!result) return corsResponse({ error: "Session not found" }, 404);

  return corsResponse({
    command: result.pendingCommand ?? null,
    closed: !!result.closedAt,
  });
}
