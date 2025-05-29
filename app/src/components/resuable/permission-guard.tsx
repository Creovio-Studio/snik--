import React from "react";
import { PermissionsType } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";

type PermissionsGuardProps = {
  requiredPermission: PermissionsType;
  children: React.ReactNode;
  showMessage?: boolean;
};

const PermissionsGuard: React.FC<PermissionsGuardProps> = ({
  requiredPermission,
  showMessage = false,
  children,
}) => {
  const { hasPermission } = useAuthContext();

  console.log("required permission component,", requiredPermission);

  console.log(hasPermission(requiredPermission));
  if (!hasPermission(requiredPermission)) {
    return (
      showMessage && (
        <div
          className="text-center 
        text-sm pt-3
        italic
        w-full
        text-muted-foreground"
        >
          You do not have the permission to view this
        </div>
      )
    );
  }

  return <>{children}</>;
};

export default PermissionsGuard;
