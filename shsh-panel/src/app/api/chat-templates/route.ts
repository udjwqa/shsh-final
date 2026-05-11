import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const templates = await prisma.chatTemplate.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  if (!body.title?.trim() || !body.content?.trim()) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const template = await prisma.chatTemplate.create({
    data: {
      title: body.title.trim(),
      content: body.content.trim(),
      userId,
    },
  });

  return NextResponse.json(template, { status: 201 });
}
