import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { isAxiosError } from "axios";
import BookingFilters from "./BookingFilters";
import BookingHeader from "./BookingHeader";
import AdminBookingsTable from "./AdminBookingsTable";
import AdminNewBookingModal from "./bookingComponents/AdminNewBookingModal";
import { getAdminBookingsApi } from "@/api/admin";

export default function AdminBooking() {
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { isPending, isError, error, data } = useQuery({
    queryKey: ["getAdminBookings", searchParams.toString()],
    queryFn: () => getAdminBookingsApi(searchParams),
    placeholderData: keepPreviousData,
  });

  const { bookings, pagination } = data?.data?.data || {};

  const handlePageChange = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
  };

  const errorMessage = isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message
    : undefined;

  return (
    <section>
      <BookingHeader onAddClick={() => setIsNewBookingModalOpen(true)} />

      <BookingFilters />

      <div className="mt-6">
        {isError ? (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {errorMessage || "Failed to fetch bookings"}
          </div>
        ) : (
          <AdminBookingsTable
            bookings={bookings || []}
            pagination={pagination}
            isLoading={isPending}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <AdminNewBookingModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
      />
    </section>
  );
}
