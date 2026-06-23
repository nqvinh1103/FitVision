import { User } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AdminUserListItem } from '../types/user.types';

const toAdminUserListItem = (user: User): AdminUserListItem => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  aiCredits: user.aiCredits,
  avatarUrl: user.avatarUrl,
  experienceLevel: user.experienceLevel,
  createdAt: user.createdAt.toISOString(),
});

export const getAllUsers = async (): Promise<AdminUserListItem[]> => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return users.map(toAdminUserListItem);
};
