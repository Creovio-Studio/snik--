"use client";
import { Permissions } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";
import useWorkspaceId from "@/hooks/use-workspace";
import {
  CheckCircle,
  LayoutDashboard,
  LucideIcon,
  Settings,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ItemType = {
  title: string;
  url: string;
  icon: LucideIcon;
};
const NavMain = () => {
  const { hasPermission } = useAuthContext();
  const canManageSettings = hasPermission(
    Permissions.MANAGE_WORKSPACE_SETTINGS
  );
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  const { open } = useSidebar();

  const items: ItemType[] = [
    {
      title: "Dashboard",
      url: `/workspace/${workspaceId}`,
      icon: LayoutDashboard,
    },
    {
      title: "Tasks",
      url: `/workspace/${workspaceId}/tasks`,
      icon: CheckCircle,
    },
    {
      title: "Members",
      url: `/workspace/${workspaceId}/members`,
      icon: Users,
    },

    ...(canManageSettings
      ? [
          {
            title: "Settings",
            url: `/workspace/${workspaceId}/settings`,
            icon: Settings,
          },
        ]
      : []),
  ];

  return (
    <div className="">
      <SidebarGroup>
        <SidebarMenu
          className={cn(
            "flex flex-1 flex-col py-2 w-full",
            open ? "md:items-start" : "items-center"
          )}
        >
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className=""
                  isActive={item.url === pathname}
                  asChild
                >
                  <Link href={item.url} className="w-full px-3 py-2">
                    <item.icon />
                    <span className="hidden md:inline">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    </div>
  );
};

export default NavMain;
