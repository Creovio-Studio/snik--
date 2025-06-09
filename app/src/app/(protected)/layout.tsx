import AsideBar from "@/components/asidebar/asidebar";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import CreateProjectDialog from "@/components/workspace/project/create-project-dialog";
import CreateWorkspaceDialog from "@/components/workspace/create-workspace-dialog";
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AsideBar />
      <SidebarInset className="overflow-x-hidden">
        <div className="w-full">
          <>
            <Header />
            <div className="px-3 lg:px-20 py-3">{children}</div>
          </>
          <CreateProjectDialog />
          <CreateWorkspaceDialog />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
