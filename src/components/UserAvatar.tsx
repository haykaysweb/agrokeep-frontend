import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown, Book } from "lucide-react";
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

  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Open logout confirmation modal
  const initiateLogout = () => {
    setIsOpen(false);
    setIsLogoutModalOpen(true);
  };

  // Perform the actual logout
  const handleLogout = async () => {
    setIsLogoutModalOpen(false);

    try {
      await logoutUserApi();

      showToast.success("Logged out successfully");

      // Clear authenticated user state
      setUser(null);

      // Clear cached current user
      queryClient.setQueryData(["currentUser"], null);

      // Redirect to login
      navigateWithDelay(navigate, "/auth/login");
    } catch {
      showToast.error("Failed to log out. Please try again.");
    }
  };

  const initial =
    user?.fullName?.charAt(0)?.toUpperCase() ||
    name?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <div ref={dropdownRef} className="relative">
      {/* User menu trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open user menu"
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-stone-200 hover:bg-stone-50 transition-colors shadow-sm"
      >
        {/* Avatar */}
        <div className="h-8 w-8 rounded-full overflow-hidden bg-brand-primary flex items-center justify-center shrink-0">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName || name || "User"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-white">{initial}</span>
          )}
        </div>

        {/* User name */}
        <span className="text-sm font-medium text-stone-800">{name}</span>

        {/* Dropdown arrow */}
        <ChevronDown
          className={`h-4 w-4 text-stone-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            role="menu"
            aria-label="User menu"
            className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-stone-100 py-2 z-50"
          >
            {/* Profile */}
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              role="menuitem"
              className="flex items-center gap-3 px-4 py-3 text-text-main hover:bg-stone-50 transition-colors"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>

            {/* My Bookings */}
            <Link
              to="/storage/bookings"
              onClick={() => setIsOpen(false)}
              role="menuitem"
              className="flex items-center gap-3 px-4 py-3 text-text-main hover:bg-stone-50 transition-colors"
            >
              <Book className="h-4 w-4" />
              <span>My Bookings</span>
            </Link>

            <hr className="border-stone-100 my-1" />

            {/* Logout */}
            <button
              type="button"
              onClick={initiateLogout}
              role="menuitem"
              className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout confirmation modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
