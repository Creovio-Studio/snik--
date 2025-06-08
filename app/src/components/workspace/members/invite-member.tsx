import PermissionsGuard from "@/components/resuable/permission-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Permissions } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";
import { CheckIcon, CopyIcon, Loader } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const InviteMember = () => {
  const { workspace, workspaceLoading } = useAuthContext();
  const [copied, setCopied] = React.useState(false);

  const inviteUrl = workspace
    ? `${window.location.origin}/invite/workspace/${workspace.invite_code}/join`
    : "";

  const hanldeCopy = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl).then(() => {
        setCopied(true);
        toast("Copied", { description: "Invite link copied to clipboard" });
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      });
    }
  };

  return (
    <div className=" flex flex-col pt-0.5 px-0">
      <h5>Invite Members to join you</h5>

      <p className=" text-sm text-muted-foreground leading-tight">
        Anyone with an invite link can join this workpsace. You can also disable
        and create new invite link for this workpsace at any time.
      </p>

      <PermissionsGuard showMessage requiredPermission={Permissions.ADD_MEMBER}>
        {workspaceLoading ? (
          <Loader className=" animate-spin place-self-center w-8 h-8" />
        ) : (
          <div className=" flex py-3 gap-2">
            <Label htmlFor="link" className=" sr-only">
              Link
            </Label>
            <Input
              id="link"
              disabled={true}
              className=" disabled:opacity-100 disabled:pointer-events-none"
              readOnly
              value={inviteUrl}
            />
            <Button
              disabled={false}
              className=" shrink-0"
              onClick={hanldeCopy}
              size="icon"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>
        )}
      </PermissionsGuard>
    </div>
  );
};

export default InviteMember;
