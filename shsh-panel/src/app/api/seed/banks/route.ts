import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { seedBanks } from "@/lib/banks-seed";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const banks = await seedBanks();
  return NextResponse.json({ count: banks.length, banks: banks.map((b) => b.slug) });
}
