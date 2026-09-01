interface BookingHeaderProps {
  onAddClick?: () => void;
}

export default function BookingHeader({ onAddClick }: BookingHeaderProps) {
  return (
    <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full sm:mb-6">
      {/* Title and Description */}
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">
          Bookings
        </h1>
        <p className="text-sm text-text-subtle mt-1">
          Manage storage reservations across AgroKeep.
        </p>
      </div>

      <button
        onClick={onAddClick}
        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary/90 text-text-light text-sm font-medium transition-colors shadow-xs cursor-pointer"
      >
        <img src="/Add.svg" alt="Add" className="w-4 h-4" />
        Add Booking
      </button>
    </section>
  );
}