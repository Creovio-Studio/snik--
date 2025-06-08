"use client";
import { Separator } from "@/components/ui/separator";
import WorkspaceHeader from "@/components/workspace/common/workspace-header";
import ALlMembers from "@/components/workspace/members/all-members";
import InviteMember from "@/components/workspace/members/invite-member";

const MembersPage = () => {
  return (
    <div className=" w-full h-auto pt-2">
      <WorkspaceHeader />
      <Separator className=" my-4" />
      <main>
        <div className=" w-full max-w-3xl mx-auto pt-3">
          <h2 className=" text-lg leading-[30px] font-semibold mb-1">
            Workspace Members
          </h2>
          <p className=" text-sm text-muted-foreground">
            Workpsace members can access all projects and tasks in the
            workspace.
          </p>
          <Separator className=" my-4" />
          <InviteMember />
          <Separator className="" />
          <ALlMembers />
        </div>
      </main>
    </div>
  );
};
export default MembersPage;
