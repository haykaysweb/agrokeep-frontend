import { z } from "zod";

// Reusable password validation to avoid repetition
const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Must contain at least one number" })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    message: "Must contain at least one special character",
  });

export const validateSignupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "Full name is required" })
      .trim()
      .min(5, { message: "Full name must be at least 5 characters long" })
      .max(50, { message: "Full name must be at most 50 characters long" }),

    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" })
      .toLowerCase()
      .trim(),

    phone: z
      .string()
      .trim()
      .refine(
        (val) => {
          if (val === "") return true;
          const cleanNumber = val.replace(/[\s\-\(\)]/g, "");
          return /^\+?[1-9]\d{7,14}$/.test(cleanNumber);
        },
        { message: "Invalid phone number format" },
      ),

    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type signUpSchemaType = z.infer<typeof validateSignupSchema>;

export const ValidateLoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .toLowerCase()
    .trim(),

  password: z.string().min(1, { message: "Password is required" }),
});

export type loginSchemaType = z.infer<typeof ValidateLoginSchema>;

export const validateForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .toLowerCase()
    .trim(),
});

export type forgotPasswordSchemaType = z.infer<
  typeof validateForgotPasswordSchema
>;

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type resetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export const validateVerifyOtpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .toLowerCase()
    .trim(),
  otp: z
    .string()
    .trim()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only digits" }),
});

export type verifyOtpSchemaType = z.infer<typeof validateVerifyOtpSchema>;
