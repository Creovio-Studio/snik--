import CreateTaskDialog from "@/components/workspace/task/create-task-dialog";
import TaskTable from "@/components/workspace/task/task-table";

const page = () => {
  return (
    <div className=" w-full h-full flex flex-col space-y-8 pt-3">
      <div className=" flex items-center justify-between space-y-2">
        <div>
          <h2 className=" text-2xl font-bold tracking-tight">All Tasks</h2>
          <p className=" text-muted-foreground">
            Here&apos;s the list of the tasks for this workspace!
          </p>
        </div>
        <CreateTaskDialog />
        <div>
          <TaskTable />
        </div>
      </div>
    </div>
  );
};

export default page;
