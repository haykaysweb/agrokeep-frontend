// import apiClient from "@/api/apiClient";
// import type { VerifiedHubsApiResponse } from "@/lib/types";

// export const getVerifiedHubs = async (): Promise<VerifiedHubsApiResponse> => {
//   const response = await apiClient.get("/hub/verified-hubs");

//   return response.data;
// };

import apiClient from "@/api/apiClient";
import type { StorageHub } from "@/api/storageDetails";

export interface VerifiedHubsApiResponse {
  message: string;
  data: StorageHub[];
}

export const getVerifiedHubs = async (): Promise<VerifiedHubsApiResponse> => {
  const response =
    await apiClient.get<VerifiedHubsApiResponse>("/hub/verified-hubs");

  return response.data;
};
