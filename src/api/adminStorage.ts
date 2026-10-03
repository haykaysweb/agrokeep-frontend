/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./apiClient";

export interface StatusOption {
  value: string;
  label: string;
}

export interface LocationOption {
  state?: string;
  lga?: string;

  [key: string]: any;
}

export interface StorageFilterOptionsData {
  cropTypes: string[];
  locations: LocationOption[];
  statuses: StatusOption[];
  storageTypes: string[];
  verificationStatuses: StatusOption[];
}

export interface StorageFilterOptionsResponse {
  success: boolean;
  message: string;
  data: StorageFilterOptionsData;
}

export const getStorageFilterOptionsApi = () => {
  return apiClient.get<StorageFilterOptionsResponse>(
    "/admin/storage-hubs/filter-options",
  );
};

export interface StorageHubItem {
  _id: string;
  name: string;
  state: string;
  lga: string;
  storageType: string;
  address?: string;
  totalCapacity?: number;
  availableCapacity?: number;
  unitType?: string;
  status?: string;
  verificationStatus?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // fallback for any extra fields
}

export interface ListStorageHubsData {
  hubs: StorageHubItem[];
  pagination?: {
    limit: number;
    total: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ListStorageHubsResponse {
  success: boolean;
  message: string;
  data: ListStorageHubsData;
}

export interface StorageHubDetailsResponse {
  success: boolean;
  message: string;
  data: StorageHubItem;
}

export const getAdminStorageHubsApi = (searchParams?: URLSearchParams) => {
  const params = new URLSearchParams();

  if (searchParams) {
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("query") || searchParams.get("search");
    const state = searchParams.get("state");
    const lga = searchParams.get("lga");
    const storageType = searchParams.get("storageType");
    const verificationStatus = searchParams.get("verificationStatus");
    const status = searchParams.get("status");

    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);
    if (state && state !== "All") params.append("state", state);
    if (lga && lga !== "All") params.append("lga", lga);
    if (storageType && storageType !== "All")
      params.append("storageType", storageType);
    if (verificationStatus && verificationStatus !== "All")
      params.append("verificationStatus", verificationStatus);
    if (status && status !== "All") params.append("status", status);
  }

  const queryString = params.toString();
  const endpoint = queryString
    ? `/admin/storage-hubs?${queryString}`
    : "/admin/storage-hubs";

  return apiClient.get<ListStorageHubsResponse>(endpoint);
};

/**
 * Get details for a specific storage hub by its ID
 */
export const getAdminStorageHubDetailsApi = (id: string) => {
  return apiClient.get<StorageHubDetailsResponse>(`/admin/storage-hubs/${id}`);
};

/**
 * Upload verification documents for a storage hub
 */
export const uploadVerificationDocumentsApi = (
  id: string,
  formData: FormData,
) => {
  return apiClient.post(`/admin/storage-hubs/${id}/documents`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Activity Log types and API
 */
export interface PerformedBy {
  _id: string;
  fullName: string;
  role?: string;
  id?: string;
  [key: string]: any;
}

export interface ActivityLogItem {
  action: string;
  performedBy?: PerformedBy;
  description?: string;
  createdAt?: string;
  timestamp?: string;
  [key: string]: any;
}

export interface StorageActivityLogData {
  activityLog: ActivityLogItem[];
  [key: string]: any;
}

export interface StorageActivityLogResponse {
  activityLog: ActivityLogItem[];
  success: boolean;
  message: string;
  data: StorageActivityLogData;
}

/**
 * Get activity log for a specific storage hub by its ID
 */
export const getStorageHubActivityLogApi = (id: string) => {
  return apiClient.get<StorageActivityLogResponse>(
    `/admin/storage-hubs/${id}/activity-log`,
  );
};

/**
 * Contact storage hub owner via email
 */
export interface ContactHubEmailPayload {
  subject: string;
  message: string;
}

export interface ContactHubEmailResponse {
  success: boolean;
  message: string;
}

export const contactStorageHubOwnerApi = (
  id: string,
  payload: ContactHubEmailPayload,
) => {
  return apiClient.post<ContactHubEmailResponse>(
    `/admin/storage-hubs/${id}/email`,
    payload,
  );
};

export const editStorageHubDetailApi = async (id: string, payload: any) => {
  const response = await apiClient.patch(`/admin/storage-hubs/${id}`, payload);
  return response.data;
};
