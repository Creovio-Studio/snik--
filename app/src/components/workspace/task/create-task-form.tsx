"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

import { TaskPriorityEnum, TaskStatusEnum } from "@/constant";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import useWorkspaceId from "@/hooks/use-workspace";
import { createTaskMutationFn } from "@/lib/api";
import {
  getAvatarColor,
  getAvatarFallbackText,
  transformOptions,
} from "@/lib/helper";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function CreateTaskForm(props: {
  projectId?: string;
  onClose: () => void;
}) {
  const { projectId, onClose } = props;
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useMutation({
    mutationFn: createTaskMutationFn,
  });

  const { data } = useGetProjectsInWorkspaceQuery({
    workspace_id: workspaceId,
    skip: !!projectId,
  });

  const { data: memberData } = useGetWorkspaceMembers(workspaceId);

  const projects = data?.projects || [];
  const members = memberData?.members || [];
  const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    projectId: z.string().trim().min(1, "Project is required"),
    status: z.enum(
      Object.values(TaskStatusEnum) as [keyof typeof TaskStatusEnum],
      { required_error: "Status is required" }
    ),
    priority: z.enum(
      Object.values(TaskPriorityEnum) as [keyof typeof TaskPriorityEnum],
      { required_error: "Priority is required" }
    ),
    assigned_to: z.string().trim().min(1, "Assigned user is required"),
    dueDate: z.date({
      required_error: "Due date is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: projectId ?? "",
    },
  });

  const statusOptions = transformOptions(Object.values(TaskStatusEnum));
  const priorityOptions = transformOptions(Object.values(TaskPriorityEnum));

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;

    const payload = {
      workspace_id: workspaceId,
      project_id: values.projectId,
      data: {
        ...values,
        dueDate: values.dueDate.toISOString(),
      },
    };

    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["project-analytics", projectId],
        });

        queryClient.invalidateQueries({
          queryKey: ["all-tasks", workspaceId],
        });

        toast.success("Task created successfully");
        onClose();
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to create task"
        );
      },
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-full space-y-4"
    >
      <div className="mb-5 pb-2 border-b">
        <h1 className="text-xl font-semibold">Create Task</h1>
        <p className="text-muted-foreground text-sm">
          Organize and manage tasks, resources, and team collaboration
        </p>
      </div>

      <Input placeholder="Task title" {...form.register("title")} />
      <Textarea
        placeholder="Task description"
        {...form.register("description")}
      />

      {!projectId && (
        <Select
          onValueChange={(value) => form.setValue("projectId", value)}
          value={form.watch("projectId")}
        >
          <SelectTrigger className=" w-full">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent className=" w-full">
            {projects.map((project) => (
              <SelectItem key={project.project_id} value={project.project_id}>
                {project.emoji} {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        onValueChange={(value) => form.setValue("status", value as any)}
        value={form.watch("status")}
      >
        <SelectTrigger className=" w-full">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent className=" w-full">
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => form.setValue("priority", value as any)}
        value={form.watch("priority")}
      >
        <SelectTrigger className=" w-full">
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent className=" w-full">
          {priorityOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => form.setValue("assigned_to", value)}
        value={form.watch("assigned_to")}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Assign to member" />
        </SelectTrigger>
        <SelectContent className=" w-full">
          {members.map((member) => {
            const name = member.user?.name || "Unknown";
            const initials = getAvatarFallbackText(name);
            const avatarColor = getAvatarColor(name);
            return (
              <SelectItem key={member.member_id} value={member.member_id}>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={member.user.profile_picture || ""} />
                    <AvatarFallback className={avatarColor}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span>{name}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            {form.watch("dueDate")
              ? format(form.watch("dueDate"), "PPP")
              : "Pick due date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto" align="center">
          <Calendar
            mode="single"
            selected={form.watch("dueDate")}
            disabled={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0)) ||
              date > new Date("2100-12-31")
            }
            onSelect={(date) => form.setValue("dueDate", date!)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating..." : "Create Task"}
      </Button>
    </form>
  );
}
