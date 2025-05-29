import { getProjectsInWorkspaceQueryFn } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AllProjectPayloadType } from "@/types/api.type";

const useGetProjectsInWorkspaceQuery = ({
  workspace_id,
  page_size,
  page_number,
  skip = false,
}: AllProjectPayloadType) => {
  const query = useQuery({
    queryKey: ["allprojects", workspace_id, page_number, page_size],
    queryFn: () =>
      getProjectsInWorkspaceQueryFn({ workspace_id, page_size, page_number }),
    staleTime: Infinity,
    placeholderData: skip ? undefined : keepPreviousData,
    enabled: !skip,
  });

  return query;
};
export default useGetProjectsInWorkspaceQuery;
