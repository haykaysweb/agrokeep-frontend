interface AdminBookingCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel?: () => void;
  onKeepBooking?: () => void;
}

export default function AdminBookingCancelModal({
  isOpen,
  onClose,
  onConfirmCancel,
  onKeepBooking,
}: AdminBookingCancelModalProps) {
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

        {/* Modal Header & Message */}
        <div className="mb-6 sm:mb-8 pr-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-text-main leading-snug">
            Cancel Booking AGK-004582?
          </h3>
          <p className="text-sm text-text-muted mt-2 leading-relaxed">
            This will cancel Adewale&apos;s Booking. Adewale will be notified
            and any deposit will be queued for refund.
          </p>
        </div>

        {/* Actions / Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onKeepBooking || onClose}
            className="w-full sm:w-1/2 py-3.5 px-4 border border-card-border text-text-main font-medium rounded-2xl hover:bg-surface-hover transition-all duration-200 text-base cursor-pointer text-center"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirmCancel || (() => alert("Booking cancelled..."))}
            className="w-full sm:w-1/2 py-3.5 px-4 bg-semantic-error text-white font-medium rounded-2xl hover:bg-semantic-error/85 transition-all duration-200 text-base cursor-pointer text-center shadow-xs"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
}
