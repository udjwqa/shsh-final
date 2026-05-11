import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [banks, clicksGroups, submissionsGroups, recentSubmissions, totalSubmissions] =
    await Promise.all([
      prisma.bank.findMany({ orderBy: { order: "asc" } }),
      prisma.event.groupBy({
        by: ["metadata"],
        where: { type: "bank_selected" },
        _count: { _all: true },
      }),
      prisma.bankSubmission.groupBy({
        by: ["bankId"],
        _count: { _all: true },
      }),
      prisma.bankSubmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { bank: { select: { slug: true, name: true } } },
      }),
      prisma.bankSubmission.count(),
    ]);

  const clicksByBankName: Record<string, number> = {};
  for (const g of clicksGroups) {
    const meta = g.metadata as { bank?: string } | null;
    const name = meta?.bank;
    if (!name) continue;
    clicksByBankName[name] = (clicksByBankName[name] || 0) + g._count._all;
  }

  const submissionsByBankId: Record<string, number> = {};
  for (const g of submissionsGroups) {
    submissionsByBankId[g.bankId] = g._count._all;
  }

  const perBank = banks.map((b) => ({
    slug: b.slug,
    name: b.name,
    enabled: b.enabled,
    maintenance: b.maintenance,
    clicks: clicksByBankName[b.name] || 0,
    submissions: submissionsByBankId[b.id] || 0,
  }));

  const totalClicks = perBank.reduce((sum, b) => sum + b.clicks, 0);
  const top = [...perBank]
    .sort((a, b) => b.submissions - a.submissions || b.clicks - a.clicks)[0];

  return NextResponse.json({
    totals: {
      clicks: totalClicks,
      submissions: totalSubmissions,
      topBank: top ? { slug: top.slug, name: top.name, submissions: top.submissions } : null,
    },
    perBank,
    recent: recentSubmissions,
  });
}
