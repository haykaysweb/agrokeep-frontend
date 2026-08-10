import apiClient from "@/api/apiClient";
import { bookingStorage } from "@/lib/bookingHelpers";

export interface InitializePaymentPayload {
  hubId: string;
  bookingId: string;
  slug: string;
}

export interface InitializePaymentResponse {
  message: string;
  data: {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
  };
}

// =========================
// VERIFIED HUB
// =========================

export interface VerifiedHub {
  _id: string;
  name: string;
  state: string;
  lga: string;
  address: string;
  proximityText?: string;
  storageType: string;
  operatingHours: string;
  images: string[];
  isVerified: boolean;
  slug: string;
}

// =========================
// VERIFIED BOOKING
// =========================

export interface VerifiedBooking {
  _id: string;
  bookingId: string;
  hub: VerifiedHub;
  user: string;

  cropType: string;
  quantity: number;
  unitType: string;

  dropOffDate: string;
  pickUpDate: string;
  durationInDays: number;

  fullName: string;
  phoneNumber: string;
  email?: string;

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
}

// =========================
// VERIFIED PAYMENT
// =========================

export interface VerifiedPayment {
  _id: string;
  reference: string;
  amount: number;
  booking: string;
  currency: string;
  paidAt: string;
  paymentMethod: string;
  paymentType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// =========================
// VERIFY PAYMENT RESPONSE
// =========================

export interface VerifyPaymentResponse {
  message: string;

  data: {
    booking: VerifiedBooking;
    payment: VerifiedPayment;
    hub: VerifiedHub;
    status: string;
  };
}

// =========================
// INITIALIZE PAYMENT
// =========================

export const initializePaymentApi = async (
  payload: InitializePaymentPayload,
): Promise<InitializePaymentResponse> => {
  const res = await apiClient.post<InitializePaymentResponse>(
    "/payment/initialize",
    payload,
  );

  return res.data;
};

// =========================
// VERIFY PAYMENT
// =========================

export const verifyPaymentApi = async (
  reference: string,
): Promise<VerifyPaymentResponse> => {
  const draftData = bookingStorage.getDraft();

  const hubId = draftData?.hubId || "";
  const bookingId = draftData?.bookingId || draftData?.id || "";
  const slug = draftData?.slug || "";

  const res = await apiClient.get<VerifyPaymentResponse>(
    `/payment/verify?reference=${encodeURIComponent(
      reference,
    )}&hubId=${encodeURIComponent(
      hubId,
    )}&bookingId=${encodeURIComponent(
      bookingId,
    )}&slug=${encodeURIComponent(slug)}`,
  );

  return res.data;
};

// =========================
// DOWNLOAD RECEIPT
// =========================

export const downloadReceiptApi = async (reference: string) => {
  const response = await apiClient.get(
    `/payment/receipt/${encodeURIComponent(reference)}`,
    {
      responseType: "blob",
    },
  );

  return response.data;
};