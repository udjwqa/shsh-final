import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bank Austria",
  description: "24You Online Banking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" translate="no">
      <body>{children}</body>
    </html>
  );
}
