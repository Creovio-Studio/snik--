"use client";
import React from "react";
import useCreateWorkspaceDialog from "@/hooks/use-create-workspace-dialog";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import CreateWorkspaceForm from "./create-workspace-form";
const CreateWorkspaceDialog = () => {
  const { open, onClose } = useCreateWorkspaceDialog();
  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
      <DialogTitle />
      <DialogContent className="  !p-0 overflow-hidden border-0">
        <CreateWorkspaceForm {...{ onClose }} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;
