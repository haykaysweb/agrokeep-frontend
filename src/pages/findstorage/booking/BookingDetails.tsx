import { useLocation, useNavigate } from "react-router";
import { useForm, type Resolver } from "react-hook-form";
import { BookingSteps } from "./BookingSteps";
import {
  bookingDetailsSchema,
  type BookingDetailsInputs,
} from "@/lib/SchemaTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCurrency } from "@/lib/constant";
import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  getInitialDates,
  calculateDurationDays,
  bookingStorage,
} from "@/lib/bookingHelpers";
import { useMutation } from "@tanstack/react-query";
import {
  createBooking,
  type CreateBookingPayload,
  type CreateBookingResponse,
} from "@/api/booking";
import { showToast } from "@/utils/CustomToast";
import axios from "axios";
import Seo from "@/components/Seo";

export default function BookingDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingState = location.state || bookingStorage.getDraft();

  const { todayStr, tomorrowStr } = getInitialDates();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingDetailsInputs>({
    resolver: zodResolver(
      bookingDetailsSchema,
    ) as Resolver<BookingDetailsInputs>,
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      dropDate: bookingState?.dropDate || todayStr,
      pickupDate: bookingState?.pickupDate || tomorrowStr,
      selectedCrop: bookingState?.selectedCrop || "",
      quantity: Number(bookingState?.quantity) || 1,
      fullName: bookingState?.fullName || "",
      phoneNumber: bookingState?.phoneNumber || "",
      email: bookingState?.email || "",
      specialInstructions: bookingState?.specialInstructions || "",
      agreedToTerms: bookingState?.agreedToTerms || false,
    },
  });

  const watchedDropDate = watch("dropDate");
  const watchedPickupDate = watch("pickupDate");
  const watchedCrop = watch("selectedCrop");
  const watchedQuantity = Math.max(Number(watch("quantity")) || 1, 1);

  const watchedDurationDays = useMemo(
    () => calculateDurationDays(watchedDropDate, watchedPickupDate),
    [watchedDropDate, watchedPickupDate],
  );

  const standardDailyPrice = bookingState?.standardDailyPrice ?? 0;
  const bulkDailyPrice =
    Number(bookingState?.bulkDailyPrice) || standardDailyPrice;
  const weeklyFlatPrice = Number(bookingState?.weeklyFlatPrice) || 0;
  const isBulkDiscountApplied = watchedQuantity >= 100;
  const activePricePerUnit = isBulkDiscountApplied
    ? bulkDailyPrice
    : standardDailyPrice;

  const storageFee = activePricePerUnit * watchedQuantity * watchedDurationDays;
  const serviceFee = Number(bookingState?.serviceFee) || 5000;
  const estimatedTotal = storageFee + serviceFee;
  const deposit = Math.round(estimatedTotal * 0.3);
  const remainingBalance = estimatedTotal - deposit;
  const unit = bookingState?.unitType?.toLowerCase().includes("crate")
    ? "crate"
    : "bag";
  const durationUnitLabel = watchedDurationDays === 1 ? "day" : "days";
  const itemUnitLabel = watchedQuantity === 1 ? unit : `${unit}s`;

  const createBookingMutation = useMutation<
    CreateBookingResponse,
    Error,
    CreateBookingPayload
  >({
    mutationFn: createBooking,
    onSuccess: (res, variables) => {
      const bookingObj = res.data.booking;
      const resolvedId = bookingObj?._id || bookingObj?.bookingId;

      if (!resolvedId) {
        showToast.error("Failed to retrieve booking confirmation reference.");
        return;
      }

      const finalPaymentPayload = {
        ...bookingState,
        ...variables,
        id: bookingObj?._id || bookingObj?.id,
        bookingId: bookingObj?.bookingId || resolvedId,
        slug: bookingState.slug || bookingState.hubSlug,
        hubSlug: bookingState.hubSlug,
        hubId: bookingState.hubId,
        hubName: bookingState.hubName,
        image: bookingState.image,
        galleryImage: bookingState.galleryImage,
        location: bookingState.location,
        storageType: bookingState.storageType,
        supportedCrops: bookingState.supportedCrops,
        availableCapacity: bookingState.availableCapacity,
        totalCapacity: bookingState.totalCapacity,
        rating: bookingState.rating,
        reviewCount: bookingState.reviewCount,
        operatingHours: bookingState.operatingHours,
        unitType: unit,
        unitLabel: bookingState.unitLabel,
        durationDays: watchedDurationDays,
        selectedCrop: variables.selectedCrop,
        quantity: variables.quantity,
        dropDate: variables.dropOffDate,
        pickupDate: variables.pickUpDate,
        fullName: variables.fullName,
        phoneNumber: variables.phoneNumber,
        email: variables.email,
        specialInstructions: variables.specialInstructions,
        pricePerUnit: activePricePerUnit,
        standardDailyPrice,
        bulkDailyPrice,
        weeklyFlatPrice,
        isBulkDiscountApplied,
        subtotal: storageFee,
        storageFee,
        serviceFee,
        totalCost: estimatedTotal,
        estimatedTotal,
        deposit,
        remainingBalance,
      };
      bookingStorage.saveDraft(finalPaymentPayload);
      showToast.success("Booking created successfully.");
      navigate("/storage/payment", {
        state: finalPaymentPayload,
      });
    },
    onError: (error) => {
      showToast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to create booking"
          : "Failed to create booking",
      );
    },
  });

  if (!bookingState) {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-16 text-center">
        <h2 className="text-xl font-semibold text-text-main mb-2">
          No Active Booking Session
        </h2>
        <p className="text-text-subtle text-sm mb-6">
          Please select a storage facility from our hubs list first.
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="relative inline-block cursor-pointer"
          onClick={() => navigate("/storage")}
        >
          <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-xl bg-brand-secondary"></span>
          <span className="relative z-10 flex h-8 items-center gap-3 rounded-xl bg-brand-primary px-5 md:px-8 py-3 text-text-light">
            <span className="text-sm font-medium md:text-base">
              Browse Storage Hubs
            </span>
          </span>
        </motion.button>
      </section>
    );
  }

  const onSubmit = (formData: BookingDetailsInputs) => {
    const payload: CreateBookingPayload = {
      hubId: bookingState.hubId ?? bookingState._id ?? bookingState.id,
      selectedCrop: formData.selectedCrop,
      quantity: Number(formData.quantity),
      unitType: unit === "crate" ? "crates" : "bags",
      dropOffDate: formData.dropDate,
      pickUpDate: formData.pickupDate,
      durationInDays: watchedDurationDays,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      ...(formData.specialInstructions && {
        specialInstructions: formData.specialInstructions,
      }),
    };

    bookingStorage.saveDraft({
      ...bookingState,
      ...formData,
      durationDays: watchedDurationDays,
      pricePerUnit: activePricePerUnit,
      standardDailyPrice,
      bulkDailyPrice,
      weeklyFlatPrice,
      isBulkDiscountApplied,
      subtotal: storageFee,
      storageFee,
      serviceFee,
      totalCost: estimatedTotal,
      estimatedTotal,
      deposit,
      remainingBalance,
    });
    createBookingMutation.mutate(payload);
  };

  const handleBack = () => {
    const targetSlug = bookingState.slug || bookingState.hubSlug;
    bookingStorage.saveDraft({
      ...bookingState,
      // eslint-disable-next-line react-hooks/incompatible-library -- one-off snapshot read on click, not memoized render output
      ...watch(),
      durationDays: watchedDurationDays,
      pricePerUnit: activePricePerUnit,
      standardDailyPrice,
      bulkDailyPrice,
      weeklyFlatPrice,
      isBulkDiscountApplied,
      subtotal: storageFee,
      storageFee,
      serviceFee,
      totalCost: estimatedTotal,
      estimatedTotal,
      deposit,
      remainingBalance,
    });

    if (targetSlug) {
      navigate(`/storage/details/${targetSlug}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <Seo
        title="Booking Details"
        description="Storage booking details."
        noIndex
      />
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-sm cursor-pointer text-text-subtle hover:text-text-main transition-colors mb-7"
        >
          <img src="/Arrow Left.svg" alt="Arrow Back" className="h-5 w-5" />{" "}
          Back
        </button>

        <BookingSteps currentStep={1} />

        <div className="mb-8 mt-7">
          <h1 className="text-2xl md:text-3xl font-bold text-text-main">
            Booking Details
          </h1>
          <p className="text-xs md:text-sm text-text-subtle mt-1">
            Tell us when and what you are storing. Fields with * are required.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border-none rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-brand-primary font-semibold text-sm">
                <img src="/Calendar.svg" alt="Calendar" className="w-5 h-5" />
                <span>Storage schedule</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base md:text-xs font-medium text-text-main mb-1">
                    Drop-off date*
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    {...register("dropDate", {
                      required: "Drop-off date is required",
                    })}
                    className="w-full block box-border bg-background border border-border-input rounded-2xl px-3 py-2 text-base md:text-xs text-text-main focus:outline-none focus:border-brand-primary appearance-none [&::-webkit-date-and-time-value]:text-left"
                  />
                  {errors.dropDate?.message && (
                    <span className="text-[10px] text-red-500 mt-0.5">
                      {String(errors.dropDate.message)}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-base md:text-xs font-medium text-text-main mb-1">
                    Pick-up date*
                  </label>
                  <input
                    type="date"
                    min={
                      watch("dropDate") ||
                      new Date().toISOString().split("T")[0]
                    }
                    {...register("pickupDate", {
                      required: "Pick-up date is required",
                    })}
                    className="w-full block box-border bg-background border border-border-input rounded-2xl px-3 py-2 text-base md:text-xs text-text-main focus:outline-none focus:border-brand-primary appearance-none [&::-webkit-date-and-time-value]:text-left"
                  />
                  {errors.pickupDate?.message && (
                    <span className="text-[10px] text-red-500 mt-0.5">
                      {String(errors.pickupDate.message)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white border-input rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-brand-primary font-semibold text-sm">
                <img
                  src="/plant-light.svg"
                  alt="Calendar"
                  className="w-5 h-5"
                />
                <span>Produce information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base md:text-xs font-medium text-text-main mb-1">
                    Crop type*
                  </label>

                  <select
                    {...register("selectedCrop", {
                      required: "Crop type is required",
                    })}
                    className={`w-full block box-border bg-background border ${
                      errors.selectedCrop
                        ? "border-semantic-error"
                        : "border-border-input"
                    } rounded-2xl px-3 py-2 text-base md:text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer capitalize`}
                  >
                    <option value="" disabled>
                      Select Crop
                    </option>
                    {Array.isArray(bookingState?.supportedCrops) &&
                    bookingState.supportedCrops.length > 0 ? (
                      bookingState.supportedCrops.map((crop: string) => (
                        <option key={crop} value={crop}>
                          {crop}
                        </option>
                      ))
                    ) : bookingState?.selectedCrop ? (
                      <option value={bookingState.selectedCrop}>
                        {bookingState.selectedCrop}
                      </option>
                    ) : (
                      <option disabled value="">
                        No crops available
                      </option>
                    )}
                  </select>

                  {errors.selectedCrop && (
                    <span className="text-[10px] text-semantic-error mt-1 block">
                      {String(errors.selectedCrop.message)}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-base md:text-xs font-medium text-text-main mb-1">
                    Estimated quantity*
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      {...register("quantity")}
                      className={`flex-1 min-w-0 block box-border bg-background border ${
                        errors.quantity
                          ? "border-red-500"
                          : "border-border-input"
                      } rounded-2xl px-3 py-2 text-base md:text-xs text-text-main focus:outline-none focus:border-brand-primary`}
                    />
                    <span className="flex items-center justify-center px-3 py-2 bg-background border border-border-input text-base md:text-xs font-medium text-text-subtle rounded-2xl capitalize shrink-0">
                      {watchedQuantity === 1 ? unit : `${unit}s`}
                    </span>
                  </div>

                  {errors.quantity?.message && (
                    <span className="text-[10px] text-red-500 mt-1 block font-medium">
                      {String(errors.quantity.message)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white border-none rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-brand-primary font-semibold text-sm">
                <img
                  src="/Phone Rounded.svg"
                  alt="Contact"
                  className="w-5 h-5"
                />
                <span>Contact information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base md:text-xs font-medium text-text-main mb-1">
                    Full name*
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    {...register("fullName", {
                      required: "Full name is required",
                    })}
                    className="w-full bg-background border border-border-input rounded-2xl px-3 py-2 text-base md:text-xs text-text-main focus:outline-none focus:border-brand-primary"
                  />
                  {errors.fullName && (
                    <span className="text-[10px] text-red-500 mt-0.5">
                      {String(errors.fullName.message)}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-base md:text-xs font-medium text-text-main mb-1">
                    Phone number*
                  </label>
                  <input
                    type="tel"
                    placeholder="+234 700 000 0000"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                    })}
                    className="w-full bg-background border border-border-input rounded-2xl px-3 py-2 text-base md:text-xs text-text-main focus:outline-none focus:border-brand-primary"
                  />
                  {errors.phoneNumber && (
                    <span className="text-[10px] text-red-500 mt-0.5">
                      {String(errors.phoneNumber.message)}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-base md:text-xs font-medium text-text-main mb-1">
                  Email address (optional)
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="w-full bg-background border border-border-input rounded-2xl px-3 py-2 text-base md:text-xs text-text-main focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-base md:text-xs font-medium text-text-main mb-1">
                  Special instructions (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. I'll arrive around 10 AM, I need truck access."
                  {...register("specialInstructions")}
                  className="w-full bg-background border border-border-input rounded-2xl px-3 py-2 text-xs text-text-main focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <label className="flex items-start gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  {...register("agreedToTerms", { required: true })}
                  className="mt-0.5 text-brand-primary rounded focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px] text-text-subtle">
                  I confirm that the information provided is correct and I agree
                  to AgroKeep's booking terms.
                </span>
              </label>

              {errors.agreedToTerms && (
                <p className="text-[10px] text-red-500 font-medium animate-pulse">
                  {errors.agreedToTerms.message ||
                    "You must agree to the booking terms to proceed"}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <motion.button
                type="button"
                onClick={handleBack}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative inline-block cursor-pointer"
              >
                <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-2xl bg-brand-secondary"></span>
                <span className="relative z-10 flex h-9 items-center rounded-2xl bg-white px-5 md:px-6 py-3 text-brand-primary font-medium text-sm md:text-base border border-border-input">
                  Back
                </span>
              </motion.button>
              <motion.button
                type="submit"
                disabled={createBookingMutation.isPending}
                whileHover={
                  createBookingMutation.isPending ? undefined : { scale: 1.04 }
                }
                whileTap={
                  createBookingMutation.isPending ? undefined : { scale: 0.96 }
                }
                className="relative inline-block cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-2xl bg-brand-secondary"></span>
                <span className="relative z-10 flex h-9 items-center gap-3 rounded-2xl bg-brand-primary px-5 md:px-6 py-3 text-text-light">
                  <span className="text-sm font-medium md:text-base">
                    {createBookingMutation.isPending
                      ? "Creating Booking..."
                      : "Continue to payment"}
                  </span>
                </span>
              </motion.button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border-none rounded-2xl p-5 shadow-sm space-y-5">
              <div className="flex items-center gap-4">
                <img
                  src={bookingState.image || "/hub-placeholder"}
                  alt={bookingState.hubName || "Hub Image"}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h3 className="font-bold text-text-main text-base leading-tight">
                    {bookingState.hubName || "Storage Hub"}
                  </h3>
                  <div className="flex items-center gap-1 text-text-subtle text-xs mt-1">
                    <img
                      src="/Map Point.svg"
                      alt="Map point"
                      className="w-4 h-4"
                    />
                    <span className="line-clamp-2">
                      {bookingState.location || "Location unavailable"}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="border-border-input" />

              <div className="space-y-2.5 text-xs text-text-main">
                <div className="flex justify-between">
                  <span className="text-text-subtle">Crop type</span>
                  <span className="font-medium capitalize">
                    {watchedCrop || "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-text-subtle">Daily Price</span>
                    {isBulkDiscountApplied && (
                      <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                        Bulk Applied
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    {isBulkDiscountApplied &&
                      standardDailyPrice > bulkDailyPrice && (
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
                      {formatCurrency(activePricePerUnit)} / {unit}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-text-subtle">Duration</span>
                  <span className="font-medium">
                    {watchedDurationDays} {durationUnitLabel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-subtle">Quantity</span>
                  <span className="font-medium">
                    {watchedQuantity} {itemUnitLabel}
                  </span>
                </div>
              </div>

              <hr className="border-border-input" />

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

              <div className="bg-amber-500 text-white rounded-xl p-3 flex justify-between items-center font-bold text-sm">
                <span>Deposit (30%)</span>
                <span>{formatCurrency(deposit)}</span>
              </div>

              <p className="text-[11px] text-text-subtle text-center">
                Balance will be charged when produce arrives.
              </p>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
