import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "easy eBanking Login",
  description: "easybank eBanking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="size5 default">{children}</body>
    </html>
  );
}
