import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayLife",
  description: "PayLife Login",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body id="sesam2">{children}</body>
    </html>
  );
}
