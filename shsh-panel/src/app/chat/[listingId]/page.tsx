"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Send, Paperclip, Zap, Settings } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  sender: "client" | "support";
  imageUrl: string | null;
  createdAt: string;
}

interface ChatTemplate {
  id: string;
  title: string;
  content: string;
}

export default function ChatPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [templates, setTemplates] = useState<ChatTemplate[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastTimestamp = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async (initial = false) => {
    const url = initial ? `/api/chat/${listingId}` : `/api/chat/${listingId}?after=${encodeURIComponent(lastTimestamp.current || "")}`;
    const res = await fetch(url);
    const data: Message[] = await res.json();
    if (initial) { setMessages(data); } else if (data.length > 0) { setMessages((prev) => [...prev, ...data]); }
    if (data.length > 0) { lastTimestamp.current = data[data.length - 1].createdAt; }
  };

  useEffect(() => {
    fetch("/api/listings").then((r) => r.json()).then((listings) => {
      const found = listings.find((l: { id: string }) => l.id === listingId);
      if (found) setTitle(found.title);
    });
  }, [listingId]);

  useEffect(() => {
    fetch("/api/chat-templates").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setTemplates(data);
    });
  }, []);

  useEffect(() => { fetchMessages(true); fetch(`/api/chat/${listingId}/read`, { method: "POST" }); }, [listingId]);
  useEffect(() => { const interval = setInterval(() => fetchMessages(), 3000); return () => clearInterval(interval); }, [listingId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (templatesRef.current && !templatesRef.current.contains(e.target as Node)) setShowTemplates(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSend = async (imageUrl?: string) => {
    if (!input.trim() && !imageUrl) return;
    if (sending) return;
    setSending(true);
    const res = await fetch(`/api/chat/${listingId}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim(), sender: "support", imageUrl: imageUrl || null }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      lastTimestamp.current = msg.createdAt;
      setInput("");
    }
    setSending(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) { await handleSend(data.url); } else { alert(data.error || "Upload failed"); }
    } catch { alert("Upload failed"); }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleTemplateSelect = (content: string) => { setInput(content); setShowTemplates(false); };

  const hasClientMessage = messages.some((m) => m.sender === "client");

  return (
    <div className="flex flex-col h-[calc(100vh-56px-32px)] sm:h-[calc(100vh-56px-48px)]">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <Link href="/chat" className="p-2 rounded-xl text-[#6B6B6B] hover:text-white hover:bg-[#141414] transition-colors shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">{title || "Chat"}</h1>
          <p className="text-[#6B6B6B] text-xs">Live conversation</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#141414] rounded-2xl p-3 sm:p-5 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-[#4A4A4A] text-sm">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "support" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] sm:max-w-[70%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-sm ${msg.sender === "support" ? "bg-[#A8A29E] text-[#0A0A0A]" : "bg-[#1E1E1E] text-white"}`}>
                {msg.imageUrl && (
                  <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                    <img src={msg.imageUrl} alt="Shared image" className="max-w-full max-h-48 rounded-xl mb-2 hover:opacity-80 transition-opacity" />
                  </a>
                )}
                {msg.content && <p className="break-words">{msg.content}</p>}
                <p className={`text-[10px] mt-1 ${msg.sender === "support" ? "text-[#0A0A0A]/50" : "text-[#4A4A4A]"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {hasClientMessage ? (
        <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-3">
          <div ref={templatesRef} className="relative">
            <button onClick={() => setShowTemplates(!showTemplates)} className="p-2 sm:p-3 rounded-2xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#141414] transition-colors cursor-pointer" title="Quick replies">
              <Zap className="w-4 h-4" />
            </button>
            {showTemplates && (
              <div className="absolute bottom-full left-0 mb-2 bg-[#1E1E1E] rounded-2xl overflow-hidden z-10 min-w-[220px] sm:min-w-[250px] max-h-60 overflow-y-auto">
                {templates.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-[#6B6B6B]">No templates yet</div>
                ) : (
                  templates.map((t) => (
                    <button key={t.id} onClick={() => handleTemplateSelect(t.content)} className="w-full px-4 py-3 text-left hover:bg-[#252525] transition-colors cursor-pointer">
                      <p className="text-sm text-white">{t.title}</p>
                      <p className="text-xs text-[#4A4A4A] truncate mt-0.5">{t.content}</p>
                    </button>
                  ))
                )}
                <Link href="/settings/chat-templates" className="block px-4 py-2.5 text-xs text-[#A8A29E] hover:text-white border-t border-[#2A2A2A] transition-colors">
                  <div className="flex items-center gap-1.5"><Settings className="w-3 h-3" /> Manage templates</div>
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="p-2 sm:p-3 rounded-2xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#141414] transition-colors cursor-pointer disabled:opacity-40" title="Upload image">
            <Paperclip className="w-4 h-4" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileSelect} className="hidden" />

          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#141414] rounded-2xl text-white placeholder-[#4A4A4A] text-sm" placeholder="Type a message..." />

          <button onClick={() => handleSend()} disabled={!input.trim() || sending} className="p-2.5 sm:p-3 bg-[#A8A29E] hover:bg-[#BDB8B3] disabled:opacity-30 rounded-2xl transition-colors cursor-pointer shrink-0">
            <Send className="w-4 h-4 text-[#0A0A0A]" />
          </button>
        </div>
      ) : (
        <div className="mt-3 text-center py-3">
          <p className="text-[#4A4A4A] text-xs">Waiting for client to start the conversation</p>
        </div>
      )}
    </div>
  );
}
