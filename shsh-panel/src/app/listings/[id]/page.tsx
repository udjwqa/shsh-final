"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Send, Trash2, Pencil, Eye, MousePointerClick, MessageCircle, Play, MapPin, CreditCard, Building2 } from "lucide-react";
import Link from "next/link";

interface Listing {
  id: string;
  sellerName: string;
  address: string;
  template: string;
  title: string;
  price: number;
  mainImage: string;
  images: string[];
  slug: string;
  status: string;
  externalUrl: string | null;
  sourceUrl: string | null;
  description: string | null;
  buyerName: string | null;
  buyerAddress: string | null;
  buyerOrderNumber: string | null;
  createdAt: string;
}

interface Event {
  id: string;
  type: string;
  ip: string;
  userAgent: string;
  metadata: Record<string, string> | null;
  createdAt: string;
}

interface EventData {
  events: Event[];
  counts: {
    page_view: number;
    continue_click: number;
    chat_open: number;
    message_sent: number;
    address_submitted: number;
    payment_method_selected: number;
    bank_selected: number;
  };
}

const EVENT_ICONS: Record<string, { icon: typeof Eye; label: string }> = {
  page_view: { icon: Eye, label: "Page view" },
  continue_click: { icon: Play, label: "Clicked continue" },
  chat_open: { icon: MessageCircle, label: "Opened chat" },
  message_sent: { icon: MousePointerClick, label: "Sent message" },
  address_submitted: { icon: MapPin, label: "Address submitted" },
  payment_method_selected: { icon: CreditCard, label: "Payment method" },
  bank_selected: { icon: Building2, label: "Bank selected" },
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/listings").then((r) => r.json()),
      fetch(`/api/events/${id}`).then((r) => r.json()),
    ]).then(([listings, events]) => {
      const found = listings.find((l: Listing) => l.id === id);
      if (found) setListing(found);
      setEventData(events);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this listing?")) return;
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    router.push("/listings");
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch(`/api/listings/${id}/publish`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setListing((prev) => prev ? { ...prev, status: "published" } : prev);
      } else {
        alert(data.error || "Failed to publish");
      }
    } catch {
      alert("Failed to publish");
    }
    setPublishing(false);
  };

  if (loading) return <div className="text-[#6B6B6B] text-sm py-20 text-center">Loading...</div>;
  if (!listing) return <div className="text-[#6B6B6B] text-sm py-20 text-center">Listing not found</div>;

  const counts = eventData?.counts || { page_view: 0, continue_click: 0, chat_open: 0, message_sent: 0, address_submitted: 0, payment_method_selected: 0, bank_selected: 0 };

  // Extract payment-related events for the dedicated block
  const paymentEvents = (eventData?.events || []).filter(
    (e) => e.type === "payment_method_selected" || e.type === "bank_selected"
  );

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-2">
        <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Link href="/listings" className="p-2 rounded-xl text-[#6B6B6B] hover:text-white hover:bg-[#141414] transition-colors shrink-0 mt-0.5 sm:mt-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate">{listing.title}</h1>
            <p className="text-[#6B6B6B] text-xs sm:text-sm mt-0.5 truncate">{listing.sellerName} &middot; {listing.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <Link href={`/listings/${id}/edit`} className="p-1.5 sm:p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#141414] transition-colors">
            <Pencil className="w-4 h-4" />
          </Link>
          {listing.status === "draft" && (
            <button onClick={handlePublish} disabled={publishing} className="p-1.5 sm:p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#141414] transition-colors cursor-pointer disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          )}
          {listing.externalUrl && (
            <a href={listing.externalUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 sm:p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#141414] transition-colors hidden sm:block">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <Link href={`/chat/${id}`} className="p-1.5 sm:p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#141414] transition-colors">
            <MessageCircle className="w-4 h-4" />
          </Link>
          <button onClick={handleDelete} className="p-1.5 sm:p-2 rounded-xl text-[#6B6B6B] hover:text-red-400 hover:bg-[#141414] transition-colors cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-[#141414] rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {listing.mainImage && (
            <img src={listing.mainImage} alt={listing.title} className="w-full sm:w-32 h-40 sm:h-32 rounded-xl object-cover shrink-0" />
          )}
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xl font-bold text-white tabular-nums">{listing.price.toLocaleString("de-DE")} &euro;</span>
              <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full ${listing.status === "published" ? "bg-[#1E1E1E] text-[#A8A29E]" : "bg-[#1E1E1E] text-[#6B6B6B]"}`}>
                {listing.status}
              </span>
            </div>
            {listing.description && <p className="text-sm text-[#6B6B6B] line-clamp-3">{listing.description}</p>}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-[#6B6B6B]">Template:</span> <span className="text-white">{listing.template}</span></div>
              <div><span className="text-[#6B6B6B]">Created:</span> <span className="text-white">{new Date(listing.createdAt).toLocaleDateString("de-DE")}</span></div>
              {listing.sourceUrl && (
                <div className="col-span-2">
                  <span className="text-[#6B6B6B]">Source: </span>
                  <a href={listing.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#A8A29E] hover:text-white transition-colors">willhaben.at</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buyer Address Card */}
      {listing.buyerName && (
        <div className="bg-[#141414] rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-[#36a3d9]" />
            <h2 className="text-sm font-semibold text-white">Buyer Address</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-[#6B6B6B]">Name: </span>
              <span className="text-white">{listing.buyerName}</span>
            </div>
            {listing.buyerAddress && (
              <div>
                <span className="text-[#6B6B6B]">Address: </span>
                <span className="text-white">{listing.buyerAddress}</span>
              </div>
            )}
            {listing.buyerOrderNumber && (
              <div>
                <span className="text-[#6B6B6B]">Order #: </span>
                <span className="text-white">{listing.buyerOrderNumber}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Notifications Block */}
      {paymentEvents.length > 0 && (
        <div className="bg-[#141414] rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-[#e8833a]" />
            <h2 className="text-sm font-semibold text-white">Payment Selections</h2>
            <span className="ml-auto px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#e8833a]/15 text-[#e8833a]">
              {paymentEvents.length}
            </span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {paymentEvents.map((event) => {
              const meta = event.metadata as Record<string, string> | null;
              const isBank = event.type === "bank_selected";
              const isMethod = event.type === "payment_method_selected";
              const methodLabel = isMethod
                ? (meta?.method === "credit_card" ? "Kreditkarte" : "Bank")
                : null;
              const bankLabel = isBank ? meta?.bank : null;

              return (
                <div key={event.id} className="flex items-center gap-3 px-3 py-2 bg-[#1A1A1A] rounded-xl">
                  {isMethod ? (
                    <CreditCard className="w-3.5 h-3.5 text-[#e8833a] shrink-0" />
                  ) : (
                    <Building2 className="w-3.5 h-3.5 text-[#36a3d9] shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-white">
                      {isMethod ? `Method: ${methodLabel}` : `Bank: ${bankLabel}`}
                    </span>
                    {event.ip && (
                      <span className="text-[10px] text-[#4A4A4A] ml-2">{event.ip}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#4A4A4A] shrink-0">
                    {new Date(event.createdAt).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
        {[
          { label: "Views", value: counts.page_view, icon: Eye },
          { label: "Continues", value: counts.continue_click, icon: Play },
          { label: "Chat", value: counts.chat_open, icon: MessageCircle },
          { label: "Messages", value: counts.message_sent, icon: MousePointerClick },
          { label: "Addresses", value: counts.address_submitted, icon: MapPin },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#141414] rounded-2xl p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-[9px] sm:text-[10px] font-medium text-[#6B6B6B] uppercase tracking-wider">{stat.label}</span>
              <stat.icon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#A8A29E]" />
            </div>
            <p className="text-base sm:text-lg font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Activity */}
      <div className="bg-[#141414] rounded-2xl overflow-hidden">
        <div className="px-4 sm:px-6 py-4">
          <h2 className="text-sm font-semibold text-white">Activity</h2>
        </div>
        {!eventData?.events.length ? (
          <div className="px-4 sm:px-6 pb-6 text-center">
            <p className="text-[#6B6B6B] text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {eventData.events.map((event) => {
              const info = EVENT_ICONS[event.type] || { icon: Eye, label: event.type };
              const Icon = info.icon;
              const meta = event.metadata as Record<string, string> | null;

              let detail = "";
              if (event.type === "payment_method_selected" && meta?.method) {
                detail = meta.method === "credit_card" ? "Kreditkarte" : "Bank";
              }
              if (event.type === "bank_selected" && meta?.bank) {
                detail = meta.bank;
              }
              if (event.type === "address_submitted" && meta?.fullName) {
                detail = meta.fullName;
              }

              return (
                <div key={event.id} className="flex items-center gap-3 px-4 sm:px-6 py-2.5 hover:bg-[#1A1A1A] transition-colors">
                  <Icon className="w-3.5 h-3.5 text-[#A8A29E] shrink-0" />
                  <span className="text-xs sm:text-sm text-white flex-1 truncate">
                    {info.label}
                    {detail && <span className="text-[#6B6B6B] ml-1.5">{detail}</span>}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#4A4A4A] shrink-0">
                    {new Date(event.createdAt).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Images */}
      {listing.images.length > 0 && (
        <div className="bg-[#141414] rounded-2xl p-4 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Additional Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {listing.images.map((img, i) => (
              <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                <img src={img} alt={`Image ${i + 1}`} className="w-full h-24 sm:h-28 rounded-xl object-cover hover:opacity-80 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
