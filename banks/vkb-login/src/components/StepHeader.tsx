"use client";

import LanguageSwitch from "./LanguageSwitch";

export default function StepHeader({
  verfueger,
  onBack,
}: {
  verfueger: string;
  onBack: () => void;
}) {
  return (
    <header className="w-full bg-white border-b border-vkb-gray-300 shadow-sm">
      <div className="px-2 pt-1 flex justify-end">
        <LanguageSwitch />
      </div>
      <div className="px-3 sm:px-6 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Zurück"
          className="w-10 h-10 flex items-center justify-center text-vkb-gray-900 hover:bg-vkb-gray-100 rounded-full transition-colors"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className="w-px h-8 bg-vkb-gray-300" />
        <div className="w-10 h-10 rounded-full bg-vkb-gray-300 flex items-center justify-center text-vkb-gray-700">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-1a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v1" />
          </svg>
        </div>
        <span className="text-base font-normal truncate">{verfueger}</span>
      </div>
    </header>
  );
}
