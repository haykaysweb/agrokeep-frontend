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



export const validateContactFormSchema = z.object({
  // Only allows alphabets and spaces, 2-50 chars, no leading/trailing whitespace
  fullName: z
    .string()
    .trim()
    .regex(/^[a-zA-Z\s]{5,50}$/, {
      message: "Full name must be 5-50 characters and contain only letters and spaces",
    }),

  // RFC 5322 standard-ish regex for email
  email: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Please enter a valid email address (e.g., name@domain.com)",
    }),

  // Strictly enforces E.164 international format (e.g., +2348012345678) 
  // or local format (08012345678)
  phone: z
    .string()
    .trim()
    .regex(/^(\+?\d{1,4}?[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4,6}$/, {
      message: "Please enter a valid phone number (10-15 digits)",
    }),

  // Allows alphanumeric + common punctuation, strict length
  message: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s.,!?'"()-]{10,1000}$/, {
      message: "Message must be 10-1000 characters (alphanumeric and standard punctuation only)",
    }),
});

export type contactFormSchemaType = z.infer<typeof validateContactFormSchema>;
