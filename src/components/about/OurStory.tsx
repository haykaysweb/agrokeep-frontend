import { motion } from "framer-motion";

export default function OurStory() {
  return (
    <section className="py-18">
      <div className="w-full relative max-w-7xl mx-auto px-4 md:px-12 flex flex-col lg:flex-row lg:items-stretch items-center gap-16">
        {/* LEFT - Image & Stats Card  */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative w-full lg:w-1/2 flex flex-col"
        >
          <img
            src="https://res.cloudinary.com/dxgzbqdpb/image/upload/v1783698018/image_4_lataa0.svg"
            alt="Farmer in the field"
            className="rounded-3xl shadow-2xl w-full h-[500px] lg:h-full flex-1 object-cover"
          />

          {/* Stats Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute -bottom-0 right-0 md:right-0 bg-surface-card p-4 rounded-2xl shadow-lg w-[85%] md:w-64 border border-border-light"
          >
            <h3 className="text-4xl font-bold text-brand-primary">40%</h3>
            <p className="text-text-subtle mt-1">
              of Nigerian harvests are lost to poor storage each year.
            </p>
          </motion.div>
        </motion.div>

        {/* RIGHT - Content  */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2 flex flex-col justify-center space-y-4"
        >
          <div className="flex items-center gap-2 text-brand-primary font-medium">
            <img src="/flowerIcon3.svg" alt="" className="w-5 h-5" /> Our Story
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-text-main leading-tight">
            Created <span className="text-brand-primary">for Farmers</span>.
            <br className="hidden lg:block" /> Built to{" "}
            <span className="text-brand-primary">Protect Every Harvest</span>.
          </h2>

          <div className="space-y-4 text-text-subtle text-md leading-relaxed">
            <p>
              Every harvest is more than just a season's yield, it reflects
              months of dedication, investment, and hope for a profitable
              outcome.
            </p>
            <p>
              Unfortunately, many Nigerian farmers continue to lose valuable
              produce, not because they didn't produce enough, but because
              reliable storage solutions remain out of reach.
            </p>
            <p>
              We believed every farmer deserved better. AgroKeep was founded to
              bridge that gap by connecting farmers with trusted storage hubs.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="border-2 border-brand-secondary p-6 md:p-4 rounded-2xl bg-surface-card shadow-sm mt-8"
          >
            <p className="text-text-main font-medium italic">
              "Because every harvest deserves a chance to reach the market, not
              the waste heap."
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
