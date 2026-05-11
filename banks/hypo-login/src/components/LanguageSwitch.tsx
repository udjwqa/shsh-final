"use client";

import { useState } from "react";

const languages = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
];

export default function LanguageSwitch() {
  const [selected, setSelected] = useState("de");
  const [isOpen, setIsOpen] = useState(false);
  const selectedLang = languages.find((l) => l.code === selected);

  return (
    <div className="flex justify-end mr-2">
      <div className="relative w-3/4 max-w-[180px]">
        <label className="sr-only">Wählen Sie Ihre bevorzugte Sprache aus</label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-1 text-sm bg-transparent border-0 border-b border-hyp-gray-500 cursor-pointer"
          style={{ color: "rgba(0,0,0,0.87)" }}
        >
          <span className="truncate">{selectedLang?.label}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={`flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}>
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-10 border border-hyp-gray-300">
            {languages.map((lang) => (
              <button key={lang.code} type="button" onClick={() => { setSelected(lang.code); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-hyp-gray-100 transition-colors ${selected === lang.code ? "bg-hyp-primary/10 font-semibold" : ""}`}>
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
