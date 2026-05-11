import { prisma } from "@/lib/prisma";
import { corsResponse, corsOptions } from "@/lib/cors";

export async function OPTIONS() {
  return corsOptions();
}

export async function GET() {
  const settings = await prisma.settings.findFirst({
    select: { banksGloballyEnabled: true, creditCardEnabled: true },
  });
  const globallyEnabled = settings?.banksGloballyEnabled ?? true;
  const creditCardEnabled = settings?.creditCardEnabled ?? true;

  const banks = await prisma.bank.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
    select: {
      slug: true,
      name: true,
      logo: true,
      urlTemplate: true,
      maintenance: true,
    },
  });

  return corsResponse({ globallyEnabled, creditCardEnabled, banks });
}
