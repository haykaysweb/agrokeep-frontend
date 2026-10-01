// import apiClient from "./apiClient";
// import type { StorageHubApiResponse } from "@/lib/types";

// export const getHubDetails = async (slug: string): Promise<StorageHubApiResponse> => {
//   const response = await apiClient.get<StorageHubApiResponse>(`/hub/${slug}`);
//   return response.data;
// };

import apiClient from "./apiClient";

export interface StorageHub {
  _id: string;

  // Basic Information
  name: string;
  slug: string;
  aboutFacility: string;
  address: string;
  lga: string;
  state: string;
  proximityText: string;

  // Capacity & Specifications
  totalCapacity: number;
  availableCapacity: number;
  unitType: string;
  storageType: string;

  specFacilitySize: string;
  specStorageMethod: string;
  specClimateControl: string;
  specSecurity: string;
  specAccessibility: string;
  specNearestMajorMarket: string;

  // Pricing
  pricePerBagPerDay: number;
  pricePerCratePerDay: number;
  priceBulk100Units: number;
  priceWeeklyFlat: number;

  // Metadata
  operatingHours: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;

  // Arrays
  features: string[];
  images: string[];
  supportedCrops: string[];
  whatsIncluded: string[];

  // Similar Facilities
  similarFacilities: StorageHub[];
}

export interface StorageHubApiResponse {
  message: string;
  data: StorageHub;
}

export const getHubDetails = async (
  slug: string,
): Promise<StorageHubApiResponse> => {
  const response = await apiClient.get<StorageHubApiResponse>(`/hub/${slug}`);
  return response.data;
};
