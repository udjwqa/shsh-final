import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Login",
  description: "Login 24/7 Internetbanking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="login banking">{children}</body>
    </html>
  );
}
