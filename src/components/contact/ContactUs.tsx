import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactUs() {
  return (
    <>
      <section
        className="relative w-full h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dw5bai7mk/image/upload/v1783422830/markus-winkler-HeqXGxnsnX4-unsplash_whdicv.jpg')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-overlay-dark/70" />
        <div className="relative z-10 text-center px-4 max-w-2xl text-text-light">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg md:text-xl font-light text-text-light/90">
            We're here to help you every step of the way!
          </p>
        </div>
      </section>

      <main className="w-full max-w-7xl mx-auto px-4 md:px-12 py-18">
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-brand-primary font-medium">
              <img src="/flowerIcon3.svg" alt="" className="w-5 h-5" />
              <span>Contact Us</span>
            </div>
            <h1 className="text-5xl font-bold text-text-main">
              We Are <span className="text-brand-primary">Ready to Help</span>
            </h1>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-10">
                  <img src="/phone.svg" alt="phone" />
                </div>
                <div>
                  <p className="font-semibold text-text-main">Phone</p>
                  <p className="text-text-subtle">+234 900 0000 0000</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10">
                  <img src="/email.svg" alt="email" />
                </div>
                <div>
                  <p className="font-semibold text-text-main">Email</p>
                  <p className="text-text-subtle">company@agrokeep.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column*/}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full name"
              className="w-full p-4 rounded-xl bg-surface-card border border-border-input focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all placeholder:text-text-muted"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email address"
                className="p-4 rounded-xl bg-surface-card border border-border-input focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all placeholder:text-text-muted"
              />
              <input
                type="tel"
                placeholder="Phone number"
                className="p-4 rounded-xl bg-surface-card border border-border-input focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all placeholder:text-text-muted"
              />
            </div>

            <textarea
              placeholder="Message (Tell us how we can help you)"
              rows={6}
              className="w-full p-4 rounded-xl bg-surface-card border border-border-input focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all placeholder:text-text-muted resize-none"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="relative inline-block w-full cursor-pointer"
            >
              {/* Orange Offset */}
              <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary "></span>

              {/* Button */}
              <span className="relative z-10 flex h-10 items-center justify-center gap-3 rounded-full bg-brand-primary px-8 py-3 text-text-light">
                <span className="text-sm font-medium md:text-base">
                  Explore Hubs
                </span>

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary">
                  <ArrowUpRight
                    className="h-4 w-4 text-text-light"
                    strokeWidth={2.5}
                  />
                </span>
              </span>
            </motion.button>

            <p className="text-sm text-text-muted text-start">
              By submitting, you agree to our terms and privacy policy.
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
