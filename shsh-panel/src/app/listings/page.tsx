"use client";

import { useEffect, useState } from "react";
import { Trash2, ExternalLink, Send, Search, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Listing {
  id: string;
  sellerName: string;
  title: string;
  price: number;
  status: string;
  externalUrl: string | null;
  sourceUrl: string | null;
  createdAt: string;
}

export default function ListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);

  const fetchListings = () => {
    fetch("/api/listings").then((r) => r.json()).then((data) => {
      setListings(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchListings(); }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this listing?")) return;
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const handlePublish = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPublishing(id);
    try {
      const res = await fetch(`/api/listings/${id}/publish`, { method: "POST" });
      const data = await res.json();
      if (res.ok) { fetchListings(); } else { alert(data.error || "Failed to publish"); }
    } catch { alert("Failed to publish"); }
    setPublishing(null);
  };

  const filtered = listings.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase()) || l.sellerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Listings</h1>
          <p className="text-[#6B6B6B] text-sm mt-1 hidden sm:block">Manage all your listings</p>
        </div>
        <Link href="/listings/new" className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#141414] hover:bg-[#1A1A1A] text-white text-sm font-medium rounded-2xl transition-colors whitespace-nowrap shrink-0">
          + New
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-[#141414] rounded-2xl text-white placeholder-[#6B6B6B] text-sm" />
      </div>

      <div className="bg-[#141414] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#6B6B6B] text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[#6B6B6B] text-sm">{search ? "No results" : "No listings yet"}</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="w-full hidden md:table">
              <thead>
                <tr className="text-left">
                  <th className="px-6 py-3 text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-3 text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((listing) => (
                  <tr key={listing.id} onClick={() => router.push(`/listings/${listing.id}`)} className="hover:bg-[#1A1A1A] transition-colors cursor-pointer">
                    <td className="px-6 py-3.5 text-sm text-white">
                      <div className="flex items-center gap-2">
                        {listing.title}
                        {listing.sourceUrl && (
                          <a href={listing.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#4A4A4A] hover:text-[#A8A29E] transition-colors" title="View on willhaben">
                            <Eye className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-[#6B6B6B]">{listing.sellerName}</td>
                    <td className="px-6 py-3.5 text-sm text-white tabular-nums">{listing.price.toLocaleString("de-DE")} &euro;</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full ${listing.status === "published" ? "bg-[#1E1E1E] text-[#A8A29E]" : "bg-[#1E1E1E] text-[#6B6B6B]"}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-[#6B6B6B]">{new Date(listing.createdAt).toLocaleDateString("de-DE")}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {listing.status === "draft" && (
                          <button onClick={(e) => handlePublish(e, listing.id)} disabled={publishing === listing.id} className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#1E1E1E] transition-colors cursor-pointer disabled:opacity-40" title="Publish">
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {listing.externalUrl && (
                          <a href={listing.externalUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#1E1E1E] transition-colors" title="Open">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button onClick={(e) => handleDelete(e, listing.id)} className="p-2 rounded-xl text-[#6B6B6B] hover:text-red-400 hover:bg-[#1E1E1E] transition-colors cursor-pointer" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-[#1E1E1E]">
              {filtered.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => router.push(`/listings/${listing.id}`)}
                  className="px-4 py-3.5 hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white truncate">{listing.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#6B6B6B]">{listing.sellerName}</span>
                        <span className="text-xs text-[#4A4A4A]">{new Date(listing.createdAt).toLocaleDateString("de-DE")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm text-white tabular-nums font-medium">{listing.price.toLocaleString("de-DE")} &euro;</span>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${listing.status === "published" ? "bg-[#1E1E1E] text-[#A8A29E]" : "bg-[#1E1E1E] text-[#6B6B6B]"}`}>
                        {listing.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 justify-end">
                    {listing.status === "draft" && (
                      <button onClick={(e) => handlePublish(e, listing.id)} disabled={publishing === listing.id} className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#A8A29E] transition-colors cursor-pointer disabled:opacity-40" title="Publish">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={(e) => handleDelete(e, listing.id)} className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-red-400 transition-colors cursor-pointer" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
