import { motion } from "framer-motion";
import { useMyBookings } from "@/hooks/useMyBookings";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router";

import {
  formatBookingDate,
  formatBookingStatus,
  formatPaymentStatus,
  formatDuration,
  formatQuantity,
  getBookingStatusStyles,
} from "@/lib/constant";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import { useScrollToTopOnChange } from "@/hooks/useScrollToTopOnChange";
import BookingCardSkeleton from "@/pages/admin/adminBookings/bookingComponents/BookingCardSkeleton";
import Seo from "@/components/Seo";

export default function MyBookings() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isPending, isFetching, isError } = useMyBookings(currentPage);

  const bookings = data?.data?.bookings ?? [];

  const metrics = data?.data?.metrics ?? {
    upcoming: 0,
    active: 0,
    completed: 0,
  };

  const pagination = data?.data?.pagination;

  useScrollToTopOnChange(currentPage);

  const showListSkeleton = isPending;
  const showBackgroundRefresh = isFetching && !isPending;

  return (
    <>
      <Seo title="My Bookings" noIndex />
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-8">
        {/* Header Section */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-text-main">My Bookings</h1>

          <p className="text-sm text-text-subtle">
            View and manage all your storage reservations in one place.
          </p>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10">
          {/* Upcoming */}
          <div className="bg-surface-card rounded-2xl p-5 flex items-center gap-3 shadow-sm border border-border-light/60">
            <img src="/calenderbig.svg" alt="" />

            <div>
              <p className="text-[11px] font-medium text-text-subtle">
                Upcoming
              </p>

              <p className="text-sm font-bold text-text-main">
                {metrics.upcoming}{" "}
                {metrics.upcoming === 1 ? "Booking" : "Bookings"}
              </p>
            </div>
          </div>

          {/* Active */}
          <div className="bg-surface-card rounded-2xl p-5 flex items-center gap-3 shadow-sm border border-border-light/60">
            <img src="/box.svg" alt="" />

            <div>
              <p className="text-[11px] font-medium text-text-subtle">Active</p>

              <p className="text-sm font-bold text-text-main">
                {metrics.active} {metrics.active === 1 ? "Booking" : "Bookings"}
              </p>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-surface-card rounded-2xl p-5 flex items-center gap-3 shadow-sm border border-border-light/60">
            <img src="/completedclock.svg" alt="" />

            <div>
              <p className="text-[11px] font-medium text-text-subtle">
                Completed
              </p>

              <p className="text-sm font-bold text-text-main">
                {metrics.completed}{" "}
                {metrics.completed === 1 ? "Booking" : "Bookings"}
              </p>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div
          className={`space-y-6 py-5 transition-opacity duration-200 ${
            showBackgroundRefresh ? "opacity-60" : "opacity-100"
          }`}
        >
          {isError ? (
            <div className="bg-surface-card rounded-2xl border border-border-light/60 p-10 text-center">
              <h2 className="text-lg font-semibold text-text-main">
                Unable to load your bookings
              </h2>
              <p className="text-sm text-text-subtle mt-1">
                Please try again later.
              </p>
            </div>
          ) : showListSkeleton ? (
            Array.from({ length: 3 }).map((_, index) => (
              <BookingCardSkeleton key={index} />
            ))
          ) : bookings.length === 0 ? (
            <div className="bg-surface-card rounded-2xl border border-border-light/60 p-10 text-center">
              <CalendarDays className="w-10 h-10 mx-auto text-text-subtle mb-3" />
              <h2 className="text-lg font-semibold text-text-main">
                No bookings yet
              </h2>
              <p className="text-sm text-text-subtle mt-1">
                Your storage reservations will appear here.
              </p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-surface-card rounded-2xl shadow-sm border border-border-light/50 overflow-hidden flex flex-col md:flex-row mt-10"
              >
                {/* Facility Image */}
                <div className="w-full md:w-72 shrink-0 min-h-[180px] md:min-h-full">
                  <img
                    src={booking.hub?.images?.[0] || "/placeholder-image.jpg"}
                    alt={booking.hub?.name || "Storage Facility"}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content Container */}
                <div className="flex-1 p-4 flex flex-col justify-between space-y-4">
                  {/* Top Details & Badges */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-text-main">
                          {booking.hub?.name || "Storage Facility"}
                        </h2>

                        {booking.hub?.isVerified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] font-medium text-brand-primary">
                            <img
                              src="/verifiedIcon.svg"
                              alt=""
                              className="h-3 w-3"
                            />
                            Verified
                          </span>
                        )}
                      </div>

                      {/* Status & Payment */}
                      <div className="text-right shrink-0">
                        <span
                          className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[10px] font-medium ${getBookingStatusStyles(
                            booking.bookingStatus,
                          )}`}
                        >
                          {formatBookingStatus(booking.bookingStatus)}
                        </span>

                        <p className="mt-0.5 text-[10px] text-text-subtle">
                          {formatPaymentStatus(booking.paymentStatus)}
                        </p>
                      </div>
                    </div>

                    {/* Sub-header Metadata */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-subtle">
                      <div className="flex items-center gap-1">
                        <img
                          src="/mapcon.svg"
                          alt="location icon"
                          className="h-3 w-3"
                        />

                        <span>
                          {booking.hub?.address || "Location unavailable"}
                        </span>
                      </div>

                      {booking.hub?.storageType && (
                        <div className="flex items-center gap-1">
                          <img
                            src="/Garage.svg"
                            alt="location icon"
                            className="h-3 w-3"
                          />
                          <span>{booking.hub.storageType}</span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <p>|</p>
                        <span className="italic text-text-subtle">
                          {booking.bookingId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Data Specifications Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-border-light/60 text-xs">
                    {/* Crop Type */}
                    <div>
                      <div className="flex items-center gap-1 text-text-subtle text-[11px] mb-0.5">
                        <img
                          src="/plant-lighttwo.svg"
                          alt=""
                          className="w-3 h-3"
                        />
                        <span>Crop type</span>
                      </div>

                      <p className="font-semibold text-text-main">
                        {booking.cropType || "N/A"}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div>
                      <div className="flex items-center gap-1 text-text-subtle text-[11px] mb-0.5">
                        <img src="/Group.svg" alt="" className="w-3 h-3" />
                        <span>Quantity</span>
                      </div>

                      <p className="font-semibold text-text-main">
                        {formatQuantity(booking.quantity, booking.unitType)}
                      </p>
                    </div>

                    {/* Drop-off Date */}
                    <div>
                      <div className="flex items-center gap-1 text-text-subtle text-[11px] mb-0.5">
                        <img
                          src="/Calendartwo.svg"
                          alt=""
                          className="w-3 h-3"
                        />

                        <span>
                          {booking.bookingStatus?.toLowerCase() === "in_storage"
                            ? "Stored since"
                            : "Drop-off Date"}
                        </span>
                      </div>

                      <p className="font-semibold text-text-main">
                        {formatBookingDate(booking.dropOffDate)}
                      </p>
                    </div>

                    {/* Duration */}
                    <div>
                      <div className="flex items-center gap-1 text-text-subtle text-[11px] mb-0.5">
                        <img
                          src="/Clock Circletwo.svg"
                          alt=""
                          className="w-3 h-3"
                        />
                        <span>Duration</span>
                      </div>

                      <p className="font-semibold text-text-main">
                        {formatDuration(booking.durationInDays)}
                      </p>
                    </div>

                    {/* Pick-up Date */}
                    <div>
                      <div className="flex items-center gap-1 text-text-subtle text-[11px] mb-0.5">
                        <img
                          src="/Clock Circletwo.svg"
                          alt=""
                          className="w-3 h-3"
                        />
                        <span>Pick-up Date</span>
                      </div>

                      <p className="font-semibold text-text-main">
                        {formatBookingDate(booking.pickUpDate)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-1">
                    {/* View Booking Details */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative inline-block shrink-0 cursor-pointer"
                      onClick={() =>
                        navigate(`/storage/viewbooking/${booking.bookingId}`)
                      }
                    >
                      <span className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-full bg-brand-secondary" />

                      <span className="relative z-10 flex h-8 items-center justify-center rounded-full bg-brand-primary px-5 text-text-light">
                        <span className="text-xs font-semibold whitespace-nowrap">
                          View Booking Details
                        </span>
                      </span>
                    </motion.button>

                    {/* Get Directions */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative inline-block shrink-0 cursor-pointer"
                      onClick={() => {
                        const address = booking.hub?.address;
                        if (address) {
                          window.open(
                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
                            "_blank",
                          );
                        }
                      }}
                    >
                      <span className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-full bg-brand-secondary" />

                      <span className="relative z-10 flex h-8 items-center justify-center rounded-full bg-surface-card px-5 border border-brand-secondary">
                        <span className="text-xs font-semibold whitespace-nowrap">
                          Get Directions
                        </span>
                      </span>
                    </motion.button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </>
  );
}
