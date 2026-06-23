import { ExperienceLevel, Role } from '@prisma/client';

export interface AdminUserListItem {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  aiCredits: number;
  avatarUrl: string | null;
  experienceLevel: ExperienceLevel | null;
  createdAt: string;
}
