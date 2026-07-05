import { Outlet } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-main font-sans ">
      <Navbar />

      {/* flex-1 makes the main content area expand to fill the available screen height */}
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
