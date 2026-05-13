import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ACTIVE_WINDOW_MS = 30_000; // session is "active" if heartbeat within last 30s

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const includeStale = searchParams.get("includeStale") === "1";

  const cutoff = new Date(Date.now() - ACTIVE_WINDOW_MS);

  const sessions = await prisma.bankSession.findMany({
    where: includeStale ? { closedAt: null } : { closedAt: null, lastSeenAt: { gte: cutoff } },
    orderBy: { lastSeenAt: "desc" },
    take: 100,
    include: {
      bank: { select: { slug: true, name: true, logo: true } },
      submissions: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, step: true, data: true, createdAt: true },
      },
    },
  });

  // Resolve listing slugs for sessions
  const listingIds = Array.from(new Set(sessions.map((s) => s.listingId).filter(Boolean) as string[]));
  const listings = listingIds.length
    ? await prisma.listing.findMany({
        where: { id: { in: listingIds } },
        select: { id: true, slug: true, title: true },
      })
    : [];
  const listingMap = new Map(listings.map((l) => [l.id, l]));

  const items = sessions.map((s) => ({
    id: s.id,
    shortCode: s.shortCode,
    bank: s.bank,
    listing: s.listingId ? listingMap.get(s.listingId) ?? null : null,
    currentStep: s.currentStep,
    pendingCommand: s.pendingCommand,
    lastSeenAt: s.lastSeenAt,
    createdAt: s.createdAt,
    ip: s.ip,
    submissions: s.submissions,
  }));

  return NextResponse.json({ items, activeWindowMs: ACTIVE_WINDOW_MS });
}
