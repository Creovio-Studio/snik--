import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async.handler.middleware";
import {
  changeRoleSchema,
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspaceIdSchema,
} from "../validation/workspace.validation";
import {
  changeMemberRoleService,
  createWorksapceService,
  deleteWorkspaceService,
  getAllWorkspaceUserIsMemberService,
  getWorksapceByIdService,
  getWorkspaceAnaylticsService,
  getWorkspaceMembersService,
  updateWorkspaceByIdService,
} from "../services/workspace.service";
import { HTTPSTATUS } from "../config/http.config";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { roleGuard } from "../utils/role-guard";
import { Permissions } from "../enums/role.enum";

export const createWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createWorkspaceSchema.parse(req.body);
    const userId = req.body.userId;

    const { workspace } = await createWorksapceService(userId, body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Worksapce created successfully",
      workspace,
    });
  }
);

export const getAllWorkspaceUserMemberController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.body.userId;

    const { workspaces } = await getAllWorkspaceUserIsMemberService(userId);
    return res
      .status(HTTPSTATUS.OK)
      .json({ message: "User workspaces fetched successfully", workspaces });
  }
);

export const getWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);

    const userId = req.body.userId;

    await getMemberRoleInWorkspace(userId, workspaceId);

    const { workspace } = await getWorksapceByIdService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Workspace fetched successfully",
      workspace,
    });
  }
);

export const getWorkspaceMembersController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.body.userId;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { members, roles } = await getWorkspaceMembersService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Workspace members retrieved successfully",
      members,
      roles,
    });
  }
);

export const getWorkspaceAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.body.userId;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { analytics } = await getWorkspaceAnaylticsService(workspaceId);
    return res.status(HTTPSTATUS.OK).json({
      message: "Workspace analtyics retrieved successfully",
      analytics,
    });
  }
);

export const changeWorkspaceMemberRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const { member_id, role_id } = changeRoleSchema.parse(req.body);
    const userId = req.body.userId;
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

    const { updatedMember } = await changeMemberRoleService(
      workspaceId,
      member_id,
      role_id
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Member Role changed successfully",
      member: updatedMember,
    });
  }
);

export const updateWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const { name, description } = updateWorkspaceSchema.parse(req.body);
    const userId = req.body.userId;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_WORKSPACE]);

    const { workspace } = await updateWorkspaceByIdService(
      workspaceId,
      name,
      description
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Workspace updated successfully",
      workspace,
    });
  }
);

export const deleteWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);

    const userId = req.body.userId;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_WORKSPACE]);

    const { currentWorkspace } = await deleteWorkspaceService(
      workspaceId,
      userId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Workspace deleted successfully",
      currentWorkspace,
    });
  }
);
