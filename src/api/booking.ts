import apiClient from "./apiClient";

export interface CreateBookingPayload {
  hubId: string;
  selectedCrop: string;
  quantity: number;
  unitType: "bags" | "crates";
  dropOffDate: string;
  pickUpDate: string;
  durationInDays: number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  specialInstructions?: string;
}

export interface BookingData {
  _id?: string;
  id?: string;
  bookingId?: string;

  hub?: {
    _id?: string;
    name?: string;
    state?: string;
    lga?: string;
    address?: string;
    storageType?: string;
    operatingHours?: string;
    proximityText?: string;
    images?: string[];
    isVerified?: boolean;
    slug?: string;
  };

  user?: {
    _id?: string;
    fullName?: string;
    email?: string;
  };

  cropType?: string;
  quantity?: number;
  unitType?: string;

  dropOffDate?: string;
  pickUpDate?: string;
  durationInDays?: number;

  fullName?: string;
  phoneNumber?: string;
  email?: string;

  dailyPricePerUnit?: number;

  storageFee?: number;
  serviceFee?: number;
  totalAmount?: number;
  depositAmount?: number;
  balanceAmount?: number;

  bookingStatus?: string;
  paymentStatus?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentSummary {
  depositAmount?: number;
  balanceAmount?: number;
  totalAmount?: number;
  durationInDays?: number;
}

export interface CreateBookingResponse {
  message: string;
  data: {
    booking: BookingData;
    paymentSummary?: PaymentSummary;
  };
}

export const createBooking = async (
  payload: CreateBookingPayload,
): Promise<CreateBookingResponse> => {
  const response = await apiClient.post("/booking/create", payload);

  return response.data;
};

// My Bookings Interfaces
export interface MyBookingHub {
  _id?: string;
  name?: string;
  address?: string;
  images?: string[];
  isVerified?: boolean;
  operatingHours?: string;
  rating?: number;
  reviewCount?: number;
  proximityText?: string;
  slug?: string;
  state?: string;
  lga?: string;
  storageType?: string;
}

export interface MyBooking {
  _id: string;
  bookingId: string;

  hub: MyBookingHub;

  cropType: string;
  quantity: number;
  unitType: string;

  dropOffDate: string;
  pickUpDate: string;
  durationInDays: number;

  bookingStatus: string;
  paymentStatus: string;

  createdAt: string;
  updatedAt?: string;

  fullName?: string;
  phoneNumber?: string;
  email?: string;

  dailyPricePerUnit?: number;

  storageFee?: number;
  serviceFee?: number;
  totalAmount?: number;
  depositAmount?: number;
  balanceAmount?: number;
}

export interface BookingMetrics {
  upcoming: number;
  active: number;
  completed: number;
}

export interface BookingPagination {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  total: number;
  totalPages: number;
}

export interface MyBookingsData {
  bookings: MyBooking[];
  metrics: BookingMetrics;
  pagination: BookingPagination;
}

export interface MyBookingsResponse {
  success: boolean;
  message: string;
  data: MyBookingsData;
}

export const getMyBookingsApi = (page = 1) => {
  return apiClient.get<MyBookingsResponse>(`/booking/my-bookings?page=${page}`);
};

export interface SingleBookingResponse {
  success: boolean;
  message: string;
  data: {
    booking: BookingData;
  };
}

export const getSingleBookingApi = async (bookingId: string) => {
  return await apiClient.get<SingleBookingResponse>(
    `/booking/single-booking/${bookingId}`,
  );
};
