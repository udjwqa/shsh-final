import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramNotification } from "@/lib/telegram";
import { corsResponse, corsOptions } from "@/lib/cors";

export async function OPTIONS() {
  return corsOptions();
}

// Get messages for a listing (public — used by widget and admin)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  const { listingId } = await params;
  const after = req.nextUrl.searchParams.get("after");

  const messages = await prisma.message.findMany({
    where: {
      listingId,
      ...(after ? { createdAt: { gt: new Date(after) } } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  return corsResponse(messages);
}

// Send a message (client or support)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  const { listingId } = await params;
  const body = await req.json();

  if (!body.content?.trim() && !body.imageUrl) {
    return corsResponse({ error: "Message is empty" }, 400);
  }

  const sender = body.sender === "support" ? "support" : "client";

  const message = await prisma.message.create({
    data: {
      content: body.content?.trim() || "",
      sender,
      listingId,
      imageUrl: body.imageUrl || null,
    },
  });

  // Send Telegram notification when client writes
  if (sender === "client") {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { user: { include: { settings: true } } },
    });

    if (listing?.user?.settings) {
      const { telegramBotToken, telegramChatId } = listing.user.settings;
      await sendTelegramNotification(
        telegramBotToken,
        telegramChatId,
        `💬 <b>New message</b>\n\n<b>Listing:</b> ${listing.title}\n<b>Message:</b> ${body.content.trim()}`
      );
    }
  }

  return corsResponse(message, 201);
}
