import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const body = await req.json();

  const data: { urlTemplate?: string; enabled?: boolean; maintenance?: boolean } = {};
  if (typeof body.urlTemplate === "string") data.urlTemplate = body.urlTemplate.trim();
  if (typeof body.enabled === "boolean") data.enabled = body.enabled;
  if (typeof body.maintenance === "boolean") data.maintenance = body.maintenance;

  const bank = await prisma.bank.update({ where: { slug }, data });
  return NextResponse.json(bank);
}
