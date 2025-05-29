"use client";
import { useAuthContext } from "@/context/auth-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  useSidebar,
} from "../ui/sidebar";
import useWorkspaceId from "@/hooks/use-workspace";
import { useState } from "react";
import Logo from "../logo";
import Link from "next/link";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Separator } from "../ui/separator";
import NavMain from "./nav-main";
import { NavProjects } from "./nav-projects";

const AsideBar = () => {
  const { isLoading, user } = useAuthContext();
  const { open } = useSidebar();
  const workspaceId = useWorkspaceId();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="!py-0 dark:bg-background">
          <div className=" flex h-[50px] border-b  items-center justify-start w-full">
            <Logo url={`/workspace/${workspaceId}`} />
            {open && (
              <Link
                href={`/workspace/${workspaceId}`}
                className=" hidden md:flex ml-2 items-center gap-2 select-none font-medium"
              >
                SNIK-
              </Link>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent className=" !mt-0 dark:bg-background">
          <SidebarGroup className=" !py-0">
            <SidebarGroupContent>
              <WorkspaceSwitcher />
              <Separator />
              <NavMain />
              <Separator />
              <NavProjects />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default AsideBar;
