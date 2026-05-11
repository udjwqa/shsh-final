import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const listings = await prisma.listing.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(listings);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  const slug = generateSlug(body.title) + "-" + Date.now();

  const listing = await prisma.listing.create({
    data: {
      sellerName: body.sellerName,
      address: body.address,
      template: body.template || "default",
      title: body.title,
      price: parseFloat(body.price),
      mainImage: body.mainImage || "",
      images: body.images || [],
      slug,
      userId,
      sourceUrl: body.sourceUrl || null,
      description: body.description || null,
      sellerAvatar: body.sellerAvatar || null,
      redirectMarketplace: body.redirectMarketplace || null,
      redirectRealEstate: body.redirectRealEstate || null,
      redirectAuto: body.redirectAuto || null,
      redirectJobs: body.redirectJobs || null,
      redirectPostListing: body.redirectPostListing || null,
    },
  });

  return NextResponse.json(listing, { status: 201 });
}
