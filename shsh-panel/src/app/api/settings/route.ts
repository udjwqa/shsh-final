import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const settings = await prisma.settings.findUnique({ where: { userId } });

  return NextResponse.json(settings || { externalDomain: "", apiKey: "", apiEndpoint: "", telegramBotToken: "", telegramChatId: "" });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  const settings = await prisma.settings.upsert({
    where: { userId },
    update: {
      externalDomain: body.externalDomain,
      apiKey: body.apiKey,
      apiEndpoint: body.apiEndpoint,
      telegramBotToken: body.telegramBotToken,
      telegramChatId: body.telegramChatId,
    },
    create: {
      userId,
      externalDomain: body.externalDomain,
      apiKey: body.apiKey,
      apiEndpoint: body.apiEndpoint,
      telegramBotToken: body.telegramBotToken,
      telegramChatId: body.telegramChatId,
    },
  });

  return NextResponse.json(settings);
}
