import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { BookingSteps } from "./BookingSteps";
import {
  formatBookingDate,
  formatCurrency,
  WHATS_NEXT_STEPS,
} from "@/lib/constant";
import { bookingStorage, type BookingDraft } from "@/lib/bookingHelpers";
import {
  verifyPaymentApi,
  downloadReceiptApi,
  type VerifyPaymentResponse,
} from "@/api/paymentApi";
import { showToast } from "@/utils/CustomToast";
import { useScrollToTopOnChange } from "@/hooks/useScrollToTopOnChange";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const EMPTY_DRAFT: BookingDraft = {};

export default function Confirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Paystack sends the reference back in the URL
  const urlRef = searchParams.get("reference") || searchParams.get("trxref");

  // Fallback reference
  const storageRef =
    sessionStorage.getItem("agrokeep_payment_ref") ||
    localStorage.getItem("agrokeep_last_ref");

  const reference = urlRef || storageRef;

  useScrollToTopOnChange(urlRef);

  // Booking draft fallback
  const draftData: BookingDraft = bookingStorage.getDraft() || EMPTY_DRAFT;

  // Cached verified booking fallback
  const cachedBookingJson = reference
    ? localStorage.getItem(`agrokeep_confirmed_${reference}`)
    : null;

  let cachedBooking: VerifyPaymentResponse | null = null;

  try {
    cachedBooking = cachedBookingJson ? JSON.parse(cachedBookingJson) : null;
  } catch {
    cachedBooking = null;
  }

  // Verify payment
  const { data: verificationData, isLoading } =
    useQuery<VerifyPaymentResponse | null>({
      queryKey: ["verifyPayment", reference],

      queryFn: async (): Promise<VerifyPaymentResponse | null> => {
        if (!reference) {
          return cachedBooking;
        }

        try {
          const response = await verifyPaymentApi(reference);
          if (response) {
            localStorage.setItem(
              `agrokeep_confirmed_${reference}`,
              JSON.stringify(response),
            );
            localStorage.setItem("agrokeep_last_ref", reference);
          }
          return response;
        } catch {
          return cachedBooking;
        }
      },

      enabled: !!reference,
      staleTime: Infinity,
    });

  // Clear booking draft after successful verification
  useEffect(() => {
    if (verificationData?.data?.booking) {
      bookingStorage.clearDraft();
    }
  }, [verificationData]);

  const verifiedBooking = verificationData?.data?.booking;
  const verifiedHub = verificationData?.data?.hub ?? verifiedBooking?.hub;
  const verifiedPayment = verificationData?.data?.payment;

  // BOOKING ID
  const bookingId = verifiedBooking?.bookingId || reference || "AK-PENDING";

  // HUB
  const hubName = verifiedHub?.name || draftData.hubName || "Storage Hub";

  const location =
    verifiedHub?.address ||
    [verifiedHub?.lga, verifiedHub?.state].filter(Boolean).join(", ") ||
    draftData.location ||
    "Location unavailable";

  // CROP
  const cropType =
    verifiedBooking?.cropType || draftData.selectedCrop || "Produce";

  // QUANTITY
  const quantity = verifiedBooking?.quantity ?? draftData.quantity ?? 0;

  // UNIT
  const rawUnit = String(
    verifiedBooking?.unitType || draftData.unitType || "bags",
  ).toLowerCase();

  const unitType = rawUnit.includes("crate") ? "crate" : "bag";

  // PAYMENT METHOD
  const paymentMethod =
    verifiedPayment?.paymentMethod || draftData.paymentMethod || "Paystack";

  // DROP-OFF DATE
  const startDateRaw = verifiedBooking?.dropOffDate || draftData.dropDate;

  const startDate = startDateRaw ? formatBookingDate(startDateRaw) : "";

  // DURATION
  const durationDays =
    verifiedBooking?.durationInDays ?? draftData.durationDays ?? 1;

  const durationText =
    durationDays >= 7
      ? `${Math.round(durationDays / 7)} ${
          Math.round(durationDays / 7) === 1 ? "week" : "weeks"
        }`
      : `${durationDays} ${durationDays === 1 ? "day" : "days"}`;

  // AMOUNT PAID
  const amountPaid =
    verifiedPayment?.amount ??
    verifiedBooking?.depositAmount ??
    draftData.deposit ??
    0;

  // RECEIPT
  const handleDownloadReceipt = async () => {
    try {
      if (!reference) {
        showToast.error("Payment reference not found.");
        return;
      }

      const receiptBlob = await downloadReceiptApi(reference);

      const url = window.URL.createObjectURL(receiptBlob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `AgroKeep-Receipt-${reference}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      showToast.error("Failed to download receipt.");
    }
  };

  const hasDraftFallback = Object.keys(draftData).length > 0;

  // Loading State
  if (isLoading && !verificationData && !cachedBooking && !hasDraftFallback) {
    return (
      <section className="max-w-7xl min-h-[calc-(100vh-80px)] mx-auto px-4 md:px-12 py-20 text-center">
        <LoadingSpinner />

        <h2 className="mt-6 text-xl font-semibold text-text-main">
          Verifying your payment...
        </h2>

        <p className="mt-2 text-text-subtle">
          Please wait while we confirm your transaction with Paystack.
        </p>
      </section>
    );
  }

  // Missing Reference State
  if (!reference && !cachedBooking && !hasDraftFallback) {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-20 text-center">
        <h2 className="text-xl font-semibold text-text-main">
          No Booking Reference Found
        </h2>

        <p className="mt-2 text-text-subtle">
          We couldn't retrieve your payment confirmation details.
        </p>

        <button
          onClick={() => navigate("/storage")}
          className="mt-6 px-6 py-2.5 bg-brand-primary text-text-light rounded-xl font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          Return to Storage Hubs
        </button>
      </section>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-4">
      <BookingSteps currentStep={3} />
      <div className="space-y-8">
        {/* CONFIRMATION HEADER */}
        <div className="text-center space-y-3 pt-5">
          <div className="flex items-center justify-center p-2">
            <img
              src="/noto.svg"
              alt="confirmation check"
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-text-main">
            Booking Confirmed!
          </h1>

          <p className="text-xs text-text-subtle max-w-md mx-auto leading-relaxed">
            Your storage reservation has been successfully completed.{" "}
            <span className="font-semibold text-text-main">{hubName}</span> is
            expecting your delivery.
          </p>

          <div>
            <span className="inline-block bg-text-light text-brand-primary text-xs font-semibold px-6 py-2 rounded-full">
              Booking ID:{" "}
              <span className="text-black italic">
                {bookingId || "Pending"}
              </span>
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="relative inline-block cursor-pointer"
            onClick={() => navigate(`/storage/viewbooking/${bookingId}`)}
          >
            <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary"></span>
            <span className="relative z-10 flex h-8 items-center rounded-full bg-brand-primary px-4 md:px-6 py-3 text-text-light">
              <span className="text-sm font-medium md:text-base">
                View Booking
              </span>
            </span>
          </motion.button>
        </div>

        {/* SUMMARY HIGHLIGHT BANNER */}
        <div className="bg-brand-primary text-text-light rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
          <div className="flex-1 grid grid-cols-2 gap-4 md:gap-auto sm:grid-cols-4 items-center w-full">
            {/* Item 1 */}
            <div className="pr-4">
              <p className="text-white/70 text-[10px] mb-0.5">Booking ID</p>
              <p className="font-semibold text-text-light text-xs sm:text-sm truncate">
                {bookingId || "Pending"}
              </p>
            </div>

            {/* Item 2 */}
            <div className="sm:border-l sm:border-white/20 sm:pl-6 sm:pr-4">
              <p className="text-white/70 text-[10px] mb-0.5">Payment Method</p>
              <p className="font-semibold text-text-light text-xs sm:text-sm">
                {paymentMethod}
              </p>
            </div>

            {/* Item 3 */}
            <div className="sm:border-l sm:border-white/20 sm:pl-6 sm:pr-4">
              <p className="text-white/70 text-[10px] mb-0.5">Drop-off Date</p>
              <p className="font-semibold text-text-light text-xs sm:text-sm">
                {startDate}
              </p>
            </div>

            {/* Item 4 */}
            <div className="sm:border-l sm:border-white/20 sm:pl-6 sm:pr-4">
              <p className="text-white/70 text-[10px] mb-0.5">Duration</p>
              <p className="font-semibold text-text-light text-xs sm:text-sm">
                {durationText}
              </p>
            </div>
          </div>

          {/* Download Receipt button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="relative inline-block shrink-0 w-full sm:w-auto cursor-pointer"
            onClick={handleDownloadReceipt}
          >
            <span className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-full bg-brand-secondary" />

            <span className="relative z-10 flex h-9 items-center justify-center rounded-full bg-surface-card px-5 py-2 text-brand-primary">
              <span className="text-xs font-semibold whitespace-nowrap">
                Download receipt
              </span>
            </span>
          </motion.button>
        </div>

        {/* TWO COLUMN CONTENT SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Booking Information Card */}
          <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-light space-y-4">
            <h3 className="text-sm font-semibold text-brand-primary">
              Booking Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <span className="text-text-muted">Facility</span>
                <span className="font-medium text-text-main text-right">
                  {hubName}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-text-muted">Location</span>
                <span className="font-medium text-text-main text-right">
                  {location}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-text-muted">Crop type</span>
                <span className="font-medium text-text-main capitalize text-right">
                  {cropType}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-text-muted">Quantity reserved</span>
                <span className="font-medium text-text-main text-right">
                  {quantity}{" "}
                  {quantity === 1
                    ? unitType
                    : unitType.endsWith("s")
                      ? unitType
                      : `${unitType}s`}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-text-muted">Amount paid</span>
                <span className="font-bold text-text-main text-right">
                  {amountPaid && amountPaid > 0
                    ? formatCurrency(amountPaid)
                    : "₦0"}
                </span>
              </div>
            </div>
          </div>

          {/* What's Next Card */}
          <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-light space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-brand-secondary mb-3">
                What&apos;s next?
              </h3>

              <div className="space-y-3 text-xs">
                {WHATS_NEXT_STEPS.map((step) => (
                  <div key={step.id} className="flex gap-2">
                    <span className="shrink-0 font-bold">
                      <img
                        src="/check-left.svg"
                        alt=""
                        className="w-3.5 h-3.5 shrink-0 mt-0.5"
                      />
                    </span>
                    <div>
                      <h4 className="font-semibold text-text-main">
                        {step.title}
                      </h4>
                      <p className="text-text-subtle text-[11px] leading-tight mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-text-muted pt-2 border-t border-border-light">
              Free cancellation up to 48 hours before storage date
            </p>
          </div>
        </div>

        {/* NEED ASSISTANCE */}
        <div className="bg-brand-primary text-text-light rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm md:px-8 w-full">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center justify-center shrink-0">
              <img src="/cycle.svg" alt="Help icon" />
            </div>

            <div>
              <h3 className="text-sm sm:text-base md:text-2xl font-semibold text-text-light">
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
          >
            <span className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-xl bg-brand-secondary"></span>
            <span className="relative z-10 flex h-10 items-center justify-center gap-2 rounded-xl bg-surface-card px-5 py-2 text-brand-primary">
              <span className="text-xs font-semibold whitespace-nowrap">
                Contact Support
              </span>
              <img src="/orangePhone.svg" alt="" />
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
