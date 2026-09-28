import { Clock, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminBookingContactModal from "./bookingComponents/AdminBookingContactModal";
import AdminBookingCancelModal from "./bookingComponents/AdminBookingCancelModal";
import { getAdminBookingByIdApi, cancelAdminBookingApi } from "@/api/admin";
import {
  formatCurrency,
  formatBookingStatus,
  formatBookingDate,
  formatDateTime,
  formatDuration,
  formatQuantity,
} from "@/lib/constant";
import { bookingStatusColors, type BookingStatus } from "@/lib/constant";
import { showToast } from "@/utils/CustomToast";
import { isAxiosError } from "axios";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { sendAdminBookingEmailApi } from "@/api/admin";
import AdminBookingViewProfileModal from "./bookingComponents/AdminBookingViewProfileModal";

export default function AdminBookingDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isViewProfileModalOpen, setIsViewProfileModalOpen] = useState(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["getAdminBookingById", id],
    queryFn: () => getAdminBookingByIdApi(id as string),
    enabled: !!id,
  });

  const booking = data?.data?.data?.booking;
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: () => cancelAdminBookingApi(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAdminBookingById", id] });
      queryClient.invalidateQueries({ queryKey: ["getAdminBookings"] });
      setIsCancelModalOpen(false);
      showToast.success("Booking cancelled successfully!");
    },
    onError: (error: unknown) => {
      const msg = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      showToast.error(msg || "Failed to cancel booking");
    },
  });

  const sendEmailMutation = useMutation({
    mutationFn: (payload: { subject: string; message: string }) =>
      sendAdminBookingEmailApi(id as string, payload),
    onSuccess: () => {
      showToast.success("Email sent to farmer!");
    },
    onError: (error: unknown) => {
      const msg = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      showToast.error(msg || "Failed to send email");
    },
  });

  if (isPending) {
    return <LoadingSpinner message="Fetching Booking details" />;
  }

  if (isError || !booking) {
    const errMsg = isAxiosError<{ message?: string }>(error)
      ? error.response?.data?.message
      : error instanceof Error
        ? error.message
        : undefined;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-semantic-error">
          {errMsg || "Failed to load booking details"}
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-brand-primary underline"
        >
          Go back
        </button>
      </div>
    );
  }
  const { farmer, payment, priceBreakdown, reservationSummary, timeline } =
    booking;

  const farmerInitials = farmer.fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const depositPercentage = priceBreakdown.totalAmount
    ? Math.round(
        (priceBreakdown.depositAmount / priceBreakdown.totalAmount) * 100,
      )
    : 0;

  const statusColorClass =
    bookingStatusColors[booking.bookingStatus as BookingStatus] ??
    "bg-brand-primary/25 text-brand-primary";

  const canCancel = !["cancelled", "completed", "in_storage"].includes(
    booking.bookingStatus,
  );

  return (
    <div className="min-h-screen">
      <div>
        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-base cursor-pointer text-text-subtle hover:text-text-main transition-colors mb-7"
          >
            <img src="/Arrow Left.svg" alt="Arrow Back" className="h-4 w-4" />{" "}
            Back to bookings
          </button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-text-main">
              Booking Details - {booking.bookingCustomId}
            </h1>
            <p className="text-sm text-text-subtle mt-1">
              {farmer.fullName} &bull; {reservationSummary.hubName}
            </p>
          </div>

          {/* Action Badges / Buttons */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold capitalize ${statusColorClass}`}
            >
              {formatBookingStatus(booking.bookingStatus)}
            </span>
            {canCancel && (
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-semantic-error text-text-light hover:opacity-90 transition-opacity cursor-pointer"
              >
                <XCircle className="w-4 h-4 mr-1.5" />
                Cancel Booking
              </button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reservation Summary Card */}
            <div className="bg-surface-card rounded-2xl p-3 sm:p-5 shadow-xs border border-card-border w-full">
              <div className="flex items-center justify-between mb-4 gap-4">
                <span className="w-full md:w-[50%]">
                  <h2 className="text-lg font-semibold text-text-main mb-3 leading-snug">
                    Reservation Summary
                  </h2>
                  <hr className="text-border-light" />
                </span>
                <span className="hidden md:block md:w-[50%]">
                  <div className="flex justify-end pb-3 mb-2">
                    <img
                      src="/adminCal.svg"
                      alt=""
                      className="w-4 h-4 shrink-0"
                    />
                  </div>
                  <hr className="text-border-light" />
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 pt-2">
                <div className="space-y-1 pb-4">
                  <div className="flex items-center text-xs text-text-muted gap-1.5">
                    <img
                      src="/adminGarage.svg"
                      alt=""
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    Storage Hub
                  </div>
                  <p className="text-sm font-semibold text-text-main pb-3 wrap-break-words truncate">
                    {reservationSummary.hubName}
                  </p>
                  <hr className="text-border-light" />
                </div>

                <div className="space-y-1 pb-4">
                  <div className="flex items-center text-xs text-text-muted gap-1.5">
                    <img
                      src="/adminMapPoint.svg"
                      alt=""
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    Location
                  </div>
                  <p className="text-sm font-semibold text-text-main pb-3 wrap-break-words">
                    {reservationSummary.location}
                  </p>
                  <hr className="text-border-light" />
                </div>

                <div className="space-y-1 pb-4">
                  <div className="flex items-center text-xs text-text-muted gap-1.5">
                    <img
                      src="/adminPlant.svg"
                      alt=""
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    Crop and Quantity
                  </div>
                  <p className="text-sm font-semibold text-text-main pb-3 wrap-break-words">
                    {reservationSummary.crop} &bull;{" "}
                    {formatQuantity(
                      reservationSummary.quantity,
                      reservationSummary.unitType,
                    )}
                  </p>
                  <hr className="text-border-light" />
                </div>

                <div className="space-y-1 pb-4">
                  <div className="flex items-center text-xs text-text-muted gap-1.5">
                    <img
                      src="/adminCalTwo.svg"
                      alt=""
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    Drop-off Date
                  </div>
                  <p className="text-sm font-semibold text-text-main pb-3 wrap-break-words">
                    {formatBookingDate(reservationSummary.dropOffDate)}
                  </p>
                  <hr className="text-border-light" />
                </div>

                <div className="space-y-1 pb-4">
                  <div className="flex items-center text-xs text-text-muted gap-1.5">
                    <img
                      src="/adminClock.svg"
                      alt=""
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    Storage Duration
                  </div>
                  <p className="text-sm font-semibold text-text-main pb-3 wrap-break-word">
                    {formatDuration(reservationSummary.durationInDays)}
                  </p>
                  <hr className="text-border-light" />
                </div>

                <div className="space-y-1 pb-4">
                  <div className="flex items-center text-xs text-text-muted gap-1.5">
                    <img
                      src="/adminCard.svg"
                      alt=""
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    Booking Amount
                  </div>
                  <p className="text-sm font-semibold text-text-main pb-3 wrap-break-word">
                    {formatCurrency(reservationSummary.totalAmount)}
                  </p>
                  <hr className="text-border-light" />
                </div>
              </div>
            </div>

            {/* Farmer Information Card */}
            <div className="bg-surface-card rounded-2xl p-3 sm:p-5 shadow-xs border border-card-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-main">Farmer</h2>
                <img src="/adminProfile.svg" alt="" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-background-subtle flex items-center justify-center text-brand-primary font-bold text-base">
                    {farmerInitials}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-text-main">
                      {farmer.fullName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-text-subtle">
                      <span className="inline-flex items-center gap-1">
                        <img src="/adminPhone.svg" alt="" className="w-4 h-4" />
                        {farmer.phoneNumber}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <img src="/adminMail.svg" alt="" className="w-4 h-4" />
                        {farmer.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsViewProfileModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-brand-primary text-text-light hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-border-input text-text-main hover:bg-backgroundTwo transition-colors cursor-pointer"
                  >
                    Contact Farmer
                  </button>
                </div>
              </div>
            </div>

            {/* Booking Timeline Card */}
            <div className="bg-surface-card rounded-2xl p-3 sm:p-5 shadow-xs border border-card-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-text-main">
                  Booking Timeline
                </h2>
                <Clock className="w-5 h-5 text-text-muted" />
              </div>

              <div className="space-y-6 relative pl-2">
                <div className="absolute left-5 top-3 bottom-3 w-0.5 bg-border-light z-0" />

                {timeline.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 relative z-10"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                      <img src="/adminCheck.svg" alt="" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-text-main">
                        {item.title}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatDateTime(item.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Price Breakdown Card */}
            <div className="bg-surface-card rounded-2xl p-3 sm:p-5 shadow-xs border border-card-border space-y-4">
              <h2 className="text-lg font-semibold text-text-main border-b border-border-light pb-3">
                Price Breakdown
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-text-subtle">
                  <span>Crop type</span>
                  <span className="font-semibold text-text-main">
                    {priceBreakdown.cropType}
                  </span>
                </div>
                <div className="flex justify-between text-text-subtle">
                  <span>Daily price</span>
                  <span className="font-semibold text-text-main">
                    {formatCurrency(priceBreakdown.dailyPricePerUnit)}/
                    {priceBreakdown.unitType.replace(/s$/, "")}
                  </span>
                </div>
                <div className="flex justify-between text-text-subtle">
                  <span>Duration</span>
                  <span className="font-semibold text-text-main">
                    {formatDuration(reservationSummary.durationInDays)}
                  </span>
                </div>
                <div className="flex justify-between text-text-subtle pb-2 border-b border-border-light">
                  <span>Quantity</span>
                  <span className="font-semibold text-text-main">
                    {formatQuantity(
                      priceBreakdown.quantity,
                      priceBreakdown.unitType,
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-text-subtle pt-1">
                  <span>Storage fee</span>
                  <span className="font-normal text-text-main">
                    {formatCurrency(priceBreakdown.storageFee)}
                  </span>
                </div>
                <div className="flex justify-between text-text-subtle border-border-light">
                  <span>Service fee</span>
                  <span className="font-normal text-text-main">
                    {formatCurrency(priceBreakdown.serviceFee)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-medium text-text-main pt-1">
                  <span>Estimated total</span>
                  <span>{formatCurrency(priceBreakdown.totalAmount)}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="w-full py-3 px-2 rounded-xl font-semibold text-white bg-brand-secondary hover:bg-brand-secondary-hover transition-colors flex items-center justify-between shadow-xs cursor-pointer"
                >
                  <span>Deposit ({depositPercentage}%)</span>
                  <span>{formatCurrency(priceBreakdown.depositAmount)}</span>
                </button>
                <p className="text-[11px] text-text-muted mt-2">
                  Balance ({formatCurrency(priceBreakdown.balanceAmount)}) will
                  be charged when produce arrives.
                </p>
              </div>
            </div>

            {/* Payment Info Card */}
            <div className="bg-surface-card rounded-2xl p-3 sm:p-5 shadow-xs border border-card-border space-y-4">
              <h2 className="text-lg font-semibold text-text-main border-border-light pb-3">
                Payment
              </h2>

              <div className="space-y-3 text-sm text-text-subtle">
                <div className="flex justify-between text-text-subtle">
                  <span>Method</span>
                  <span className="font-semibold capitalize">
                    {payment.method}
                  </span>
                </div>
                <div className="flex justify-between text-text-subtle">
                  <span>Reference</span>
                  <span className="font-semibold">{payment.reference}</span>
                </div>
                <div className="flex justify-between text-text-subtle">
                  <span>Date and Time</span>
                  <span className="font-semibold text-right">
                    {formatDateTime(payment.paidAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {cancelMutation.isError && (
        <p className="text-xs text-semantic-error text-center mt-2">
          {(isAxiosError<{ message?: string }>(cancelMutation.error) &&
            cancelMutation.error.response?.data?.message) ||
            "Failed to cancel booking. Please try again."}
        </p>
      )}

      {/* Modals */}
      <AdminBookingViewProfileModal
        isOpen={isViewProfileModalOpen}
        onClose={() => setIsViewProfileModalOpen(false)}
        farmer={farmer}
        bookingRef={booking.bookingCustomId}
        hubName={reservationSummary.hubName}
        bookingStatus={booking.bookingStatus}
      />

      <AdminBookingContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        farmerName={booking.farmer.fullName}
        bookingRef={booking.bookingCustomId}
        hubName={booking.reservationSummary.hubName}
        phoneNumber={booking.farmer.phoneNumber}
        email={booking.farmer.email}
        onSendEmail={async (payload) => {
          await sendEmailMutation.mutateAsync(payload);
        }}
      />
      <AdminBookingCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        bookingId={booking.bookingCustomId}
        farmerName={booking.farmer.fullName}
        isCancelling={cancelMutation.isPending}
        onConfirmCancel={() => cancelMutation.mutate()}
      />
    </div>
  );
}
