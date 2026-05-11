export default function Header() {
  return (
    <header className="relative w-full">
      <div className="absolute top-0 left-0 right-0 h-1 z-50" />
      <div className="relative px-4 py-2">
        <div className="flex justify-end sm:hidden">
          <button
            type="button"
            className="mt-2 w-10 h-10 rounded-full bg-hyp-primary flex items-center justify-center shadow-md hover:shadow-lg transition-shadow text-white"
            aria-label="Menü öffnen"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
