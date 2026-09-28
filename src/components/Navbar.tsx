import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  BookCheck,
  LayoutDashboard,
  Menu,
  User,
  X,
} from "lucide-react";
import { Link, useNavigate, NavLink } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import UserAvatar from "./UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { logoutUserApi } from "@/api/auth";
import { navigateWithDelay } from "@/utils/navigation";
import { showToast } from "@/utils/CustomToast";
import LogoutModal from "./LogoutModal";
import Logo from "./Logo";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Find storage", href: "/storage" },
  { name: "About us", href: "/about" },
  { name: "Contact us", href: "/contact" },
];

export default function Navbar() {
  const { user, isAuthenticating, setUser } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isAdmin = user?.role === "admin";
  /*
   * Mobile logout
   */
  const initiateLogout = () => {
    setIsOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);

    try {
      await logoutUserApi();

      showToast.success("Logged out successfully");

      setUser(null);
      queryClient.setQueryData(["currentUser"], null);

      navigateWithDelay(navigate, "/auth/login");
    } catch {
      showToast.error("Failed to log out.");
    }
  };

  /* Navbar scroll behavior*/
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border-light"
            : "bg-background border-transparent"
        }`}
      >
        {/* Main Navbar Container */}
        <div className="max-w-7xl mx-auto px-4 md:px-12 h-20 flex items-center justify-between">
          <Logo />
          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center gap-9">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `group relative flex items-center py-2 text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-brand-primary"
                        : "text-text-subtle hover:text-brand-primary"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.name}</span>

                      <span
                        className={`absolute -bottom-0.5 left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-brand-primary transition-all duration-300 ${
                          isActive
                            ? "w-7 opacity-100"
                            : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-70"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          {/* Desktop Authentication Section */}
          <div className="hidden lg:flex items-center gap-6 min-h-[40px]">
            {isAuthenticating ? (
              <div className="flex items-center gap-6">
                <div className="h-6 w-16 animate-pulse rounded bg-border-light/50" />
                <div className="h-10 w-32 animate-pulse rounded-full bg-border-light/50" />
              </div>
            ) : user ? (
              <UserAvatar name={user.fullName || "User"} />
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-text-main font-medium hover:text-brand-primary transition-colors"
                >
                  Sign in
                </Link>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative inline-block cursor-pointer"
                  onClick={() => navigate("/auth/register")}
                >
                  <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary" />

                  <span className="relative z-10 flex h-10 items-center gap-3 rounded-full bg-brand-primary px-4 py-3 text-text-light">
                    <span className="text-sm font-medium md:text-base">
                      Get Started
                    </span>

                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary">
                      <ArrowUpRight
                        className="h-3 w-3 text-text-light"
                        strokeWidth={2.5}
                      />
                    </span>
                  </span>
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-text-main"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden absolute top-20 left-0 w-full bg-background backdrop-blur-sm border-b border-border-light overflow-hidden"
            >
              {/* Logged-in User Information */}
              {user && (
                <div className="max-w-7xl mx-auto px-4 md:px-12 pt-6 pb-2">
                  <div className="flex items-center gap-3 py-4 rounded-xl">
                    {/* User Avatar */}
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-brand-primary flex items-center justify-center shrink-0">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-white">
                          {user.fullName?.charAt(0).toUpperCase() || "U"}
                        </span>
                      )}
                    </div>

                    {/* User Information */}
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-text-main truncate">
                        {user.fullName || "User"}
                      </p>

                      <p className="text-xs text-stone-500 truncate">
                        {user.email || ""}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <ul className="flex flex-col gap-6 max-w-7xl mx-auto px-4 md:px-12 p-6">
                {/* My Bookings */}
                {user && (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 text-text-main hover:bg-stone-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/storage/bookings"
                      className="flex items-center gap-3 text-text-main hover:bg-stone-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <BookCheck className="h-5 w-5" />
                      <span>My Bookings</span>
                    </Link>

                    {/* admin */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-3 text-text-main hover:bg-stone-50 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <li>
                      <hr className="border-stone-100" />
                    </li>
                  </>
                )}

                {/* Main Navigation Links */}
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-text-subtle text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}

                {/* Mobile Authentication Actions */}
                <li className="mt-4 border-t border-border-light pt-4">
                  {user ? (
                    <button
                      type="button"
                      onClick={initiateLogout}
                      className="text-red-600 font-medium text-lg text-left py-4"
                    >
                      Logout
                    </button>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link
                        to="/auth/login"
                        className="bg-brand-primary text-text-light py-3 px-6 rounded-full text-center font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign in
                      </Link>

                      <Link
                        to="/auth/register"
                        className="bg-brand-primary text-text-light py-3 px-6 rounded-full text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        Get Started
                      </Link>
                    </div>
                  )}
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
