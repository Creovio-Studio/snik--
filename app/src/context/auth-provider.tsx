"use client";
import { createContext, useContext, useEffect } from "react";
import useWorkspaceId from "@/hooks/use-workspace";
import useAuth from "@/hooks/api/use-auth";
import { UserType, WorkspaceType } from "@/types/api.type";
import useGetWorkspaceQuery from "@/hooks/api/use-get-workspace";
import { useRouter } from "next/navigation";
import usePermissions from "@/hooks/use-permissions";
import { PermissionsType } from "@/constant";
import { CustomError } from "@/types/custom-error.type";

type AuthContextType = {
  user?: UserType;
  workspace: WorkspaceType;
  hasPermission: (permission: PermissionsType) => boolean;
  error: CustomError | null;
  isLoading: boolean;
  isFetching: boolean;
  workspaceLoading: boolean;
  refetchAuth: () => void;
  reftechWorkspace: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const {
    data: authData,
    error: authError,
    isLoading,
    isFetching,
    refetch: refetchAuth,
  } = useAuth();

  const user = authData?.user;

  const {
    data: workspaceData,
    isLoading: workspaceLoading,
    error: workspaceError,
    refetch: reftechWorkspace,
  } = useGetWorkspaceQuery(workspaceId);

  const workspace = workspaceData?.workspace;

  useEffect(() => {
    if (workspaceError?.errorCode === "ACCESS_UNAUTHORIZED" || authError) {
      router.push("/");
    }
  }, [workspaceError, router, authError]);

  const permissions = usePermissions(user, workspace);
  const hasPermission = (permission: PermissionsType) => {
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        hasPermission,
        error: authError || workspaceError,
        isLoading,
        isFetching,
        workspaceLoading,
        refetchAuth,
        reftechWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
