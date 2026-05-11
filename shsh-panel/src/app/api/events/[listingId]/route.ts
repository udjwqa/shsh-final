import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ listingId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId } = await params;

  const events = await prisma.event.findMany({
    where: { listingId },
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    page_view: events.filter((e) => e.type === "page_view").length,
    continue_click: events.filter((e) => e.type === "continue_click").length,
    chat_open: events.filter((e) => e.type === "chat_open").length,
    message_sent: events.filter((e) => e.type === "message_sent").length,
    address_submitted: events.filter((e) => e.type === "address_submitted").length,
    payment_method_selected: events.filter((e) => e.type === "payment_method_selected").length,
    bank_selected: events.filter((e) => e.type === "bank_selected").length,
  };

  return NextResponse.json({ events, counts });
}
