export default function Header() {
  return (
    <header className="w-full bg-white">
      <div className="max-w-[1100px] mx-auto px-4 flex items-center" style={{ height: "90px" }}>
        <a href="#">
          <img
            src="/oberbank/oberbank-logo.png"
            alt="Oberbank"
            width={162}
            height={28}
          />
        </a>
      </div>
    </header>
  );
}
