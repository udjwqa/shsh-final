import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const template = await prisma.sellerTemplate.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.address !== undefined && { address: body.address.trim() }),
      ...(body.phone !== undefined && { phone: body.phone.trim() }),
      ...(body.email !== undefined && { email: body.email.trim() }),
      ...(body.iban !== undefined && { iban: body.iban.trim() }),
      ...(body.notes !== undefined && { notes: body.notes.trim() }),
    },
  });

  return NextResponse.json(template);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.sellerTemplate.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
