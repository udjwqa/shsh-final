import Link from "next/link";
import Footer from "@/components/Footer";

export default function SuccessPage() {
  return (
    <div
      className="min-h-screen flex flex-col login-bg"
      style={{
        backgroundImage: "url('/raiffeisen/bg-forest.jpg')",
        backgroundColor: "#2d5a27",
      }}
    >
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-lg w-full max-w-[460px] py-10 px-6 flex flex-col items-center shadow-lg">
          <div className="raf-success-check" aria-hidden="true">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-normal text-center">
            Sie wurden erfolgreich angemeldet.
          </h1>
          <Link
            href="/"
            className="raf-btn-primary mt-8 text-center inline-block no-underline"
          >
            Zurück zum Login
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
