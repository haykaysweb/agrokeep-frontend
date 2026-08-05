import { HelpCircle, PhoneCall } from "lucide-react";

export default function SupportBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-[#1B4D3E] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        
        {/* Left Side: Icon and Text */}
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
          <div className="w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center shrink-0">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Need help choosing the right storage?
            </h2>
            <p className="text-stone-300 text-sm md:text-base">
              Speak with an AgroKeep advisor for crop-specific recommendations.
            </p>
          </div>
        </div>

        {/* Right Side: Action Button with Amber Shadow Layer */}
        <div className="relative shrink-0 mt-4 md:mt-0">
          <div className="absolute top-1 left-1 w-full h-full bg-amber-500 rounded-full" />
          <button className="relative bg-white text-stone-900 px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-stone-50 transition-transform hover:-translate-y-0.5">
            Contact Support <PhoneCall className="w-4 h-4 text-amber-600" />
          </button>
        </div>

      </div>
    </section>
  );
}