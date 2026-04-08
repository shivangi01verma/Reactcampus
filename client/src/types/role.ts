export interface Role {
  _id: string;
  id: string;
  name: string;
  displayName: string;
  permissions: Permission[] | string[];
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  _id: string;
  key: string;
  resource: string;
  action: string;
  description: string;
  group: string;
}

export interface CreateRoleRequest {
  name: string;
  displayName: string;
}

export interface UpdateRoleRequest {
  displayName?: string;
  isActive?: boolean;
}

export interface AssignPermissionsRequest {
  permissions: string[];
}
