import {
  Building2,
  CalendarDays,
  CreditCard,
  Grid2x2,
  LogOut,
  Menu,
  Settings,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import Logo from "./Logo";
import { NavLink } from "react-router";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/hooks/useAuth";
import LogoutModal from "./LogoutModal";

export default function AdminDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const { handleLogout } = useAuth();

  const drawerContent = (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white text-black z-50 flex flex-col justify-between px-2 transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Scrollable/Flex Section */}
        <div className="overflow-y-auto">
          <div className="p-4 flex justify-between items-center">
            <Logo />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation menu"
              className="cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <NavLink
            to="/admin"
            end
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
                isActive
                  ? "bg-[#1E5E3A] text-white border-3"
                  : "hover:text-[#1E5E3A]"
              }`
            }
          >
            <Grid2x2 /> <h1>Dashboard</h1>
          </NavLink>

          <NavLink
            to="/admin/bookings"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
                isActive
                  ? "bg-[#1E5E3A] text-white border-3"
                  : "hover:text-[#1E5E3A]"
              }`
            }
          >
            <CalendarDays /> <h1>Bookings</h1>
          </NavLink>

          <NavLink
            to="/admin/storage-hubs"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
                isActive
                  ? "bg-[#1E5E3A] text-white border-3"
                  : "hover:text-[#1E5E3A]"
              }`
            }
          >
            <Warehouse /> <h1>Storage Hubs</h1>
          </NavLink>

          <NavLink
            to="/admin/hub-applications"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
                isActive
                  ? "bg-[#1E5E3A] text-white border-3"
                  : "hover:text-[#1E5E3A]"
              }`
            }
          >
            <Building2 /> <h1>Hub Applications</h1>
          </NavLink>

          <NavLink
            to="/admin/farmers"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
                isActive
                  ? "bg-[#1E5E3A] text-white border-3"
                  : "hover:text-[#1E5E3A]"
              }`
            }
          >
            <Users /> <h1>Farmers</h1>
          </NavLink>

          <NavLink
            to="/admin/payments"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
                isActive
                  ? "bg-[#1E5E3A] text-white border-3"
                  : "hover:text-[#1E5E3A]"
              }`
            }
          >
            <CreditCard /> <h1>Payments</h1>
          </NavLink>
        </div>

        {/* Bottom Pinned Footer Section (Settings & Logout) */}
        <div className="pb-4 pt-2 border-t border-gray-100 space-y-1">
          <NavLink
            to="/admin/settings"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-2 ${
                isActive
                  ? "bg-[#1E5E3A] text-white border-3"
                  : "hover:text-[#1E5E3A]"
              }`
            }
          >
            <Settings /> <h1>Settings</h1>
          </NavLink>

          <div
            className="p-3 w-50 rounded-3xl flex gap-2 cursor-pointer hover:text-red-600 items-center"
            onClick={() => {
              setIsOpen(false);
              setIsLogoutOpen(true);
            }}
          >
            <LogOut /> <p className="text-red-600">Logout</p>
          </div>
        </div>
      </aside>

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={() => {
          setIsLogoutOpen(false);
          handleLogout();
        }}
      />
    </>
  );

  return (
    <>
      {/* Hamburger button (stays inside AdminNav) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 text-[#1E5E3A] cursor-pointer"
        aria-label="Open navigation menu"
      >
        <Menu size={28} />
      </button>

      {/* Render drawer directly into document.body */}
      {createPortal(drawerContent, document.body)}
    </>
  );
}
