import { z } from "zod"

const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password cannot exceed 72 characters")
  .refine((val) => val === val.trim(), {
    error: "Password cannot start or end with spaces",
  });

export const registerSchema = z.strictObject({
  email: emailSchema,
  password: passwordSchema
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character")
});

export const loginSchema = z.strictObject({
  email: emailSchema,
  password: z.string()
    .min(1, "Password is required")
    .max(72)
    .refine((val) => val === val.trim(), {
      error: "Password cannot start or end with spaces",
    }),
});

export const refreshTokenSchema = z.strictObject({
  refreshToken: z.string()
      .min(20, "Invalid refresh token format")
      .trim()
});