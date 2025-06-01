import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectType } from "@/types/api.type";
import { PencilIcon } from "lucide-react";
import React, { useState } from "react";
import EditProjectForm from "./edit-project-form";

const EditProjectDialog = (props: { project?: ProjectType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className=" mt-1.5" asChild>
          <button>
            <PencilIcon size={15} />
          </button>
        </DialogTrigger>
        <DialogTitle />

        <DialogContent className=" sm:max-w-lg border-0">
          <EditProjectForm project={props.project} onClose={onClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProjectDialog;
