import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import AdminStatsGrid from "./adminComponents/AdminStats";
import BookingActivityCard from "./adminComponents/BookingActivityCard";
import StorageUtilizationCard from "./adminComponents/StorageUtilizationCard";
import RecentBookingsCard from "./adminComponents/RecentBookingsCard";
import ActionRequiredCard from "./adminComponents/ActionRequiredCard";

export default function DashboardHeader() {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState("30d");

  // Pull cached profile details if available to keep the name instantly synced
  const { data: profileData } = useQuery<any>({
    queryKey: ["userProfile"],
    enabled: false,
    staleTime: Infinity,
  });

  const currentUser = profileData?.user || profileData || user;
  
  // Extract first name for a friendly greeting (e.g., "Good Morning, Oge")
  const fullName = currentUser?.fullName || "User";
  const firstName = fullName.split(" ")[0];

  const filters = [
    { id: "today", label: "Today" },
    { id: "7d", label: "7d" },
    { id: "30d", label: "30d" },
    { id: "custom", label: "Custom" },
  ];

  return (
    <div className="flex flex-col gap-6 pt-22 py-4 px-2">
      {/* Top Section: Greeting & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Greeting Section */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 flex items-center gap-2">
            Good Morning, {firstName} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Here's what's happening across AgroKeep today.
          </p>
        </div>

        {/* Filter Tabs Section */}
        <div className="flex items-center bg-stone-100/80 p-1 rounded-full border border-stone-200/60 shadow-xs self-start md:self-auto">
          {filters.map((filter) => {
            const isActive = selectedFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                type="button"
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#1B4D3E] text-white shadow-sm" // Matches AgroKeep brand dark green theme
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Stats Grid Cards */}
      <AdminStatsGrid />

      {/* Main Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full pt-2">
        {/* Left Side: Booking Activity Chart Card (Span 7) */}
        <div className="lg:col-span-7 flex">
          <BookingActivityCard />
        </div>

        {/* Right Side: Storage Utilization Chart Card (Span 5) */}
        <div className="lg:col-span-5 flex">
          <StorageUtilizationCard />
        </div>
      </div>

      {/* Recent Bookings & Action Required Section */}
      <div className="flex flex-col gap-6 w-full pt-2">
        <RecentBookingsCard />
        <ActionRequiredCard />
      </div>
    </div>
  );
}