"use client";

import { createWorkspaceMutationFn } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

const CreateWorkspaceForm = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createWorkspaceMutationFn,
  });

  const formSchema = z.object({
    name: z.string().trim().min(1, {
      message: "Workspace namae is required",
    }),
    description: z.string().trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;

    mutate(values, {
      onSuccess: (data) => {
        queryClient.resetQueries({
          queryKey: ["userWorkpsaces"],
        });

        const workpsace = data.workspace;
        onClose();
        router.push(`/workspace/${workpsace.workspace_id}`);
      },
      onError: (error) => {
        toast.error("Error", { description: error.message });
      },
    });
  };

  return (
    <main className=" w-full flex flex-row minh-[590px] h-auto max-w-full">
      <div className=" h-full px-10 py-10 flex-1">
        <div className=" mb-5">
          <h1 className=" text-2xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5 text-center sm:text-left">
            Let&apos;s build a Workspace
          </h1>

          <p className=" text-muted-foreground text-lg leading-tight">
            Boost your productivity by making it easier for everyone to access
            projects in one location.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className=" mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" dark:text-[#f1f7feb5] text-sm">
                      Workspace name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Taco's Co"
                        className="!h-[48px]"
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>
                      This is the name of your company, team or organization.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className=" mb-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" dark:text-[#f1f7feb5] text-sm">
                      Workspace description
                      <span className=" text-xs font-extralight ml-2">
                        Optional
                      </span>
                    </FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder=""
                        className="!h-[48px]"
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>
                      Get your members on board with few words about your.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className=" w-full h-[40px] text-white font-semibold"
            >
              {isPending && <Loader className=" animate-spin" />}
              Create Workspace
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default CreateWorkspaceForm;
