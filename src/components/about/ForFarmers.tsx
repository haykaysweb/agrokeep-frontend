import { motion } from "framer-motion";

const benefits = [
  { text: "Reduce post-harvest losses" },
  { text: "Book online or via USSD" },
  { text: "Secure and reliable storage" },
  { text: "Find verified storage facilities nearby" },
  { text: "Better control when and where you sell" },
  { text: "Transparent pricing" },
];

export default function ForFarmers() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-12 py-18">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* LEFT - Image */}
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

        {/* RIGHT - Content & Benefits Grid */}
        <div className="w-full lg:w-1/2">
          <p className="flex items-center gap-2 text-brand-primary font-medium mb-4">
            <img src="/flowerIcon3.svg" alt="" className="w-5 h-5" /> For Farmers
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-text-main mb-12">
            Helping Farmers <span className="text-brand-primary">Harvest </span>
            <br className="hidden md:block"/>
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
                className="flex items-center gap-3 bg-surface-card p-4 rounded-xl border border-border-light shadow-sm"
              >
                <img src="/flowerIcon3.svg" alt="" className="w-5 h-5" />
                <span className="text-text-subtle font-medium">
                  {benefit.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}