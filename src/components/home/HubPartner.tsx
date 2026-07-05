import { motion } from "framer-motion";

export default function HubPartner() {
  return (
    <section className="w-full py-12 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto bg-brand-primary rounded-3xl p-8 md:p-14 flex flex-col items-center text-center space-y-6"
      >
        <div className="flex items-center gap-2 text-surface-card/80 font-medium text-sm">
          <img src="/home.svg" alt="HomeLogo" className="w-4 h-4"/>
          Hub Partner Program
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-surface-card leading-tight">
          Own a warehouse or storage facility?
        </h2>

        <p className="max-w-2xl text-surface-card/90 text-lg md:text-xl">
          Join AgroKeep's verified storage network and earn from your unused
          space. We handle discovery, bookings, and payments — you focus on safe
          storage.
        </p>

        <div className="relative inline-block mt-4 ">
          {/* Orange Offset/Shadow */}
          <div className="absolute inset-0.5 bg-brand-secondary rounded-full translate-x-1 translate-y-1" />
          <button className="relative bg-surface-card text-brand-primary font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition cursor-pointer">
            Become a Hub Partner
          </button>
        </div>
      </motion.div>
    </section>
  );
}
