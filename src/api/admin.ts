import apiClient from "./apiClient";

export interface Hub {
  _id: string;
  name: string;
  state: string;
  lga: string;
  address: string;
}

export interface BookingUser {
  _id: string;
  fullName: string;
  email: string;
}

export interface AdminBooking {
  _id: string;
  bookingId: string;
  fullName: string;
  phoneNumber: string;
  cropType: string;
  quantity: number;
  unitType: string;
  durationInDays: number;
  dailyPricePerUnit: number;
  storageFee: number;
  serviceFee: number;
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  dropOffDate: string;
  pickUpDate: string;
  createdAt: string;
  updatedAt: string;
  hub: Hub;
  user: BookingUser | null;
}

export interface Pagination {
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminBookingsData {
  bookings: AdminBooking[];
  pagination: Pagination;
}

export interface AdminBookingsResponse {
  success: boolean;
  message: string;
  data: AdminBookingsData;
}

export const getAdminBookingsApi = (searchParams: URLSearchParams) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const state = searchParams.get("state") || "";
  const storageHub = searchParams.get("storageHub") || "";
  const cropType = searchParams.get("cropType") || "";
  const paymentStatus = searchParams.get("paymentStatus") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (state) params.append("state", state);
  if (storageHub) params.append("storageHub", storageHub);
  if (cropType) params.append("cropType", cropType);
  if (paymentStatus) params.append("paymentStatus", paymentStatus);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  return apiClient.get<AdminBookingsResponse>(
    `/admin/all-bookings?${params.toString()}`,
  );
};

export interface BookingStatusOption {
  value: string;
  label: string;
}

export interface PaymentStatusOption {
  value: string;
  label: string;
}

export interface StorageHubOption {
  id: string;
  name: string;
}

export interface BookingFilterOptionsData {
  bookingStatuses: BookingStatusOption[];
  paymentStatuses: PaymentStatusOption[];
  states: string[];
  cropTypes: string[];
  storageHubs: StorageHubOption[];
}

export interface BookingFilterOptionsResponse {
  success: boolean;
  message: string;
  data: BookingFilterOptionsData;
}

export const getBookingFilterOptionsApi = () => {
  return apiClient.get<BookingFilterOptionsResponse>(
    "/admin/booking-filter-options",
  );
};

export interface BookingFarmer {
  userId: string | null;
  fullName: string;
  phoneNumber: string;
  email: string;
}

export interface BookingPayment {
  method: string;
  paidAt: string;
  reference: string;
  status: string;
}

export interface BookingPriceBreakdown {
  cropType: string;
  quantity: number;
  unitType: string;
  durationInDays: number;
  dailyPricePerUnit: number;
  storageFee: number;
  serviceFee: number;
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
}

export interface BookingReservationSummary {
  hubName: string;
  location: string;
  crop: string;
  quantity: number;
  unitType: string;
  dropOffDate: string;
  pickUpDate: string;
  durationInDays: number;
  durationInWeeks: number;
  totalAmount: number;
}

export interface BookingTimelineItem {
  title: string;
  timestamp: string;
}

export interface AdminBookingDetail {
  id: string;
  bookingCustomId: string;
  bookingStatus: string;
  farmer: BookingFarmer;
  payment: BookingPayment;
  priceBreakdown: BookingPriceBreakdown;
  reservationSummary: BookingReservationSummary;
  timeline: BookingTimelineItem[];
}

export interface AdminBookingDetailResponse {
  success: boolean;
  message: string;
  data: {
    booking: AdminBookingDetail;
  };
}

export const sendAdminBookingEmailApi = (
  id: string,
  payload: { subject: string; message: string },
) => apiClient.post(`/admin/booking/${id}/email`, payload);

export const getAdminBookingByIdApi = (id: string) => {
  return apiClient.get<AdminBookingDetailResponse>(`/admin/booking/${id}`);
};

export const cancelAdminBookingApi = (id: string) => {
  return apiClient.patch(`/admin/booking/${id}/cancel`, {});
};

// create booking hubs location
export interface HubLocation {
  state: string;
  lga: string;
}

export interface HubLocationsResponse {
  success: boolean;
  message: string;
  data: {
    locations: HubLocation[];
  };
}

export const getHubLocationsApi = () => {
  return apiClient.get<HubLocationsResponse>("/admin/hub-locations");
};

export interface StorageHub {
  _id: string;
  name: string;
  state: string;
  lga: string;
  images: string[];
  operatingHours: string;
  proximityText: string;
  storageType: string;
  totalCapacity: number;
  availableCapacity: number;
  unitType: string;
  supportedCrops: string[];
  pricePerBagPerDay: number;
  pricePerCratePerDay: number;
}

export interface HubsByLocationResponse {
  success: boolean;
  message: string;
  data: {
    hubs: StorageHub[];
  };
}

export const getHubsByLocationApi = (state: string, lga: string) => {
  const params = new URLSearchParams();
  params.append("state", state);
  params.append("lga", lga);

  return apiClient.get<HubsByLocationResponse>(
    `/admin/hubs?${params.toString()}`,
  );
};

export interface CreateAdminBookingPayload {
  hubId: string;
  selectedCrop: string;
  quantity: number;
  unitType: string;
  dropOffDate: string;
  pickUpDate: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  specialInstructions?: string;
  paymentType: "deposit" | "full";
}

export interface CreatedAdminBooking {
  _id: string;
  bookingId: string;
  hub: string;
  cropType: string;
  quantity: number;
  unitType: string;
  dropOffDate: string;
  pickUpDate: string;
  durationInDays: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  specialInstructions?: string;
  dailyPricePerUnit: number;
  storageFee: number;
  serviceFee: number;
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  paymentReference: string;
}

export interface CreatedByAdmin {
  id: string;
  fullName: string;
  role: string;
}

export interface CreatedAdminPayment {
  _id: string;
  booking: string;
  hub: string;
  reference: string;
  paymentMethod: string;
  paymentType: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string;
}

export interface CreateAdminBookingResponse {
  success: boolean;
  message: string;
  data: {
    booking: CreatedAdminBooking;
    payment: CreatedAdminPayment;
    createdBy: CreatedByAdmin;
  };
}

export const createAdminBookingApi = (payload: CreateAdminBookingPayload) => {
  return apiClient.post<CreateAdminBookingResponse>(
    "/admin/create-booking",
    payload,
  );
};
