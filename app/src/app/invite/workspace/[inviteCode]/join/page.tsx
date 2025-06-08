"use client";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuth from "@/hooks/api/use-auth";
import { invitedUserJoinWorkspaceMutationFn } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const InvitePage = () => {
  const params = useParams();
  const inviteCode = params.inviteCode as string;

  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: authData, isPending } = useAuth();
  const [returnUrl, setReturnUrl] = React.useState<string>("");

  const user = authData?.user;
  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: invitedUserJoinWorkspaceMutationFn,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReturnUrl(
        `${window.location.origin}/invite/workspace/${inviteCode}/join`
      );
    }
  }, [inviteCode]);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    mutate(inviteCode, {
      onSuccess: (data) => {
        queryClient.resetQueries({
          queryKey: ["userWorkpsaces"],
        });
        router.push(`workspace/${data.workspace_id}`);
      },
      onError: (error) => {
        toast.error("Error", { description: error.message || "" });
      },
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo />
          Snik-
        </Link>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                Hey there! You&apos;re invited to join a SNIK Workspace!
              </CardTitle>
              <CardDescription>
                Looks like you need to be logged into your snik account to join
                this Workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isPending ? (
                <Loader className="!w-11 !h-11 animate-spin place-self-center flex" />
              ) : (
                <div>
                  {user ? (
                    <div className="flex items-center justify-center my-3">
                      <form onSubmit={handleSubmit}>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="!bg-green-500 !text-white  text-base "
                        >
                          {isLoading && (
                            <Loader className="!w-6 !h-6 animate-spin" />
                          )}
                          Join the Workspace
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row items-center gap-2">
                      <Link
                        className="flex-1 w-full text-base"
                        href={`/?returnUrl=${returnUrl}`}
                      >
                        <Button variant="secondary" className="w-full border">
                          Login
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
