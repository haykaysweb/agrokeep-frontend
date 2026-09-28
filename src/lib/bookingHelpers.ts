// Shared utilities for date math and session management

export interface BookingDraft {
  // Hub info
  hubId?: string;
  _id?: string;
  id?: string;
  bookingId?: string;
  slug?: string;
  hubSlug?: string;
  hubName?: string;
  image?: string;
  galleryImage?: string;
  location?: string;
  storageType?: string;
  supportedCrops?: string[];
  availableCapacity?: number;
  totalCapacity?: number;
  rating?: number;
  reviewCount?: number;
  operatingHours?: string;
  // Booking info
  selectedCrop?: string;
  quantity?: number;
  unitType?: string;
  unitLabel?: string;
  dropDate?: string;
  pickupDate?: string;
  durationDays?: number;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  specialInstructions?: string;
  agreedToTerms?: boolean;
  // Pricing
  pricePerUnit?: number;
  standardDailyPrice?: number;
  bulkDailyPrice?: number;
  weeklyFlatPrice?: number;
  isBulkDiscountApplied?: boolean;
  subtotal?: number;
  storageFee?: number;
  serviceFee?: number;
  totalCost?: number;
  estimatedTotal?: number;
  deposit?: number;
  remainingBalance?: number;
  paymentMethod?: string;
  // Allows any additional field this draft picks up along the way
  [key: string]: unknown;
}

export const getInitialDates = () => {
  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format helper
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  return {
    // Default drop-off date
    todayStr: formatDate(today),
    // Default pick-up date
    tomorrowStr: formatDate(tomorrow),
    // Earliest selectable drop-off date
    minDropDate: formatDate(today),
  };
};

export const calculateDurationDays = (
  dropDate?: string,
  pickupDate?: string,
): number => {
  if (!dropDate || !pickupDate) return 1;
  const [dY, dM, dD] = dropDate.split("-").map(Number);
  const [pY, pM, pD] = pickupDate.split("-").map(Number);

  const drop = new Date(dY, dM - 1, dD);
  const pickup = new Date(pY, pM - 1, pD);

  const diffDays = Math.ceil(
    (pickup.getTime() - drop.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffDays > 0 ? diffDays : 1;
};

export const bookingStorage = {
  getDraft: (currentHubSlug?: string): BookingDraft | null => {
    if (typeof window === "undefined") return null;
    try {
      const saved = sessionStorage.getItem("agrokeep_booking_draft");
      if (!saved) return null;
      const parsed = JSON.parse(saved) as BookingDraft;
      // Only return draft if it belongs to the active hub slug
      if (currentHubSlug && parsed.hubSlug !== currentHubSlug) return null;
      return parsed;
    } catch {
      return null;
    }
  },
  saveDraft: (data: BookingDraft) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("agrokeep_booking_draft", JSON.stringify(data));
    }
  },
  clearDraft: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("agrokeep_booking_draft");
    }
  },
};
