/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Search, ChevronDown, Plus, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import StorageHubTable from "./StorageHubTable";
import AddStorageHubModal from "./AddStorageHubModal";
import { getStorageFilterOptionsApi } from "@/api/adminStorage";

export function useStorageFilterOptions() {
  return useQuery({
    queryKey: ["storageFilterOptions"],
    queryFn: async () => {
      const response = await getStorageFilterOptionsApi();
      return response.data;
    },
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
  });
}

interface StorageHubsHeaderProps {
  onAddHub?: () => void;
}

export default function StorageHubsHeader({
  onAddHub,
}: StorageHubsHeaderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Read current filter values directly from the URL search params
  const searchQuery = searchParams.get("search") || "";
  const selectedState = searchParams.get("state") || "All";
  const selectedLga = searchParams.get("lga") || "All";
  const selectedStorageType = searchParams.get("storageType") || "All";
  const selectedVerification = searchParams.get("verificationStatus") || "All";
  const selectedStatus = searchParams.get("status") || "All";

  const { data: filterOptions, isLoading } = useStorageFilterOptions();

  // Helper to update a single search parameter
  const updateParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (!value || value === "All") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
      newParams.delete("page"); // Reset page when filters change
      return newParams;
    });
  };

  // Extract unique states from the flat locations array
  const statesList = useMemo(() => {
    if (!filterOptions?.data?.locations) return [];
    const states = filterOptions.data.locations
      .map((loc: any) => loc.state)
      .filter(Boolean);
    return Array.from(new Set(states));
  }, [filterOptions]);

  // Extract LGAs that match the currently selected state
  const lgasList = useMemo(() => {
    if (!filterOptions?.data?.locations) return [];
    if (selectedState === "All") {
      return filterOptions.data.locations
        .map((loc: any) => loc.lga)
        .filter(Boolean);
    }
    return filterOptions.data.locations
      .filter((loc: any) => loc.state === selectedState)
      .map((loc: any) => loc.lga)
      .filter(Boolean);
  }, [filterOptions, selectedState]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParam("search", e.target.value);
  };

  return (
    <div className="flex flex-col gap-6 w-full py-6 md:px-2 bg-stone-50/50 relative">
      {/* Top Title & Add Button Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
            Storage Hubs
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Manage storage facilities, availability and capacity.
          </p>
        </div>

        <button
          onClick={() => {
            if (onAddHub) onAddHub();
            setIsAddModalOpen(true);
          }}
          type="button"
          className="inline-flex items-center justify-center gap-2 bg-[#1B4D3E] hover:bg-[#153e31] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Storage Hub</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          placeholder="Search hub name, location, storage type..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200/85 rounded-full text-sm text-stone-800 placeholder-stone-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 focus:border-[#1B4D3E] transition-all"
        />
      </div>

      {/* Filter Dropdowns Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* State Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-stone-500">State</label>
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => {
                const newState = e.target.value;
                // FIX: Update state and reset LGA/page in a single setSearchParams call to prevent race conditions
                setSearchParams((prev) => {
                  const newParams = new URLSearchParams(prev);
                  if (newState === "All" || !newState) {
                    newParams.delete("state");
                  } else {
                    newParams.set("state", newState);
                  }
                  newParams.delete("lga"); // Reset LGA dependent filter
                  newParams.delete("page"); // Reset page
                  return newParams;
                });
              }}
              className="w-full appearance-none bg-white border border-stone-200/80 rounded-full px-4 py-2 text-xs font-medium text-stone-800 shadow-xs focus:outline-none focus:border-[#1B4D3E] pr-8 cursor-pointer"
            >
              <option value="All">All</option>
              {statesList.map((stateName: string, idx: number) => (
                <option key={idx} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* LGA Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-stone-500">LGA</label>
          <div className="relative">
            <select
              value={selectedLga}
              onChange={(e) => updateParam("lga", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200/80 rounded-full px-4 py-2 text-xs font-medium text-stone-800 shadow-xs focus:outline-none focus:border-[#1B4D3E] pr-8 cursor-pointer"
            >
              <option value="All">All</option>
              {lgasList.map((lgaName: string, idx: number) => (
                <option key={idx} value={lgaName}>
                  {lgaName}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Storage Type Filter */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-stone-500">
              Storage Type
            </label>
            {isLoading && (
              <Loader2 className="h-3 w-3 animate-spin text-[#1B4D3E]" />
            )}
          </div>
          <div className="relative">
            <select
              value={selectedStorageType}
              onChange={(e) => updateParam("storageType", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200/80 rounded-full px-4 py-2 text-xs font-medium text-stone-800 shadow-xs focus:outline-none focus:border-[#1B4D3E] pr-8 cursor-pointer"
            >
              <option value="All">All</option>
              {filterOptions?.data?.storageTypes?.map(
                (type: string, idx: number) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ),
              )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Verification Status Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-stone-500">
            Verification Status
          </label>
          <div className="relative">
            <select
              value={selectedVerification}
              onChange={(e) =>
                updateParam("verificationStatus", e.target.value)
              }
              className="w-full appearance-none bg-white border border-stone-200/80 rounded-full px-4 py-2 text-xs font-medium text-stone-800 shadow-xs focus:outline-none focus:border-[#1B4D3E] pr-8 cursor-pointer"
            >
              <option value="All">All</option>
              {filterOptions?.data?.verificationStatuses?.map((status: any) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <label className="text-xs font-medium text-stone-500">Status</label>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => updateParam("status", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200/80 rounded-full px-4 py-2 text-xs font-medium text-stone-800 shadow-xs focus:outline-none focus:border-[#1B4D3E] pr-8 cursor-pointer"
            >
              <option value="All">All</option>
              {filterOptions?.data?.statuses?.map((status: any) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="w-full mt-2">
        <StorageHubTable />
      </div>

      {/* Render the imported modal component */}
      <AddStorageHubModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
