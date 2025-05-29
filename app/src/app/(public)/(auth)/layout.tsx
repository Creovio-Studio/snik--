"use client";
import { useAuthContext } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AuthenticationLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      if (isLoading) return;
      if (user) {
        return router.push(`/workspace/${user.current_workspace}`);
      } else {
        return router.push("/sign-in");
      }
    }, 350);
  }, [user, isLoading, router]);

  return <div>{children}</div>;
};

export default AuthenticationLayout;
