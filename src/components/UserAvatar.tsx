import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { logoutUserApi } from "@/api/auth";
import { useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/utils/CustomToast";
import { navigateWithDelay } from "@/utils/navigation";
import LogoutModal from "./LogoutModal";

interface UserAvatarProps {
  name: string;
}

export default function UserAvatar({ name }: UserAvatarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, setUser } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Just opens the modal
  const initiateLogout = () => {
    setIsOpen(false);
    setIsLogoutModalOpen(true);
  };

  // The actual logout logic
  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    try {
      await logoutUserApi();
      showToast.success("Logged out successfully");

      // Cleanup state before redirecting
      setUser(null);
      queryClient.setQueryData(["currentUser"], null);

      // Perform the delayed navigation
      navigateWithDelay(navigate, "/auth/login");
    } catch (error) {
      console.error("Logout API call failed:", error);
      showToast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-stone-200 hover:bg-stone-50 transition-colors shadow-sm"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white text-sm font-semibold">
          {user?.fullName.charAt(0).toUpperCase() || "U"}
        </div>
        <span className="text-sm font-medium text-stone-700">{name}</span>
        <ChevronDown
          className={`h-4 w-4 text-stone-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-stone-100 py-2 z-50"
          >
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-text-main hover:bg-stone-50 transition-colors"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <hr className="border-stone-100" />
            <button
              onClick={initiateLogout} // Now calls the modal trigger
              className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
