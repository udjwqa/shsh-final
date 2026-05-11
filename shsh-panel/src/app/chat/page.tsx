"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

interface Chat {
  listingId: string;
  title: string;
  slug: string;
  unread: number;
  lastMessage: string;
  lastMessageAt: string | null;
}

export default function ChatListPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = () => {
    fetch("/api/chat/unread")
      .then((r) => r.json())
      .then((data) => {
        setChats(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Live Chat</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Conversations from your listings</p>
      </div>

      <div className="bg-[#141414] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#6B6B6B] text-sm">Loading...</div>
        ) : chats.length === 0 ? (
          <div className="p-12 text-center">
            <MessageCircle className="w-10 h-10 text-[#2A2A2A] mx-auto mb-3" />
            <p className="text-[#6B6B6B] text-sm">No conversations yet</p>
            <p className="text-[#4A4A4A] text-xs mt-1">Chats appear when a client sends a message</p>
          </div>
        ) : (
          <div>
            {chats.map((chat) => (
              <Link
                key={chat.listingId}
                href={`/chat/${chat.listingId}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#1A1A1A] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white font-medium truncate">{chat.title}</p>
                    {chat.unread > 0 && (
                      <span className="flex items-center justify-center w-5 h-5 bg-[#A8A29E] text-[#0A0A0A] text-[10px] font-bold rounded-full shrink-0">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B6B6B] mt-0.5 truncate">{chat.lastMessage}</p>
                </div>
                {chat.lastMessageAt && (
                  <span className="text-[11px] text-[#4A4A4A] ml-4 shrink-0">
                    {new Date(chat.lastMessageAt).toLocaleString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
