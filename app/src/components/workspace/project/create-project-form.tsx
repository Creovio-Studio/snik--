"use client";
import EmojiPickerComponent from "@/components/emoji-picker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import useWorkspaceId from "@/hooks/use-workspace";
import { createProjectMutationFn } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
export default function CreateProjectForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const [emoji, setEmoji] = useState("😎");
  const { mutate, isPending } = useMutation({
    mutationFn: createProjectMutationFn,
  });

  const formSchema = z.object({
    name: z
      .string()
      .trim()
      .min(1, "Project name is required")
      .max(50, "Project name must be less than 50 characters"),
    description: z
      .string()
      .trim()
      .max(200, "Description must be less than 200 characters"),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "" },
  });

  const handleEmojiSelection = (emoji: string) => {
    setEmoji(emoji);
  };

  const onSubmit = (value: z.infer<typeof formSchema>) => {
    if (isPending) return;

    const payload = {
      workspace_id: workspaceId,
      data: {
        emoji,
        ...value,
      },
    };

    mutate(payload, {
      onSuccess: (data) => {
        const project = data.project;
        queryClient.invalidateQueries({
          queryKey: ["allprojects", workspaceId],
        });

        toast.success("Success", {
          description: "Project created successfully",
        });

        router.push(`/workspace/${workspaceId}/project/${project.project_id}`);
        setTimeout(() => {
          return onClose();
        }, 500);
      },
    });
  };

  return (
    <div className=" w-full h-auto max-w-full">
      <div className=" h-full">
        <div className=" mb-5 pb-2 border-b">
          <h2 className=" text-lg tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1 text-center sm:text-left">
            Create Project
          </h2>
          <p className=" text-muted-foreground text-sm leading-tight">
            Organize and manage your with tasks, resources and team
            collaboration.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className=" mb-4">
              <label className=" block text-sm font-medium text-gray-700">
                Select Emoji
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className=" outline">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className="text-xl">{emoji}</span>
                    </div>
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="!p-0">
                  <EmojiPickerComponent onSelect={handleEmojiSelection} />
                </PopoverContent>
              </Popover>
            </div>

            <div className=" mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm dark:text-[#f1f7feb5]">
                      Project Title
                    </FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Website Redesign"
                        className="!h-[48px]"
                      ></Input>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className=" mb-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm dark:text-[#f1f7feb5]">
                      Project Description
                      <span className=" text-xs font-extralight ml-2">
                        Optional
                      </span>
                    </FormLabel>

                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Project description"
                        className="!h-[48px]"
                        {...field}
                      ></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className=" flex place-self-end h-[40px] text-white font-semibold"
            >
              {isPending && <Loader className=" animate-spin" />}
              Create
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
