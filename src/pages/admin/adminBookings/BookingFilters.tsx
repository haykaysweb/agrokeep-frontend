import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { useDebouncedCallback } from "use-debounce";
import { getBookingFilterOptionsApi } from "@/api/admin";

type FilterKey =
  | "status"
  | "state"
  | "storageHub"
  | "cropType"
  | "paymentStatus"
  | "dateRange";

export default function BookingFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("query") || "",
  );

  const { data: filterOptionsData } = useQuery({
    queryKey: ["bookingFilterOptions"],
    queryFn: getBookingFilterOptionsApi,
  });

  const filterOptions = filterOptionsData?.data.data;

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    // Any filter change should take you back to page 1
    next.set("page", "1");
    setSearchParams(next);
  };

  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateParam("query", value);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleFilterChange =
    (key: FilterKey) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateParam(key, e.target.value);
    };

  const handleFocus = (key: FilterKey) => () => setOpenFilter(key);
  const handleBlur = () => setOpenFilter(null);

  const chevronSvgClass = (key: FilterKey) =>
    `w-4 h-4 transition-transform duration-200 ${
      openFilter === key ? "rotate-180" : "rotate-0"
    }`;

  return (
    <div className="w-full space-y-4 mb-6 mt-10 sm:mt-auto">
      {/* Search Input Bar */}
      <div className="relative w-full mb-5">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-text-muted">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </span>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search Booking ID, Farmer, Storage Hub"
          className="w-full pl-11 pr-4 py-3 bg-surface-card border border-border-input rounded-[25px] text-text-main text-sm placeholder:text-text-muted focus:outline-none focus:border-brand-primary shadow-xs"
        />
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Status Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-subtle">Status</label>
          <div className="relative">
            <select
              value={searchParams.get("status") || ""}
              onChange={handleFilterChange("status")}
              onFocus={handleFocus("status")}
              onBlur={handleBlur}
              className="w-full pl-3 pr-10 py-2.5 bg-surface-card border border-border-input rounded-[25px] text-text-subtle text-xs sm:text-sm focus:outline-none focus:border-brand-primary shadow-xs cursor-pointer appearance-none"
            >
              <option value="">All Statuses</option>
              {filterOptions?.bookingStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
              <svg
                className={chevronSvgClass("status")}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>

        {/* State Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-subtle">State</label>
          <div className="relative">
            <select
              value={searchParams.get("state") || ""}
              onChange={handleFilterChange("state")}
              onFocus={handleFocus("state")}
              onBlur={handleBlur}
              className="w-full pl-3 pr-10 py-2.5 bg-surface-card border border-border-input rounded-[25px] text-text-subtle text-xs sm:text-sm focus:outline-none focus:border-brand-primary shadow-xs cursor-pointer appearance-none"
            >
              <option value="">All States</option>
              {filterOptions?.states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
              <svg
                className={chevronSvgClass("state")}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>

        {/* Storage Hub Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-subtle">
            Storage Hub
          </label>
          <div className="relative">
            <select
              value={searchParams.get("storageHub") || ""}
              onChange={handleFilterChange("storageHub")}
              onFocus={handleFocus("storageHub")}
              onBlur={handleBlur}
              className="w-full pl-3 pr-10 py-2.5 bg-surface-card border border-border-input rounded-[25px] text-text-subtle text-xs sm:text-sm focus:outline-none focus:border-brand-primary shadow-xs cursor-pointer appearance-none"
            >
              <option value="">All Storage Hubs</option>
              {filterOptions?.storageHubs.map((hub) => (
                <option key={hub.id} value={hub.id}>
                  {hub.name}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
              <svg
                className={chevronSvgClass("storageHub")}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>

        {/* Crop Type Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-subtle">
            Crop Type
          </label>
          <div className="relative">
            <select
              value={searchParams.get("cropType") || ""}
              onChange={handleFilterChange("cropType")}
              onFocus={handleFocus("cropType")}
              onBlur={handleBlur}
              className="w-full pl-3 pr-10 py-2.5 bg-surface-card border border-border-input rounded-[25px] text-text-subtle text-xs sm:text-sm focus:outline-none focus:border-brand-primary shadow-xs cursor-pointer appearance-none"
            >
              <option value="">All Crop Types</option>
              {filterOptions?.cropTypes.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
              <svg
                className={chevronSvgClass("cropType")}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>

        {/* Payment Status Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-subtle">
            Payment Status
          </label>
          <div className="relative">
            <select
              value={searchParams.get("paymentStatus") || ""}
              onChange={handleFilterChange("paymentStatus")}
              onFocus={handleFocus("paymentStatus")}
              onBlur={handleBlur}
              className="w-full pl-3 pr-10 py-2.5 bg-surface-card border border-border-input rounded-[25px] text-text-subtle text-xs sm:text-sm focus:outline-none focus:border-brand-primary shadow-xs cursor-pointer appearance-none"
            >
              <option value="">All Statuses</option>
              {filterOptions?.paymentStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
              <svg
                className={chevronSvgClass("paymentStatus")}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-subtle">
            Date Range
          </label>
          <div className="relative">
            <select
              value={searchParams.get("dateRange") || ""}
              onChange={handleFilterChange("dateRange")}
              onFocus={handleFocus("dateRange")}
              onBlur={handleBlur}
              className="w-full pl-3 pr-10 py-2.5 bg-surface-card border border-border-input rounded-[25px] text-text-subtle text-xs sm:text-sm focus:outline-none focus:border-brand-primary shadow-xs cursor-pointer appearance-none"
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
              <svg
                className={chevronSvgClass("dateRange")}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
