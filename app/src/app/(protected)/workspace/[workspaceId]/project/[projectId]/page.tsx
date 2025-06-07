"use client";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import ProjectAnalytics from "@/components/workspace/project/project-analytics";
import ProjectHeader from "@/components/workspace/project/project-header";
import TaskTable from "@/components/workspace/task/table/table";
import React from "react";

const ProjectDetails = () => {
  const { isMobile } = useSidebar();
  return (
    <div className=" w-full space-y-6 py-4 md:pt-3">
      <ProjectHeader />
      <div className="space-y-5 ">
        <ProjectAnalytics />
        <Separator orientation={isMobile ? "horizontal" : "vertical"} />
        <TaskTable />
      </div>
    </div>
  );
};

export default ProjectDetails;
