import AdminNav from "@/components/AdminNav";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div className="min-h-dvh bg-[#F9F6F0]">
      <Sidebar />
      <div className="min-h-screen lg:ml-60 flex flex-col">
        <AdminNav />
        <main className="flex-1 pt-20 px-4 md:px-6 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
