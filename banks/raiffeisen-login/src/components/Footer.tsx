export default function Footer() {
  const links = [
    { label: "Impressum", href: "#" },
    { label: "Nutzungsbedingungen", href: "#" },
    { label: "Barrierefreiheitserklärung", href: "#" },
  ];

  return (
    <footer className="hidden sm:block w-full mt-auto mb-4">
      <div className="flex justify-center items-center gap-1 flex-wrap">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs text-raf-gray-600 hover:text-raf-gray-900 transition-colors border-0 bg-transparent"
          >
            <span className="text-white/80 drop-shadow-sm">{link.label}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white/60"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        ))}
        <a
          href="#"
          className="inline-flex items-center px-2 py-1 text-xs border-0 bg-transparent"
        >
          <span className="text-white/80 drop-shadow-sm">© 2026 Raiffeisen</span>
        </a>
      </div>
    </footer>
  );
}
