"use client";
import { SidebarTrigger } from "./ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useWorkspaceId from "@/hooks/use-workspace";

const Header = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();

  const getPageLabel = (pathname: string) => {
    if (pathname.includes("/project/")) return "Project";
    if (pathname.includes("/settings/")) return "Settings";
    if (pathname.includes("/tasks")) return "Tasks";
    if (pathname.includes("/members")) return "Members";
    return null;
  };

  const pageHeading = getPageLabel(pathname);

  return (
    <header className="flex sticky top-0 z-50 bg-white h-12 shrink-0 items-center border-b">
      <div className="flex flex-1/2 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/workspace/${workspaceId}`}>Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pageHeading && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageHeading}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default Header;
