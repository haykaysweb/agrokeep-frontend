import apiClient from "./apiClient";

export interface Hub {
  pricePerCratePerDay: number;
  pricePerBagPerDay: number;
  priceWeeklyFlat: number;
  priceBulk100Units: number;
  _id: string;
  name: string;
  state: string;
  lga: string;
  slug: string;
  address: string;
  storageType: string;
  totalCapacity: number;
  availableCapacity: number;
  pricePerBagPerWeek50kg: number;
  pricePerCratePerWeek50kg: number;
  unitType: string;
  images?: string;
  crops?: string[];
}

export interface StateGroup {
  state: string;
  hubs: Hub[];
}

export interface GroupedHubsResponse {
  message: string;
  data: StateGroup[];
}

// Function to fetch the grouped storage data
export const getStorageHubsGroupedByState = async (): Promise<StateGroup[]> => {
  const response = await apiClient.get<GroupedHubsResponse>(
    "/hub/grouped-by-state",
  );

  return response.data.data || [];
};

export interface FilterHubsParams {
  locationState?: string;
  cropType?: string;
  storageType?: string;
  lga?: string;
  tonnage?: string;
}

export interface FilterHubsResponse {
  message: string;
  count: number;
  data: Hub[];
}

// Function to fetch filtered storage hubs using query parameters
export const filterStorageHubs = async (
  params: FilterHubsParams,
): Promise<Hub[]> => {
  const response = await apiClient.get<FilterHubsResponse>("/hub/filter", {
    params,
  });
  return response.data.data || [];
};
