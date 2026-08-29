import { useState } from "react";

interface Booking {
  id: string;
  farmerName: string;
  storageHub: string;
  location: string;
  crop: string;
  quantity: string;
  amount: string;
  status: "Confirmed" | "Active" | "Completed" | "Pending" | "Cancelled";
}

export default function RecentBookingsCard() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const bookings: Booking[] = [
    {
      id: "AGK-004582",
      farmerName: "Adewale Anuoluwapo",
      storageHub: "Ibadan Central Hermetic Hub",
      location: "Ibadan, Oyo",
      crop: "Maize",
      quantity: "120 Bags",
      amount: "₦761,400",
      status: "Confirmed",
    },
    {
      id: "AGK-004581",
      farmerName: "Kemi Ogunlana",
      storageHub: "Osun Cool Chamber",
      location: "Osogbo, Osun",
      crop: "Tomatoes",
      quantity: "100 Crates",
      amount: "₦761,400",
      status: "Active",
    },
    {
      id: "AGK-004580",
      farmerName: "Bola Farms",
      storageHub: "Abeokuta Yam Brick Chamber",
      location: "Abeokuta, Ogun",
      crop: "Yam",
      quantity: "200 Crates",
      amount: "₦761,400",
      status: "Completed",
    },
    {
      id: "AGK-004579",
      farmerName: "Adewale Anuoluwapo",
      storageHub: "Akure Dry Storage",
      location: "Akure, Ondo",
      crop: "Cassava",
      quantity: "180 Bags",
      amount: "₦761,400",
      status: "Pending",
    },
    {
      id: "AGK-004578",
      farmerName: "Adewale Anuoluwapo",
      storageHub: "Ado-Ekiti Hermetic Hub",
      location: "Ado-Ekiti, Ekiti",
      crop: "Maize",
      quantity: "230 Bags",
      amount: "₦761,400",
      status: "Cancelled",
    },
  ];

  const toggleSelectAll = () => {
    if (selectedRows.length === bookings.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(bookings.map((b) => b.id));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-100 text-emerald-800";
      case "Active":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-stone-200 text-stone-700";
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 border border-stone-100 shadow-xs w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Recent Bookings</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Latest storage reservations
          </p>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors whitespace-nowrap"
        >
          View all Bookings
        </button>
      </div>

      {/* Table Container */}
      <div className="w-full">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-[#1E5E3A] text-white text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3 rounded-l-xl w-8">
                <input
                  type="checkbox"
                  checked={selectedRows.length === bookings.length}
                  onChange={toggleSelectAll}
                  className="rounded border-white/45 accent-[#1E5E3A] cursor-pointer"
                />
              </th>
              <th className="py-3 px-2 font-semibold whitespace-nowrap">Booking ID</th>
              <th className="py-3 px-2 font-semibold">Farmer's Name</th>
              <th className="py-3 px-2 font-semibold">Storage Hub</th>
              <th className="py-3 px-2 font-semibold">Location</th>
              <th className="py-3 px-2 font-semibold">Crop</th>
              <th className="py-3 px-2 font-semibold whitespace-nowrap">Qty</th>
              <th className="py-3 px-2 font-semibold whitespace-nowrap">Amount</th>
              <th className="py-3 px-3 rounded-r-xl font-semibold whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
            {bookings.map((booking) => {
              const isSelected = selectedRows.includes(booking.id);
              return (
                <tr
                  key={booking.id}
                  className="hover:bg-stone-50/80 transition-colors"
                >
                  <td className="py-4 px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(booking.id)}
                      className="rounded border-stone-300 accent-[#1E5E3A] cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-2 font-medium text-stone-900 whitespace-nowrap">
                    {booking.id}
                  </td>
                  <td className="py-4 px-2 font-medium text-stone-900">
                    {booking.farmerName}
                  </td>
                  <td className="py-4 px-2 text-stone-600">
                    {booking.storageHub}
                  </td>
                  <td className="py-4 px-2 text-stone-500">
                    {booking.location}
                  </td>
                  <td className="py-4 px-2">{booking.crop}</td>
                  <td className="py-4 px-2 whitespace-nowrap">{booking.quantity}</td>
                  <td className="py-4 px-2 font-semibold text-stone-900 whitespace-nowrap">
                    {booking.amount}
                  </td>
                  <td className="py-4 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${getStatusBadge(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}