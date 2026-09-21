import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import AdminStepper from "@/components/AdminStepper";
import {
  getHubLocationsApi,
  getHubsByLocationApi,
  createAdminBookingApi,
  type CreateAdminBookingPayload,
  type CreatedAdminBooking,
  type CreatedByAdmin,
} from "@/api/admin";
import { adminBookingSchema, type AdminBookingInputs } from "@/lib/SchemaTypes";
import { getInitialDates, calculateDurationDays } from "@/lib/bookingHelpers";
import {
  formatCurrency,
  formatBookingDate,
  formatDateTime,
  formatDuration,
  formatQuantity,
} from "@/lib/constant";
import { showToast } from "@/utils/CustomToast";

interface AdminNewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminNewBookingModal({
  isOpen,
  onClose,
}: AdminNewBookingModalProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(0);
  const [createdBooking, setCreatedBooking] =
    useState<CreatedAdminBooking | null>(null);
  const [createdBy, setCreatedBy] = useState<CreatedByAdmin | undefined>();

  const { todayStr, tomorrowStr } = getInitialDates();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<AdminBookingInputs>({
    resolver: zodResolver(adminBookingSchema) as Resolver<AdminBookingInputs>,
    defaultValues: {
      state: "",
      lga: "",
      hub: "",
      cropType: "",
      quantity: 1,
      dropOffDate: todayStr,
      pickUpDate: tomorrowStr,
      fullName: "",
      phoneNumber: "",
      email: "",
      specialInstructions: "",
      paymentType: "deposit",
    },
  });

  const [
    watchedState,
    watchedLga,
    watchedHub,
    watchedCropType,
    watchedQuantity,
    watchedDropOffDate,
    watchedPickUpDate,
    watchedPaymentType,
  ] = watch([
    "state",
    "lga",
    "hub",
    "cropType",
    "quantity",
    "dropOffDate",
    "pickUpDate",
    "paymentType",
  ]);

  // Locations dropdown
  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ["hubLocations"],
    queryFn: getHubLocationsApi,
    enabled: isOpen,
  });

  const locations = locationsData?.data?.data?.locations ?? [];

  // Hubs for the selected location
  const { data: hubsData, isLoading: isLoadingHubs } = useQuery({
    queryKey: ["hubsByLocation", watchedState, watchedLga],
    queryFn: () => getHubsByLocationApi(watchedState, watchedLga),
    enabled: !!watchedState && !!watchedLga,
  });

  const hubs = hubsData?.data?.data?.hubs ?? [];
  const selectedHub = hubs.find((hub) => hub._id === watchedHub);

  // Reset dependent fields when their parent selection changes
  useEffect(() => {
    setValue("hub", "");
    setValue("cropType", "");
  }, [watchedState, watchedLga, setValue]);

  useEffect(() => {
    setValue("cropType", "");
  }, [watchedHub, setValue]);

  const durationInDays = useMemo(
    () => calculateDurationDays(watchedDropOffDate, watchedPickUpDate),
    [watchedDropOffDate, watchedPickUpDate],
  );

  const quantityNumber = Number(watchedQuantity) || 0;

  const dailyPricePerUnit = selectedHub
    ? selectedHub.unitType === "bags"
      ? selectedHub.pricePerBagPerDay
      : selectedHub.pricePerCratePerDay
    : 0;

  const storageFee = dailyPricePerUnit * quantityNumber * durationInDays;
  const serviceFee = 5000;
  const totalAmount = storageFee + serviceFee;
  const depositAmount = Math.round(totalAmount * 0.3);
  const balanceAmount = totalAmount - depositAmount;

  const capacityPercentage =
    selectedHub && selectedHub.totalCapacity > 0
      ? Math.round(
          (selectedHub.availableCapacity / selectedHub.totalCapacity) * 100,
        )
      : 0;

  const createBookingMutation = useMutation({
    mutationFn: (payload: CreateAdminBookingPayload) =>
      createAdminBookingApi(payload),
    onSuccess: (response) => {
      setCreatedBooking(response.data.data.booking);
      setCreatedBy(response.data.data.createdBy);
      queryClient.invalidateQueries({ queryKey: ["getAdminBookings"] });
      setCurrentStep(2);
      showToast.success("Booking created successfully!");
    },
    onError: (error: unknown) => {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      showToast.error(message || "Failed to create booking");
    },
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentStep(0);
    setCreatedBooking(null);
    setCreatedBy(undefined);
    reset();
    onClose();
  };

  const handleStartNewBooking = () => {
    setCreatedBooking(null);
    setCreatedBy(undefined);
    reset();
    setCurrentStep(0);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (!value) {
      setValue("state", "");
      setValue("lga", "");
      return;
    }

    const [state, lga] = value.split("||");
    setValue("state", state, { shouldValidate: true });
    setValue("lga", lga, { shouldValidate: true });
  };

  const handleContinueToReview = async () => {
    const isValid = await trigger([
      "state",
      "lga",
      "hub",
      "cropType",
      "quantity",
      "dropOffDate",
      "pickUpDate",
      "fullName",
      "phoneNumber",
      "email",
    ]);

    if (!isValid) return;

    if (selectedHub && quantityNumber > selectedHub.availableCapacity) {
      showToast.error(
        `Only ${selectedHub.availableCapacity} ${selectedHub.unitType} available at this hub`,
      );
      return;
    }

    setCurrentStep(1);
  };

  const onSubmit = (data: AdminBookingInputs) => {
    if (!selectedHub) return;

    createBookingMutation.mutate({
      hubId: data.hub,
      selectedCrop: data.cropType,
      quantity: data.quantity,
      unitType: selectedHub.unitType,
      dropOffDate: data.dropOffDate,
      pickUpDate: data.pickUpDate,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email || undefined,
      specialInstructions: data.specialInstructions || undefined,
      paymentType: data.paymentType,
    });
  };

  const selectedLocationValue =
    watchedState && watchedLga ? `${watchedState}||${watchedLga}` : "";

  const isConfirmation = currentStep === 2;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center bg-black/50 backdrop-blur-xs p-2 overflow-y-auto ${
        isConfirmation ? "justify-center" : "justify-end"
      }`}
    >
      <div
        className={`bg-surface-card rounded-xl w-full border border-card-border shadow-xl relative max-h-full overflow-y-auto ${
          isConfirmation ? "max-w-lg p-4 sm:p-6" : "max-w-lg p-4"
        }`}
      >
        {/* Close Button + Header — hidden on the confirmation step */}
        {!isConfirmation && (
          <>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1 rounded-md text-text-muted hover:text-text-main hover:bg-background-subtle transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <img
                src="/Close.svg"
                alt="Close"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </button>

            <div className="space-y-1 pr-8">
              <h1 className="text-lg md:text-xl font-semibold text-text-main tracking-tight leading-snug">
                New Booking
              </h1>
              <p className="text-base text-text-subtle leading-relaxed">
                Make a reservation on behalf of the customer
              </p>
            </div>
          </>
        )}

        <AdminStepper
          steps={["Booking Details", "Review", "Confirmation"]}
          currentStep={currentStep}
        />

        {/* Modal Body - Dynamic Step Content */}
        <section className={isConfirmation ? "mt-5" : "mt-6 space-y-5"}>
          {/*  Booking Details  */}
          {currentStep === 0 && (
            <div className="space-y-5">
              {/* Storage details */}
              <div className="border border-border-input rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-1 font-medium text-sm">
                  <img src="/garageTwo.svg" alt="" className="w-5 h-5" />
                  <span className="text-table-header">Storage details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Location Select */}
                  <div>
                    <label className="block text-xs text-text-main mb-1">
                      Location*
                    </label>
                    <div className="relative">
                      <select
                        value={selectedLocationValue}
                        onChange={handleLocationChange}
                        className="w-full appearance-none bg-surface-card border border-border-input rounded-lg pl-3 pr-8 py-2 text-sm text-text-main focus:outline-none focus:border-brand-primary truncate"
                      >
                        <option value="">
                          {isLoadingLocations
                            ? "Loading locations..."
                            : "Select location"}
                        </option>
                        {locations.map((loc) => (
                          <option
                            key={`${loc.state}-${loc.lga}`}
                            value={`${loc.state}||${loc.lga}`}
                          >
                            {loc.lga}, {loc.state}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.state && (
                      <span className="text-[10px] text-semantic-error mt-1 block">
                        {errors.state.message}
                      </span>
                    )}
                  </div>

                  {/* Storage Hub Select */}
                  <div>
                    <label className="block text-xs text-text-main mb-1">
                      Storage hub*
                    </label>
                    <div className="relative">
                      <select
                        {...register("hub")}
                        disabled={!watchedState || !watchedLga}
                        className="w-full appearance-none bg-surface-card border border-border-input rounded-lg pl-3 pr-8 py-2 text-sm text-text-main focus:outline-none focus:border-brand-primary truncate disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {!watchedState || !watchedLga
                            ? "Select a location first"
                            : isLoadingHubs
                              ? "Loading hubs..."
                              : "Select storage hub"}
                        </option>
                        {hubs.map((hub) => (
                          <option key={hub._id} value={hub._id}>
                            {hub.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.hub && (
                      <span className="text-[10px] text-semantic-error mt-1 block">
                        {errors.hub.message}
                      </span>
                    )}
                  </div>

                  {/* Storage Type — read-only, determined by the hub */}
                  <div>
                    <label className="block text-xs text-text-main mb-1">
                      Storage type
                    </label>
                    <div className="w-full bg-background-subtle border border-border-input rounded-lg px-3 py-2 text-sm text-text-subtle truncate">
                      {selectedHub?.storageType || "—"}
                    </div>
                  </div>
                </div>

                <div className="inline-flex w-full items-center px-3 py-2 font-normal text-xs bg-brand-primary/15 text-brand-primary rounded-xl gap-2">
                  <span>
                    <img
                      src="/prime_sort.svg"
                      alt="price_icon"
                      className="w-4 h-4"
                    />
                  </span>{" "}
                  {selectedHub
                    ? `Available capacity: ${selectedHub.availableCapacity.toLocaleString()} ${selectedHub.unitType} (${capacityPercentage}%)`
                    : "Select a storage hub to see available capacity"}
                </div>
              </div>

              {/* Storage schedule */}
              <div className="border border-border-input rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-1 text-table-header font-medium text-sm">
                  <span>
                    <img
                      src="/Calendar.svg"
                      alt="calender-icon"
                      className="w-5 h-5"
                    />
                  </span>{" "}
                  Storage schedule
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-main mb-1">
                      Drop-off date*
                    </label>
                    <input
                      type="date"
                      {...register("dropOffDate")}
                      className="w-full bg-surface-card border border-border-input rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-brand-primary"
                    />
                    {errors.dropOffDate && (
                      <span className="text-[10px] text-semantic-error mt-1 block">
                        {errors.dropOffDate.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-text-main mb-1">
                      Pick-up date*
                    </label>
                    <input
                      type="date"
                      {...register("pickUpDate")}
                      className="w-full bg-surface-card border border-border-input rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-brand-primary"
                    />
                    {errors.pickUpDate && (
                      <span className="text-[10px] text-semantic-error mt-1 block">
                        {errors.pickUpDate.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Produce information */}
              <div className="border border-border-input rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-1 text-table-header font-medium text-sm">
                  <span>
                    <img
                      src="/plant-light.svg"
                      alt="plant-icon"
                      className="w-5 h-5"
                    />
                  </span>{" "}
                  Produce information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Crop Type Select */}
                  <div className="sm:col-span-1">
                    <label className="block text-xs text-text-main mb-1">
                      Crop type*
                    </label>
                    <div className="relative">
                      <select
                        {...register("cropType")}
                        disabled={!selectedHub}
                        className="w-full appearance-none bg-surface-card border border-border-input rounded-lg pl-3 pr-8 py-2 text-sm text-text-main focus:outline-none focus:border-brand-primary truncate disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {!selectedHub
                            ? "Select a hub first"
                            : "Select crop type"}
                        </option>
                        {selectedHub?.supportedCrops.map((crop) => (
                          <option key={crop} value={crop}>
                            {crop}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.cropType && (
                      <span className="text-[10px] text-semantic-error mt-1 block">
                        {errors.cropType.message}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-2 grid grid-cols-2 gap-2">
                    {/* Estimated Quantity Input */}
                    <div>
                      <label className="block text-xs text-text-main mb-1">
                        Estimated quantity*
                      </label>
                      <input
                        type="number"
                        min={1}
                        placeholder="e.g. 120"
                        {...register("quantity")}
                        className="w-full bg-surface-card border border-border-input rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-brand-primary"
                      />
                      {errors.quantity && (
                        <span className="text-[10px] text-semantic-error mt-1 block">
                          {errors.quantity.message}
                        </span>
                      )}
                    </div>

                    {/* Unit — read-only, determined by the hub */}
                    <div>
                      <label className="block text-xs text-text-subtle mb-1">
                        &nbsp;
                      </label>
                      <div className="w-full bg-background-subtle border border-border-input rounded-lg px-3 py-2 text-sm text-text-subtle truncate capitalize">
                        {selectedHub?.unitType
                          ? quantityNumber === 1
                            ? selectedHub.unitType.replace(/s$/, "")
                            : selectedHub.unitType
                          : "Unit"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Farmer information */}
              <div className="border border-border-input rounded-xl p-4 space-y-3">
                <div className="flex flex-col items-start gap-2 mb-3">
                  <div className="flex items-center gap-1 text-table-header font-medium text-sm">
                    <span>
                      <img
                        src="/User.svg"
                        alt="user-icon"
                        className="w-5 h-5"
                      />
                    </span>{" "}
                    Farmer information
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-main mb-1">
                      Full name*
                    </label>
                    <input
                      type="text"
                      placeholder="Adewale Anuoluwapo"
                      {...register("fullName")}
                      className="w-full bg-surface-card border border-border-input rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-brand-primary"
                    />
                    {errors.fullName && (
                      <span className="text-[10px] text-semantic-error mt-1 block">
                        {errors.fullName.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-text-main mb-1">
                      Phone number*
                    </label>
                    <input
                      type="tel"
                      placeholder="+234 803 456 7899"
                      {...register("phoneNumber")}
                      className="w-full bg-surface-card border border-border-input rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-brand-primary"
                    />
                    {errors.phoneNumber && (
                      <span className="text-[10px] text-semantic-error mt-1 block">
                        {errors.phoneNumber.message}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-text-main mb-1">
                    Email address (optional)
                  </label>
                  <input
                    type="email"
                    placeholder="adewale.a@mail.com"
                    {...register("email")}
                    className="w-full bg-surface-card border border-border-input rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-brand-primary"
                  />
                  {errors.email && (
                    <span className="text-[10px] text-semantic-error mt-1 block">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-text-main mb-1">
                    Additional notes (optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="I'll arrive around 10 AM, I need truck access."
                    {...register("specialInstructions")}
                    className="w-full bg-surface-card border border-border-input rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-brand-primary resize-none"
                  />
                </div>
              </div>

              {/* Payment Status */}
              <div className="border border-border-input rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-table-header font-medium text-sm">
                  <span>
                    <img src="/Card.svg" alt="card" className="h-5 w-5" />
                  </span>{" "}
                  Payment Status
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="deposit"
                      {...register("paymentType")}
                      className="accent-brand-primary"
                    />
                    <span className="text-text-main font-medium">
                      Initial deposit (30%)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="full"
                      {...register("paymentType")}
                      className="accent-brand-primary"
                    />
                    <span className="text-text-muted">Full Payment</span>
                  </label>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-lg border border-border-input text-text-main text-sm font-medium hover:bg-background-subtle transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleContinueToReview}
                  className="px-5 py-2.5 rounded-lg bg-brand-primary text-text-light text-sm font-medium hover:bg-opacity-90 transition-colors cursor-pointer"
                >
                  Continue to review
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: REVIEW */}
          {currentStep === 1 && (
            <div className="space-y-5">
              {/* Storage info card preview */}
              <div className="border border-border-input rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-1.5 font-medium text-sm text-table-header">
                  <img src="/garageTwo.svg" alt="" className="w-5 h-5" />
                  <span>Storage details</span>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-25 h-25 bg-background-subtle rounded-xl overflow-hidden shrink-0">
                    <img
                      src={selectedHub?.images?.[0]}
                      alt={selectedHub?.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  <div className="space-y-1 text-xs sm:text-sm">
                    <h3 className="font-semibold text-text-main">
                      {selectedHub?.name}
                    </h3>
                    <p className="text-text-subtle flex items-center gap-1.5">
                      <span className="text-text-muted">
                        <img src="/Map Point.svg" alt="" className="w-4 h-4" />
                      </span>{" "}
                      {selectedHub?.lga}, {selectedHub?.state}
                    </p>

                    <p className="text-text-subtle flex items-center gap-1.5">
                      <span className="text-text-muted">
                        <img src="/Plain.svg" alt="" className="w-4 h-4" />
                      </span>{" "}
                      {selectedHub?.proximityText}
                    </p>
                    <p className="text-text-subtle flex items-center gap-1.5">
                      <span className="text-text-muted">
                        <img
                          src="/Clock Circle.svg"
                          alt=""
                          className="w-4 h-4"
                        />
                      </span>{" "}
                      {selectedHub?.operatingHours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Storage reservation details summary */}
              <div className="border border-border-input rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 text-table-header font-medium text-sm">
                  <span>
                    <img src="/Calendar.svg" alt="" className="w-5 h-5" />
                  </span>{" "}
                  Storage reservation details
                </div>

                <div className="grid grid-cols-3 gap-y-4 gap-x-2 text-xs">
                  <div>
                    <span className="text-text-muted block mb-0.5">
                      Drop-off Date
                    </span>
                    <span className="font-medium text-text-main">
                      {formatBookingDate(watchedDropOffDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block mb-0.5">
                      Storage Duration
                    </span>
                    <span className="font-medium text-text-main">
                      {formatDuration(durationInDays)}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block mb-0.5">
                      Pick-up Date
                    </span>
                    <span className="font-medium text-text-main">
                      {formatBookingDate(watchedPickUpDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block mb-0.5">
                      Crop Type
                    </span>
                    <span className="font-medium text-text-main">
                      {watchedCropType}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block mb-0.5">
                      Quantity Reserved
                    </span>
                    <span className="font-medium text-text-main">
                      {formatQuantity(quantityNumber, selectedHub?.unitType)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Farmer information view */}
              <div className="border border-border-input rounded-xl p-4 space-y-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-table-header font-medium text-sm">
                  <img src="/User.svg" alt="" className="w-5 h-5" />
                  <span>Farmer information</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Name</span>
                    <span className="font-medium text-text-muted text-right">
                      {watch("fullName")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Phone Number</span>
                    <span className="font-medium text-text-muted text-right">
                      {watch("phoneNumber")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Email address</span>
                    <span className="font-medium text-text-muted text-right">
                      {watch("email") || "Not provided"}
                    </span>
                  </div>
                </div>

                {watch("specialInstructions") && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-text-muted block text-xs">
                      Additional notes
                    </span>
                    <div className="border border-border-input rounded-xl p-2 text-xs sm:text-sm text-text-muted bg-surface-card">
                      {watch("specialInstructions")}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment summary */}
              <div className="border border-border-input rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-table-header font-medium text-sm mb-2">
                  <span>
                    <img src="/Card.svg" alt="card" className="w-5 h-5" />
                  </span>{" "}
                  Payment summary
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-muted">Storage fee</span>
                  <span className="font-medium text-text-muted">
                    {formatCurrency(storageFee)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-light pb-2">
                  <span className="text-text-muted">Service fee</span>
                  <span className="font-medium text-text-muted">
                    {formatCurrency(serviceFee)}
                  </span>
                </div>
                <div className="flex justify-between py-1 font-semibold text-sm">
                  <span className="text-text-main">Estimated total</span>
                  <span className="text-text-main">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                {watchedPaymentType === "deposit" ? (
                  <div className="bg-brand-primary text-text-light p-3 rounded-lg flex items-center justify-between font-medium mt-2">
                    <span>Deposit (30%)</span>
                    <span>{formatCurrency(depositAmount)}</span>
                  </div>
                ) : (
                  <div className="bg-brand-primary text-text-light p-3 rounded-lg flex items-center justify-between font-medium mt-2">
                    <span>Full payment</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                )}

                <p className="text-[11px] text-text-muted pt-1">
                  {watchedPaymentType === "deposit"
                    ? `Balance (${formatCurrency(balanceAmount)}) will be charged when produce arrives.`
                    : "Paid in full — no balance due on arrival."}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="px-5 py-2.5 rounded-lg border border-border-input text-text-main text-sm font-medium hover:bg-background-subtle transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={createBookingMutation.isPending}
                  className="px-5 py-2.5 rounded-lg bg-brand-primary text-text-light text-sm font-medium hover:bg-opacity-90 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {createBookingMutation.isPending
                    ? "Creating booking..."
                    : "Create booking"}
                </button>
              </div>
            </div>
          )}

          {/*  STEP 2: CONFIRMATION  */}
          {currentStep === 2 && createdBooking && (
            <div className="space-y-5">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14">
                  <img src="/noto.svg" alt="" className="w-full h-full" />
                </div>
                <h2 className="text-lg font-bold text-text-main">
                  Booking Confirmed!
                </h2>
                <p className="text-xs text-text-subtle leading-relaxed">
                  This booking has been created on behalf of{" "}
                  {createdBooking.fullName} and booking details has been sent to{" "}
                  {createdBooking.email || "the provided contact"}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs border-t border-border-light py-3">
                <span className="text-text-subtle">
                  <span className="font-medium text-text-main">
                    Created by:
                  </span>{" "}
                  {createdBy?.fullName}{" "}
                  <span className="text-xs text-text-subtle">
                    ({createdBy?.role})
                  </span>
                </span>
                <span className="text-text-main shrink-0">
                  {formatDateTime(createdBooking.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    handleClose();
                    navigate(`/admin/bookings/details/${createdBooking._id}`);
                  }}
                  className="px-5 py-2.5 rounded-lg border border-border-input text-text-main text-sm font-medium hover:bg-background-subtle transition-colors cursor-pointer"
                >
                  View booking
                </button>
                <button
                  onClick={handleStartNewBooking}
                  className="btn bg-brand-primary hover:bg-brand-primary/90 text-text-light border-none px-5 py-2.5 rounded-lg text-sm font-medium shadow-none transition-all"
                >
                  Add a new booking
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
