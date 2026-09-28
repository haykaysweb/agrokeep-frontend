import { useState } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import StorageHubTable from "./StorageHubTable";

interface StorageHubsHeaderProps {
  onAddHub?: () => void;
  onSearchChange?: (query: string) => void;
}

export default function StorageHubsHeader({ onAddHub, onSearchChange }: StorageHubsHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedLga, setSelectedLga] = useState("All");
  const [selectedStorageType, setSelectedStorageType] = useState("All");
  const [selectedVerification, setSelectedVerification] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full py-6 px-2 bg-stone-50/50">
      
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

        {/* Add Storage Hub Button */}
        <button
          onClick={onAddHub}
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
          className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200/80 rounded-full text-sm text-stone-800 placeholder-stone-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 focus:border-[#1B4D3E] transition-all"
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
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200/80 rounded-full px-4 py-2 text-xs font-medium text-stone-800 shadow-xs focus:outline-none focus:border-[#1B4D3E] pr-8 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Oyo">Oyo</option>
              <option value="Ogun">Ogun</option>
              <option value="Osun">Osun</option>
              <option value="Ondo">Ondo</option>
              <option value="Ekiti">Ekiti</option>
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
              onChange={(e) => setSelectedLga(e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200/80 rounded-full px-4 py-2 text-xs font-medium text-stone-800 shadow-xs focus:outline-none focus:border-[#1B4D3E] pr-8 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Ibadan North">Ibadan North</option>
              <option value="Abeokuta South">Abeokuta South</option>
              <option value="Osogbo">Osogbo</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Storage Type Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-stone-500">Storage Type</label>
          <div className="relative">
            <select
              value={selectedStorageType}
              onChange={(e) => setSelectedStorageType(e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200/80 rounded-full px-4 py-2 text-xs font-medium text-stone-800 shadow-xs focus:outline-none focus:border-[#1B4D3E] pr-8 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Hermetic Hub">Hermetic Hub</option>
              <option value="Cool Chamber">Cool Chamber</option>
              <option value="Dry Storage">Dry Storage</option>
              <option value="Brick Chamber">Brick Chamber</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Verification Status Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-stone-500">Verification Status</label>
          <div className="relative">
            <select
              value={selectedVerification}
              onChange={(e) => setSelectedVerification(e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200/80 rounded-full px-4 py-2 text-xs font-medium text-stone-800 shadow-xs focus:outline-none focus:border-[#1B4D3E] pr-8 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Unverified">Unverified</option>
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
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200/80 rounded-full px-4 py-2 text-xs font-medium text-stone-800 shadow-xs focus:outline-none focus:border-[#1B4D3E] pr-8 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
          </div>
        </div>

      </div>
      <div className="w-full mt-2">
        <StorageHubTable />
      </div>

    </div>
    
    
  );
}