import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Login",
  description: "hausbanking Login",
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
