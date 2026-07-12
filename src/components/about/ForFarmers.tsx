import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Zap, Wheat, Search, TrendingUp } from "lucide-react";

const benefits = [
  { icon: Leaf, text: "Reduce post-harvest losses" },
  { icon: Zap, text: "Book online or via USSD" },
  { icon: ShieldCheck, text: "Secure and reliable storage" },
  { icon: Search, text: "Find verified storage facilities nearby" },
  { icon: Wheat, text: "Better control when and where you sell" },
  { icon: TrendingUp, text: "Transparent pricing" }
];

export default function ForFarmers() {
  return (
    <section className="bg-[#FAF7F0] py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* LEFT: Image */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
   
          className="w-full lg:w-1/2"
        >
          <img 
            src="https://res.cloudinary.com/dxgzbqdpb/image/upload/v1783700503/image_5_k0tmva.svg" 
            alt="Farmer with tomatoes" 
            className="rounded-3xl shadow-2xl w-full h-[550px] object-cover"
          />
        </motion.div>

        {/* RIGHT: Content & Benefits Grid */}
        <div className="w-full lg:w-1/2">
          <p className="flex items-center gap-2 text-[#1B4D3E] font-medium mb-4">
            🌱 For Farmers
          </p>
          <h2 className="text-5xl font-bold text-stone-900 mb-12">
            Helping Farmers <span className="text-[#1B4D3E]">Harvest</span><br /> 
            More Than Crops
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-stone-100 shadow-sm"
              >
                <benefit.icon className="h-5 w-5 text-[#1B4D3E]" />
                <span className="text-stone-700 font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}