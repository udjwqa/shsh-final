import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await req.json();

  if (!url || !url.includes("willhaben.at")) {
    return NextResponse.json({ error: "Invalid URL. Must be a willhaben.at link." }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "de-AT,de;q=0.9,en;q=0.8",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch page: ${response.status}` }, { status: 502 });
    }

    const html = await response.text();

    const jsonLdRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let productData = null;

    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const data = JSON.parse(match[1]);
        if (data["@type"] === "Product") {
          productData = data;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!productData) {
      return NextResponse.json({ error: "Could not find listing data on page" }, { status: 422 });
    }

    const result = {
      title: productData.name || "",
      price: parseFloat(productData.offers?.price) || 0,
      mainImage: productData.image || "",
      sellerName: productData.offers?.seller?.givenName || "",
      description: productData.description || "",
      sourceUrl: url,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Scraping failed", details: message }, { status: 500 });
  }
}
