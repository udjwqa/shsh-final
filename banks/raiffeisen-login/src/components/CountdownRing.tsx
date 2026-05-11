"use client";

import { useEffect, useState } from "react";

const INITIAL_SECONDS = 5 * 60;

function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type Props = {
  onExpired?: () => void;
  onResend?: () => void;
};

export default function CountdownRing({ onExpired, onResend }: Props) {
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);

  useEffect(() => {
    if (seconds <= 0) {
      onExpired?.();
      return;
    }
    const id = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [seconds, onExpired]);

  const handleResend = () => {
    setSeconds(INITIAL_SECONDS);
    onResend?.();
  };

  if (seconds === 0) {
    return (
      <button
        type="button"
        onClick={handleResend}
        className="raf-resend-btn"
      >
        Code erneut senden
      </button>
    );
  }

  return (
    <div className="raf-countdown-ring" aria-label={`Zeit verbleibend: ${formatTime(seconds)}`}>
      {formatTime(seconds)}
    </div>
  );
}
