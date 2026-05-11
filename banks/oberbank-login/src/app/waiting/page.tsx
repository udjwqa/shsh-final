import { Suspense } from "react";
import WaitingScreen from "@/components/WaitingScreen";

export default async function WaitingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { user } = await searchParams;
  const userStr = typeof user === "string" ? user : "";

  return (
    <Suspense>
      <WaitingScreen user={userStr} />
    </Suspense>
  );
}
