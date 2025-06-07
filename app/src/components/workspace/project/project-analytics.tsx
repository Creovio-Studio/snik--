"use client";
import useWorkspaceId from "@/hooks/use-workspace";
import { getProjectAnalyticsQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import AnalyticsCard from "../common/analytics-card";

const ProjectAnalytics = () => {
  const params = useParams();
  const projectId = params.projectId as string;

  const workspaceId = useWorkspaceId();

  const { data, isPending } = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: () =>
      getProjectAnalyticsQueryFn({
        workspace_id: workspaceId,
        project_id: projectId,
      }),
    staleTime: 0,
    enabled: !!projectId,
  });

  const analytics = data?.analytics;

  return (
    <div className=" grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      <AnalyticsCard
        isLoading={isPending}
        title="Total Task"
        value={analytics?.total_tasks || 0}
      ></AnalyticsCard>

      <AnalyticsCard
        isLoading={isPending}
        title="Overdue task"
        value={analytics?.overdue_tasks || 0}
      ></AnalyticsCard>

      <AnalyticsCard
        isLoading={isPending}
        title="Completed Task"
        value={analytics?.completed_tasks || 0}
      ></AnalyticsCard>
    </div>
  );
};

export default ProjectAnalytics;
