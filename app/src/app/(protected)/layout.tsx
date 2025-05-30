import AsideBar from "@/components/asidebar/asidebar";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import CreateProjectDialog from "@/components/workspace/project/create-project-dialog";
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NuqsAdapter>
      <SidebarProvider>
        <AsideBar />
        <SidebarInset className="overflow-x-hidden">
          <div className="w-full">
            <>
              <Header />
              <div className="px-3 lg:px-20 py-3">{children}</div>
            </>
            <CreateProjectDialog />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </NuqsAdapter>
  );
}
