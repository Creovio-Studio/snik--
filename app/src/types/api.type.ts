import {
  PermissionsType,
  TaskPriorityEnumType,
  TaskStatusEnumType,
} from "@/constant";

export type loginType = { email: string; password: string };
export type LoginResponseType = {
  message: string;
  user: {
    user_id: string;
    current_workspace: string;
  };
};

export type registerType = {
  name: string;
  email: string;
  password: string;
};
export type GoogleLoginOrRegisterType = {
  email: string;
};
export type UserType = {
  user_id: string;
  name: string;
  email: string;
  profile_picture: string | null;
  is_active: true;
  last_login: null;
  created_at: Date;
  updated_at: Date;
  current_workspace: {
    project_id: string;
    name: string;
    owner: string;
    invite_code: string;
  };
};

export type CurrentUserResponseType = {
  message: string;
  user: UserType;
};

export type WorkspaceType = {
  workspace_id: string;
  name: string;
  description?: string;
  owner: string;
  invite_code: string;
};

export type CreateWorkspaceType = {
  workspace_id: string;
  data: {
    name: string;
    description: string;
  };
};

export type CreateWorkspaceResponseType = {
  message: string;
  workspace: WorkspaceType;
};
export type AllWorkspaceResposneType = {
  message: string;
  workspaces: WorkspaceType[];
};

export type EditWorkspaceType = {
  workspace_id: string;
  data: {
    name: string;
    description: string;
  };
};
export type WorkspaceWithMemberType = WorkspaceType & {
  members: {
    member_id: string;
    user_id: string;
    workspace_id: string;
    role: {
      id: string;
      name: string;
      permissions: PermissionsType[];
    };
    jointed_at: string;
    created_at: string;
  }[];
};

export type WorkspacebyIdResponseType = {
  message: string;
  workspace: WorkspaceWithMemberType[];
};

export type ChangeWorkspaceMemberRoleType = {
  workspace_id: string;
  data: {
    role_id: string;
    member_id: string;
  };
};

export type AllMembersInWorkspaceResponseType = {
  message: string;
  members: {
    member_id: string;
    user: {
      user_id: string;
      name: string;
      email: string;
      profile_picture: string | null;
    };
  };
  workspace_id: string;
  role: {
    id: string;
    name: string;
  };
  joined_at: string;
  created_at: string;
  roles: RoleType[];
};

export type AnalyticsResponseType = {
  message: string;
  analytics: {
    total_tasks: number;
    overdue_tasks: number;
    completed_tasks: number;
  };
};

export type PaginationType = {
  total_count: number;
  page_size: number;
  page_number: string;
  total_pages: number;
  skip: number;
  limit: number;
};

export type RoleType = {
  id: string;
  name: string;
};

export type ProjectType = {
  project_id: string;
  name: string;
  emoji: string;
  description: string;
  workspace: string;
  created_by: {
    user_id: string;
    name: string;
    profile_picture: string;
  };
  created_at: string;
  updated_at: string;
};

export type CreateProjectPayloadType = {
  workspace_id: string;
  data: {
    emoji: string;
    name: string;
    description: string;
  };
};

export type ProjectResponseType = {
  message: "Project created successfully";
  project: ProjectType;
};

export type EditProjectPayloadType = {
  workspace_id: string;
  project_id: string;
  data: {
    emoji: string;
    name: string;
    description: string;
  };
};

export type AllProjectPayloadType = {
  workspace_id: string;
  page_number?: number;
  page_size?: number;
  keyword?: string;
  skip?: boolean;
};

export type AllProjectResponseType = {
  message: string;
  projects: ProjectType[];
  pagination: PaginationType;
};

export type ProjectByIdPayloadType = {
  workspace_id: string;
  project_id: string;
};

export type CreateTaskPayloadType = {
  workspace_id: string;
  project_id: string;
  data: {
    title: string;
    description: string;
    priority: TaskPriorityEnumType;
    status: TaskStatusEnumType;
    assigned_to: string;
    dueDate: string;
  };
};

export type TaskType = {
  task_id: string;
  title: string;
  description?: string;
  project?: {
    project_id: string;
    emoji: string;
    name: string;
  };
  priority: TaskPriorityEnumType;
  status: TaskStatusEnumType;
  assigned_to: {
    user_id: string;
    name: string;
    profile_picture: string | null;
  };
  created_by?: string;
  dueDate: string;
  created_at?: string;
  updated_at?: string;
};

export type AllTaskPayloadType = {
  workspace_id: string;
  project_id?: string | null;
  keyword?: string | null;
  priority: TaskPriorityEnumType | null;
  status?: TaskStatusEnumType | null;
  assigned_to: string | null;
  dueDate?: string;
  page_number: number | null;
  page_size: number | null;
};

export type AllTaskResponseType = {
  message: string;
  tasks: TaskType[];
  pagination: PaginationType;
};
