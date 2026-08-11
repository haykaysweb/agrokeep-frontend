import { useNavigate, useParams } from "react-router";
import LazyLoadImageRC from "@/components/ui/LazyLoadImage";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getHubDetails } from "@/api/storageDetails";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import type { StorageHubApiResponse } from "@/lib/types";
import { formatCurrency } from "@/lib/constant";
import StorageReviews from "./StorageReviews";
import { useForm, type Resolver } from "react-hook-form";
import { bookingSchema, type StorageBookingInputs } from "@/lib/SchemaTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import StorageDetailsMap from "./storagedetailsmap/StorageDetailsMap";
import { useMemo } from "react";
import {
  getInitialDates,
  calculateDurationDays,
  bookingStorage,
} from "@/lib/bookingHelpers";
import SimilarFacilities from "./SimilarFacilities";
import { useScrollToTopOnChange } from "@/hooks/useScrollToTopOnChange";

export default function StorageDetails() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const { data, isPending, isError, error } = useQuery<StorageHubApiResponse>({
    queryKey: ["hubDetails", slug],
    queryFn: () => getHubDetails(slug as string),
    enabled: !!slug,
  });
  const hub = data?.data;
  const draft = bookingStorage.getDraft(slug);
  useScrollToTopOnChange(data);

  // Unit & Labels
  const unit = hub?.unitType?.toLowerCase().includes("crate") ? "crate" : "bag";
  const unitLabel = unit === "crate" ? "Crates" : "Bags";

  // Date Defaults
  const { todayStr, tomorrowStr, minDropDate } = getInitialDates();

  // Booking Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StorageBookingInputs>({
    resolver: zodResolver(bookingSchema) as Resolver<StorageBookingInputs>,
    defaultValues: {
      selectedCrop: draft?.selectedCrop || "",
      quantity: Number(draft?.quantity) || 1,
      dropDate: draft?.dropDate || todayStr,
      pickupDate: draft?.pickupDate || tomorrowStr,
      phoneNumber: draft?.phoneNumber || "",
    },
  });

  // Watches
  const watchedQuantity = Math.max(Number(watch("quantity")) || 1, 1);
  const watchedDropDate = watch("dropDate");
  const watchedPickupDate = watch("pickupDate");

  // Duration
  const watchedDurationDays = useMemo(
    () => calculateDurationDays(watchedDropDate, watchedPickupDate),
    [watchedDropDate, watchedPickupDate],
  );

  // Pricing
  const standardDailyPrice =
    unit === "crate"
      ? (hub?.pricePerCratePerDay ?? 0)
      : (hub?.pricePerBagPerDay ?? 0);

  const bulkDailyPrice = hub?.priceBulk100Units ?? standardDailyPrice;
  const weeklyFlatPrice = hub?.priceWeeklyFlat ?? 0;
  const isBulkDiscountApplied = watchedQuantity >= 100;
  const pricePerUnit = isBulkDiscountApplied
    ? bulkDailyPrice
    : standardDailyPrice;

  // Cost Breakdown

  const subtotal = pricePerUnit * watchedQuantity * watchedDurationDays;
  const storageFee = subtotal;
  const serviceFee = 5000;
  const totalCost = storageFee + serviceFee;
  const estimatedTotal = totalCost;
  const deposit = Math.round(totalCost * 0.3);
  const remainingBalance = totalCost - deposit;

  // Labels

  const durationUnitLabel = watchedDurationDays === 1 ? "day" : "days";

  const itemUnitLabel = watchedQuantity === 1 ? unit : `${unit}s`;

  // Capacity
  const availableCapacity = hub?.availableCapacity ?? 0;
  const totalCapacity = hub?.totalCapacity ?? 0;
  const percentage =
    totalCapacity > 0
      ? Math.round((availableCapacity / totalCapacity) * 100)
      : 0;

  // Images
  const galleryImage = hub?.images?.[0] ?? "/placeholder-hub.jpg";

  // Submit
  const onSubmit = (formData: StorageBookingInputs) => {
    if (!hub) return;
    const bookingPayload = {
      ...formData,
      // Booking
      durationDays: watchedDurationDays,
      // Hub
      hubId: hub._id,
      slug: hub.slug,
      hubSlug: hub.slug,
      hubName: hub.name,
      image: galleryImage,
      galleryImage,
      location: hub.address || `${hub.lga}, ${hub.state}`,
      storageType: hub.storageType,
      unitType: unit,
      unitLabel,
      // Capacity
      availableCapacity,
      totalCapacity,
      // Metadata
      rating: hub.rating,
      reviewCount: hub.reviewCount,
      operatingHours: hub.operatingHours,
      supportedCrops: hub.supportedCrops ?? [],
      // Pricing
      standardDailyPrice,
      bulkDailyPrice,
      weeklyFlatPrice,
      pricePerUnit,
      isBulkDiscountApplied,
      subtotal,
      storageFee,
      serviceFee,
      totalCost,
      estimatedTotal,
      deposit,
      remainingBalance,
      // Customer
      fullName: draft?.fullName ?? "",
      email: draft?.email ?? "",
      phoneNumber: formData.phoneNumber || draft?.phoneNumber || "",
    };
    bookingStorage.saveDraft(bookingPayload);
    navigate("/storage/booking", {
      state: bookingPayload,
    });
  };

  if (isPending) {
    return <LoadingSpinner message="Fetching Storage Hub Details" />;
  }

  if (isError) {
    const status = (error as any)?.status || (error as any)?.response?.status;

    let errorMessage = "Failed to load Storage Hub details. Please try again.";

    if (status === 401) {
      errorMessage =
        "You must have an account and be logged in to view Storage Hub details.";
    } else if (status === 403) {
      errorMessage =
        "Your account does not have permission to view this Storage Hub's details.";
    }

    return <ErrorDisplay message={errorMessage} />;
  }

  if (!hub) {
    return <ErrorDisplay message="Storage Hub Details Not Available" />;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-12 py-4 font-sans text-text-main">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-text-subtle font-medium text-sm hover:text-brand-primary transition-colors duration-200 cursor-pointer"
        >
          <img src="/Arrow Left.svg" alt="Arrow Back" className="h-5 w-5" />
          Back
        </button>
      </div>

      <main>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:auto-rows-[220px]">
          <div className="col-span-2 h-[260px] sm:h-[340px] md:h-full md:row-span-2 rounded-2xl md:rounded-3xl overflow-hidden shadow-xs">
            <LazyLoadImageRC
              src={hub.images?.[0] || "/placeholder-hub.jpg"}
              alt={hub.name}
              className="w-full h-full block object-cover"
            />
          </div>

          {/* Top Left Secondary Sub-angle */}
          <div className="h-[140px] sm:h-[180px] md:h-full rounded-xl md:rounded-2xl overflow-hidden shadow-xs">
            <LazyLoadImageRC
              src={galleryImage}
              alt="Storage configuration alternate view 1"
              className="w-full h-full block object-cover"
            />
          </div>

          {/* Top Right Secondary Sub-angle */}
          <div className="h-[140px] sm:h-[180px] md:h-full rounded-xl md:rounded-2xl overflow-hidden shadow-xs">
            <LazyLoadImageRC
              src={galleryImage}
              alt="Storage configuration alternate view 2"
              className="w-full h-full block object-cover"
            />
          </div>

          {/* Bottom Left Secondary Sub-angle */}
          <div className="h-[140px] sm:h-[180px] md:h-full rounded-xl md:rounded-2xl overflow-hidden shadow-xs">
            <LazyLoadImageRC
              src={galleryImage}
              alt="Storage configuration alternate view 3"
              className="w-full h-full block object-cover"
            />
          </div>

          {/* Bottom Right Secondary Sub-angle */}
          <div className="h-[140px] sm:h-[180px] md:h-full rounded-xl md:rounded-2xl overflow-hidden shadow-xs">
            <LazyLoadImageRC
              src={galleryImage}
              alt="Storage configuration alternate view 4"
              className="w-full h-full block object-cover"
            />
          </div>
        </div>

        {/* Details content section */}
        <section className="font-sans text-text-main mt-10">
          {/* Title & Badge */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-main">
              {hub.name}
            </h1>

            {hub.isVerified ? (
              <span className="inline-flex items-center gap-1 bg-surface-alt/20 text-brand-primary px-2.5 py-0.5 rounded-full text-xs font-medium">
                <img
                  src="/VerifiedCheck.svg"
                  alt="Verified"
                  className="w-3.5 h-3.5"
                />
                <span>Verified</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-surface-card border border-border-light text-text-muted px-2.5 py-0.5 rounded-full text-xs font-medium">
                <span>Not Verified</span>
              </span>
            )}
          </div>

          {/* Meta Details Row */}
          <div className="flex items-center gap-6 text-sm text-text-subtle mb-6 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-brand-secondary font-bold text-base">
                ★
              </span>
              <span className="font-semibold text-text-main">{hub.rating}</span>
              <span className="text-text-subtle">
                ({hub.reviewCount} reviews)
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5">
              <img src="/Map Point.svg" alt="" className="w-4 h-4 opacity-70" />
              <span>{hub.lga}</span>
            </div>

            {/* Distance */}
            <div className="flex items-center gap-1.5">
              <img src="/Plain.svg" alt="" className="w-4 h-4 opacity-70" />
              <span>{hub.address}</span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-card border border-border-input rounded-xl p-4 flex flex-col justify-between shadow-xs">
              <div>
                <img
                  src="/Garage.svg"
                  alt=""
                  className="w-5 h-5 mb-2 text-brand-primary"
                />
                <p className="text-xs uppercase tracking-wider text-text-muted font-medium mb-1">
                  STORAGE TYPE
                </p>
              </div>
              <p className="text-base font-semibold text-text-main">
                {hub.storageType}
              </p>
            </div>

            <div className="bg-surface-card border border-border-input rounded-xl p-4 flex flex-col justify-between shadow-xs">
              <div>
                <img
                  src="/famicons.svg"
                  alt=""
                  className="w-5 h-5 mb-2 text-brand-primary"
                />
                <p className="text-xs uppercase tracking-wider text-text-muted font-medium mb-1">
                  PRICE
                </p>
              </div>
              <p className="text-base font-semibold text-text-main">
                From {formatCurrency(pricePerUnit)}/{unit}/day
              </p>
            </div>

            {/* Card 3: Supported Crops */}
            <div className="bg-surface-card border border-border-input rounded-xl p-4 flex flex-col justify-between shadow-xs">
              <div>
                <img
                  src="/plant-light.svg"
                  alt=""
                  className="w-5 h-5 mb-2 text-brand-primary"
                />
                <p className="text-xs uppercase tracking-wider text-text-muted font-medium mb-1">
                  SUPPORTED CROPS
                </p>
              </div>
              <p className="text-base font-semibold text-text-main">
                {hub.supportedCrops?.length ?? 0} crop types
              </p>
            </div>

            {/* Card 4: Operating Hours */}
            <div className="bg-surface-card border border-border-input rounded-xl p-4 flex flex-col justify-between shadow-xs">
              <div>
                <img
                  src="/Clock Circle.svg"
                  alt=""
                  className="w-5 h-5 mb-2 text-brand-primary"
                />
                <p className="text-xs uppercase tracking-wider text-text-muted font-medium mb-1">
                  OPERATING HOURS
                </p>
              </div>
              <p className="text-base font-semibold text-text-main">
                {hub.operatingHours}
              </p>
            </div>
          </div>

          {/* availability section */}
          <div className="bg-background-subtle rounded-2xl p-5 shadow-2xs space-y-4 mt-10">
            {/* Dynamic Percentage */}
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-text-main">
                  Availability
                </h3>
                <p className="text-xs text-text-muted">
                  {`${availableCapacity.toLocaleString()} ${hub?.unitType || "bags"} remaining`}
                </p>
              </div>

              <span className="text-2xl font-bold text-brand-primary">
                {percentage}%
              </span>
            </div>

            {/* Progress Bar Track & Fill */}
            <div className="w-full bg-surface-alt/30 h-3.5 rounded-full overflow-hidden">
              <div
                className="bg-brand-primary h-full rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* about this facility section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-text-main font-sans mt-10">
            <div className="lg:col-span-7 flex flex-col gap-8">
              {/* Section - About this facility */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                  About this facility
                </h2>
                <p className="text-xs leading-relaxed text-text-subtle mb-5">
                  {hub.aboutFacility}
                </p>

                {/* 2x3 Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-border-brand-secondary/40 border-brand-secondary/50 bg-surface-card rounded-xl p-3.5">
                    <p className="text-[12px] uppercase font-bold tracking-wider text-brand-primary mb-0.5">
                      STORAGE METHOD
                    </p>
                    <p className="text-xs text-text-subtle">
                      {hub.specStorageMethod}
                    </p>
                  </div>

                  <div className="border border-brand-secondary/50 bg-surface-card rounded-xl p-3.5">
                    <p className="text-[12px] uppercase font-bold tracking-wider text-brand-primary mb-0.5">
                      FACILITY SIZE
                    </p>
                    <p className="text-xs text-text-subtle">
                      {hub.specFacilitySize}
                    </p>
                  </div>

                  <div className="border border-brand-secondary/50 bg-surface-card rounded-xl p-3.5">
                    <p className="text-[12px] uppercase font-bold tracking-wider text-brand-primary mb-0.5">
                      CLIMATE CONTROL
                    </p>
                    <p className="text-xs text-text-subtle">
                      {hub.specClimateControl}
                    </p>
                  </div>

                  <div className="border border-brand-secondary/50 bg-surface-card rounded-xl p-3.5">
                    <p className="text-[12px] uppercase font-bold tracking-wider text-brand-primary mb-0.5">
                      SECURITY
                    </p>
                    <p className="text-xs text-text-subtle">
                      {hub.specSecurity}
                    </p>
                  </div>

                  <div className="border border-brand-secondary/50 bg-surface-card rounded-xl p-3.5">
                    <p className="text-[12px] uppercase font-bold tracking-wider text-brand-primary mb-0.5">
                      ACCESSIBILITY
                    </p>
                    <p className="text-xs text-text-subtle">
                      {hub.specAccessibility}
                    </p>
                  </div>

                  <div className="border border-brand-secondary/50 bg-surface-card rounded-xl p-3.5">
                    <p className="text-[12px] uppercase font-bold tracking-wider text-brand-primary mb-0.5">
                      NEAREST MAJOR MARKET
                    </p>
                    <p className="text-xs text-text-subtle">
                      {hub.specNearestMajorMarket}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Supported Crops */}
              <div>
                <h3 className="text-xl font-bold tracking-tight mb-3">
                  Supported Crops
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {hub.supportedCrops && hub.supportedCrops.length > 0 ? (
                    hub.supportedCrops.map((crop, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 bg-brand-primary text-text-light px-4 py-1.5 rounded-full text-xs font-medium capitalize"
                      >
                        <img
                          src="/flowerIcon.png"
                          alt=""
                          className="w-3.5 h-3.5"
                        />
                        {crop}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-text-muted">
                      No supported crops listed
                    </span>
                  )}
                </div>
              </div>

              {/* Section - Facility Features */}
              <div>
                <h3 className="text-xl font-bold tracking-tight mb-3">
                  Facility Features
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {hub.features && hub.features.length > 0 ? (
                    hub.features.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-surface-card border border-border-light rounded-xl p-4 flex flex-col items-start gap-2.5 shadow-2xs"
                      >
                        <img
                          src="/VerifiedCheck.svg"
                          alt="check"
                          className="w-4 h-4 text-brand-secondary shrink-0"
                        />
                        <span className="text-xs font-medium text-text-main capitalize">
                          {feature}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full p-4 border border-border-light rounded-xl bg-surface-card text-xs text-text-muted">
                      No specific features listed
                    </div>
                  )}
                </div>
              </div>

              {/* Section Pricing */}
              <div>
                <h3 className="text-xl font-bold tracking-tight mb-3">
                  Pricing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Standard Rates Table */}
                  <div className="bg-surface-card border border-border-light rounded-2xl p-4 shadow-2xs">
                    <h4 className="text-sm font-semibold text-text-main mb-3">
                      Standard rates
                    </h4>
                    <div className="space-y-2.5 text-xs text-text-subtle">
                      <div className="flex justify-between items-center pb-2 border-b border-border-light">
                        <span>Per bag/Day (50kg)</span>
                        <span className="font-semibold text-text-main">
                          {formatCurrency(hub.pricePerBagPerDay)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border-light">
                        <span>Per crate/Day (50kg)</span>
                        <span className="font-semibold text-text-main">
                          {formatCurrency(hub.pricePerCratePerDay)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-border-light pb-2">
                        <div className="flex flex-col">
                          <span>100+ Units</span>
                          <span className="text-xs text-brand-primary font-medium">
                            5% OFF applied automatically
                          </span>
                        </div>

                        <span className="font-semibold text-text-main">
                          {formatCurrency(hub.priceBulk100Units)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Weekly</span>
                        <span className="font-semibold text-text-main">
                          {formatCurrency(hub.priceWeeklyFlat)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div className="bg-brand-primary text-text-light rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-brand-secondary mb-3">
                        What's included
                      </h4>
                      <ul className="space-y-2 text-[11px] text-text-light/90">
                        {hub.whatsIncluded && hub.whatsIncluded.length > 0 ? (
                          hub.whatsIncluded.map((included, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <img
                                src="/check-left.svg"
                                alt=""
                                className="w-3.5 h-3.5 shrink-0 mt-0.5"
                              />
                              <span>{included}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-text-muted">
                            Nothing included specified
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* section for map location for each storage hub */}
              <StorageDetailsMap />
            </div>

            {/* RIGHT COLUMN: Booking Card */}
            <div className="lg:col-span-5">
              <div className="bg-surface-card border border-border-light rounded-3xl p-5 shadow-xs flex flex-col gap-4">
                {/* Dynamic Price Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-text-subtle">From</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-text-main">
                        ₦{pricePerUnit.toLocaleString()}
                      </span>
                      <span className="text-xs text-text-subtle">
                        /{unit}/day
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Form Inputs */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <div className="space-y-3">
                    {/* Drop-off Date */}
                    <div>
                      <label className="block text-[11px] font-medium text-text-subtle mb-1">
                        Drop-off date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          min={minDropDate}
                          {...register("dropDate")}
                          className={`w-full bg-background border ${
                            errors.dropDate
                              ? "border-semantic-error"
                              : "border-border-input"
                          } rounded-2xl px-1 py-2 text-xs text-text-main focus:outline-none`}
                        />
                      </div>
                      {errors.dropDate && (
                        <span className="text-[10px] text-semantic-error mt-1 block">
                          {errors.dropDate.message}
                        </span>
                      )}
                    </div>

                    {/* Pick-up Date */}
                    <div>
                      <label className="block text-[11px] font-medium text-text-subtle mb-1">
                        Pick-up date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          {...register("pickupDate")}
                          className={`w-full bg-background border ${
                            errors.pickupDate
                              ? "border-semantic-error"
                              : "border-border-input"
                          } rounded-2xl px-1 py-2 text-xs text-text-main focus:outline-none`}
                        />
                      </div>
                      {errors.pickupDate && (
                        <span className="text-[10px] text-semantic-error mt-1 block">
                          {errors.pickupDate.message}
                        </span>
                      )}
                    </div>

                    {/* 3. Crop type & Est. Quantity */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-text-subtle mb-1">
                          Crop type
                        </label>
                        <select
                          {...register("selectedCrop")}
                          className={`w-full bg-background border ${
                            errors.selectedCrop
                              ? "border-semantic-error"
                              : "border-border-input"
                          } rounded-2xl py-2 px-1 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer`}
                        >
                          {/* Placeholder option */}
                          <option value="" disabled>
                            Select Crop
                          </option>

                          {hub?.supportedCrops &&
                          hub.supportedCrops.length > 0 ? (
                            hub.supportedCrops.map((crop) => (
                              <option key={crop} value={crop}>
                                {crop}
                              </option>
                            ))
                          ) : (
                            <option disabled value="">
                              No crops available
                            </option>
                          )}
                        </select>
                        {errors.selectedCrop && (
                          <span className="text-[10px] text-semantic-error mt-1 block">
                            {errors.selectedCrop.message}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-text-subtle mb-1">
                          Est. Quantity ({unitLabel})
                        </label>
                        <input
                          type="number"
                          {...register("quantity")}
                          className={`w-full bg-background border ${
                            errors.quantity
                              ? "border-semantic-error"
                              : "border-border-input"
                          } rounded-2xl px-1 py-2 text-xs text-text-main focus:outline-none`}
                        />
                        {errors.quantity && (
                          <span className="text-[10px] text-semantic-error mt-1 block">
                            {errors.quantity.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 4. Phone Number */}
                    <div>
                      <label className="block text-[11px] font-medium text-text-subtle mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+234 700 000 000"
                        {...register("phoneNumber")}
                        className={`w-full bg-background border ${
                          errors.phoneNumber
                            ? "border-semantic-error"
                            : "border-border-input"
                        } rounded-2xl px-1 py-2 text-xs text-text-main focus:outline-none placeholder:text-text-muted`}
                      />
                      {errors.phoneNumber && (
                        <span className="text-[10px] text-semantic-error mt-1 block">
                          {errors.phoneNumber.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Calculations Breakdown */}
                  <div className="pt-2 border-t border-border-light space-y-2 text-xs text-text-subtle">
                    <div className="flex justify-between items-center">
                      <span>
                        ₦{pricePerUnit.toLocaleString()} x {watchedQuantity}{" "}
                        {itemUnitLabel} x {watchedDurationDays}{" "}
                        {durationUnitLabel}
                        {isBulkDiscountApplied && (
                          <span className="ml-1.5 text-[10px] bg-brand-secondary/20 text-brand-primary px-1.5 py-0.5 rounded font-medium">
                            Bulk Rate
                          </span>
                        )}
                      </span>
                      <span className="font-semibold text-text-main">
                        ₦{subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span className="font-semibold text-text-main">
                        ₦{serviceFee.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between font-bold text-text-main">
                      <span>Deposit (30%)</span>
                      <span>₦{deposit.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full cursor-pointer mt-1"
                  >
                    <span className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-full bg-brand-secondary"></span>
                    <span className="relative z-10 flex h-11 w-full items-center justify-center rounded-full bg-brand-primary text-text-light font-semibold text-sm">
                      Book Storage
                    </span>
                  </motion.button>
                </form>

                <p className="text-[11px] text-center text-text-muted">
                  Balance will be charged when produce arrives.
                </p>

                {/* Talk to Support Row */}
                <div className="border border-border-light rounded-2xl p-3 flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <img
                      src="/icons/headset.svg"
                      alt=""
                      className="w-4 h-4 text-text-subtle"
                    />
                    <span className="text-xs font-medium text-text-main">
                      Talk to support
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-semibold text-brand-primary hover:underline"
                  >
                    Call now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <StorageReviews />
        <section className="mt-12 pb-10">
          <SimilarFacilities facilities={hub.similarFacilities} />
          <section className="mt-12 rounded-2xl bg-brand-primary px-6 py-5 text-center sm:px-10 sm:py-6">
            <h2 className="text-xl font-medium text-text-light sm:text-4xl">
              Ready to secure your harvest?
            </h2>

            <p className="mx-auto mt-1 max-w-2xl text-xs leading-relaxed text-text-light/80 sm:text-xs">
              Reserve your storage space today and protect your produce before
              harvest. Book in minutes, pay a small deposit, and stock with
              confidence.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                className="relative inline-flex cursor-pointer"
                onClick={() => navigate("/storage")}
              >
                <span className="absolute inset-0 translate-x-[2px] translate-y-[2px] rounded-[15px] bg-brand-secondary" />
                <span className="relative z-10 flex h-10 items-center justify-center rounded-[15px] border border-brand-secondary bg-brand-primary px-4 text-xs font-medium text-text-light sm:px-5">
                  Book storage now
                </span>
              </button>
              <button
                type="button"
                className="relative inline-flex cursor-pointer"
                onClick={() => navigate("/contact")}
              >
                <span className="absolute inset-0 translate-x-[2px] translate-y-[2px] rounded-[15px] bg-brand-secondary" />
                <span className="relative z-10 flex h-10 items-center justify-center rounded-[15px] bg-white px-4 text-xs font-medium text-text-main sm:px-5">
                  Talk to an advisor
                </span>
              </button>
            </div>
          </section>
        </section>
      </main>
    </section>
  );
}
