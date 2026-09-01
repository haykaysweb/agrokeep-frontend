interface AdminBookingViewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminBookingViewProfileModal({
  isOpen,
  onClose,
}: AdminBookingViewProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-surface-card rounded-2xl p-6 sm:p-8 w-[95%] sm:w-full max-w-lg border border-card-border shadow-xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-text-muted hover:text-text-main text-2xl cursor-pointer font-bold leading-none p-1 rounded-lg hover:bg-surface-hover transition-colors"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Modal Header */}
        <div className="mb-6 sm:mb-8 pr-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-text-main leading-snug">
            Contact Adewale Anuoluwapo
          </h3>
          <p className="text-sm text-text-muted mt-1.5 leading-normal">
            Booking - AGK-004582 &bull; Ibadan Central Hermetic Hub
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3.5">
          <button 
            onClick={() => alert("Calling Adewale...")}
            className="w-full py-3.5 px-4 border border-card-border text-text-main font-medium rounded-xl hover:bg-brand-primary hover:text-white hover:border-transparent transition-all duration-200 text-base cursor-pointer text-center"
          >
            Call Adewale
          </button>
          <button 
            onClick={() => alert("Opening SMS...")}
            className="w-full py-3.5 px-4 border border-card-border text-text-main font-medium rounded-xl hover:bg-brand-primary hover:text-white hover:border-transparent transition-all duration-200 text-base cursor-pointer text-center"
          >
            Send SMS Update
          </button>
          <button 
            onClick={() => alert("Opening Email...")}
            className="w-full py-3.5 px-4 border border-card-border text-text-main font-medium rounded-xl hover:bg-brand-primary hover:text-white hover:border-transparent transition-all duration-200 text-base cursor-pointer text-center"
          >
            Send Email Update
          </button>
        </div>
      </div>
    </div>
  );
}