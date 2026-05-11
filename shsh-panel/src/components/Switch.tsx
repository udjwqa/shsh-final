"use client";

export function Switch({
  checked,
  onCheckedChange,
  label,
  variant = "default",
}: {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  label?: string;
  variant?: "default" | "warn";
}) {
  const onColor = variant === "warn" ? "bg-amber-500" : "bg-emerald-500";
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
          checked ? onColor : "bg-[#2A2A2A]"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
      {label && <span className="text-xs text-[#A8A29E]">{label}</span>}
    </label>
  );
}
