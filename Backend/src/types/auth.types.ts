import { ExperienceLevel, Role } from '@prisma/client';

export interface PublicUser {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  aiCredits: number;
  avatarUrl: string | null;
  experienceLevel: ExperienceLevel | null;
}

export interface AuthResponse {
  accessToken: string;
  user: PublicUser;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface RegisterOtpResponse {
  message: string;
  expiresIn: number;
}
