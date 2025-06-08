import useWorkspaceId from "@/hooks/use-workspace";
import { getWorkspaceAnalyticsQUeryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import AnalyticsCard from "./common/analytics-card";

const WorkspaceAnayltics = () => {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: () => getWorkspaceAnalyticsQUeryFn(workspaceId),
    staleTime: 0,
    enabled: !!workspaceId,
  });

  const analytics = data?.analytics;

  return (
    <>
      <div className=" grid gap-4 md:gap-5 w-full lg:grid-cols-2 xl:grid-cols-3">
        <AnalyticsCard
          isLoading={isPending}
          title="Total Task"
          value={analytics?.total_tasks || 0}
        />
        <AnalyticsCard
          isLoading={isPending}
          title="Overdue Task"
          value={analytics?.overdue_tasks || 0}
        />
        <AnalyticsCard
          isLoading={isPending}
          title="Completed Task"
          value={analytics?.completed_tasks || 0}
        />
      </div>
    </>
  );
};

export default WorkspaceAnayltics;
