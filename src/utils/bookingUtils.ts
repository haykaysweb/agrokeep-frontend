export const formatBookingDate = (
  date?: string,
  includeYear = true,
): string => {
  if (!date) return "-";

  // Prevent the timezone issue we had earlier.
  // For YYYY-MM-DD, parse the date as a local date.
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      ...(includeYear ? { year: "numeric" } : {}),
    });
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(includeYear ? { year: "numeric" } : {}),
  });
};

export const formatDuration = (days?: number): string => {
  if (!days) return "-";

  if (days >= 7) {
    const weeks = Math.round(days / 7);

    return `${weeks} ${weeks === 1 ? "Week" : "Weeks"}`;
  }

  return `${days} ${days === 1 ? "Day" : "Days"}`;
};

export const formatBookingStatus = (status?: string): string => {
  if (!status) return "Confirmed";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatPaymentStatus = (status?: string): string => {
  if (!status) return "Paid";

  if (status === "partial_deposit_paid") {
    return "Deposit paid";
  }

  if (status === "fully_paid") {
    return "Paid";
  }

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getBookingImage = (images?: string[]): string => {
  if (!images || images.length === 0) {
    return "/placeholder-image.png";
  }

  return images[0];
};
