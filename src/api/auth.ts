import type { loginSchemaType, signUpSchemaType } from "@/lib/SchemaTypes";
import apiClient from "./apiClient";

export const registerUserApi = async (formData: signUpSchemaType) => {
  return await apiClient.post("/api/v1/user/register", formData);
};

export const loginUserApi = async (formData: loginSchemaType) => {
  return await apiClient.post("/api/v1/user/login", formData);
};

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export const verifyOtpApi = async (formData: VerifyOtpPayload) => {
  return await apiClient.post(
    `/api/v1/user/verify-account?email=${encodeURIComponent(formData.email)}`,
    { otp: formData.otp },
  );
};

export const resendVerifyOtpApi = async (formData: { email: string }) => {
  return await apiClient.post(
    "/api/v1/user/resend-verifyaccount-otp",
    formData,
  );
};

export const forgotPasswordApi = async (email: string) => {
  return await apiClient.post("/api/v1/user/forgot-password", { email });
};

interface VerifyOtpParams {
  email: string;
  otp: string;
}

export const verifyForgotOtpApi = async (formData: VerifyOtpParams) => {
  return await apiClient.post(
    `/api/v1/user/verify-forgotpassword-otp?email=${encodeURIComponent(formData.email)}`,
    {
      otp: formData.otp,
    },
  );
};

export const resendForgotOtpApi = async (email: string) => {
  return await apiClient.post("/api/v1/user/resend-otp", { email });
};

interface ResetPasswordParams {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export const resetPasswordApi = async ({
  email,
  newPassword,
  confirmPassword,
}: ResetPasswordParams) => {
  return await apiClient.post(
    `/api/v1/user/reset-password?email=${encodeURIComponent(email)}`,
    { newPassword, confirmPassword },
  );
};

export const getMeApi = async () => {
  const response = await apiClient.get("/api/v1/user/me");
  return response.data;
};
