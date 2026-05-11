"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BankAvatar } from "@/components/BankAvatar";

type Submission = {
  id: string;
  step: string;
  listingId: string | null;
  ip: string;
  userAgent: string;
  data: Record<string, unknown>;
  createdAt: string;
  bank: { slug: string; name: string; logo: string };
};

type Bank = { slug: string; name: string };

export default function SubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [bankFilter, setBankFilter] = useState<string>("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pageSize = 25;

  useEffect(() => {
    fetch("/api/banks").then((r) => r.json()).then(setBanks);
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (bankFilter) q.set("bank", bankFilter);
    fetch(`/api/banks/submissions?${q}`)
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items);
        setTotal(d.total);
        setLoading(false);
      });
  }, [page, bankFilter]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/banks"
          className="p-2 rounded-full bg-[#1E1E1E] hover:bg-[#252525] text-[#A8A29E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Submissions</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">{total} total</p>
        </div>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <select
          value={bankFilter}
          onChange={(e) => {
            setPage(1);
            setBankFilter(e.target.value);
          }}
          className="px-4 py-2 bg-[#1E1E1E] rounded-full text-white text-xs cursor-pointer"
        >
          <option value="">All banks</option>
          {banks.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm py-20 text-center">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-[#6B6B6B] text-sm py-20 text-center">No submissions</div>
      ) : (
        <div className="bg-[#141414] rounded-2xl divide-y divide-[#1E1E1E] overflow-hidden">
          {items.map((s) => {
            const isOpen = expanded === s.id;
            return (
              <div key={s.id} className="px-5 py-3">
                <button
                  onClick={() => setExpanded(isOpen ? null : s.id)}
                  className="w-full flex items-center gap-3 text-xs text-left cursor-pointer"
                  type="button"
                >
                  <BankAvatar name={s.bank.name} slug={s.bank.slug} size={28} />
                  <span className="text-white font-medium min-w-[100px]">{s.bank.name}</span>
                  <span className="px-2 py-0.5 bg-[#1E1E1E] rounded-full text-[#A8A29E]">
                    {s.step}
                  </span>
                  <span className="text-[#6B6B6B] flex-1 truncate">
                    {s.listingId ? `listing ${s.listingId.slice(0, 8)}` : "no listing"} · IP {s.ip || "—"}
                  </span>
                  <span className="text-[#6B6B6B] shrink-0">
                    {new Date(s.createdAt).toLocaleString()}
                  </span>
                </button>
                {isOpen && (
                  <pre className="mt-3 p-3 bg-[#0A0A0A] rounded-xl text-[11px] text-[#A8A29E] overflow-x-auto">
{JSON.stringify(s.data, null, 2)}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-[#1E1E1E] hover:bg-[#252525] disabled:opacity-30 text-white text-xs rounded-full transition-colors cursor-pointer"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-[#6B6B6B] text-xs">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-[#1E1E1E] hover:bg-[#252525] disabled:opacity-30 text-white text-xs rounded-full transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
