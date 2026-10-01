import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { BookingSteps } from "./BookingSteps";
import { formatCurrency } from "@/lib/constant";
import { bookingStorage } from "@/lib/bookingHelpers";
import { initializePaymentApi } from "@/api/paymentApi";
import { showToast } from "@/utils/CustomToast";
import Seo from "@/components/Seo";

// Ensure your payment API response types match this interface
interface PaymentInitResponse {
  success?: boolean;
  message?: string;
  data?: {
    authorizationUrl?: string;
    reference?: string;
  };
  authorizationUrl?: string;
  reference?: string;
}
interface InitializePaymentPayload {
  hubId: string;
  bookingId: string;
  slug: string;
}

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  // Read booking state from React Router or Session Storage backup
  const bookingData = location.state || bookingStorage.getDraft();
  // Initialize Payment Mutation
  const initPaymentMutation = useMutation<
    PaymentInitResponse,
    Error,
    InitializePaymentPayload
  >({
    mutationFn: initializePaymentApi,
    onSuccess: (res) => {
      const paystackData = res.data || res;
      const authorizationUrl = paystackData.authorizationUrl;
      const reference = paystackData.reference;
      if (reference) {
        sessionStorage.setItem("agrokeep_payment_ref", reference);
      }
      if (!authorizationUrl) {
        showToast.error("Authorization URL missing from payment gateway.");
        return;
      }
      showToast.success("Redirecting to Paystack...");
      setTimeout(() => {
        window.location.href = authorizationUrl;
      }, 700);
    },
    onError: (error) => {
      showToast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to initialize payment"
          : "Failed to initialize payment",
      );
    },
  });

  // Back Button
  const handleBack = () => {
    navigate("/storage/booking", {
      state: bookingData,
    });
  };
  // Fallback guard if route is accessed directly without state
  if (!bookingData) {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-16 text-center">
        <h2 className="text-xl font-semibold text-text-main mb-2">
          No Active Booking Session
        </h2>
        <p className="text-text-subtle text-sm mb-6">
          Please select a storage facility and fill in your details first.
        </p>
        <button
          onClick={() => navigate("/storage")}
          className="px-6 py-2.5 bg-brand-primary text-text-light rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Browse Storage Hubs
        </button>
      </section>
    );
  }
  // Booking Details
  const {
    id,
    _id,
    bookingId,
    hubId,
    slug,
    hubName = "Storage Hub",
    location: hubLocation = "Location unavailable",
    image = "",
    selectedCrop = "Produce",
    quantity = 1,
    unitType = "bag",
    durationDays = 1,
    pricePerUnit = 0,
    standardDailyPrice = 0,
    isBulkDiscountApplied = false,
    storageFee = 0,
    serviceFee = 5000,
    estimatedTotal = 0,
    deposit = 0,
  } = bookingData;

  const normalizedUnit = String(unitType).toLowerCase().includes("crate")
    ? "crate"
    : "bag";

  // Submit Payment
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBookingIdentifier = id ?? bookingId ?? _id;
    if (!hubId || !slug || !targetBookingIdentifier) {
      showToast.error("Missing booking details. Please restart your booking.");
      navigate("/storage", {
        replace: true,
      });
      return;
    }
    initPaymentMutation.mutate({
      hubId,
      bookingId: targetBookingIdentifier,
      slug,
    });
  };

  return (
    <>
      <Seo title="Payment" description="Secure payment processing." noIndex />
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-6 space-y-6">
        {/* Top Header & Steps */}
        <div className="space-y-4 mb-10">
          <button
            type="button"
            onClick={handleBack}
            disabled={initPaymentMutation.isPending}
            className="flex items-center gap-2 text-sm text-text-subtle hover:text-text-main transition-colors disabled:opacity-50"
          >
            <img src="/Arrow Left.svg" alt="Arrow Back" className="h-4 w-4" />{" "}
            Back
          </button>

          <BookingSteps currentStep={2} />
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* LEFT COLUMN: Paystack Checkout Trigger */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-main">
                Secure Payment
              </h1>
              <p className="text-xs md:text-sm text-text-subtle mt-1">
                Complete your payment safely via Paystack. Supports Card, Bank
                Transfer, & USSD.
              </p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-border-input space-y-4 shadow-sm text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                  <img src="/Card.svg" alt="" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-main">
                    Pay with Paystack
                  </h3>
                  <p className="text-xs text-text-subtle mt-1 max-w-sm mx-auto">
                    You will be redirected to Paystack's secure checkout gateway
                    to complete your transaction.
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-emerald-700 pt-3 border-t border-border-input/60">
                  <span className="flex items-center gap-1">
                    <img src="/key.svg" alt="" /> Secure checkout
                  </span>
                  <span className="flex items-center gap-1">
                    <img src="/shield.svg" alt="" />
                    256-bit Encryption
                  </span>
                  <span className="flex items-center gap-1">
                    <img src="/shield.svg" alt="" />
                    Instant Confirmation
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS ROW */}
              <div className="flex items-center justify-between pt-2">
                <motion.button
                  type="button"
                  onClick={handleBack}
                  disabled={initPaymentMutation.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative inline-block cursor-pointer disabled:opacity-50"
                >
                  <span className="absolute inset-0 translate-x-[2px] translate-y-[2px] rounded-full bg-brand-secondary"></span>
                  <span className="relative z-10 flex h-10 items-center justify-center rounded-full bg-white px-6 text-brand-primary border border-brand-secondary font-medium text-sm">
                    Back
                  </span>
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={initPaymentMutation.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative inline-block cursor-pointer disabled:opacity-50"
                >
                  <span className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-full bg-brand-secondary"></span>
                  <span className="relative z-10 flex h-11 items-center justify-center rounded-full bg-brand-primary px-8 text-text-light font-medium text-xs md:text-sm">
                    {initPaymentMutation.isPending
                      ? "Redirecting to Paystack..."
                      : "Pay with Paystack"}
                  </span>
                </motion.button>
              </div>
            </form>
          </div>
          {/* RIGHT COLUMN: Active Breakdown Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-border-input/40 rounded-2xl p-5 shadow-sm space-y-5">
              {/* Facility Header */}
              <div className="flex items-center gap-4">
                <img
                  src={image}
                  alt={hubName || "Hub Image"}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h3 className="font-bold text-text-main text-base leading-tight">
                    {hubName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-text-subtle text-xs mt-1">
                    <img
                      src="/Map Point.svg"
                      alt="Map point"
                      className="w-4 h-4 shrink-0"
                    />
                    <span className="line-clamp-1">{hubLocation}</span>
                  </div>
                </div>
              </div>

              <hr className="border-border-input/60" />

              {/* Specs */}
              <div className="space-y-2.5 text-xs text-text-main">
                <div className="flex justify-between">
                  <span className="text-text-subtle">Crop type</span>
                  <span className="font-medium capitalize">{selectedCrop}</span>
                </div>

                {/* Daily Price with Bulk Discount Support */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-text-subtle">Daily price</span>
                    {isBulkDiscountApplied && (
                      <p className="text-[11px] text-green-600">
                        5% bulk discount applied for orders of 100+{" "}
                        {normalizedUnit}s.
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    {isBulkDiscountApplied &&
                      standardDailyPrice > pricePerUnit && (
                        <span className="text-text-subtle line-through text-[11px]">
                          {formatCurrency(standardDailyPrice)}
                        </span>
                      )}
                    <span
                      className={
                        isBulkDiscountApplied
                          ? "text-brand-primary font-semibold"
                          : ""
                      }
                    >
                      {formatCurrency(pricePerUnit)}/{normalizedUnit}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-text-subtle">Duration</span>
                  <span className="font-medium">
                    {durationDays} {durationDays === 1 ? "day" : "days"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-subtle">Quantity</span>
                  <span className="font-medium">
                    {quantity}{" "}
                    {quantity === 1 ? normalizedUnit : `${normalizedUnit}s`}
                  </span>
                </div>
              </div>

              <hr className="border-border-input/60" />

              {/* Financials */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-text-main">
                  <span className="text-text-subtle">Storage fee</span>
                  <span className="font-medium">
                    {formatCurrency(storageFee)}
                  </span>
                </div>
                <div className="flex justify-between text-text-main">
                  <span className="text-text-subtle">Service fee</span>
                  <span className="font-medium">
                    {formatCurrency(serviceFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-text-main pt-1">
                  <span>Estimated total</span>
                  <span>{formatCurrency(estimatedTotal)}</span>
                </div>
              </div>

              {/* Deposit Highlight Banner */}
              <div className="bg-amber-500 text-white rounded-xl p-3 flex justify-between items-center font-bold text-sm shadow-sm">
                <span>Deposit (30%)</span>
                <span>{formatCurrency(deposit)}</span>
              </div>

              <p className="text-[11px] text-text-subtle text-center">
                The remaining balance will be paid upon produce arrival.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
