import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import TableBody, { type TableRow } from "@/components/AdminBookingsTableBody";
import {
  bookingColumns,
  bookingStatusColors,
  formatBookingStatus,
  formatBookingDate,
  formatCurrency,
  formatDuration,
  formatQuantity,
  type BookingStatus,
} from "@/lib/constant";
import type { AdminBooking, Pagination } from "@/api/admin";

interface AdminBookingsTableProps {
  bookings: AdminBooking[];
  pagination?: Pagination;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

const FILTER_KEYS = [
  "query",
  "status",
  "state",
  "storageHub",
  "cropType",
  "paymentStatus",
  "dateRange",
];

export default function AdminBookingsTable({
  bookings,
  pagination,
  isLoading,
  onPageChange,
}: AdminBookingsTableProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hasActiveFilters = FILTER_KEYS.some((key) => searchParams.get(key));

  const emptyMessage = hasActiveFilters
    ? "No bookings match your search or filters"
    : "No bookings available yet";

  const renderCell = useCallback((row: TableRow, columnKey: string) => {
    const booking = row as unknown as AdminBooking;

    switch (columnKey) {
      case "bookingId":
        return <p className="whitespace-nowrap text-sm">{booking.bookingId}</p>;

      case "farmerName":
        return <p className="max-w-40 truncate text-sm">{booking.fullName}</p>;

      case "storageHub":
        return <p className="max-w-40 truncate text-sm">{booking.hub?.name}</p>;

      case "location":
        return (
          <p className="max-w-40 truncate text-sm">
            {booking.hub?.lga}, {booking.hub?.state}
          </p>
        );

      case "crop":
        return <p className="text-sm">{booking.cropType}</p>;

      case "quantity":
        return (
          <p className="text-sm">
            {formatQuantity(booking.quantity, booking.unitType)}
          </p>
        );

      case "dropOff":
        return (
          <p className="whitespace-nowrap text-sm">
            {formatBookingDate(booking.dropOffDate)}
          </p>
        );

      case "duration":
        return (
          <p className="text-sm">{formatDuration(booking.durationInDays)}</p>
        );

      case "amount":
        return (
          <p className="whitespace-nowrap text-sm">
            {formatCurrency(booking.totalAmount)}
          </p>
        );

      case "status":
        return (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${
              bookingStatusColors[booking.bookingStatus as BookingStatus] ?? ""
            }`}
          >
            {formatBookingStatus(booking.bookingStatus)}
          </span>
        );

      default:
        return null;
    }
  }, []);

  return (
    <TableBody
      tableColumns={bookingColumns}
      tableData={bookings as unknown as TableRow[]}
      renderCell={renderCell}
      isLoading={isLoading}
      pagination={pagination}
      onPageChange={onPageChange}
      onRowClick={(row) => navigate(`/admin/bookings/details/${row._id}`)}
      itemLabel="bookings"
      emptyMessage={emptyMessage}
    />
  );
}
