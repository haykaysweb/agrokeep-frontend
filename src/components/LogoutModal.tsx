import { motion, AnimatePresence } from "framer-motion";

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-overlay-dark/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface-card p-8 rounded-3xl max-w-sm w-full text-center shadow-xl"
          >
            <h3 className="text-xl font-bold text-text-main mb-2">
              Are you sure?
            </h3>
            <p className="text-text-subtle mb-6">
              You will be logged out of your AgroKeep account.
            </p>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full border border-border-base hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3 rounded-full bg-semantic-error text-text-light font-medium"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}