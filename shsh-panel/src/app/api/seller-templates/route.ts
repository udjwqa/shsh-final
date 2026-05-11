import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const templates = await prisma.sellerTemplate.findMany({
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

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const template = await prisma.sellerTemplate.create({
    data: {
      name: body.name.trim(),
      address: body.address?.trim() || "",
      phone: body.phone?.trim() || "",
      email: body.email?.trim() || "",
      iban: body.iban?.trim() || "",
      notes: body.notes?.trim() || "",
      userId,
    },
  });

  return NextResponse.json(template, { status: 201 });
}
