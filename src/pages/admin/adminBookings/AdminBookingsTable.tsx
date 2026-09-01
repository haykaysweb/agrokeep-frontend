import { useCallback } from "react";
import TableBody from "@/components/TableBody";
import {
  bookingColumns,
  bookingStatusColors,
  type BookingStatus,
} from "@/lib/constant";

interface Booking {
  id: string;
  bookingId: string;
  farmerName: string;
  storageHub: string;
  location: string;
  crop: string;
  quantity: string;
  dropOff: string;
  duration: string;
  amount: number;
  status: BookingStatus;
}

const dummyBookings: Booking[] = [
  {
    id: "1",
    bookingId: "AGK-004582",
    farmerName: "Adewale Anuoluwapo",
    storageHub: "Ibadan Central Hermetic Hub",
    location: "Ibadan, Oyo",
    crop: "Maize",
    quantity: "120 Bags",
    dropOff: "24 Aug, 2026",
    duration: "8 Weeks",
    amount: 3024000,
    status: "confirmed",
  },
  {
    id: "2",
    bookingId: "AGK-004583",
    farmerName: "Kemi Ogunlana",
    storageHub: "Osun Cool Chamber",
    location: "Osogbo, Osun",
    crop: "Tomatoes",
    quantity: "100 Crates",
    dropOff: "22 Aug, 2026",
    duration: "6 Weeks",
    amount: 561000,
    status: "active",
  },
  {
    id: "3",
    bookingId: "AGK-004584",
    farmerName: "Bola Farms",
    storageHub: "Abeokuta Yam Brick Hub",
    location: "Abeokuta, Ogun",
    crop: "Cassava",
    quantity: "200 Crates",
    dropOff: "12 Jul, 2026",
    duration: "4 Weeks",
    amount: 432000,
    status: "completed",
  },
  {
    id: "4",
    bookingId: "AGK-004585",
    farmerName: "Tunde Farms",
    storageHub: "Akure Dry Storage",
    location: "Akure, Ondo",
    crop: "Cassava",
    quantity: "180 Bags",
    dropOff: "28 Aug, 2026",
    duration: "2 Weeks",
    amount: 199000,
    status: "pending",
  },
  {
    id: "5",
    bookingId: "AGK-004586",
    farmerName: "Yemi Fuga",
    storageHub: "Ado-Ekiti Hermetic Hub",
    location: "Ado-Ekiti, Ekiti",
    crop: "Cocoa",
    quantity: "120 Bags",
    dropOff: "15 Aug, 2026",
    duration: "12 Weeks",
    amount: 1461400,
    status: "cancelled",
  },
  {
    id: "6",
    bookingId: "AGK-004587",
    farmerName: "Chidinma Okoro",
    storageHub: "Gateway Storage Hub",
    location: "Sagamu, Ogun",
    crop: "Onion",
    quantity: "50 Bags",
    dropOff: "18 Aug, 2026",
    duration: "4 Weeks",
    amount: 591400,
    status: "confirmed",
  },
  {
    id: "7",
    bookingId: "AGK-004588",
    farmerName: "Chidinma Okoro",
    storageHub: "Gateway Storage Hub",
    location: "Sagamu, Ogun",
    crop: "Onion",
    quantity: "50 Bags",
    dropOff: "18 Aug, 2026",
    duration: "4 Weeks",
    amount: 591400,
    status: "cancelled",
  },
];

export default function AdminBookingsTable() {
  const renderCell = useCallback((booking: Booking, columnKey: string) => {
    const cellValue = booking[columnKey as keyof Booking];

    switch (columnKey) {
      case "amount":
        return (
          <p className="whitespace-nowrap">
            ₦{booking.amount.toLocaleString()}
          </p>
        );

      case "status":
        return (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${
              bookingStatusColors[booking.status]
            }`}
          >
            {booking.status}
          </span>
        );

      case "bookingId":
        return <p className="whitespace-nowrap text-sm">{booking.bookingId}</p>;

      default:
        return (
          <p className="max-w-40 truncate text-sm">{String(cellValue)}</p>
        );
    }
  }, []);
  

  return (
    <TableBody
      tableColumns={bookingColumns}
      tableData={dummyBookings}
      renderCell={renderCell}
    />
  );
}
