import ClientShell from "@/components/ClientShell";

export default async function Home({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  const listingSlug = resolved.slug?.[0] ?? null;
  return <ClientShell initialSlug={listingSlug} />;
}
