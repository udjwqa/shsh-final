"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const PANEL_URL = process.env.NEXT_PUBLIC_PANEL_URL || "http://localhost:8500";

interface Message {
  id: string;
  content: string;
  sender: "client" | "support";
  createdAt: string;
}

interface ChatWidgetProps {
  listingId: string;
}

interface SupportAgent {
  name: string;
  color: string;
  initials: string;
  avatarUrl?: string;
}

const SUPPORT_AGENTS: SupportAgent[] = [
  { name: "Anna M.", initials: "AM", color: "#e74c3c", avatarUrl: "https://i.pravatar.cc/80?img=1" },
  { name: "Thomas K.", initials: "TK", color: "#3498db", avatarUrl: "https://i.pravatar.cc/80?img=11" },
  { name: "Lisa W.", initials: "LW", color: "#9b59b6", avatarUrl: "https://i.pravatar.cc/80?img=5" },
  { name: "Markus B.", initials: "MB", color: "#27ae60", avatarUrl: "https://i.pravatar.cc/80?img=12" },
  { name: "Sarah L.", initials: "SL", color: "#e67e22", avatarUrl: "https://i.pravatar.cc/80?img=9" },
  { name: "Julia H.", initials: "JH", color: "#1abc9c", avatarUrl: "https://i.pravatar.cc/80?img=16" },
  { name: "Stefan R.", initials: "SR", color: "#2c3e50", avatarUrl: "https://i.pravatar.cc/80?img=14" },
  { name: "Nicole F.", initials: "NF", color: "#e84393", avatarUrl: "https://i.pravatar.cc/80?img=20" },
];

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

function trackEvent(type: string, listingId: string) {
  fetch(`${PANEL_URL}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, listingId }),
  }).catch(() => {});
}

export default function ChatWidget({ listingId }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const lastTimestampRef = useRef<string | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pick a random agent once per session (stable across re-renders)
  const agent = useMemo(() => {
    const idx = Math.floor(Math.random() * SUPPORT_AGENTS.length);
    return SUPPORT_AGENTS[idx];
  }, []);

  const scrollToBottom = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch(`${PANEL_URL}/api/chat/${listingId}`);
      if (!res.ok) return;
      const data: Message[] = await res.json();
      setMessages(data);
      if (data.length > 0) {
        lastTimestampRef.current = data[data.length - 1].createdAt;
      }
      setTimeout(scrollToBottom, 50);
    } catch {
      // ignore
    }
  }, [listingId, scrollToBottom]);

  const pollNewMessages = useCallback(async () => {
    if (!lastTimestampRef.current) return;
    try {
      const url = `${PANEL_URL}/api/chat/${listingId}?after=${encodeURIComponent(lastTimestampRef.current)}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data: Message[] = await res.json();
      if (data.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMsgs = data.filter((m) => !existingIds.has(m.id));
          return newMsgs.length > 0 ? [...prev, ...newMsgs] : prev;
        });
        lastTimestampRef.current = data[data.length - 1].createdAt;
        setTimeout(scrollToBottom, 50);
      }
    } catch {
      // ignore
    }
  }, [listingId, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      loadMessages();
      pollTimerRef.current = setInterval(pollNewMessages, 3000);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    }
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [isOpen, loadMessages, pollNewMessages]);

  const handleOpen = () => {
    setIsOpen(true);
    trackEvent("chat_open", listingId);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;
    const text = inputText.trim();
    setInputText("");
    setIsSending(true);
    try {
      const res = await fetch(`${PANEL_URL}/api/chat/${listingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, sender: "client" }),
      });
      if (res.ok) {
        const msg: Message = await res.json();
        setMessages((prev) => [...prev, msg]);
        lastTimestampRef.current = msg.createdAt;
        trackEvent("message_sent", listingId);
        setTimeout(scrollToBottom, 50);
      }
    } catch {
      // ignore
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Widget Panel */}
      <div className={`chat-widget ${isOpen ? "visible" : "hidden"}`} role="dialog" aria-label="Chat">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-avatar" style={{ overflow: "hidden" }}>
            {agent.avatarUrl && !avatarLoaded && (
              <img
                src={agent.avatarUrl}
                alt=""
                style={{ display: "none" }}
                onLoad={() => setAvatarLoaded(true)}
                onError={() => setAvatarLoaded(false)}
              />
            )}
            {avatarLoaded && agent.avatarUrl ? (
              <img
                src={agent.avatarUrl}
                alt={agent.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
              />
            ) : (
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{agent.initials}</span>
            )}
          </div>
          <div className="chat-header-info">
            <div className="chat-header-title">{agent.name}</div>
            <div className="chat-header-status">
              <span className="chat-online-dot" />
              <span className="chat-header-subtitle">Online</span>
            </div>
          </div>
          <button className="chat-close-btn" onClick={handleClose} aria-label="Chat schließen">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="chat-body" ref={bodyRef}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", color: "#aaa", fontSize: 13, padding: "20px 0" }}>
              Starten Sie einen Dialog — wir antworten in Kürze
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <div className="chat-bubble-msg">{msg.content}</div>
              <div className="chat-message-time">{formatTime(msg.createdAt)}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="chat-footer">
          <div className="chat-input-row">
            <input
              ref={inputRef}
              className="chat-input-simple"
              type="text"
              placeholder="Nachricht schreiben..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="chat-send-btn"
              aria-label="Senden"
              onClick={handleSend}
              disabled={isSending || !inputText.trim()}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bubble */}
      <button className="chat-bubble" onClick={handleOpen} aria-label="Chat öffnen">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      </button>
    </>
  );
}
