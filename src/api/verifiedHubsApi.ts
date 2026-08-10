import apiClient from "@/api/apiClient";
import type { VerifiedHubsApiResponse } from "@/lib/types";

export const getVerifiedHubs = async (): Promise<VerifiedHubsApiResponse> => {
  const response = await apiClient.get("/hub/verified-hubs");

  return response.data;
};
