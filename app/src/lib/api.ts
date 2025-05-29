import API from "./axios-client";

import {
  CreateWorkspaceResponseType,
  CreateWorkspaceType,
  CurrentUserResponseType,
  LoginResponseType,
  loginType,
  registerType,
  EditWorkspaceType,
  AllWorkspaceResposneType,
  WorkspacebyIdResponseType,
  AllMembersInWorkspaceResponseType,
  AnalyticsResponseType,
  ChangeWorkspaceMemberRoleType,
  CreateProjectPayloadType,
  ProjectResponseType,
  AllProjectPayloadType,
  AllProjectResponseType,
  EditProjectPayloadType,
  GoogleLoginOrRegisterResponseType,
  ProjectByIdPayloadType,
  CreateTaskPayloadType,
  AllTaskPayloadType,
  AllTaskResponseType,
} from "@/types/api.type";

export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const registerMutationFn = async (
  data: registerType
): Promise<CurrentUserResponseType> => {
  return await API.post("/auth/register", data);
};

export const GoogleLoginOrRegisterMutationFn = async (
  idToken: string
): Promise<GoogleLoginOrRegisterResponseType> => {
  const response = await API.post(
    "/auth/google",
    {},
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data;
};
export const logoutMutationFn = async () => await API.post("/auth/logout");

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    const response = await API.get("/user/current");
    return response.data;
  };

export const createWorkspaceMutationFn = async (
  data: CreateWorkspaceType
): Promise<CreateWorkspaceResponseType> => {
  const response = await API.post("/workspace/create/new", data);
  return response.data;
};

export const editWorkspaceMutationFn = async ({
  workspace_id,
  data,
}: EditWorkspaceType) => {
  const response = await API.put(`/workspace/update/${workspace_id}`, data);
  return response.data;
};

export const getAllWorkspaceUserIsMemberQueryFn =
  async (): Promise<AllWorkspaceResposneType> => {
    const response = await API.get("/workspace/all");
    return response.data;
  };

export const getWorkspacebyIdQueryFn = async (
  workspaceId: string
): Promise<WorkspacebyIdResponseType> => {
  const response = await API.get(`/workspace/${workspaceId}`);
  return response.data;
};

export const getMembersInWorkspaceQueryFn = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.get(`/workspace/members/${workspaceId}`);
  return response.data;
};

export const getWorkspaceAnalyticsQUeryFn = async (
  workspaceId: string
): Promise<AnalyticsResponseType> => {
  const response = await API.get(`/workspace/analytics/${workspaceId}`);
  return response.data;
};

export const changeWorkspaceMemberRoleMutationFn = async ({
  workspace_id,
  data,
}: ChangeWorkspaceMemberRoleType) => {
  const response = await API.put(
    `/workspace/change/member/role/${workspace_id}`,
    data
  );
  return response.data;
};

export const deleteWorkspaceMutationFn = async (
  workspaceId: string
): Promise<{ message: string; current_workspace: string }> => {
  const response = await API.delete(`/workspace/delete/${workspaceId}`);
  return response.data;
};

export const invitedUserJoinWorkspaceMutationFn = async (
  inviteCode: string
): Promise<{ message: string; workspace_id: string }> => {
  const response = await API.post(`/member/workspace/${inviteCode}/join`);
  return response.data;
};

export const createProjectMutationFn = async ({
  workspace_id,
  data,
}: CreateProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.post(
    `/project/workspace/${workspace_id}/create`,
    data
  );
  return response.data;
};

export const editProjectMutationFn = async ({
  project_id,
  workspace_id,
  data,
}: EditProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.put(
    `/project/${project_id}/workspace/${workspace_id}/update`,
    data
  );
  return response.data;
};

export const getProjectsInWorkspaceQueryFn = async ({
  workspace_id,
  page_size = 10,
  page_number = 1,
}: AllProjectPayloadType): Promise<AllProjectResponseType> => {
  const response = await API.get(
    `/project/workspace/${workspace_id}/all?pageSize=${page_size}&pageNumber=${page_number}`
  );
  return response.data;
};

export const getProjectByIdQueryFn = async ({
  workspace_id,
  project_id,
}: ProjectByIdPayloadType): Promise<ProjectResponseType> => {
  const response = await API.get(
    `/project/${project_id}/workspace/${workspace_id}`
  );
  return response.data;
};
export const getProjectAnalyticsQueryFn = async ({
  workspace_id,
  project_id,
}: ProjectByIdPayloadType): Promise<AnalyticsResponseType> => {
  const response = await API.get(
    `/project/${project_id}/workspace/${workspace_id}/analytics`
  );
  return response.data;
};

export const deleteProjectMutationFn = async ({
  project_id,
  workspace_id,
}: ProjectByIdPayloadType): Promise<{ message: string }> => {
  const response = await API.delete(
    `/project/${project_id}/workspace/${workspace_id}/delete`
  );

  return response.data;
};

export const createTaskMutationFn = async ({
  workspace_id,
  project_id,
  data,
}: CreateTaskPayloadType) => {
  const response = await API.post(
    `/task/project/${project_id}/workspace/${workspace_id}/create`,
    data
  );
  return response.data;
};

export const getAllTasksQueryFn = async ({
  workspace_id,
  keyword,
  project_id,
  assigned_to,
  priority,
  status,
  dueDate,
  page_number,
  page_size,
}: AllTaskPayloadType): Promise<AllTaskResponseType> => {
  const baseURL = `/task/workspace/${workspace_id}/all`;

  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append("keyword", keyword);
  if (project_id) queryParams.append("project_id", project_id);
  if (assigned_to) queryParams.append("assigned_to", assigned_to);
  if (priority) queryParams.append("priority", priority);
  if (status) queryParams.append("status", status);
  if (dueDate) queryParams.append("dueDate", dueDate);
  if (page_number) queryParams.append("page_number", page_number?.toString());
  if (page_size) queryParams.append("page_size", page_size?.toString());
  const url = queryParams.toString() ? `${baseURL}?${queryParams}` : baseURL;
  const response = await API.get(url);
  return response.data;
};

export const deleteTaskMutationFn = async ({
  workspace_id,
  task_id,
}: {
  workspace_id: string;
  task_id: string;
}) => {
  const response = await API.delete(
    `task/${task_id}/workspace/${workspace_id}/delete`
  );
  return response.data;
};
