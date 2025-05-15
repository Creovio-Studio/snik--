import { Router } from "express";

import {
  createTaskController,
  deleteTaskController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskController,
} from "../controller/task.controller";

const taskRoutes = Router();

taskRoutes.post(
  "/project/:projectId/workspace/:workspaceId/create",
  createTaskController
);

taskRoutes.delete(
  "/:id/project/:projectId/workspace/:workspaceId/update",
  deleteTaskController
);
taskRoutes.put(
  "/:id/project/:projectId/workspace/:workspaceId/update",
  updateTaskController
);
taskRoutes.get("/workspace/:workspaceId/all", getAllTasksController);

taskRoutes.get(
  "/:id/project/:projectId/workspace/:workspaceId",
  getTaskByIdController
);

export default taskRoutes;
