import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";

export default function WhatGuidesUs() {
  return (
    <section className="bg-[#FAF7F0] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="flex items-center justify-center gap-2 text-[#1B4D3E] font-medium mb-3">
            🌱 What Guides Us
          </p>
          <h2 className="text-5xl font-bold text-stone-900">
            <span className="text-[#1B4D3E]">Purpose</span> Over Paperwork
          </h2>
        </div>

        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-8 bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          
          {/* Mission Card */}
          <motion.div 
            whileHover={{ y: -5 }}
               initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{   duration: 0.6,
        ease: "easeOut", }}
        
            className="p-8"
          >
            <div className="flex items-center gap-2 text-[#1B4D3E] mb-6">
              <Target className="h-6 w-6" />
              <h3 className="text-xl font-bold text-stone-900">Our Mission</h3>
            </div>
            <p className="text-stone-600 text-lg leading-relaxed">
              Empowering farmers and agribusinesses with reliable storage infrastructure that preserves harvests, improves profitability, and strengthens food security.
            </p>
          </motion.div>

          {/* Vision Card (Colored) */}
          <motion.div 
            whileHover={{ y: -5 }}
               initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-[#1B4D3E] p-8 rounded-2xl text-white"
          >
            <div className="flex items-center gap-2 text-emerald-200 mb-6">
              <Eye className="h-6 w-6" />
              <h3 className="text-xl font-bold">Our Vision</h3>
            </div>
            <p className="text-emerald-50 text-lg leading-relaxed">
              To become Africa's most trusted agricultural storage network, ensuring that no harvest is lost because of inadequate storage.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}