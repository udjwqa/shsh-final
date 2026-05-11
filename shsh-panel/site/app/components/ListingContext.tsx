"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const PANEL_URL = process.env.NEXT_PUBLIC_PANEL_URL || "http://localhost:8500";

export interface ListingData {
  id: string;
  title: string;
  price: number;
  mainImage?: string | null;
  images?: string[];
  sellerName?: string | null;
  address?: string | null;
  description?: string | null;
  slug: string;
  template?: string | null;
}

export interface AddressData {
  address: string;
  fullName: string;
  orderNumber: string;
}

export interface BankData {
  bankName: string;
}

interface ListingContextValue {
  listing: ListingData | null;
  loading: boolean;
  error: string | null;
  listingId: string | null;
  slug: string;
  addressData: AddressData;
  setAddressData: (data: AddressData) => void;
  bankData: BankData;
  setBankData: (data: BankData) => void;
}

const ListingContext = createContext<ListingContextValue>({
  listing: null,
  loading: true,
  error: null,
  listingId: null,
  slug: "",
  addressData: { address: "", fullName: "", orderNumber: "" },
  setAddressData: () => {},
  bankData: { bankName: "" },
  setBankData: () => {},
});

export function ListingProvider({ children, slug }: { children: ReactNode; slug: string }) {
  const [listing, setListing] = useState<ListingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<AddressData>({ address: "", fullName: "", orderNumber: "" });
  const [bankData, setBankData] = useState<BankData>({ bankName: "" });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    fetch(`${PANEL_URL}/api/public/listing/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Listing not found");
        return res.json();
      })
      .then((data: ListingData) => {
        setListing(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Ladefehler");
        setLoading(false);
      });
  }, [slug]);

  return (
    <ListingContext.Provider
      value={{
        listing,
        loading,
        error,
        listingId: listing?.id ?? null,
        slug,
        addressData,
        setAddressData,
        bankData,
        setBankData,
      }}
    >
      {children}
    </ListingContext.Provider>
  );
}

export function useListing() {
  return useContext(ListingContext);
}
