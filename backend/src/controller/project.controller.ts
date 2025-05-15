import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { Permissions } from "../enums/role.enum";
import { asyncHandler } from "../middlewares/async.handler.middleware";
import { getMemberRoleInWorkspace } from "../services/member.service";
import {
  createProjectService,
  deleteProjectService,
  getProjectAnalyticsService,
  getProjectByIdAndWorkspaceIdService,
  getProjectsInWorkspaceService,
  updateProjectService,
} from "../services/project.service";
import { roleGuard } from "../utils/role-guard";
import {
  createProjectScehma,
  projectIdScehma,
  updateProjectSceham,
} from "../validation/project.validation";
import { workspaceIdSchema } from "../validation/workspace.validation";

export const createProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createProjectScehma.parse(req.body);

    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const userId = req.body.userId;
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CREATE_PROJECT]);

    const { project } = await createProjectService(userId, workspaceId, body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Project created successfully",
      project,
    });
  }
);

export const getAllProjectsInWorksapceController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.worksapceId);
    const userId = req.body.userId;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);

    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;

    const { projects, totalCount, totalPage, skip } =
      await getProjectsInWorkspaceService(workspaceId, pageSize, pageNumber);

    return res.status(HTTPSTATUS.OK).json({
      message: "Project fetched successfully",
      projects,
      pagination: {
        totalCount,
        pageSize,
        pageNumber,
        totalPage,
        skip,
        limit: pageSize,
      },
    });
  }
);

export const getProjectByIdAndWorksapceIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = projectIdScehma.parse(req.params.id);
    const worksapceId = workspaceIdSchema.parse(req.params.workspaceId);

    const userId = req.body.userId;

    const { role } = await getMemberRoleInWorkspace(userId, worksapceId);

    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { project } = await getProjectByIdAndWorkspaceIdService(
      worksapceId,
      projectId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Project fetched successfully",
      project,
    });
  }
);

export const getProjectAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = projectIdScehma.parse(req.params.id);
    const workspaceId = projectIdScehma.parse(req.params.workspaceId);

    const userId = req.body.userId;
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);

    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { analytics } = await getProjectAnalyticsService(
      workspaceId,
      projectId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Project analytics retrieved successfully",
      analytics,
    });
  }
);

export const updateProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.body.userId;

    const projectId = projectIdScehma.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const body = updateProjectSceham.parse(req.body);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);

    roleGuard(role, [Permissions.EDIT_PROJECT]);

    const { project } = await updateProjectService(
      workspaceId,
      projectId,
      body
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Project updated successfully",
      project,
    });
  }
);

export const deleteProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.body.userId;

    const projectId = projectIdScehma.parse(req.params.projectId);
    const worksapceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, worksapceId);
    roleGuard(role, [Permissions.DELETE_PROJECT]);

    await deleteProjectService(worksapceId, projectId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Project deleted successfully",
    });
  }
);
