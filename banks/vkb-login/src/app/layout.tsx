import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Login - VKB",
  description: "VKB-Bank Online Banking Login",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full">
      <body className="min-h-screen flex flex-col font-sans">{children}</body>
    </html>
  );
}
