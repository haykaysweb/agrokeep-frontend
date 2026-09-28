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
          const cleanNumber = val.replace(/[\s\-()]/g, "");
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
      message:
        "Full name must be 5-50 characters and contain only letters and spaces",
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
      message:
        "Message must be 10-1000 characters (alphanumeric and standard punctuation only)",
    }),
});

export type contactFormSchemaType = z.infer<typeof validateContactFormSchema>;

// Helper for timezone-safe local date parsing

const parseLocalDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  return date;
};

// Base Booking Object

const bookingBaseObject = z.object({
  selectedCrop: z.string().min(1, "Please select a crop to proceed"),

  quantity: z.coerce
    .number()
    .refine((val) => !isNaN(val), "Quantity is required")
    .refine((val) => val >= 1, "Quantity must be at least 1"),

  dropDate: z.string().superRefine((dateString, ctx) => {
    if (!dateString) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Drop-off date is required",
      });
      return;
    }

    const selectedDate = parseLocalDate(dateString);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Allow today. Only reject past dates.
    if (selectedDate < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Drop-off date cannot be in the past",
      });
    }
  }),

  pickupDate: z.string().min(1, "Pick-up date is required"),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(\+?234|0)[789][01]\d{8}$/,
      "Please enter a valid phone number (e.g. +234... or 080...)",
    ),
});

// Shared Date Validation

const validateDates = (data: { dropDate?: string; pickupDate?: string }) => {
  if (!data.dropDate || !data.pickupDate) return true;

  const drop = parseLocalDate(data.dropDate);
  const pickup = parseLocalDate(data.pickupDate);

  return pickup > drop;
};

// Storage Details Schema

export const bookingSchema = bookingBaseObject.refine(validateDates, {
  message: "Pick-up date must be at least 1 day after drop-off date",
  path: ["pickupDate"],
});

export type StorageBookingInputs = z.infer<typeof bookingSchema>;

// Booking Details Schema

export const bookingDetailsSchema = bookingBaseObject
  .extend({
    fullName: z.string().min(1, "Full name is required"),

    email: z
      .string()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),

    specialInstructions: z.string().optional(),

    agreedToTerms: z.boolean().refine((value) => value === true, {
      message: "You must agree to the terms to proceed",
    }),
  })
  .refine(validateDates, {
    message: "Pick-up date must be at least 1 day after drop-off date",
    path: ["pickupDate"],
  });

export type BookingDetailsInputs = z.infer<typeof bookingDetailsSchema>;

// Admin — Create Booking Schema
export const adminBookingSchema = z
  .object({
    state: z.string().min(1, "Please select a location"),
    lga: z.string().min(1, "Please select a location"),
    hub: z.string().min(1, "Please select a storage hub"),
    cropType: z.string().min(1, "Please select a crop type"),

    quantity: z.coerce
      .number()
      .refine((val) => !isNaN(val), "Quantity is required")
      .refine((val) => val >= 1, "Quantity must be at least 1"),

    dropOffDate: z.string().superRefine((dateString, ctx) => {
      if (!dateString) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Drop-off date is required",
        });
        return;
      }

      const selectedDate = parseLocalDate(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Drop-off date cannot be in the past",
        });
      }
    }),

    pickUpDate: z.string().min(1, "Pick-up date is required"),

    fullName: z.string().min(1, "Full name is required"),

    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^(\+?234|0)[789][01]\d{8}$/,
        "Please enter a valid phone number (e.g. +234... or 080...)",
      ),

    email: z
      .string()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),

    specialInstructions: z.string().optional(),

    paymentType: z.enum(["deposit", "full"]),
  })
  .refine(
    (data) => {
      if (!data.dropOffDate || !data.pickUpDate) return true;

      const drop = parseLocalDate(data.dropOffDate);
      const pickup = parseLocalDate(data.pickUpDate);

      return pickup > drop;
    },
    {
      message: "Pick-up date must be at least 1 day after drop-off date",
      path: ["pickUpDate"],
    },
  );

export const emailBookingSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export type EmailBookingFormValues = z.infer<typeof emailBookingSchema>;
