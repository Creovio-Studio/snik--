"use client";
import { Button } from "@/components/ui/button";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentMembers from "@/components/workspace/members/recent-members";
import RecentProjects from "@/components/workspace/project/recent-projects";
import RecentTasks from "@/components/workspace/task/recent-tasks";
import WorkspaceAnayltics from "@/components/workspace/workspace-analytics";
import useCreateProjcetDialog from "@/hooks/use-create-project-dialog";
import { Tabs } from "@radix-ui/react-tabs";
import { Plus } from "lucide-react";
import React from "react";

const Workspace = () => {
  const { onOpen } = useCreateProjcetDialog();
  return (
    <div className=" flex flex-1 flex-col py-4 md:pt-3 ">
      <div className=" flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className=" text-2xl font-bold tracking-tight">
            Workspace Overview
          </h2>

          <p className=" text-muted-foreground">
            Here&apos;s an overview of your workspace!
          </p>
        </div>
        <Button onClick={onOpen} size={"sm"}>
          <Plus />
          New Project
        </Button>
      </div>

      <WorkspaceAnayltics />

      <div className=" mt-4">
        <Tabs defaultValue="projects" className="w-full border rounded-lg p-2">
          <TabsList className=" max-w-lg justify-start border-0 bg-gray-50 px-1 h-12">
            <TabsTrigger className=" py-2" value="projects">
              Recent Projects
            </TabsTrigger>

            <TabsTrigger className=" py-2" value="tasks">
              Recent Tasks
            </TabsTrigger>

            <TabsTrigger className=" py-2" value="members">
              Recent Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <RecentProjects />
          </TabsContent>

          <TabsContent value="tasks">
            <RecentTasks />
          </TabsContent>

          <TabsContent value="members">
            <RecentMembers />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Workspace;
