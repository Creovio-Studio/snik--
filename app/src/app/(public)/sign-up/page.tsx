"use client";
import Logo from "@/components/logo";
import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import GoolgeAuthButton from "@/components/auth/google-auth-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { z } from "zod";
import { registerMutationFn } from "@/lib/api";
const SignUpPage = () => {
  const router = useRouter();

  const formSchema = z.object({
    name: z.string().trim().min(1, {
      message: "Name is required",
    }),
    email: z.string().trim().email("Invalid email address").min(1, {
      message: "Workspace name is required",
    }),
    password: z.string().trim().min(1, {
      message: "Password is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const { mutate, isPending } = useMutation({ mutationFn: registerMutationFn });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;

    mutate(values, {
      onSuccess: () => {
        router.push("/");
      },
      onError: (error) => {
        console.log("error");
        toast.error("Error", {
          description: error.message,
        });
      },
    });
  };
  return (
    <div className=" flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className=" flex w-full max-w-sm flex-col gap-6">
        <Link
          href={"/"}
          className=" flex items-center justify-center gap-2 self-center font-medium"
        >
          <Logo />
          Snik-
        </Link>

        <div className=" flex flex-col gap-6">
          <Card>
            <CardHeader className=" text-center">
              <CardTitle className=" text-xl">Create an account</CardTitle>
              <CardDescription>
                Signup with your Email or Google account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className=" grid gap-6">
                    <div className=" flex flex-col gap-4">
                      <GoolgeAuthButton label="Signup" />
                    </div>

                    <div className=" relative text-center text-sm  after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className=" relative z-10 bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>

                    <div className=" grid gap-3">
                      <div className=" grid gap-2">
                        <FormField
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" dark:text-[#f1f7feb5]">
                                name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="!h-[42px]"
                                  placeholder="Jon Doe"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                          control={form.control}
                        ></FormField>
                      </div>
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                  Email
                                </FormLabel>
                              </div>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="k@example.com"
                                  className="!h-[42px]"
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                  Password
                                </FormLabel>
                              </div>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="password"
                                  className="!h-[42px]"
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                      >
                        {isPending && <Loader className="animate-spin" />}
                        Sign Up
                      </Button>
                    </div>
                    <div className=" text-center text-sm">
                      Already have an account?{" "}
                      <Link
                        href={"/sign-in"}
                        className="underline underline-offset-4"
                      >
                        Sign in
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className=" text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
