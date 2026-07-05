import Logo from "@/components/Logo";
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";

// A simple list of image paths or URLs
const farmImages = [
  "/Frame 142.svg",
  "/Frame 142 (1).svg",
  "/Frame 142 (2).svg",
  "/Frame 142 (3).svg",
  "/Frame 142 (4).svg",
];

export default function AuthLayout() {
  // State to track which image index to show (starts at 0)
  const [imageIndex, setImageIndex] = useState(0);

  // This hook runs a timer when the page loads
  useEffect(() => {
    const timer = setInterval(() => {
      // Move to the next image index. Go back to 0 if we hit the end.
      setImageIndex((prevIndex) => (prevIndex + 1) % farmImages.length);
    }, 5000); // 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#FAF7F2] overflow-hidden">
      <div className="w-full md:w-1/2 p-8 h-full flex flex-col overflow-y-auto">
        <div className="pb-10 pl-26">
          <Logo />
        </div>
        <div className="flex flex-col my-auto justify-center items-center">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Right side container - turned into a relative stack wrapper */}
      <div className="hidden md:block w-1/2 h-full relative overflow-hidden bg-stone-900">
        {farmImages.map((src, index) => {
          const isActive = index === imageIndex;
          
          return (
            <img
              key={src}
              src={src}
              alt={`Farming scene ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                isActive 
                  ? "opacity-100 scale-100 z-10" 
                  : "opacity-0 scale-105 z-0"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}