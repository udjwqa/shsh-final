import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  const update: Record<string, boolean> = {};
  if (typeof body.enabled === "boolean") update.banksGloballyEnabled = body.enabled;
  if (typeof body.creditCardEnabled === "boolean") update.creditCardEnabled = body.creditCardEnabled;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "enabled or creditCardEnabled must be boolean" }, { status: 400 });
  }

  const settings = await prisma.settings.upsert({
    where: { userId },
    update,
    create: { userId, ...update },
  });

  return NextResponse.json({
    banksGloballyEnabled: settings.banksGloballyEnabled,
    creditCardEnabled: settings.creditCardEnabled,
  });
}
