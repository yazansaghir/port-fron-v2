import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  MeResponse,
} from '@/features/auth/api/auth.types';
import { apiRequest } from '@/shared/api/request';

export async function login(body: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>({
    method: 'POST',
    url: '/auth/login',
    data: body,
  });
}

export async function logout(): Promise<LogoutResponse> {
  return apiRequest<LogoutResponse>({
    method: 'POST',
    url: '/auth/logout',
    data: {},
  });
}

export async function getMe(): Promise<MeResponse> {
  return apiRequest<MeResponse>({
    method: 'GET',
    url: '/auth/me',
  });
}
