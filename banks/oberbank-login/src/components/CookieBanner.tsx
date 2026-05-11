"use client";

import { useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="w-full" style={{ backgroundColor: "#e5e5ea" }}>
      <div className="max-w-[1100px] mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <p className="text-xs" style={{ color: "#30454c" }}>
          Wir verwenden auf dieser Seite technisch notwendige Cookies, die für den reibungslosen Betrieb der Website erforderlich sind und sicherheitsrelevante Funktionalitäten ermöglichen. Weitere Informationen zum Datenschutz finden Sie{" "}
          <a href="#" className="underline font-medium" style={{ color: "#30454c" }}>
            hier.
          </a>
        </p>
        <button
          onClick={() => setVisible(false)}
          className="obr-btn-accent whitespace-nowrap text-xs px-4 py-1.5 flex-shrink-0"
        >
          Schließen
        </button>
      </div>
    </div>
  );
}
