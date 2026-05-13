const PALETTE = [
  "#0e4a8a", "#1e2952", "#0099cc", "#dc1f1f", "#e8833a",
  "#8bc34a", "#36a3d9", "#7c3aed", "#16a34a", "#0891b2",
  "#db2777", "#f59e0b", "#0d9488", "#9333ea", "#475569",
  "#b91c1c", "#0ea5e9", "#ca8a04",
];

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function initials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) {
    const w = words[0];
    return w.length >= 3 ? w.slice(0, 3).toUpperCase() : w.toUpperCase();
  }
  return words.slice(0, 3).map((w) => w[0]).join("").toUpperCase();
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

export function BankAvatar({
  name,
  slug,
  logo,
  size = 36,
}: {
  name: string;
  slug: string;
  logo?: string;
  size?: number;
}) {
  const color = PALETTE[hash(slug) % PALETTE.length];
  const text = initials(name);
  const fontSize = text.length >= 3 ? size * 0.32 : size * 0.42;

  if (logo) {
    const src = logo.startsWith("http") ? logo : `${SITE_URL}${logo}`;
    return (
      <div
        className="shrink-0 flex items-center justify-center rounded-lg overflow-hidden bg-white"
        style={{ width: size, height: size }}
        aria-label={name}
      >
        <img
          src={src}
          alt={name}
          style={{ width: size - 4, height: size - 4, objectFit: "contain" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>
    );
  }

  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-lg select-none font-bold text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize,
        letterSpacing: text.length >= 3 ? "-0.02em" : 0,
      }}
      aria-label={name}
    >
      {text}
    </div>
  );
}
