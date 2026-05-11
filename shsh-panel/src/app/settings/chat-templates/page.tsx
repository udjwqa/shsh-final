"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, X } from "lucide-react";
import Link from "next/link";

interface ChatTemplate {
  id: string;
  title: string;
  content: string;
}

const emptyForm = { title: "", content: "" };

export default function ChatTemplatesPage() {
  const [templates, setTemplates] = useState<ChatTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchTemplates = () => {
    fetch("/api/chat-templates")
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

    const url = editingId ? `/api/chat-templates/${editingId}` : "/api/chat-templates";
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

  const handleEdit = (t: ChatTemplate) => {
    setForm({ title: t.title, content: t.content });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await fetch(`/api/chat-templates/${id}`, { method: "DELETE" });
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const inputClass = "w-full px-4 py-3 bg-[#1E1E1E] rounded-2xl text-white placeholder-[#4A4A4A] text-sm focus:bg-[#252525] transition-colors";

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Manage quick reply templates</p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        <Link href="/settings" className="px-4 py-2 text-[#6B6B6B] hover:text-[#A8A29E] text-xs font-medium rounded-full whitespace-nowrap shrink-0 transition-colors">
          Connection
        </Link>
        <Link href="/settings/sellers" className="px-4 py-2 text-[#6B6B6B] hover:text-[#A8A29E] text-xs font-medium rounded-full whitespace-nowrap shrink-0 transition-colors">
          Seller Templates
        </Link>
        <span className="px-4 py-2 bg-[#1E1E1E] text-white text-xs font-medium rounded-full whitespace-nowrap shrink-0">
          Chat Templates
        </span>
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
              <input name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="Template title *" required />
              <textarea name="content" value={form.content} onChange={handleChange} className={inputClass + " resize-none"} rows={4} placeholder="Message content *" required />
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
            <p className="text-[#6B6B6B] text-sm">No chat templates yet</p>
            <p className="text-[#4A4A4A] text-xs mt-1">Create quick replies for common responses</p>
          </div>
        ) : (
          templates.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#1A1A1A] transition-colors border-b border-[#1E1E1E] last:border-0">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white font-medium">{t.title}</p>
                <p className="text-xs text-[#6B6B6B] mt-0.5 truncate">{t.content}</p>
              </div>
              <div className="flex items-center gap-1 ml-3">
                <button onClick={() => handleEdit(t)} className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#1E1E1E] transition-colors cursor-pointer">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-2 rounded-xl text-[#6B6B6B] hover:text-red-400 hover:bg-[#1E1E1E] transition-colors cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
