import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(100, parseInt(searchParams.get("pageSize") || "25", 10));
  const bankSlug = searchParams.get("bank");
  const listingId = searchParams.get("listingId");

  const where: { bank?: { slug: string }; listingId?: string } = {};
  if (bankSlug) where.bank = { slug: bankSlug };
  if (listingId) where.listingId = listingId;

  const [total, items] = await Promise.all([
    prisma.bankSubmission.count({ where }),
    prisma.bankSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { bank: { select: { slug: true, name: true, logo: true } } },
    }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}
