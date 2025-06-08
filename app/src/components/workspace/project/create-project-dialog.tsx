"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import CreateProjectForm from "./create-project-form";
import useCreateProjcetDialog from "@/hooks/use-create-project-dialog";

const CreateProjectDialog = () => {
  const { open, onClose } = useCreateProjcetDialog();
  return (
    <div>
      <Dialog modal open={open} onOpenChange={onClose}>
        <DialogTitle></DialogTitle>
        <DialogContent className=" sm:max-w-lg border-0">
          <CreateProjectForm {...{ onClose }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProjectDialog;
