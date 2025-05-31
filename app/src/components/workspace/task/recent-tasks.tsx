import useWorkspaceId from "@/hooks/use-workspace";
import { getAllTasksQueryFn } from "@/lib/api";
import {
  getAvatarColor,
  getAvatarFallbackText,
  transformStatusEnum,
} from "@/lib/helper";
import { TaskType } from "@/types/api.type";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { TaskPriorityEnum, TaskStatusEnum } from "@/constant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RecentTasks = () => {
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useQuery({
    queryKey: ["all-task", workspaceId],
    queryFn: () => getAllTasksQueryFn({ workspace_id: workspaceId }),
    staleTime: 0,
    enabled: !!workspaceId,
  });

  const tasks: TaskType[] = data?.tasks || [];

  return (
    <div className="flex pt-2 flex-col space-y-6">
      {isPending ? (
        <Loader className=" w-8 h-8 animate-spin place-self-center flex" />
      ) : null}

      {tasks.length === 0 && (
        <div className=" font-semibold text-sm text-muted-foreground text-center py-5">
          No Task created yet
        </div>
      )}

      <ul role="list" className=" divide-y divide-gray-200">
        {tasks.map((task) => {
          const name = task.assigned_to?.name || "";
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(initials);
          console.log(task.task_code);
          return (
            <li
              className=" p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ease-in-out"
              key={task.task_id}
            >
              <div className="flex flex-col space-y-1 flex-grow">
                <span className=" text-sm capitalize text-gray-600 font-medium">
                  {task.task_code}
                </span>
                <p className=" text-base font-semibold text-gray-800 truncate">
                  {task.title}
                </p>

                <span className=" text-sm text-gray-500">
                  Due: {task.dueDate ? format(task.dueDate, "PPP") : null}
                </span>
              </div>

              <div className=" text-sm font-medium">
                <Badge
                  variant={TaskStatusEnum[task.status]}
                  className=" flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase "
                >
                  <span>{transformStatusEnum(task.status)}</span>
                </Badge>
              </div>

              <div className="text-sm ml-2">
                <Badge
                  variant={TaskPriorityEnum[task.priority]}
                  className="flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0"
                >
                  <span>{transformStatusEnum(task.priority)}</span>
                </Badge>
              </div>

              <div className=" flex items-center space-x-2 ml-2">
                <Avatar className=" h-8 w-8">
                  <AvatarImage
                    src={task.assigned_to?.profile_picture || " "}
                    alt={task.assigned_to?.name}
                  />
                  <AvatarFallback className={avatarColor}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentTasks;
