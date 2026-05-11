import Header from "@/components/Sidebar";

export default function BanksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 max-w-5xl mx-auto w-full">{children}</main>
    </div>
  );
}
