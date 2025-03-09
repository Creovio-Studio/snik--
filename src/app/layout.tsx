import type { Metadata } from "next";
import { DM_Mono } from "next/font/google";
import "./globals.css";

const dm_mono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SNIK PAGES",
  description: "Private, end-to-end encrypted, and open-source.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dm_mono.variable} antialiased`}>{children}</body>
    </html>
  );
}
