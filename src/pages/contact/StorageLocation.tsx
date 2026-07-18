import { motion } from "framer-motion";

const locations = [
  { state: "Oyo State", address: "1, Oyo road, Oyo Town" },
  { state: "Oyo State", address: "1, Saki road, Saki" },
  { state: "Osun State", address: "1, Osun road, Osogbo" },
  { state: "Osun State", address: "1, Ikirun road, Ikirun" },
  { state: "Ekiti State", address: "1, Ekiti road, Ekiti Town" },
  { state: "Ekiti State", address: "1, Ekiti road, Ekiti Town" },
  { state: "Ondo State", address: "1, Ondo road, Ondo Town" },
  { state: "Ogun State", address: "1, Isagamu road, Isagamu" },
  { state: "Ogun State", address: "1, Ogun road, Ogun" },
];

// Staggered container animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }, // Delay between each card
  },
};

// Slide-up animation for each card
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" as const } 
  },
};

export default function StorageLocation() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-16">
      <h2 className="text-4xl md:text-5xl font-bold text-text-main text-center mb-12">
        Our Storage Locations
      </h2>

      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // Animates when 20% of section is visible
      >
        {locations.map((loc, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="bg-surface-card p-6 rounded-2xl border border-border-light shadow-sm"
          >
            <h3 className="text-xl font-bold text-text-main mb-1">
              {loc.state}
            </h3>
            <p className="text-text-subtle mb-4">{loc.address}</p>
            <hr className="border-border-light mb-4" />
            <div className="flex items-center gap-2 text-brand-primary font-medium">
              <img src="phoneCon.svg" alt="" />
              <span>+234 900 0000 0000</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}