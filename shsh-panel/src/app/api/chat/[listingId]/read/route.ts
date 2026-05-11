import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { corsResponse, corsOptions } from "@/lib/cors";

export async function OPTIONS() {
  return corsOptions();
}

// Mark all client messages as read (admin only)
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return corsResponse({ error: "Unauthorized" }, 401);

  const { listingId } = await params;

  await prisma.message.updateMany({
    where: { listingId, sender: "client", read: false },
    data: { read: true },
  });

  return corsResponse({ success: true });
}
