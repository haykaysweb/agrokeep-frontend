/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrendingUp, Box, Calendar, Warehouse } from "lucide-react";

export default function StorageOverviewTab({ hub }: { hub: any }) {
  console.log("Overview Tab Data:", hub);

  const overview = hub?.overview || {};
  const bookings = overview?.recentBookings || [];

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between h-[110px]">
          <span className="text-xs font-medium text-stone-500">Occupancy</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-stone-900">
              {overview?.occupancyPercent ?? 0}%
            </span>
            <TrendingUp className="h-5 w-5 text-stone-800" />
          </div>
          <span className="text-[11px] text-stone-400">Healthy</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between h-[110px]">
          <span className="text-xs font-medium text-stone-500">
            Available Capacity
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-700">
              {overview?.availableCapacity?.toLocaleString() ?? 0}{" "}
              {overview?.unitType || "bags"}
            </span>
            <Box className="h-5 w-5 text-stone-800" />
          </div>
          <span className="text-[11px] text-stone-400">
            {100 - (overview?.occupancyPercent ?? 0)}% Available
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between h-[110px]">
          <span className="text-xs font-medium text-stone-500">
            Active Bookings
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-stone-900">
              {overview?.activeBookingsCount ?? 0}
            </span>
            <Calendar className="h-5 w-5 text-stone-800" />
          </div>
          <span className="text-[11px] text-stone-400">
            Currently registered
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between h-[110px]">
          <span className="text-xs font-medium text-stone-500">
            Storage Type
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-stone-900">
              {overview?.storageType || "Standard"}
            </span>
            <Warehouse className="h-5 w-5 text-stone-800" />
          </div>
          <span className="text-[11px] text-stone-400">
            {overview?.totalCapacity?.toLocaleString() ?? 0} total capacity
          </span>
        </div>
      </div>

      {/* Availability Progress Section */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-stone-900">Availability</span>
          <span className="text-sm font-bold text-stone-900">
            {overview?.occupancyPercent ?? 0}%
          </span>
        </div>
        <div className="text-xs text-stone-500 font-medium">
          {overview?.availableCapacity?.toLocaleString() ?? 0}{" "}
          {overview?.unitType || "bags"} available
        </div>

        <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{ width: `${overview?.occupancyPercent ?? 0}%` }}
          />
        </div>

        <div className="flex items-center gap-6 text-[11px] text-stone-500 mt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" /> Healthy
            0–69%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Getting full
            70–89%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Nearly full
            90–100%
          </span>
        </div>
      </div>

      {/* 3-Column Meta Cards (Environment, Pricing, Discount Rules) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col gap-4">
          <h4 className="text-sm font-bold text-stone-900">
            Storage Environment
          </h4>
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-stone-700">
            {overview?.features?.length > 0 ? (
              overview.features.map((feature: string, idx: number) => (
                <span key={idx} className="flex items-center gap-1.5">
                  ✓ {feature}
                </span>
              ))
            ) : (
              <span className="text-stone-400 text-xs">
                No specific features listed.
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col gap-4">
          <h4 className="text-sm font-bold text-stone-900">Pricing</h4>
          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Price per {overview?.unitType || "bag"}/Day</span>
              <span className="font-semibold text-stone-900">
                ₦{overview?.pricePerBagPerDay ?? 0}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Price per Crate/Day</span>
              <span className="font-semibold text-stone-900">
                ₦{overview?.pricePerCratePerDay ?? 0}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Weekly Flat Rate</span>
              <span className="font-semibold text-stone-900">
                ₦{overview?.priceWeeklyFlat?.toLocaleString() ?? 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col gap-4">
          <h4 className="text-sm font-bold text-stone-900">Discount Rules</h4>
          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Bulk Discount (100+ Units)</span>
              <span className="font-semibold text-stone-900">
                ₦{overview?.priceBulk100Units ?? 0} per unit/day
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Long-term Rate</span>
              <span className="font-semibold text-stone-900">
                Applied automatically
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900">
            Recent Bookings
          </h3>
          <button className="text-xs font-semibold text-[#1B4D3E] cursor-pointer">
            View all
          </button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1000px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200/80 bg-stone-100/70 text-[11px] font-bold tracking-wider text-stone-500 uppercase">
                <th className="px-4 py-3.5">
                  <input type="checkbox" />
                </th>
                <th className="px-4 py-3.5">Booking ID</th>
                <th className="px-4 py-3.5">Farmer's Name</th>
                <th className="px-4 py-3.5">Storage Hub</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Crop</th>
                <th className="px-4 py-3.5">Quantity</th>
                <th className="px-4 py-3.5">Drop-off</th>
                <th className="px-4 py-3.5">Duration</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-8 text-center text-stone-400"
                  >
                    No bookings found for this hub.
                  </td>
                </tr>
              ) : (
                bookings.map((b: any) => {
                  const statusColors: Record<string, string> = {
                    confirmed: "bg-emerald-100 text-emerald-800",
                    "in storage": "bg-blue-100 text-blue-800",
                    completed: "bg-stone-100 text-stone-800",
                    pending: "bg-amber-100 text-amber-800",
                    cancelled: "bg-rose-100 text-rose-800",
                  };
                  return (
                    <tr key={b._id} className="hover:bg-stone-50/80">
                      <td className="px-4 py-3.5">
                        <input type="checkbox" />
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-stone-900">
                        {b.bookingId}
                      </td>
                      <td className="px-4 py-3.5 font-medium">{b.fullName}</td>
                      <td className="px-4 py-3.5">{b.hubName}</td>
                      <td className="px-4 py-3.5 text-stone-500">
                        {b.location}
                      </td>
                      <td className="px-4 py-3.5">{b.cropType}</td>
                      <td className="px-4 py-3.5">
                        {b.quantity} {b.unitType}
                      </td>
                      <td className="px-4 py-3.5">
                        {b.dropOffDate
                          ? new Date(b.dropOffDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3.5">{b.durationInDays} Days</td>
                      <td className="px-4 py-3.5 font-semibold">
                        ₦{b.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${statusColors[b.bookingStatus?.toLowerCase()] || "bg-stone-100 text-stone-800"}`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
