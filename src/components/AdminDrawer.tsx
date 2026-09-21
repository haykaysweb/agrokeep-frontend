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
import { useAuth } from "@/hooks/useAuth";

export default function AdminDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { handleLogout } = useAuth();

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 text-[#1E5E3A]"
        aria-label="Open navigation menu"
      >
        <Menu size={28} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white text-black z-60 px-2 transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          <Logo />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
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

        <NavLink
          to="/admin/settings"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `transition-all duration-300 ease-in p-3 mt-15 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
              isActive
                ? "bg-[#1E5E3A] text-white border-3"
                : "hover:text-[#1E5E3A]"
            }`
          }
        >
          <Settings /> <h1>Settings</h1>
        </NavLink>

        <div
          className="p-4 flex gap-2 cursor-pointer hover:text-red-600 items-center"
          onClick={() => {
            setIsOpen(false);
            handleLogout();
          }}
        >
          <LogOut /> <p className="text-red-600">Logout</p>
        </div>
      </aside>
    </>
  );
}
