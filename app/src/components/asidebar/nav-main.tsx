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
} from "../ui/sidebar";
import Link from "next/link";

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
    <div>
      <SidebarGroup>
        <SidebarMenu>
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton isActive={item.url === pathname} asChild>
                  <Link href={item.url} className="!text-[15px]">
                    <item.icon />
                    <span>{item.title}</span>
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
