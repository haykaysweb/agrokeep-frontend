import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";

export default function WhatGuidesUs() {
  return (
    <section className=" py-18">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="flex items-center justify-center gap-2 text-brand-primary font-medium mb-3">
            <img src="/flowerIcon3.svg" alt="" className="w-5 h-5" /> What
            Guides Us
          </p>
          <h2 className="text-5xl font-bold text-text-main">
            <span className="text-brand-primary">Purpose</span> Over Paperwork
          </h2>
        </div>

        {/* Cards Container */}
        <div className="bg-text-light p-8 md:p-12 rounded-3xl shadow-sm border border-border-light grid md:grid-cols-2 gap-8 items-start">
          {/* Mission Card */}
          <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="p-4"
          >
            <div className="flex items-center gap-2 text-brand-primary mb-6">
              <Target className="h-6 w-6" />
              <h3 className="text-xl font-bold text-text-main">Our Mission</h3>
            </div>
            <p className="text-text-subtle text-xl md:text-3xl leading-relaxed">
              Empowering farmers and agribusinesses with reliable storage
              infrastructure that preserves harvests, improves profitability,
              and strengthens food security.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-brand-primary p-8 md:p-10 rounded-2xl text-white shadow-lg"
          >
            <div className="flex items-center gap-2 text-white/80 mb-6">
              <Eye className="h-6 w-6" />
              <h3 className="text-xl font-bold text-white">Our Vision</h3>
            </div>
            <p className="text-white text-xl md:text-3xl leading-relaxed">
              To become Africa's most trusted agricultural storage network,
              ensuring that no harvest is lost because of inadequate storage.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
