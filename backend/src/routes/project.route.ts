import { Router } from "express";
import {
  createProjectController,
  deleteProjectController,
  getAllProjectsInWorksapceController,
  getProjectAnalyticsController,
  getProjectByIdAndWorksapceIdController,
  updateProjectController,
} from "../controller/project.controller";

const projectRoutes = Router();

projectRoutes.post("/workspace/:workspaceId/create", createProjectController);

projectRoutes.put(
  "/:id/workspace/:workspaceId/update",
  updateProjectController
);

projectRoutes.delete(
  "/:id/workspace/:workspaceId/delete",
  deleteProjectController
);

projectRoutes.get(
  "/workspace/:workspaceId/all",
  getAllProjectsInWorksapceController
);

projectRoutes.get(
  "/:id/workspace/:workspaceId/analytics",
  getProjectAnalyticsController
);

projectRoutes.get(
  "/:id/workspace/:workspaceId",
  getProjectByIdAndWorksapceIdController
);

export default projectRoutes;
