export type UserRole = 'ADMIN';

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
};

export type LogoutResponse = {
  message: string;
};

export type MeResponse = {
  id: string;
  email: string;
  lastLogin: string;
};

/** Cached result of session bootstrap (`/auth/me`). */
export type AuthSessionUser = MeResponse | null;
