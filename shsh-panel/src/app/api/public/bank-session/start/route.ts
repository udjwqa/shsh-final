import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { corsResponse, corsOptions } from "@/lib/cors";

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return corsResponse({ error: "Invalid body" }, 400);
  }

  const { bankSlug, listingSlug } = body as { bankSlug?: string; listingSlug?: string };
  if (!bankSlug) return corsResponse({ error: "bankSlug required" }, 400);

  const bank = await prisma.bank.findUnique({ where: { slug: bankSlug } });
  if (!bank) return corsResponse({ error: "Bank not found" }, 404);

  const listing = listingSlug
    ? await prisma.listing.findFirst({ where: { slug: listingSlug } })
    : null;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "";
  const userAgent = req.headers.get("user-agent") || "";

  const lastSession = await prisma.bankSession.findFirst({
    orderBy: { createdAt: "desc" },
    select: { shortCode: true },
  });
  const lastNum = lastSession?.shortCode
    ? parseInt(lastSession.shortCode.replace("#", ""), 10) || 0
    : 0;
  const shortCode = "#" + String(lastNum + 1).padStart(4, "0");

  const session = await prisma.bankSession.create({
    data: {
      bankId: bank.id,
      listingId: listing?.id ?? null,
      shortCode,
      ip,
      userAgent,
    },
  });

  return corsResponse({ sessionId: session.id, shortCode });
}
