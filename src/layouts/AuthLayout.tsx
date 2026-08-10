import Logo from "@/components/Logo";
import { useState, useEffect } from "react";
import { Outlet } from "react-router";

const farmImages = [
  "/Frame 142.svg",
  "/Frame 142 (1).svg",
  "/Frame 142 (2).svg",
  "/Frame 142 (3).svg",
  "/Frame 142 (4).svg",
];

export default function AuthLayout() {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % farmImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Left Column */}
      <div className="w-full md:w-1/2 h-screen flex flex-col overflow-y-auto no-scrollbar relative">
        
        {/* Inner wrapper with min-h-screen and flex-grow ensures content renders properly */}
        <div className="w-full max-w-md mx-auto p-4 pb-12 min-h-screen flex flex-col">
          
          {/* Logo - flex-shrink-0 prevents shrinking */}
          <div className="pt-8 md:pt-4 pb-10 flex-shrink-0">
            <Logo />
          </div>

          {/* Form Content - flex-grow fills available space */}
          <div className="flex flex-col flex-grow justify-center">
            <Outlet />
          </div>
          
        </div>
      </div>

      {/* Right Column */}
      <div className="hidden md:block w-1/2 h-full relative overflow-hidden bg-surface-alt">
        {farmImages.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Farming scene ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
              index === imageIndex
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 z-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
}