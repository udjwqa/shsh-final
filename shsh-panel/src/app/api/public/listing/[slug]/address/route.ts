import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { corsResponse, corsOptions } from "@/lib/cors";
import { sendTelegramNotification } from "@/lib/telegram";

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await req.json();

  const listing = await prisma.listing.findFirst({ where: { slug } });
  if (!listing) {
    return corsResponse({ error: "Listing not found" }, 404);
  }

  const { fullName, address, orderNumber } = body;

  if (!fullName) {
    return corsResponse({ error: "fullName is required" }, 400);
  }

  // Update listing with buyer address data
  await prisma.listing.update({
    where: { id: listing.id },
    data: {
      buyerName: fullName,
      buyerAddress: address || "",
      buyerOrderNumber: orderNumber || "",
    },
  });

  // Create event for web panel notification
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  const userAgent = req.headers.get("user-agent") || "";

  await prisma.event.create({
    data: {
      type: "address_submitted",
      listingId: listing.id,
      ip,
      userAgent,
      metadata: { fullName, address, orderNumber },
    },
  });

  // Send Telegram notification
  const user = await prisma.user.findUnique({
    where: { id: listing.userId },
    include: { settings: true },
  });

  if (user?.settings?.telegramBotToken && user?.settings?.telegramChatId) {
    const message =
      `📦 <b>Neue Lieferadresse!</b>\n\n` +
      `<b>Anzeige:</b> ${listing.title}\n` +
      `<b>Name:</b> ${fullName}\n` +
      (address ? `<b>Adresse:</b> ${address}\n` : "") +
      (orderNumber ? `<b>Bestellnr.:</b> ${orderNumber}\n` : "");

    await sendTelegramNotification(
      user.settings.telegramBotToken,
      user.settings.telegramChatId,
      message
    );
  }

  return corsResponse({ success: true });
}
