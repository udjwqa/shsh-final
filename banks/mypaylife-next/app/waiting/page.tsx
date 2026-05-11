import WaitingScreen from "@/components/WaitingScreen";

export default async function WaitingPage({ searchParams }: { searchParams: Promise<{ user?: string }> }) {
  const params = await searchParams;
  return <WaitingScreen user={params.user || ""} />;
}
