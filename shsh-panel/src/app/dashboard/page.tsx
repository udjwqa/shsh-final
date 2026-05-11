"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FileText, Globe, BarChart3, TrendingUp, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  price: number;
  slug: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => {
        setListings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalListings = listings.length;
  const published = listings.filter((l) => l.status === "published").length;
  const drafts = listings.filter((l) => l.status === "draft").length;
  const totalValue = listings.reduce((sum, l) => sum + l.price, 0);

  const stats = [
    { label: "Total", value: totalListings, icon: FileText },
    { label: "Published", value: published, icon: Globe },
    { label: "Drafts", value: drafts, icon: BarChart3 },
    { label: "Value", value: `${totalValue.toLocaleString("de-DE")} €`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Welcome{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Overview of your listings</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#141414] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-[#A8A29E]" />
            </div>
            <p className="text-xl font-bold text-white">
              {loading ? "—" : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[#141414] rounded-2xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-sm font-semibold text-white">Recent Listings</h2>
          <Link
            href="/listings/new"
            className="px-4 py-2 bg-[#1E1E1E] hover:bg-[#252525] text-[#A8A29E] text-xs font-medium rounded-xl transition-colors"
          >
            + New
          </Link>
        </div>

        {loading ? (
          <div className="px-6 pb-6 text-[#6B6B6B] text-sm">Loading...</div>
        ) : listings.length === 0 ? (
          <div className="px-6 pb-8 text-center">
            <p className="text-[#6B6B6B] text-sm">No listings yet</p>
            <Link
              href="/listings/new"
              className="inline-block mt-2 text-[#A8A29E] hover:text-white text-sm font-medium transition-colors"
            >
              Create your first listing
            </Link>
          </div>
        ) : (
          <div>
            {listings.slice(0, 5).map((listing, i) => (
              <div
                key={listing.id}
                className={`flex items-center justify-between px-6 py-3.5 hover:bg-[#1A1A1A] transition-colors ${
                  i === 0 ? "" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{listing.title}</p>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">
                    {new Date(listing.createdAt).toLocaleDateString("de-DE")}
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className="text-sm text-white tabular-nums">{listing.price.toLocaleString("de-DE")} €</span>
                  <span
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-full ${
                      listing.status === "published"
                        ? "bg-[#1E1E1E] text-[#A8A29E]"
                        : "bg-[#1E1E1E] text-[#6B6B6B]"
                    }`}
                  >
                    {listing.status}
                  </span>
                  <a
                    href={`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"}/iad/kaufen-und-verkaufen/d/${listing.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-[#4A4A4A] hover:text-[#A8A29E] transition-colors"
                    title="Open on external site"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
