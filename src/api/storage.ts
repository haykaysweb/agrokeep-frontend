import apiClient from "./apiClient";

export interface Hub {
  _id: string;
  name: string;
  state: string;
  lga: string;
  address: string;
  storageType: string;
  totalCapacity: number;
  availableCapacity: number;
  pricePerBagPerWeek50kg: number;
  pricePerCratePerWeek50kg: number;
  unitType: string;
  images?: string;
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

  // 🔍 This will print your data straight to your browser console when it works!
  console.log("Real API Data Response:", response.data);

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
export const filterStorageHubs = async (params: FilterHubsParams): Promise<Hub[]> => {
  console.log("Sending Filter Request with Params:", params);
  const response = await apiClient.get<FilterHubsResponse>("/hub/filter", {
    params,
  });
  return response.data.data || [];
};