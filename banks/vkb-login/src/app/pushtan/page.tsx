import { Suspense } from "react";
import PushTanForm from "@/components/PushTanForm";

export default async function PushTanPage({
  searchParams,
}: {
  searchParams: Promise<{ user?: string; code?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawCode = params.code;
  const code = Array.isArray(rawCode) ? rawCode[0] : rawCode;
  return (
    <Suspense>
      <PushTanForm user={params.user || ""} vergleichswert={code} />
    </Suspense>
  );
}
