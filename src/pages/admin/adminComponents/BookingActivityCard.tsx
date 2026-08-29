import { useState } from "react";

export default function BookingActivityCard() {
  const [bookingTab, setBookingTab] = useState("Weekly");

  const bookingData = [
    { week: "Week 1", confirmed: 85, completed: 60, canceled: 5 },
    { week: "Week 2", confirmed: 65, completed: 75, canceled: 6 },
    { week: "Week 3", confirmed: 92, completed: 85, canceled: 4 },
    { week: "Week 4", confirmed: 74, completed: 98, canceled: 3 },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-xs flex flex-col justify-between w-full">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Booking Activity</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Storage bookings across the platform
          </p>
        </div>

        {/* Time Tabs */}
        <div className="flex items-center bg-stone-100/80 p-1 rounded-full border border-stone-200/60 self-start sm:self-auto">
          {["Daily", "Weekly", "Monthly"].map((tab) => (
            <button
              key={tab}
              onClick={() => setBookingTab(tab)}
              type="button"
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                bookingTab === tab
                  ? "bg-[#1B4D3E] text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="relative h-64 border-b border-stone-200 flex items-end justify-between px-2 pb-2">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
          {[100, 80, 60, 40, 20, 0].map((val) => (
            <div key={val} className="w-full flex items-center">
              <span className="text-[10px] text-stone-400 w-6 text-right pr-2">
                {val}
              </span>
              <div className="flex-1 border-t border-dashed border-stone-200" />
            </div>
          ))}
        </div>

        {bookingData.map((data, index) => (
          <div
            key={index}
            className="z-10 flex items-end justify-center gap-1.5 sm:gap-2 h-full pt-6 w-1/4"
          >
            <div
              style={{ height: `${data.confirmed}%` }}
              className="w-3 sm:w-4 bg-blue-600 rounded-t-sm transition-all duration-500"
            />
            <div
              style={{ height: `${data.completed}%` }}
              className="w-3 sm:w-4 bg-emerald-600 rounded-t-sm transition-all duration-500"
            />
            <div
              style={{ height: `${data.canceled}%` }}
              className="w-2.5 sm:w-3 bg-stone-400 rounded-t-sm transition-all duration-500"
            />
          </div>
        ))}
      </div>

      {/* Chart X-Axis Labels & Legend */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex justify-between w-full sm:w-[75%] px-4 text-xs font-medium text-stone-500">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
            <span>Canceled</span>
          </div>
        </div>
      </div>
    </div>
  );
}