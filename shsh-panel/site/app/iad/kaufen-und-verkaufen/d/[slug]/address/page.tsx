"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useListing } from "../../../../../components/ListingContext";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function AddressPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { addressData, setAddressData } = useListing();

  const [address, setAddress] = useState(addressData.address);
  const [fullName, setFullName] = useState(addressData.fullName);
  const [orderNumber, setOrderNumber] = useState(addressData.orderNumber);
  const [saveAddress, setSaveAddress] = useState(false);

  const handleBack = () => {
    router.push(`/iad/kaufen-und-verkaufen/d/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressData({ address, fullName, orderNumber });
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
          Zurück
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="address">
            Adresse <span className="optional">(optional)</span>
          </label>
          <input
            id="address"
            type="text"
            className="form-input"
            placeholder="Straße, Hausnummer, Wohnung..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Vollständiger Name
            </label>
            <input
              id="fullName"
              type="text"
              className="form-input"
              placeholder="Max Mustermann"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="orderNumber">
              Bestellnummer
            </label>
            <input
              id="orderNumber"
              type="text"
              className="form-input"
              placeholder="Bestellnr."
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </div>
        </div>

        <label className="form-checkbox-row">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={saveAddress}
            onChange={(e) => setSaveAddress(e.target.checked)}
          />
          <span className="form-checkbox-label">
            Adresse für den nächsten Einkauf speichern
          </span>
        </label>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleBack}>
            Zurück
          </button>
          <button type="submit" className="btn-primary">
            Speichern
          </button>
        </div>
      </form>
    </main>
  );
}
