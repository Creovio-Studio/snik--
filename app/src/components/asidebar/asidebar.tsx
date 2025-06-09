"use client";
import { useAuthContext } from "@/context/auth-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
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
import { EllipsisIcon, Loader, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const AsideBar = () => {
  const { isLoading, user } = useAuthContext();
  const { open } = useSidebar();
  const workspaceId = useWorkspaceId();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Sidebar collapsible="icon" className="">
        <SidebarHeader className="!py-0 dark:bg-background">
          <div className=" flex h-[50px] border-b  items-center justify-start w-full">
            <Link
              href={`/workspace/${workspaceId}`}
              className="flex items-center gap-2"
            >
              <Logo />
              {open && (
                <span className="hidden md:flex select-none font-medium">
                  SNIK-
                </span>
              )}
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent className="dark:bg-background">
          <SidebarGroup className="">
            <SidebarGroupContent>
              <WorkspaceSwitcher />
              <Separator className=" my-2" />
              <NavMain />
              <Separator />
              <NavProjects />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className=" dark:bg-background">
          <SidebarMenuItem>
            {isLoading ? (
              <Loader
                size={24}
                className=" place-self-center self-center animate-spin"
              />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size={"lg"}
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className=" h-8 w-8 rounded-full">
                      <AvatarImage src={user?.profile_picture || ""} />
                      <AvatarFallback className=" rounded-full border border-gray-500">
                        {user?.name?.split(" ")?.[0]?.charAt(0)}
                        {user?.name?.split(" ")?.[1]?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className=" truncate font-semibold">
                        {user?.name}
                      </span>
                      <span className=" truncate text-xs">{user?.email}</span>
                    </div>
                    <EllipsisIcon className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={"bottom"}
                  align="start"
                  sideOffset={4}
                >
                  <DropdownMenuGroup></DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsOpen(true)}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AsideBar;
