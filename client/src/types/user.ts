import type { Role } from './role';

export interface User {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  isActive: boolean;
  fullName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface AssignRolesRequest {
  roles: string[];
}
