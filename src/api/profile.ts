import apiClient from "./apiClient";

export interface UserStats {
  hubsUsed?: number;
  totalBookings?: number;
  totalStoredQuantity?: number;
}

export interface UserProfileData {
  _id?: string;
  avatarPublicId?: string;
  avatarUrl?: string;
  createdAt?: string;
  email?: string;
  emailVerified?: boolean;
  fullName?: string;
  notificationPreferences?: {
    bookingUpdates?: boolean;
    emailNotifications?: boolean;
    paymentNotifications?: boolean;
    reminderAlerts?: boolean;
    smsNotifications?: boolean;
  };
  passwordLastChanged?: string;
  phone?: string;
  role?: string;
  updatedAt?: string;
}

export interface ProfileApiResponse {
  user: UserProfileData;
  stats: UserStats;
}

export type UserProfile = UserProfileData;

export async function getUserProfile(): Promise<ProfileApiResponse> {
  const response = await apiClient.get("/user/profile");
  return response.data.data || response.data;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  notificationPreferences?: {
    bookingUpdates?: boolean;
    paymentNotifications?: boolean;
    reminderAlerts?: boolean;
    smsNotifications?: boolean;
    emailNotifications?: boolean;
  };
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const response = await apiClient.patch("/user/update-profile", payload);

  return response.data;
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await apiClient.patch("/user/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function deleteAvatar() {
  const response = await apiClient.delete("/user/delete-avatar");
  return response.data;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export async function changePassword(payload: ChangePasswordPayload) {
  const response = await apiClient.post("/user/change-password", payload);

  return response.data;
}
