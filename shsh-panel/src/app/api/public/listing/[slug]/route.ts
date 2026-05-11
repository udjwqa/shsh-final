import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { corsResponse, corsOptions } from "@/lib/cors";

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const listing = await prisma.listing.findFirst({
    where: { slug },
  });

  if (!listing) {
    return corsResponse({ error: "Listing not found" }, 404);
  }

  return corsResponse({
    id: listing.id,
    title: listing.title,
    price: listing.price,
    mainImage: listing.mainImage,
    images: listing.images,
    sellerName: listing.sellerName,
    address: listing.address,
    description: listing.description,
    slug: listing.slug,
    template: listing.template,
    sellerAvatar: listing.sellerAvatar,
    redirectMarketplace: listing.redirectMarketplace,
    redirectRealEstate: listing.redirectRealEstate,
    redirectAuto: listing.redirectAuto,
    redirectJobs: listing.redirectJobs,
    redirectPostListing: listing.redirectPostListing,
  });
}
