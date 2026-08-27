import AdminNav from "@/components/AdminNav";
import Sidebar from "@/components/Sidebar";
import { Outlet, ScrollRestoration } from "react-router";

export default function AdminLayout() {
  return (
    <div>
      <Sidebar />
      <div className="lg:ml-[240px] ">
        <AdminNav />
        <div className="bg-[#F9F6F0] ">
          <ScrollRestoration />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
