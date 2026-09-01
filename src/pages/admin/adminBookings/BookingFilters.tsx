interface BookingFiltersProps {
  searchTerm?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BookingFilters({
  searchTerm,
  onSearchChange,
}: BookingFiltersProps) {
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
          value={searchTerm}
          onChange={onSearchChange}
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
            <select className="w-full pl-3 pr-10 py-2.5 bg-surface-card border border-border-input rounded-[25px] text-text-subtle text-xs sm:text-sm focus:outline-none focus:border-brand-primary shadow-xs cursor-pointer appearance-none">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
              <svg
                className="w-4 h-4"
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
            <select className="w-full pl-3 pr-10 py-2.5 bg-surface-card border border-border-input rounded-[25px] text-text-subtle text-xs sm:text-sm focus:outline-none focus:border-brand-primary shadow-xs cursor-pointer appearance-none">
              <option value="">All States</option>
              <option value="oyo">Oyo</option>
              <option value="ogun">Ogun</option>
              <option value="ondo">Ondo</option>
              <option value="ekiti">Ekiti</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
              <svg
                className="w-4 h-4"
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
            <select className="w-full pl-3 pr-10 py-2.5 bg-surface-card border border-border-input rounded-[25px] text-text-subtle text-xs sm:text-sm focus:outline-none focus:border-brand-primary shadow-xs cursor-pointer appearance-none">
              <option value="">All Storage Hubs</option>
              <option value="ibadan">Ibadan Central Hermetic</option>
              <option value="osun">Osun Cool Chamber</option>
              <option value="abeokuta">Abeokuta Yam Brick</option>
              <option value="akure">Akure Dry Storage</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
              <svg
                className="w-4 h-4"
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
            <select className="w-full pl-3 pr-10 py-2.5 bg-surface-card border border-border-input rounded-[25px] text-text-subtle text-xs sm:text-sm focus:outline-none focus:border-brand-primary shadow-xs cursor-pointer appearance-none">
              <option value="">All Crop Types</option>
              <option value="maize">Maize</option>
              <option value="tomatoes">Tomatoes</option>
              <option value="yam">Yam</option>
              <option value="cassava">Cassava</option>
              <option value="cocoa">Cocoa</option>
              <option value="onion">Onion</option>
              <option value="rice">Rice</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
              <svg
                className="w-4 h-4"
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
            <select className="w-full pl-3 pr-10 py-2.5 bg-surface-card border border-border-input rounded-[25px] text-text-subtle text-xs sm:text-sm focus:outline-none focus:border-brand-primary shadow-xs cursor-pointer appearance-none">
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
              <svg
                className="w-4 h-4"
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
            <select className="w-full pl-3 pr-10 py-2.5 bg-surface-card border border-border-input rounded-[25px] text-text-subtle text-xs sm:text-sm focus:outline-none focus:border-brand-primary shadow-xs cursor-pointer appearance-none">
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
              <svg
                className="w-4 h-4"
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
