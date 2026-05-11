const footerLinks = [
  { label: "Impressum", href: "#" },
  { label: "AGB", href: "#" },
  { label: "Filialfinder", href: "#" },
  { label: "Fernwartung", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full mt-auto py-4 border-t border-obr-gray-light">
      <div className="max-w-[1100px] mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs hover:underline"
              style={{ color: "#30454c" }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <span className="text-xs" style={{ color: "#30454c" }}>
          © 2026 Oberbank AG
        </span>
      </div>
    </footer>
  );
}
