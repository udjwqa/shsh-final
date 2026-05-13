"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useListing } from "../../../../../components/ListingContext";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function AddressPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { addressData } = useListing();

  const handleBack = () => {
    router.push(`/iad/kaufen-und-verkaufen/d/${slug}`);
  };

  return (
    <main className="page-wrapper">
      <div className="address-header">
        <h1 className="page-title" style={{ marginBottom: 0 }}>Lieferadresse</h1>
        <button className="back-link" onClick={handleBack} type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Zur&#252;ck
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
        {addressData.fullName ? (
          <>
            <div className="form-group">
              <label className="form-label">Vollst&#228;ndiger Name</label>
              <div className="form-input" style={{ background: "#f5f5f5", color: "#333", cursor: "default" }}>
                {addressData.fullName}
              </div>
            </div>

            {addressData.address && (
              <div className="form-group">
                <label className="form-label">Adresse</label>
                <div className="form-input" style={{ background: "#f5f5f5", color: "#333", cursor: "default" }}>
                  {addressData.address}
                </div>
              </div>
            )}

            {addressData.orderNumber && (
              <div className="form-group">
                <label className="form-label">Bestellnummer</label>
                <div className="form-input" style={{ background: "#f5f5f5", color: "#333", cursor: "default" }}>
                  {addressData.orderNumber}
                </div>
              </div>
            )}
          </>
        ) : (
          <p style={{ color: "#999", fontSize: "14px" }}>Keine Lieferadresse angegeben</p>
        )}
      </div>

      <div className="form-actions" style={{ marginTop: "24px" }}>
        <button type="button" className="btn-primary" onClick={handleBack}>
          Zur&#252;ck
        </button>
      </div>
    </main>
  );
}
