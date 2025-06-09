import { PermissionsType } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";
import useWorkspaceId from "@/hooks/use-workspace";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const withPermission = (
  WrappedComponent: React.ComponentType,
  requiredPermission: PermissionsType
) => {
  const WithPermission = (props: any) => {
    const { user, hasPermission, isLoading } = useAuthContext();

    const router = useRouter();
    const workspaceId = useWorkspaceId();
    useEffect(() => {
      if (!user || !hasPermission(requiredPermission)) {
        router.push(`/workspace/${workspaceId}`);
      }
    }, [user, hasPermission, router, workspaceId]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!user || !hasPermission(requiredPermission)) {
      return;
    }

    return <WrappedComponent {...props} />;
  };

  return WithPermission;
};

export default withPermission;
