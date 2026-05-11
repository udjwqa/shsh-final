"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface SellerTemplate {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  iban: string;
  notes: string;
}

const emptyForm = { name: "", address: "", phone: "", email: "", iban: "", notes: "" };

export default function SellerTemplatesPage() {
  const [templates, setTemplates] = useState<SellerTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchTemplates = () => {
    fetch("/api/seller-templates")
      .then((r) => r.json())
      .then((data) => {
        setTemplates(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const url = editingId ? `/api/seller-templates/${editingId}` : "/api/seller-templates";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchTemplates();
    }
    setSaving(false);
  };

  const handleEdit = (t: SellerTemplate) => {
    setForm({ name: t.name, address: t.address, phone: t.phone, email: t.email, iban: t.iban, notes: t.notes });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await fetch(`/api/seller-templates/${id}`, { method: "DELETE" });
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const inputClass = "w-full px-4 py-3 bg-[#1E1E1E] rounded-2xl text-white placeholder-[#4A4A4A] text-sm focus:bg-[#252525] transition-colors";

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Manage seller templates</p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        <Link href="/settings" className="px-4 py-2 text-[#6B6B6B] hover:text-[#A8A29E] text-xs font-medium rounded-full whitespace-nowrap shrink-0 transition-colors">
          Connection
        </Link>
        <span className="px-4 py-2 bg-[#1E1E1E] text-white text-xs font-medium rounded-full whitespace-nowrap shrink-0">
          Seller Templates
        </span>
        <Link href="/settings/chat-templates" className="px-4 py-2 text-[#6B6B6B] hover:text-[#A8A29E] text-xs font-medium rounded-full whitespace-nowrap shrink-0 transition-colors">
          Chat Templates
        </Link>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#E8E8E8] text-[#0A0A0A] text-sm font-medium rounded-2xl transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{editingId ? "Edit Template" : "New Template"}</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="text-[#6B6B6B] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="Full name *" required />
              <input name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="Address" />
              <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="Phone" />
              <input name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="Email" />
              <input name="iban" value={form.iban} onChange={handleChange} className={inputClass} placeholder="IBAN" />
              <textarea name="notes" value={form.notes} onChange={handleChange} className={inputClass + " resize-none"} rows={2} placeholder="Notes" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="px-4 py-2 text-[#6B6B6B] hover:text-white text-sm rounded-2xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-white hover:bg-[#E8E8E8] disabled:opacity-40 text-[#0A0A0A] text-sm font-medium rounded-2xl transition-colors cursor-pointer">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-[#141414] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#6B6B6B] text-sm">Loading...</div>
        ) : templates.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[#6B6B6B] text-sm">No seller templates yet</p>
          </div>
        ) : (
          templates.map((t) => (
            <div key={t.id} className="border-b border-[#1E1E1E] last:border-0">
              <div className="flex items-center justify-between px-6 py-4 hover:bg-[#1A1A1A] transition-colors">
                <button
                  onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                  className="flex items-center gap-3 flex-1 text-left cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white font-medium">{t.name}</p>
                    <p className="text-xs text-[#6B6B6B] truncate">{t.address || "No address"}</p>
                  </div>
                  {expandedId === t.id ? (
                    <ChevronUp className="w-4 h-4 text-[#6B6B6B] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6B6B6B] shrink-0" />
                  )}
                </button>
                <div className="flex items-center gap-1 ml-3">
                  <button onClick={() => handleEdit(t)} className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#1E1E1E] transition-colors cursor-pointer">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-2 rounded-xl text-[#6B6B6B] hover:text-red-400 hover:bg-[#1E1E1E] transition-colors cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {expandedId === t.id && (
                <div className="px-6 pb-4 grid grid-cols-2 gap-2 text-xs">
                  {t.phone && <div><span className="text-[#6B6B6B]">Phone:</span> <span className="text-white">{t.phone}</span></div>}
                  {t.email && <div><span className="text-[#6B6B6B]">Email:</span> <span className="text-white">{t.email}</span></div>}
                  {t.iban && <div className="col-span-2"><span className="text-[#6B6B6B]">IBAN:</span> <span className="text-white">{t.iban}</span></div>}
                  {t.notes && <div className="col-span-2"><span className="text-[#6B6B6B]">Notes:</span> <span className="text-white">{t.notes}</span></div>}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
