export default function Header() {
  return (
    <header className="w-full" style={{ backgroundColor: "#ffdc00", minHeight: "60px" }}>
      <div className="flex items-center justify-center h-[60px]">
        <div
          className="h-[40px] w-[120px] bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: "url('/bank99/bank99-logo.png')" }}
        />
      </div>
    </header>
  );
}
