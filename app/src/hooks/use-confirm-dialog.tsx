import { parseAsBoolean, useQueryState } from "nuqs";
import { useState } from "react";

const useConfirmDialog = () => {
  const [open, setOpen] = useQueryState(
    "confirm-dalog",
    parseAsBoolean.withDefault(false)
  );

  const [context, setContext] = useState<any>(null);

  const onOpenDialog = (data?: any) => {
    setContext(data || null);
    setOpen(true);
  };

  const onCloseDialog = () => {
    setContext(null);
    setOpen(false);
  };

  return { open, context, onOpenDialog, onCloseDialog };
};

export default useConfirmDialog;
