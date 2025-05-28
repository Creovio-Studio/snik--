"use client";
import { PermissionsType } from "@/constant";

import { UserType, WorkspaceWithMemberType } from "@/types/api.type";
import { useEffect, useState } from "react";

const usePermissions = (
  user: UserType | undefined,
  workspace: WorkspaceWithMemberType | undefined
) => {
  const [permissions, setPermissions] = useState<PermissionsType[]>([]);

  useEffect(() => {
    if (user && workspace) {
      const member = workspace.members.find(
        (member) => member.user_id === user.user_id
      );
      if (member) {
        setPermissions(member.role.permissions || []);
      }
    }
  }, [user, workspace]);

  return permissions;
};

export default usePermissions;
