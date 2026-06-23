import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  name: z.string().min(1).max(255).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const updateProfileSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    avatarUrl: z.string().url('Invalid avatar URL').nullable().optional(),
    experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const verifyRegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6).regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

export const resendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type VerifyRegisterInput = z.infer<typeof verifyRegisterSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const verifyForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6).regex(/^\d{6}$/, 'OTP must be 6 digits'),
  newPassword: passwordSchema,
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyForgotPasswordInput = z.infer<typeof verifyForgotPasswordSchema>;
