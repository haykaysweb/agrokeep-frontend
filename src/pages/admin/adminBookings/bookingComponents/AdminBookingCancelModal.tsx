interface AdminBookingCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  farmerName: string;
  onConfirmCancel: () => void;
  onKeepBooking?: () => void;
  isCancelling?: boolean;
}

export default function AdminBookingCancelModal({
  isOpen,
  onClose,
  bookingId,
  farmerName,
  onConfirmCancel,
  onKeepBooking,
  isCancelling = false,
}: AdminBookingCancelModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-surface-card rounded-2xl p-6 sm:p-8 w-[95%] sm:w-full max-w-lg border border-card-border shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isCancelling}
          className="absolute top-5 right-5 text-text-muted hover:text-text-main text-2xl cursor-pointer font-bold leading-none p-1 rounded-lg hover:bg-surface-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="mb-6 sm:mb-8 pr-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-text-main leading-snug">
            Cancel Booking {bookingId}?
          </h3>
          <p className="text-sm text-text-muted mt-2 leading-relaxed">
            This will cancel {farmerName}&apos;s Booking. {farmerName} will be
            notified and any deposit will be queued for refund.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onKeepBooking || onClose}
            disabled={isCancelling}
            className="w-full sm:w-1/2 py-3.5 px-4 border border-card-border text-text-main font-medium rounded-2xl hover:bg-surface-hover transition-all duration-200 text-base cursor-pointer text-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirmCancel}
            disabled={isCancelling}
            className="w-full sm:w-1/2 py-3.5 px-4 bg-semantic-error text-white font-medium rounded-2xl hover:bg-semantic-error/85 transition-all duration-200 text-base cursor-pointer text-center shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isCancelling ? "Cancelling..." : "Cancel Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
