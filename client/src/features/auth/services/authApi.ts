import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  MeResponse,
  RegisterRequest,
  UpdateProfileRequest,
} from '@/types/auth';
import type { User } from '@/types/user';

export const authApi = {
  login: async (data: LoginRequest) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data.data;
  },

  register: async (data: RegisterRequest) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data;
  },

  me: async () => {
    const res = await api.get<ApiResponse<MeResponse>>('/auth/me');
    return res.data.data;
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    const res = await api.patch<ApiResponse<User>>('/auth/me', data);
    return res.data.data;
  },

  changePassword: async (data: ChangePasswordRequest) => {
    const res = await api.post<ApiResponse<void>>('/auth/change-password', data);
    return res.data;
  },

  logout: async (refreshToken: string) => {
    await api.post('/auth/logout', { refreshToken });
  },
};
