import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Login - Poso",
  description: "Posojilnica Bank Login",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
