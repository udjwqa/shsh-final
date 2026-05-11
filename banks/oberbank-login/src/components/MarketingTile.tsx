export default function MarketingTile() {
  return (
    <div className="obr-tile flex flex-col">
      {/* Placeholder image area */}
      <div
        className="w-full aspect-video flex items-center justify-center relative"
        style={{ backgroundColor: "#8b2332" }}
      >
        <div className="text-center text-white px-4">
          <p className="text-sm opacity-80">Treasury Market Flash</p>
        </div>
        {/* Carousel dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#c90000" }} />
          <span className="w-2 h-2 rounded-full bg-white/50" />
          <span className="w-2 h-2 rounded-full bg-white/50" />
          <span className="w-2 h-2 rounded-full bg-white/50" />
        </div>
        {/* Play button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium mb-2" style={{ color: "#30454c" }}>
          Treasury Market Flash
        </h3>
        <a
          href="#"
          className="inline-block text-xs text-white px-3 py-1 rounded-sm"
          style={{ backgroundColor: "#c90000" }}
        >
          Zum Video &gt;
        </a>
      </div>

      <div className="border-t border-obr-gray-light p-4">
        <p className="text-sm font-medium" style={{ color: "#30454c" }}>
          Der Lack ist ab!
        </p>
      </div>
    </div>
  );
}
