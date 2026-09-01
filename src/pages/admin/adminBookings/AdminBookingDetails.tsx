import { Clock, XCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import AdminBookingViewProfileModal from "./bookingComponents/AdminBookingViewProfileModal";
import AdminBookingCancelModal from "./bookingComponents/AdminBookingCancelModal";

export default function AdminBookingDetails() {
  const navigate = useNavigate();
  const [isViewProfileModalOpen, setIsViewProfileModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const data = {
    id: "AGK-004582",
    farmerName: "Adewale Anuoluwapo",
    farmerPhone: "+234 803 456 7899",
    farmerEmail: "adewale.a@mail.com",
    storageHub: "Ibadan Central Hermetic Hub",
    location: "Ibadan, Oyo",
    cropType: "Maize",
    quantity: "120 Bags",
    dropOffDate: "24 Aug. 2026",
    duration: "8 Weeks",
    bookingAmount: "₦761,400",
    status: "Confirmed",
    dailyPrice: "₦450/Bag",
    storageFee: "₦3,024,000",
    serviceFee: "₦5,000",
    estimatedTotal: "₦3,029,000",
    depositAmount: "₦908,700",
    paymentMethod: "Debit Card",
    paymentReference: "PAY-004582",
    paymentDate: "17 Aug. 2025 · 09:48 AM",
    timeline: [
      { title: "Booking created", date: "17 Aug. 2025 · 09:42 AM" },
      {
        title: "30% Deposit - ₦226,800 received via Paystack",
        date: "17 Aug. 2025 · 09:48 AM",
      },
      { title: "Booking Confirmed", date: "17 Aug. 2025 · 09:49 AM" },
    ],
  };

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
              Booking Details - {data.id}
            </h1>
            <p className="text-sm text-text-subtle mt-1">
              {data.farmerName} &bull; {data.storageHub}
            </p>
          </div>

          {/* Action Badges / Buttons */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-brand-primary/25 text-brand-primary">
              {data.status}
            </span>
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-semantic-error text-text-light hover:opacity-90 transition-opacity cursor-pointer"
            >
              <XCircle className="w-4 h-4 mr-1.5" />
              Cancel Booking
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Spans 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reservation Summary Card */}
            <div className="bg-surface-card rounded-2xl p-5 sm:p-6 shadow-xs border border-card-border w-full">
              {/* Header Section */}
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

              {/* Grid Section with Original HR lines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 pt-2">
                {/* Storage Hub */}
                <div className="space-y-1 pb-4">
                  <div className="flex items-center text-xs text-text-muted gap-1.5">
                    <img
                      src="/adminGarage.svg"
                      alt=""
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    Storage Hub
                  </div>
                  <p className="text-sm font-semibold text-text-main pb-3 break-words">
                    {data.storageHub}
                  </p>
                  <hr className="text-border-light" />
                </div>

                {/* Location */}
                <div className="space-y-1 pb-4">
                  <div className="flex items-center text-xs text-text-muted gap-1.5">
                    <img
                      src="/adminMapPoint.svg"
                      alt=""
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    Location
                  </div>
                  <p className="text-sm font-semibold text-text-main pb-3 break-words">
                    {data.location}
                  </p>
                  <hr className="text-border-light" />
                </div>

                {/* Crop and Quantity */}
                <div className="space-y-1 pb-4">
                  <div className="flex items-center text-xs text-text-muted gap-1.5">
                    <img
                      src="/adminPlant.svg"
                      alt=""
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    Crop and Quantity
                  </div>
                  <p className="text-sm font-semibold text-text-main pb-3 break-words">
                    {data.cropType} &bull; {data.quantity}
                  </p>
                  <hr className="text-border-light" />
                </div>

                {/* Drop-off Date */}
                <div className="space-y-1 pb-4">
                  <div className="flex items-center text-xs text-text-muted gap-1.5">
                    <img
                      src="/adminCalTwo.svg"
                      alt=""
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    Drop-off Date
                  </div>
                  <p className="text-sm font-semibold text-text-main pb-3 break-words">
                    {data.dropOffDate}
                  </p>
                  <hr className="text-border-light" />
                </div>

                {/* Storage Duration */}
                <div className="space-y-1 pb-4">
                  <div className="flex items-center text-xs text-text-muted gap-1.5">
                    <img
                      src="/adminClock.svg"
                      alt=""
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    Storage Duration
                  </div>
                  <p className="text-sm font-semibold text-text-main pb-3 break-words">
                    {data.duration}
                  </p>
                  <hr className="text-border-light" />
                </div>

                {/* Booking Amount */}
                <div className="space-y-1 pb-4">
                  <div className="flex items-center text-xs text-text-muted gap-1.5">
                    <img
                      src="/adminCard.svg"
                      alt=""
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    Booking Amount
                  </div>
                  <p className="text-sm font-semibold text-text-main pb-3 break-words">
                    {data.bookingAmount}
                  </p>
                  <hr className="text-border-light" />
                </div>
              </div>
            </div>

            {/* Farmer Information Card */}
            <div className="bg-surface-card rounded-2xl p-5 sm:p-6 shadow-xs border border-card-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-main">Farmer</h2>
                <img src="/adminProfile.svg" alt="" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-background-subtle flex items-center justify-center text-brand-primary font-bold text-base">
                    A.A
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-text-main">
                      {data.farmerName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-text-subtle">
                      <span className="inline-flex items-center gap-1">
                        <img src="/adminPhone.svg" alt="" className="w-4 h-4" />
                        {data.farmerPhone}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <img src="/adminMail.svg" alt="" className="w-4 h-4" />
                        {data.farmerEmail}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsViewProfileModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-brand-primary text-text-light hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-border-input text-text-main hover:bg-backgroundTwo transition-colors cursor-pointer"
                  >
                    Contact Farmer
                  </button>
                </div>
              </div>
            </div>

            {/* Booking Timeline Card */}
            <div className="bg-surface-card rounded-2xl p-5 sm:p-6 shadow-xs border border-card-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-text-main">
                  Booking Timeline
                </h2>
                <Clock className="w-5 h-5 text-text-muted" />
              </div>

              <div className="space-y-6 relative pl-2">
                <div className="absolute left-[20px] top-3 bottom-3 w-0.5 bg-border-light -z-0" />

                {data.timeline.map((item, index) => (
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
                      <p className="text-xs text-text-muted">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar Widgets) */}
          <div className="space-y-6">
            {/* Price Breakdown Card */}
            <div className="bg-surface-card rounded-2xl p-5 sm:p-6 shadow-xs border border-card-border space-y-4">
              <h2 className="text-lg font-semibold text-text-main border-b border-border-light pb-3">
                Price Breakdown
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-text-subtle">
                  <span>Crop type</span>
                  <span className="font-semibold text-text-main">
                    {data.cropType}
                  </span>
                </div>
                <div className="flex justify-between text-text-subtle">
                  <span>Daily price</span>
                  <span className="font-semibold text-text-main">
                    {data.dailyPrice}
                  </span>
                </div>
                <div className="flex justify-between text-text-subtle">
                  <span>Duration</span>
                  <span className="font-semibold text-text-main">
                    {data.duration}
                  </span>
                </div>
                <div className="flex justify-between text-text-subtle pb-2 border-b border-border-light">
                  <span>Quantity</span>
                  <span className="font-semibold text-text-main">
                    {data.quantity}
                  </span>
                </div>

                <div className="flex justify-between text-text-subtle pt-1">
                  <span>Storage fee</span>
                  <span className="font-normal text-text-main">
                    {data.storageFee}
                  </span>
                </div>
                <div className="flex justify-between text-text-subtle  border-border-light">
                  <span>Service fee</span>
                  <span className="font-normal text-text-main">
                    {data.serviceFee}
                  </span>
                </div>

                <div className="flex justify-between text-base font-medium text-text-main pt-1">
                  <span>Estimated total</span>
                  <span>{data.estimatedTotal}</span>
                </div>
              </div>

              {/* Deposit Action CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  className="w-full py-3 px-2 rounded-xl font-semibold text-white bg-brand-secondary hover:bg-brand-secondary-hover transition-colors flex items-center justify-between shadow-xs cursor-pointer"
                >
                  <span>Deposit (30%)</span>
                  <span>{data.depositAmount}</span>
                </button>
                <p className="text-[11px]  text-text-muted mt-2">
                  Balance will be charged when produce arrives.
                </p>
              </div>
            </div>

            {/* Payment Info Card */}
            <div className="bg-surface-card rounded-2xl p-5 sm:p-6 shadow-xs border border-card-border space-y-4">
              <h2 className="text-lg font-semibold text-text-main border-border-light pb-3">
                Payment
              </h2>

              <div className="space-y-3 text-sm text-text-subtle">
                <div className="flex justify-between text-text-subtle">
                  <span>Method</span>
                  <span className="font-semibold">{data.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-text-subtle">
                  <span>Reference</span>
                  <span className="font-semibold">{data.paymentReference}</span>
                </div>
                <div className="flex justify-between text-text-subtle">
                  <span>Date and Time</span>
                  <span className="font-semibold  text-right">
                    {data.paymentDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      <AdminBookingViewProfileModal
        isOpen={isViewProfileModalOpen}
        onClose={() => setIsViewProfileModalOpen(false)}
      />
      <AdminBookingCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirmCancel={() => {
          // Put your cancel API call here
          alert("Booking cancelled!");
          setIsCancelModalOpen(false);
        }}
      />
    </div>
  );
}
