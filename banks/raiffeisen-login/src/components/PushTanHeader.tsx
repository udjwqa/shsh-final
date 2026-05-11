"use client";

import { useRouter } from "next/navigation";
import LanguageSwitch from "./LanguageSwitch";

type Props = {
  user: string;
};

export default function PushTanHeader({ user }: Props) {
  const router = useRouter();

  return (
    <div className="bg-white">
      <div className="flex justify-end px-4 pt-2">
        <LanguageSwitch />
      </div>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-raf-gray-300">
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Zurück"
          className="raf-back-btn"
        >
          <svg
            width="24"
            height="24"
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
        <div className="w-px h-8 bg-raf-gray-300" />
        <div className="raf-avatar" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <span className="text-base font-normal text-raf-text-primary truncate">
          {user}
        </span>
      </div>
    </div>
  );
}
