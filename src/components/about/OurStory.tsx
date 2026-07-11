import { motion } from "framer-motion";

export default function OurStory() {
  return (
    <section className="bg-[#FAF7F0] py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* LEFT: Image & Stats Card */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative w-full lg:w-1/2"
        >
          <img 
            src="https://res.cloudinary.com/dxgzbqdpb/image/upload/v1783698018/image_4_lataa0.svg" 
            alt="Farmer in the field" 
            className="rounded-3xl shadow-2xl w-full h-[500px] md:h-[650px] object-cover"
          />
          
          {/* Stats Overlay */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute -bottom-10 right-6 bg-white p-6 rounded-2xl shadow-lg w-64 border border-stone-100"
          >
            <h3 className="text-4xl font-bold text-[#1B4D3E]">40%</h3>
            <p className="text-stone-600 mt-1">of Nigerian harvests are lost to poor storage each year.</p>
          </motion.div>
        </motion.div>

        {/* RIGHT: Content */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2 space-y-6"
        >
          <div className="flex items-center gap-2 text-[#1B4D3E] font-medium">
            <span>🌱</span> Our Story
          </div>
          
          <h2 className="text-5xl font-bold text-stone-900 leading-tight">
            Created <span className="text-[#1B4D3E]">for Farmers</span>. Built to <span className="text-[#1B4D3E]">Protect Every Harvest</span>.
          </h2>
          
          <div className="space-y-4 text-stone-600 text-lg leading-relaxed">
            <p>Every harvest is more than just a season's yield, it reflects months of dedication, investment, and hope for a profitable outcome.</p>
            <p>Unfortunately, many Nigerian farmers continue to lose valuable produce, not because they didn't produce enough, but because reliable storage solutions remain out of reach.</p>
            <p>We believed every farmer deserved better. AgroKeep was founded to bridge that gap by connecting farmers with trusted storage hubs.</p>
          </div>

          <motion.div 
            whileHover={{ scale: 1.01 }}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="border-2 border-amber-400 p-6 rounded-2xl bg-white shadow-sm mt-8"
          >
            <p className="text-stone-800 font-medium italic">
              "Because every harvest deserves a chance to reach the market, not the waste heap."
            </p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}