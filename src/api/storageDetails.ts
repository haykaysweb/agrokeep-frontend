import apiClient from "./apiClient";
import type { StorageHubApiResponse } from "@/lib/types";

export const getHubDetails = async (slug: string): Promise<StorageHubApiResponse> => {
  const response = await apiClient.get<StorageHubApiResponse>(`/hub/${slug}`);
  return response.data;
};