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

export const getMyBookingsApi = (page = 1) => {
  return apiClient.get(`/booking/my-bookings?page=${page}`);
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
