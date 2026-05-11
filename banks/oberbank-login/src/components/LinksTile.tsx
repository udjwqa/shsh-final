const links = [
  "Funktionsübersicht / Video",
  "FAQs - Häufig gestellte Fragen",
  "Wertpapier-Infos",
  "Sicherheit",
  "Security-App",
  "Servicenummern",
  "Support-Tool (Fernwartung)",
];

export default function LinksTile() {
  return (
    <div className="obr-tile flex flex-col">
      <div className="obr-tile-header">
        <h2 className="text-base font-medium" style={{ color: "#30454c" }}>
          Weiterführende Links
        </h2>
      </div>

      <div className="flex-1">
        {links.map((link) => (
          <a key={link} href="#" className="obr-link-item">
            <span>{link}</span>
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              stroke="#30454c"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 1l6 6-6 6" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
