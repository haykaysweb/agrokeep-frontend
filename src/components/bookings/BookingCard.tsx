import { motion } from "framer-motion";
import {
  Box,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Scale,
  Warehouse,
} from "lucide-react";
import type { MyBooking } from "@/lib/types";
import {
  formatBookingDate,
  formatBookingStatus,
  formatDuration,
  formatPaymentStatus,
  getBookingImage,
} from "../../utils/bookingUtils";

interface BookingCardProps {
  booking: MyBooking;
  onViewDetails?: (booking: MyBooking) => void;
}

export default function BookingCard({
  booking,
  onViewDetails,
}: BookingCardProps) {
  const image = getBookingImage(booking.hub?.images);
  const status = formatBookingStatus(booking.bookingStatus);
  const paymentStatus = formatPaymentStatus(booking.paymentStatus);
  const isInStorage = booking.bookingStatus?.toLowerCase() === "in_storage";
  const handleDirections = () => {
    const destination = [booking.hub?.name, booking.hub?.address]
      .filter(Boolean)
      .join(" ");

    if (!destination) return;

    window.open(
      `https://maps.google.com/?q=${encodeURIComponent(destination)}`,
      "_blank",
    );
  };

  return (
    <div className="bg-surface-card rounded-2xl shadow-sm border border-border-light/50 overflow-hidden flex flex-col md:flex-row">
      {/* Image */}
      <div className="w-full md:w-72 shrink-0 min-h-[180px] md:min-h-full">
        <img
          src={image}
          alt={booking.hub?.name || "Storage facility"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-5 flex flex-col justify-between space-y-4">
        {/* Top Details */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-text-main">
                {booking.hub?.name || "Storage Facility"}
              </h2>

              <span className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full text-[10px] font-medium">
                <CheckCircle2 className="w-3 h-3 text-[#2E7D32]" />
                Verified
              </span>
            </div>

            {/* Status */}
            <div className="text-right">
              <span
                className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold ${
                  isInStorage
                    ? "bg-blue-100 text-blue-600"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {status}
              </span>

              <p className="text-[10px] text-text-subtle mt-0.5">
                {paymentStatus}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-subtle">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />

              <span>{booking.hub?.address || "-"}</span>
            </div>

            <div className="flex items-center gap-1">
              <Warehouse className="w-3.5 h-3.5 shrink-0" />

              <span>{booking.hub?.name || "Storage Hub"}</span>
            </div>

            <span className="italic text-text-subtle">{booking.bookingId}</span>
          </div>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-border-light/60 text-xs">
          {/* Crop */}
          <div>
            <div className="flex items-center gap-1 text-text-subtle text-[11px] mb-0.5">
              <Box className="w-3 h-3" />
              <span>Crop type</span>
            </div>

            <p className="font-semibold text-text-main">
              {booking.cropType || "-"}
            </p>
          </div>

          {/* Quantity */}
          <div>
            <div className="flex items-center gap-1 text-text-subtle text-[11px] mb-0.5">
              <Scale className="w-3 h-3" />
              <span>Quantity</span>
            </div>

            <p className="font-semibold text-text-main">
              {booking.quantity} {booking.unitType || ""}
            </p>
          </div>

          {/* Drop-off */}
          <div>
            <div className="flex items-center gap-1 text-text-subtle text-[11px] mb-0.5">
              <Calendar className="w-3 h-3" />

              <span>{isInStorage ? "Stored since" : "Drop-off Date"}</span>
            </div>

            <p className="font-semibold text-text-main">
              {formatBookingDate(booking.dropOffDate)}
            </p>
          </div>

          {/* Duration */}
          <div>
            <div className="flex items-center gap-1 text-text-subtle text-[11px] mb-0.5">
              <Clock className="w-3 h-3" />

              <span>Duration</span>
            </div>

            <p className="font-semibold text-text-main">
              {formatDuration(booking.durationInDays)}
            </p>
          </div>

          {/* Pickup */}
          <div>
            <div className="flex items-center gap-1 text-text-subtle text-[11px] mb-0.5">
              <Calendar className="w-3 h-3" />

              <span>Pick-up Date</span>
            </div>

            <p className="font-semibold text-text-main">
              {formatBookingDate(booking.pickUpDate)}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-1">
          {/* View Booking Details */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewDetails?.(booking)}
            className="relative inline-block shrink-0"
          >
            <span className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-full bg-brand-secondary" />

            <span className="relative z-10 flex h-8 items-center justify-center rounded-full bg-brand-primary px-5 text-text-light">
              <span className="text-xs font-semibold whitespace-nowrap">
                View Booking Details
              </span>
            </span>
          </motion.button>

          {/* Directions */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDirections}
            className="relative inline-block shrink-0"
          >
            <span className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-full bg-brand-secondary" />

            <span className="relative z-10 flex h-8 items-center justify-center rounded-full bg-surface-card border border-border-light px-5 text-text-main">
              <span className="text-xs font-semibold whitespace-nowrap">
                Get directions
              </span>
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
