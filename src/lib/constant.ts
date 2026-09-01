export const formatCurrency = (
  amount: number | null | undefined,
  currency: string = "NGN",
): string => {
  if (amount == null || !Number.isFinite(amount)) {
    return "₦0";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Keeps API dates from shifting because of timezone conversion.
export const formatBookingDate = (date?: string) => {
  if (!date) return "";

  const dateOnly = date.split("T")[0];

  const [year, month, day] = dateOnly.split("-").map(Number);

  if (!year || !month || !day) return "";

  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatBookingStatus = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "Confirmed";

    case "in_storage":
      return "In Storage";

    case "completed":
      return "Completed";

    case "cancelled":
      return "Cancelled";

    case "pending":
      return "Pending";

    default:
      return status
        ? status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())
        : "Unknown";
  }
};

export const formatPaymentStatus = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "partial_deposit_paid":
      return "Deposit paid";

    case "paid":
    case "fully_paid":
      return "Paid";

    case "pending":
    case "unpaid":
      return "Payment pending";

    case "refunded":
      return "Refunded";

    default:
      return status
        ? status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())
        : "Payment pending";
  }
};

export const formatDuration = (durationInDays: number) => {
  if (durationInDays >= 7) {
    const weeks = Math.round(durationInDays / 7);

    return `${weeks} ${weeks === 1 ? "Week" : "Weeks"}`;
  }

  return `${durationInDays} ${durationInDays === 1 ? "Day" : "Days"}`;
};

export const formatQuantity = (quantity: number, unitType?: string) => {
  const unit = unitType?.toLowerCase() || "";

  if (unit.includes("crate")) {
    return `${quantity} ${quantity === 1 ? "Crate" : "Crates"}`;
  }

  if (unit.includes("bag")) {
    return `${quantity} ${quantity === 1 ? "Bag" : "Bags"}`;
  }

  return `${quantity} ${unitType || "Units"}`;
};

export const WHATS_NEXT_STEPS = [
  {
    id: 1,
    title: "Prepare your produce for delivery",
    description: "Bag, weigh and label your harvest ahead of drop-off day.",
  },
  {
    id: 2,
    title: "Arrive at the storage facility on your selected date",
    description: "Our hub team will be expecting you between 8 AM and 5 PM.",
  },
  {
    id: 3,
    title: "Present your Booking ID for verification and check-in",
    description:
      "Show the ID at the point of arrival, our staff will inspect and log your produce.",
  },
];

export const DELIVERY_INSTRUCTIONS = [
  "Bring your Booking ID (printed or on your phone).",
  "Present a valid phone number matching your reservation.",
  "Arrive on your scheduled drop-off date during business hours.",
  "Contact the facility if you expect delays.",
];

export const bookingColumns = [
  { name: "BOOKING ID", uid: "bookingId" },
  { name: "NAME", uid: "farmerName" },
  { name: "STORAGE HUB", uid: "storageHub" },
  { name: "LOCATION", uid: "location" },
  { name: "CROP", uid: "crop" },
  { name: "QUANTITY", uid: "quantity" },
  { name: "DROP-OFF", uid: "dropOff" },
  { name: "DURATION", uid: "duration" },
  { name: "AMOUNT", uid: "amount" },
  { name: "STATUS", uid: "status" },
] as const;

export type BookingStatus =
  | "confirmed"
  | "active"
  | "completed"
  | "pending"
  | "cancelled";

export const bookingStatusColors: Record<BookingStatus, string> = {
  confirmed: "bg-brand-primary/25 text-brand-primary",

  active: "bg-badge-active-bg text-badge-active-text",

  completed: "bg-badge-completed-bg text-badge-completed-text",

  pending: "bg-badge-pending-bg text-badge-pending-text",

  cancelled: "bg-badge-cancelled-bg text-badge-cancelled-text",
};
