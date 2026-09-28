import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DELIVERY_INSTRUCTIONS, formatCurrency } from "@/lib/constant";
import { getSingleBookingApi } from "@/api/booking";
import { showToast } from "@/utils/CustomToast";

export default function ViewBooking() {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["singleBooking", bookingId],
    queryFn: async () => {
      if (!bookingId) {
        showToast.error("No booking ID provided.");
        throw new Error("Missing booking ID");
      }
      const res = await getSingleBookingApi(bookingId);
      return res.data;
    },
    enabled: !!bookingId,
  });

  const booking = response?.data?.booking;

  const hub = booking?.hub;

  // Hub information
  const hubName = booking?.hub?.name || "Storage Hub";
  const hubImage = hub?.images?.[0] || "/hub-placeholder.jpg";

  const location =
    booking?.hub?.address ||
    [booking?.hub?.lga, booking?.hub?.state].filter(Boolean).join(", ") ||
    "Location unavailable";

  const operatingHours = hub?.operatingHours || "";

  const proximityText = hub?.proximityText || "";

  // Booking information
  const displayBookingId = booking?.bookingId || bookingId || "";

  const cropType = booking?.cropType || "N/A";

  const quantity = booking?.quantity ?? 0;

  const rawUnit = String(booking?.unitType || "bag").toLowerCase();

  const unitType = rawUnit.includes("crate")
    ? "crate"
    : rawUnit.includes("bag")
      ? "bag"
      : rawUnit;

  // Booking date
  const createdDate = booking?.createdAt
    ? new Date(booking.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // Booking time
  const createdTime = booking?.createdAt
    ? new Date(booking.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // Drop-off date
  const dropOffDate = booking?.dropOffDate
    ? new Date(booking.dropOffDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

  // Storage duration
  const durationDays = booking?.durationInDays ?? 0;

  const durationText =
    durationDays >= 7
      ? `${Math.round(durationDays / 7)} ${
          Math.round(durationDays / 7) === 1 ? "week" : "weeks"
        }`
      : `${durationDays} ${durationDays === 1 ? "day" : "days"}`;

  // Pick-up date
  const pickUpDate = booking?.pickUpDate
    ? new Date(booking.pickUpDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

  // Financial information
  const storageFee = booking?.storageFee ?? 0;

  const serviceFee = booking?.serviceFee ?? 0;

  const estimatedTotal = booking?.totalAmount ?? 0;

  const depositPaid = booking?.depositAmount ?? 0;

  // Status
  const getStatusStyles = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "partial_deposit_paid":
      case "paid":
        return "bg-[#E8F5E9] text-[#2E7D32]";

      case "pending":
      case "unpaid":
        return "bg-amber-100 text-amber-700";

      case "in_storage":
        return "bg-blue-100 text-blue-600";

      case "completed":
        return "bg-slate-200 text-slate-700";

      case "cancelled":
        return "bg-red-100 text-red-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <h2 className="text-lg font-semibold text-text-main">
            Loading Booking Details...
          </h2>

          <p className="text-sm text-text-subtle mt-1">
            Please wait while we retrieve your booking information.
          </p>
        </div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-text-main">
            Unable to load this booking
          </h2>
          <p className="text-sm text-text-subtle mt-1">
            The booking could not be found. Please try again.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 text-sm font-semibold text-brand-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 md:px-12 py-4 space-y-6 text-text-main font-sans">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm cursor-pointer text-text-subtle hover:text-text-main transition-colors mb-4"
      >
        <img src="/Arrow Left.svg" alt="Arrow Back" className="h-5 w-5" /> Back
      </button>

      <div className="text-center space-y-1">
        <div className="flex items-center justify-center p-2">
          <img
            src="/noto.svg"
            alt="confirmation check"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold text-text-main capitalize">
          {booking?.bookingStatus === "confirmed"
            ? "Booking Confirmed!"
            : booking?.bookingStatus === "pending"
              ? "Booking Pending"
              : booking?.bookingStatus === "in_storage"
                ? "Produce In Storage"
                : booking?.bookingStatus === "completed"
                  ? "Booking Completed"
                  : booking?.bookingStatus === "cancelled"
                    ? "Booking Cancelled"
                    : "Booking Details"}
        </h1>

        <p className="text-xs text-text-subtle max-w-md mx-auto leading-relaxed">
          {booking?.bookingStatus === "pending" ||
          booking?.paymentStatus === "unpaid"
            ? "Your booking has been created, but payment has not been completed yet. Please complete your payment to confirm your storage reservation."
            : booking?.bookingStatus === "confirmed"
              ? "Your storage space has been successfully reserved and is ready for your scheduled delivery."
              : booking?.bookingStatus === "in_storage"
                ? "Your produce is currently being stored at the facility."
                : booking?.bookingStatus === "completed"
                  ? "This storage booking has been completed successfully."
                  : booking?.bookingStatus === "cancelled"
                    ? "This booking has been cancelled."
                    : "Here are the details of your storage booking."}
        </p>
      </div>

      {/* Storage Facility Card */}
      <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-light space-y-4">
        <h3 className="text-sm md:text-lg font-semibold text-text-main">
          Storage Facility
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={hubImage || "/hub-placeholder.jpg"}
              alt={hubName}
              className="sm:w-30 sm:h-30 object-cover rounded-xl shrink-0"
            />
            <div className="space-y-1.5 text-xs">
              <h2 className="text-base font-semibold text-text-main">
                {hubName}
              </h2>
              <div className="flex items-center gap-1.5 text-text-subtle">
                <img src="/mapcon.svg" alt="" className="w-3 h-3" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-text-subtle">
                <span>
                  {proximityText && (
                    <div className="flex items-center gap-1.5 text-text-subtle">
                      <img src="/plaincon.svg" alt="" className="w-3 h-3" />
                      <span>{proximityText}</span>
                    </div>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-text-subtle">
                {operatingHours && (
                  <div className="flex items-center gap-1.5 text-text-subtle">
                    <img src="/clockcon.svg" alt="" className="w-3 h-3" />
                    <span>{operatingHours}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="relative inline-block shrink-0 w-full sm:w-auto cursor-pointer"
            onClick={() =>
              window.open(
                `https://maps.google.com/?q=${encodeURIComponent(
                  hubName + " " + location,
                )}`,
                "_blank",
              )
            }
          >
            <span className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-full bg-brand-secondary"></span>
            <span className="relative z-10 flex h-9 items-center justify-center rounded-full bg-brand-primary px-5 py-2 text-text-light">
              <span className="text-xs font-semibold whitespace-nowrap">
                Get directions
              </span>
            </span>
          </motion.button>
        </div>
      </div>

      {/* Booking Summary & Storage Reservation Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Card: Booking Summary */}
        <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-light space-y-4">
          <h3 className="text-sm md:text-lg font-bold text-text-main">
            Booking Summary
          </h3>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <p className="text-text-subtle text-[11px] mb-0.5">Booking ID</p>
              <p className="font-bold italic text-text-main">
                {displayBookingId}
              </p>
            </div>
            <div>
              <p className="text-text-subtle text-[11px] mb-0.5">
                Booking Date
              </p>
              <p className="font-semibold text-text-main">{createdDate}</p>
            </div>
            <div>
              <p className="text-text-subtle text-[11px] mb-0.5">
                Booking Time
              </p>
              <p className="font-semibold text-text-main">{createdTime}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs pt-1">
            <div>
              <p className="text-text-subtle text-[11px] mb-1">
                Booking Status
              </p>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusStyles(
                  booking?.bookingStatus,
                )}`}
              >
                <CheckCircle2 className="w-3 h-3" />

                {booking?.bookingStatus
                  ? booking.bookingStatus.replace(/_/g, " ")
                  : "Unknown"}
              </span>
            </div>

            <div>
              <p className="text-text-subtle text-[11px] mb-1">
                Payment Status
              </p>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusStyles(
                  booking?.paymentStatus,
                )}`}
              >
                <CheckCircle2 className="w-3 h-3" />

                {booking?.paymentStatus
                  ? booking.paymentStatus.replace(/_/g, " ")
                  : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Storage Reservation Details */}
        <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-light space-y-4">
          <h3 className="text-sm md:text-lg font-bold text-text-main">
            Storage Reservation Details
          </h3>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <p className="text-text-subtle text-[11px] mb-0.5">
                Drop-off Date
              </p>
              <p className="font-semibold text-text-main">{dropOffDate}</p>
            </div>
            <div>
              <p className="text-text-subtle text-[11px] mb-0.5">
                Storage Duration
              </p>
              <p className="font-semibold text-text-main">{durationText}</p>
            </div>
            <div>
              <p className="text-text-subtle text-[11px] mb-0.5">
                Pick-up Date
              </p>
              <p className="font-semibold text-text-main">{pickUpDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs pt-1">
            <div>
              <p className="text-text-subtle text-[11px] mb-0.5">Crop Type</p>
              <p className="font-semibold text-text-main capitalize">
                {cropType}
              </p>
            </div>
            <div>
              <p className="text-text-subtle text-[11px] mb-0.5">
                Quantity Reserved
              </p>
              <p className="font-semibold text-text-main">
                {quantity}{" "}
                {quantity === 1
                  ? unitType
                  : unitType.endsWith("s")
                    ? unitType
                    : `${unitType}s`}
              </p>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      {/* Payment Summary & Delivery Instructions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Summary Card */}
        <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-light space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm md:text-lg font-bold text-text-main">
              Payment Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-text-subtle">
                <span>Storage fee</span>
                <span className="font-semibold text-text-main">
                  {formatCurrency(storageFee)}
                </span>
              </div>
              <div className="flex justify-between items-center text-text-subtle">
                <span>Service fee</span>
                <span className="font-semibold text-text-main">
                  {formatCurrency(serviceFee)}
                </span>
              </div>
              <div className="flex justify-between items-center text-text-main font-bold pt-2 border-t border-border-light text-sm">
                <span>Estimated total</span>
                <span>{formatCurrency(estimatedTotal)}</span>
              </div>
            </div>

            {/* Deposit Pill Banner */}
            <div className="space-y-2">
              <div className="bg-brand-secondary text-text-light rounded-xl p-2.5 flex justify-between items-center text-xs font-semibold shadow-sm">
                <span>Deposit Paid</span>
                <span>{formatCurrency(depositPaid)}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-text-subtle px-1">
                <span>Balance</span>
                <span className="font-semibold text-text-main">
                  {formatCurrency(booking?.balanceAmount ?? 0)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-text-muted pt-2">
            Remaining balance: {formatCurrency(booking?.balanceAmount ?? 0)}
          </p>
        </div>

        {/* Delivery Instructions Card */}
        <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-light space-y-3">
          <h3 className="text-sm md:text-lg font-bold text-text-main">
            Delivery Instructions
          </h3>
          <div className="space-y-2.5 text-xs">
            {DELIVERY_INSTRUCTIONS.map((text, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <img
                  src="/check-left.svg"
                  alt=""
                  className="w-3.5 h-3.5 shrink-0 mt-0.5"
                />
                <p className="text-text-subtle text-[11px] leading-tight">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Need Assistance Banner */}
      <div className="bg-brand-primary text-text-light rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm md:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center shrink-0">
            <img src="/cycle.svg" alt="Help icon" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-text-light">
              Need assistance?
            </h3>
            <p className="text-xs text-white/80 leading-tight mt-0.5">
              Our support team is available 7 days a week.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="relative inline-block shrink-0 w-full sm:w-auto cursor-pointer"
          onClick={() => navigate("/contact")}
        >
          <span className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-full bg-brand-secondary"></span>
          <span className="relative z-10 flex h-9 items-center justify-center gap-2 rounded-full bg-surface-card px-5 py-2 text-brand-primary">
            <span className="text-xs font-semibold whitespace-nowrap">
              Contact Support
            </span>
            <img src="/orangePhone.svg" alt="" />
          </span>
        </motion.button>
      </div>
    </div>
  );
}
