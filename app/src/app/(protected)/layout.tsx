import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/auth-provider";
import React from "react";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <SidebarInset className="overflow-x-hidden">
          <div className="w-full">
            <Header />
            <div className="px-3 lg:px-20 py-3">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
