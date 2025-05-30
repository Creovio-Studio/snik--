import { useQueryState } from "nuqs";
import { parseAsBoolean } from "nuqs/server";
const useCreateProjcetDialog = () => {
  const [open, setOpen] = useQueryState(
    "new-project",
    parseAsBoolean.withDefault(false)
  );

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return { open, onOpen, onClose };
};

export default useCreateProjcetDialog;
