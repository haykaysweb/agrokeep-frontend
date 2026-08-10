import apiClient from "./apiClient";


export interface UserProfile {
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  stats?: {
    totalBookings?: number;
    hubsUsed?: number;
    totalStoredQuantity?: number;
  };
  [key: string]: any;
}

export async function getUserProfile(): Promise<UserProfile> {
  const response = await apiClient.get("/user/profile");
  console.log("getUserProfile response:", response.data);
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
  console.log("updateProfile response:", response.data);
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
  console.log("uploadAvatar response:", response.data);
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
  console.log("changePassword response:", response.data);
  return response.data;
}

