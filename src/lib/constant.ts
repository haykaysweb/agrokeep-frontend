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

// For timestamps where the actual time matters (payment, timeline).
export const formatDateTime = (isoDate?: string) => {
  if (!isoDate) return "";

  return new Date(isoDate).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
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

// Cascades days -> weeks -> months, e.g. 8 days = "1 Week 1 Day".
export const formatDuration = (durationInDays: number): string => {
  if (!durationInDays || durationInDays <= 0) return "0 Days";

  if (durationInDays < 7) {
    return `${durationInDays} ${durationInDays === 1 ? "Day" : "Days"}`;
  }

  const DAYS_IN_MONTH = 30;
  const DAYS_IN_WEEK = 7;

  const months = Math.floor(durationInDays / DAYS_IN_MONTH);
  const afterMonths = durationInDays % DAYS_IN_MONTH;
  const weeks = Math.floor(afterMonths / DAYS_IN_WEEK);
  const days = afterMonths % DAYS_IN_WEEK;

  const parts: string[] = [];
  if (months > 0) parts.push(`${months} ${months === 1 ? "Month" : "Months"}`);
  if (weeks > 0) parts.push(`${weeks} ${weeks === 1 ? "Week" : "Weeks"}`);
  if (days > 0) parts.push(`${days} ${days === 1 ? "Day" : "Days"}`);

  return parts.join(" ");
};

// Derives correct singular/plural locally — backend's unitType is unreliable
// (e.g. sends "bags" even when quantity is 1).
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
  { name: "FARMER'S NAME", uid: "farmerName" },
  { name: "STORAGE HUB", uid: "storageHub" },
  { name: "LOCATION", uid: "location" },
  { name: "CROP", uid: "crop" },
  { name: "QUANTITY", uid: "quantity" },
  { name: "DROP-OFF", uid: "dropOff" },
  { name: "DURATION", uid: "duration" },
  { name: "AMOUNT", uid: "amount" },
  { name: "STATUS", uid: "status" },
] as const;

// Matches the raw values the backend sends, so lookups never silently miss.
export type BookingStatus =
  "confirmed" | "in_storage" | "completed" | "pending" | "cancelled";

export const bookingStatusColors: Record<BookingStatus, string> = {
  confirmed: "bg-brand-primary/25 text-brand-primary",
  in_storage: "bg-badge-instorage-bg text-badge-instorage-text",
  completed: "bg-badge-completed-bg text-badge-completed-text",
  pending: "bg-badge-pending-bg text-badge-pending-text",
  cancelled: "bg-badge-cancelled-bg text-badge-cancelled-text",
};

export const getBookingStatusStyles = (status?: string): string => {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "confirmed") {
    return "bg-brand-primary/10 text-brand-primary";
  }

  if (normalizedStatus === "in_storage") {
    return "bg-blue-100 text-blue-600";
  }

  if (normalizedStatus === "completed") {
    return "bg-slate-200 text-slate-700";
  }

  if (normalizedStatus === "cancelled") {
    return "bg-red-100 text-red-600";
  }

  if (normalizedStatus === "pending") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-background-subtle text-text-subtle";
};
