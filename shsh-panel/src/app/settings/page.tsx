"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    externalDomain: "",
    apiKey: "",
    apiEndpoint: "",
    telegramBotToken: "",
    telegramChatId: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          externalDomain: data.externalDomain || "",
          apiKey: data.apiKey || "",
          apiEndpoint: data.apiEndpoint || "",
          telegramBotToken: data.telegramBotToken || "",
          telegramChatId: data.telegramChatId || "",
        });
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert("Failed to save");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-[#6B6B6B] text-sm py-20 text-center">Loading...</div>;
  }

  const inputClass = "w-full px-4 py-3 bg-[#1E1E1E] rounded-2xl text-white placeholder-[#4A4A4A] text-sm focus:bg-[#252525] transition-colors";

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">External server connection</p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        <span className="px-4 py-2 bg-[#1E1E1E] text-white text-xs font-medium rounded-full whitespace-nowrap shrink-0">
          Connection
        </span>
        <Link href="/settings/sellers" className="px-4 py-2 text-[#6B6B6B] hover:text-[#A8A29E] text-xs font-medium rounded-full whitespace-nowrap shrink-0 transition-colors">
          Seller Templates
        </Link>
        <Link href="/settings/chat-templates" className="px-4 py-2 text-[#6B6B6B] hover:text-[#A8A29E] text-xs font-medium rounded-full whitespace-nowrap shrink-0 transition-colors">
          Chat Templates
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
          <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Connection</p>

          <div className="space-y-1">
            <label className="block text-xs text-[#6B6B6B] ml-1">Domain</label>
            <input
              type="url"
              name="externalDomain"
              value={form.externalDomain}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://www.example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-[#6B6B6B] ml-1">API Endpoint</label>
            <input
              type="text"
              name="apiEndpoint"
              value={form.apiEndpoint}
              onChange={handleChange}
              className={inputClass}
              placeholder="/api/listings"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-[#6B6B6B] ml-1">API Key</label>
            <input
              type="password"
              name="apiKey"
              value={form.apiKey}
              onChange={handleChange}
              className={inputClass}
              placeholder="Bearer token"
            />
          </div>
        </div>

        <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
          <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Telegram Notifications</p>

          <div className="space-y-1">
            <label className="block text-xs text-[#6B6B6B] ml-1">Bot Token</label>
            <input
              type="password"
              name="telegramBotToken"
              value={form.telegramBotToken}
              onChange={handleChange}
              className={inputClass}
              placeholder="123456:ABC-DEF..."
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-[#6B6B6B] ml-1">Chat ID</label>
            <input
              type="text"
              name="telegramChatId"
              value={form.telegramChatId}
              onChange={handleChange}
              className={inputClass}
              placeholder="Your Telegram chat ID"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="flex items-center gap-1.5 text-[#A8A29E] text-xs font-medium">
              <Check className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-white hover:bg-[#E8E8E8] disabled:opacity-40 text-[#0A0A0A] text-sm font-medium rounded-2xl transition-colors cursor-pointer"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
