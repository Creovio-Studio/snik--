import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import useWorkspaceId from "@/hooks/use-workspace";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { Loader } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const RecentProjects = () => {
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useGetProjectsInWorkspaceQuery({
    workspace_id: workspaceId,
    page_number: 1,
    page_size: 10,
  });

  const projects = data?.projects || [];
  return (
    <div className=" flex flex-col pt-2">
      {isPending ? (
        <Loader className=" w-8 h-8 animate-spin place-self-center flex" />
      ) : null}

      {projects.length === 0 && (
        <div className=" font-semibold text-sm text-muted-foreground text-center py-5">
          No Project created yet
        </div>
      )}

      <ul role="list" className=" space-y-2">
        {projects.map((project) => {
          const name = project.created_by.name;
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(initials);
          return (
            <li
              role="listitem"
              className=" shadow-none cursor-pointer border-0 py-2 hover:bg-gray-50 transition-colors ease-in-out"
              key={project.project_id}
            >
              <Link
                href={`/workspace/${workspaceId}/project/${project.project_id}`}
                className=" flex items-center justify-between flex-wrap px-2"
              >
                <div className=" flex items-start gap-2">
                  <div className=" text-xl !leading-[1.4rem]">
                    {project.emoji}
                  </div>
                </div>

                <div className="ml-2">
                  <p className="text-sm font-medium leading-none">
                    {project.name}
                  </p>
                  <p className=" text-sm text-muted-foreground">
                    {project.created_at
                      ? format(project.created_at, "PPP")
                      : null}
                  </p>
                </div>

                <div className=" ml-auto flex items-center gap-4">
                  <span className=" text-sm text-gray-500">Created By</span>
                  <Avatar>
                    <AvatarImage
                      alt="Avatar"
                      src={project.created_by.profile_picture || ""}
                    />
                    <AvatarFallback className={avatarColor}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentProjects;
