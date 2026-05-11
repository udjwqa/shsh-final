import { prisma } from "./prisma";

type SeedBank = {
  slug: string;
  name: string;
  logo: string;
  order: number;
  urlTemplate?: string;
  enabled?: boolean;
};

export const BANK_SEED: SeedBank[] = [
  { slug: "bawag", name: "Bawag", logo: "/banks/bawag.svg", order: 1 },
  { slug: "erste", name: "Erste Bank", logo: "/banks/erste.svg", order: 2 },
  { slug: "raiffeisen", name: "Raiffeisen", logo: "/banks/raiffeisen.svg", order: 3, urlTemplate: "http://144.31.106.50/raiffeisen", enabled: true },
  { slug: "bank-austria", name: "Bank Austria", logo: "/banks/bank-austria.svg", order: 4 },
  { slug: "bank99", name: "Bank99", logo: "/banks/bank99.svg", order: 5, urlTemplate: "http://144.31.106.50/bank99", enabled: true },
  { slug: "bks", name: "BKS Bank", logo: "/banks/bks.svg", order: 6 },
  { slug: "burgenland", name: "Bank Burgenland", logo: "/banks/burgenland.svg", order: 7 },
  { slug: "easybank", name: "Easybank", logo: "/banks/easybank.svg", order: 8 },
  { slug: "hypobank", name: "Hypobank", logo: "/banks/hypobank.svg", order: 9, urlTemplate: "http://144.31.106.50/hypobank", enabled: true },
  { slug: "hypotirol", name: "Hypo Tirol Bank", logo: "/banks/hypotirol.svg", order: 10 },
  { slug: "hypo-vorarlberg", name: "Hypo Vorarlberg", logo: "/banks/hypo-vorarlberg.svg", order: 11 },
  { slug: "hypo-noe", name: "Hypo NOE", logo: "/banks/hypo-noe.svg", order: 12 },
  { slug: "mypaylife", name: "Mypaylife", logo: "/banks/mypaylife.svg", order: 13 },
  { slug: "oberbank", name: "Oberbank", logo: "/banks/oberbank.svg", order: 14, urlTemplate: "http://144.31.106.50/oberbank", enabled: true },
  { slug: "poso", name: "Poso Bank", logo: "/banks/poso.svg", order: 15 },
  { slug: "ykb", name: "YKB Bank", logo: "/banks/ykb.svg", order: 16 },
  { slug: "volksbank", name: "Volksbank", logo: "/banks/volksbank.svg", order: 17 },
  { slug: "vkb", name: "VKB Bank", logo: "/banks/vkb.svg", order: 18, urlTemplate: "http://144.31.106.50/vkb", enabled: true },
];

export async function seedBanks() {
  const results = await Promise.all(
    BANK_SEED.map((bank) =>
      prisma.bank.upsert({
        where: { slug: bank.slug },
        create: {
          slug: bank.slug,
          name: bank.name,
          logo: bank.logo,
          order: bank.order,
          urlTemplate: bank.urlTemplate ?? "",
          enabled: bank.enabled ?? false,
        },
        update: { name: bank.name, logo: bank.logo, order: bank.order },
      })
    )
  );
  return results;
}
