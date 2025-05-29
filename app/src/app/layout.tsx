import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/context/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth-provider";

const dmSens = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SNIK-",
  description: "A simple, fast, and secure Project Management s",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSens.className}`} suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
