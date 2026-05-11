import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get unread message counts per listing
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const listings = await prisma.listing.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      slug: true,
      messages: {
        where: { sender: "client" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: {
        select: {
          messages: { where: { sender: "client", read: false } },
        },
      },
    },
  });

  const chats = listings
    .filter((l) => l.messages.length > 0)
    .map((l) => ({
      listingId: l.id,
      title: l.title,
      slug: l.slug,
      unread: l._count.messages,
      lastMessage: l.messages[0]?.content || "",
      lastMessageAt: l.messages[0]?.createdAt || null,
    }))
    .sort((a, b) => {
      if (!a.lastMessageAt || !b.lastMessageAt) return 0;
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });

  return NextResponse.json(chats);
}
