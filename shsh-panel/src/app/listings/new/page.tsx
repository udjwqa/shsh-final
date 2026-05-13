"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Link as LinkIcon, Upload, X } from "lucide-react";
import Link from "next/link";

interface SellerTemplate {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface AddressTemplate {
  id: string;
  label: string;
  name: string;
  address: string;
  orderNumber: string;
}

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [sellerTemplates, setSellerTemplates] = useState<SellerTemplate[]>([]);
  const [addressTemplates, setAddressTemplates] = useState<AddressTemplate[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [form, setForm] = useState({
    sellerName: "",
    address: "",
    sellerAvatar: "",
    title: "",
    price: "",
    mainImage: "",
    images: "" as string,
    sourceUrl: "",
    description: "",
    redirectMarketplace: "https://www.willhaben.at/iad/kaufen-und-verkaufen/marktplatz",
    redirectRealEstate: "https://www.willhaben.at/iad/immobilien",
    redirectAuto: "https://www.willhaben.at/iad/gebrauchtwagen",
    redirectJobs: "https://www.willhaben.at/jobs/",
    redirectPostListing: "https://www.willhaben.at/iad/myprofile/anz-aufgeben/kategorie",
    buyerName: "",
    buyerAddress: "",
    buyerOrderNumber: "",
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/seller-templates")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setSellerTemplates(data); });
    fetch("/api/address-templates")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setAddressTemplates(data); });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (file: File, field: string) => {
    setUploading(field);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        if (field === "additionalImages") {
          setForm((prev) => ({
            ...prev,
            images: prev.images ? prev.images + "\n" + data.url : data.url,
          }));
        } else {
          setForm((prev) => ({ ...prev, [field]: data.url }));
        }
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    }
    setUploading(null);
  };

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) return;
    setScraping(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({
          ...prev,
          title: data.title || prev.title,
          price: data.price ? String(data.price) : prev.price,
          mainImage: data.mainImage || prev.mainImage,
          sellerName: data.sellerName || prev.sellerName,
          description: data.description || prev.description,
          sourceUrl: data.sourceUrl || scrapeUrl.trim(),
        }));
      } else {
        alert(data.error || "Failed to load data");
      }
    } catch {
      alert("Failed to connect");
    }
    setScraping(false);
  };

  const handleSellerTemplateSelect = (templateId: string) => {
    const t = sellerTemplates.find((s) => s.id === templateId);
    if (t) {
      setForm((prev) => ({ ...prev, sellerName: t.name, address: t.address }));
    }
    setSellerSelectOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        images: form.images ? form.images.split("\n").filter(Boolean) : [],
        redirectMarketplace: form.redirectMarketplace || null,
        redirectRealEstate: form.redirectRealEstate || null,
        redirectAuto: form.redirectAuto || null,
        redirectJobs: form.redirectJobs || null,
        redirectPostListing: form.redirectPostListing || null,
        buyerName: form.buyerName || null,
        buyerAddress: form.buyerAddress || null,
        buyerOrderNumber: form.buyerOrderNumber || null,
      }),
    });
    if (res.ok) {
      router.push("/listings");
    } else {
      alert("Failed to create listing");
      setLoading(false);
    }
  };

  const [sellerSelectOpen, setSellerSelectOpen] = useState(false);
  const sellerSelectRef = useRef<HTMLDivElement>(null);
  const [addressSelectOpen, setAddressSelectOpen] = useState(false);
  const addressSelectRef = useRef<HTMLDivElement>(null);

  const handleAddressTemplateSelect = (templateId: string) => {
    const t = addressTemplates.find((a) => a.id === templateId);
    if (t) {
      setForm((prev) => ({ ...prev, buyerName: t.name, buyerAddress: t.address, buyerOrderNumber: t.orderNumber }));
    }
    setAddressSelectOpen(false);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sellerSelectRef.current && !sellerSelectRef.current.contains(e.target as Node)) setSellerSelectOpen(false);
      if (addressSelectRef.current && !addressSelectRef.current.contains(e.target as Node)) setAddressSelectOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const inputClass = "w-full px-4 py-3 bg-[#1E1E1E] rounded-2xl text-white placeholder-[#4A4A4A] text-sm focus:bg-[#252525] transition-colors";

  const ImageField = ({ label, value, field, inputRef }: { label: string; value: string; field: string; inputRef: React.RefObject<HTMLInputElement | null> }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
          className={inputClass + " flex-1"}
          placeholder={label}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading === field}
          className="p-3 bg-[#1E1E1E] hover:bg-[#252525] rounded-2xl text-[#6B6B6B] hover:text-[#A8A29E] transition-colors cursor-pointer disabled:opacity-40 shrink-0"
          title="Upload from device"
        >
          {uploading === field ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, field);
            e.target.value = "";
          }}
          className="hidden"
        />
      </div>
      {value && (
        <div className="flex items-center gap-2">
          <img src={value} alt="" className="w-10 h-10 rounded-xl object-cover" />
          <button type="button" onClick={() => setForm((prev) => ({ ...prev, [field]: "" }))} className="text-[#4A4A4A] hover:text-red-400 transition-colors cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  const RedirectField = ({ label, description, name, value }: { label: string; description: string; name: string; value: string }) => (
    <div className="space-y-1.5">
      <div>
        <p className="text-sm text-white">{label}</p>
        <p className="text-xs text-[#4A4A4A]">{description}</p>
      </div>
      <input
        type="url"
        name={name}
        value={value}
        onChange={handleChange}
        className={inputClass}
        placeholder="Leave empty to disable"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/listings" className="p-2 rounded-xl text-[#6B6B6B] hover:text-white hover:bg-[#141414] transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">New Listing</h1>
          <p className="text-[#6B6B6B] text-sm mt-0.5">Create a listing for the external platform</p>
        </div>
      </div>

      {/* Scrape Section */}
      <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
        <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Import from willhaben</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A4A]" />
            <input type="url" value={scrapeUrl} onChange={(e) => setScrapeUrl(e.target.value)} className={inputClass + " pl-11"} placeholder="https://www.willhaben.at/iad/..." />
          </div>
          <button type="button" onClick={handleScrape} disabled={scraping || !scrapeUrl.trim()} className="px-5 py-3 bg-white hover:bg-[#E8E8E8] disabled:opacity-40 text-[#0A0A0A] text-sm font-medium rounded-2xl transition-colors cursor-pointer shrink-0">
            {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Seller Section */}
        <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Seller</p>
            {sellerTemplates.length > 0 && (
              <div ref={sellerSelectRef} className="relative">
                <button type="button" onClick={() => setSellerSelectOpen(!sellerSelectOpen)} className="text-xs text-[#A8A29E] hover:text-white transition-colors cursor-pointer">
                  Use template
                </button>
                {sellerSelectOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-[#1E1E1E] rounded-2xl overflow-hidden z-10 py-1 min-w-[200px]">
                    {sellerTemplates.map((t) => (
                      <button key={t.id} type="button" onClick={() => handleSellerTemplateSelect(t.id)} className="w-full px-4 py-2.5 text-left text-sm text-[#6B6B6B] hover:text-white hover:bg-[#252525] transition-colors cursor-pointer">
                        <span className="text-white">{t.name}</span>
                        {t.address && <span className="text-[#4A4A4A] text-xs block">{t.address}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" name="sellerName" value={form.sellerName} onChange={handleChange} className={inputClass} placeholder="Full name" required />
            <input type="text" name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="Address" required />
          </div>
          <ImageField label="Seller avatar URL or upload" value={form.sellerAvatar} field="sellerAvatar" inputRef={avatarInputRef} />
        </div>

        {/* Details Section */}
        <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
          <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Details</p>
          <input type="text" name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="Listing title" required />
          <input type="number" name="price" value={form.price} onChange={handleChange} className={inputClass} placeholder="Price (EUR)" step="0.01" min="0" required />
        </div>

        {/* Images Section */}
        <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
          <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Images</p>
          <ImageField label="Main image URL or upload" value={form.mainImage} field="mainImage" inputRef={mainImageInputRef} />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <textarea name="images" value={form.images} onChange={handleChange} rows={3} className={inputClass + " resize-none flex-1"} placeholder="Additional image URLs (one per line)" />
              <button
                type="button"
                onClick={() => additionalImagesInputRef.current?.click()}
                disabled={uploading === "additionalImages"}
                className="p-3 bg-[#1E1E1E] hover:bg-[#252525] rounded-2xl text-[#6B6B6B] hover:text-[#A8A29E] transition-colors cursor-pointer disabled:opacity-40 shrink-0 self-start mt-1"
                title="Upload from device"
              >
                {uploading === "additionalImages" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              </button>
              <input
                ref={additionalImagesInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "additionalImages");
                  e.target.value = "";
                }}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Buyer / Delivery Address Section */}
        <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Lieferadresse (Buyer)</p>
              <p className="text-xs text-[#4A4A4A] mt-1">Shown as read-only on the public listing page</p>
            </div>
            {addressTemplates.length > 0 && (
              <div ref={addressSelectRef} className="relative">
                <button type="button" onClick={() => setAddressSelectOpen(!addressSelectOpen)} className="text-xs text-[#A8A29E] hover:text-white transition-colors cursor-pointer">
                  Load from template
                </button>
                {addressSelectOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-[#1E1E1E] rounded-2xl overflow-hidden z-10 py-1 min-w-[200px]">
                    {addressTemplates.map((t) => (
                      <button key={t.id} type="button" onClick={() => handleAddressTemplateSelect(t.id)} className="w-full px-4 py-2.5 text-left text-sm text-[#6B6B6B] hover:text-white hover:bg-[#252525] transition-colors cursor-pointer">
                        <span className="text-white">{t.label}</span>
                        <span className="text-[#4A4A4A] text-xs block">{t.name}{t.address ? ` — ${t.address}` : ""}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" name="buyerName" value={form.buyerName} onChange={handleChange} className={inputClass} placeholder="Buyer full name (e.g. Max Mustermann)" />
            <input type="text" name="buyerOrderNumber" value={form.buyerOrderNumber} onChange={handleChange} className={inputClass} placeholder="Order number (e.g. WH-2026-123456)" />
          </div>
          <input type="text" name="buyerAddress" value={form.buyerAddress} onChange={handleChange} className={inputClass} placeholder="Buyer address (e.g. Hauptstra&#223;e 15, 1010 Wien)" />
        </div>

        {/* Redirects Section */}
        <div className="bg-[#141414] rounded-2xl p-6 space-y-5">
          <div>
            <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">External site redirects</p>
            <p className="text-xs text-[#4A4A4A] mt-1">Set redirect URLs for buttons on the external site. Leave empty to disable.</p>
          </div>
          <RedirectField label="Marketplace" description="Main marketplace tab" name="redirectMarketplace" value={form.redirectMarketplace} />
          <RedirectField label="Real Estate" description="Real estate tab" name="redirectRealEstate" value={form.redirectRealEstate} />
          <RedirectField label="Auto & Moto" description="Auto & moto tab" name="redirectAuto" value={form.redirectAuto} />
          <RedirectField label="Jobs" description="Jobs tab" name="redirectJobs" value={form.redirectJobs} />
          <RedirectField label="+ Post Listing" description="Post listing button" name="redirectPostListing" value={form.redirectPostListing} />
        </div>

        <input type="hidden" name="sourceUrl" value={form.sourceUrl} />
        <input type="hidden" name="description" value={form.description} />

        <div className="flex justify-end gap-2 pt-2">
          <Link href="/listings" className="px-5 py-2.5 text-[#6B6B6B] hover:text-white text-sm font-medium rounded-2xl transition-colors">Cancel</Link>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-white hover:bg-[#E8E8E8] disabled:opacity-40 text-[#0A0A0A] text-sm font-medium rounded-2xl transition-colors cursor-pointer">
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
