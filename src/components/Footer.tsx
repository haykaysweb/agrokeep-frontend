import { motion } from "framer-motion";

export default function Footer() {
  const footerLinks = {
    "Quick Links": ["Home", "Find Storage", "About Us", "Contact Us"],
    "For Farmers": ["Find Storage", "Pricing", "Crop Guide", "Support"],
    "For Partners": [
      "Become a Partner",
      "Hub Dashboard",
      "Partner Resources",
      "Contact",
    ],
    Legal: ["Terms", "Privacy", "Cookies", "Trust & Safety"],
  };

  return (
    <footer className="w-full bg-brand-primary text-text-light pt-16 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto flex flex-col space-y-12 px-4 md:px-12"
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Logo & Socials */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold">AgroKeep</h2>
            <p className="text-text-light/80 text-sm leading-relaxed">
              Verified post-harvest storage for Nigerian farmers and
              agribusinesses.
            </p>
            <div className="flex gap-4">
              {/* icons */}
              {["facebook", "linkedin", "instagram", "twitter"].map(
                (social) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ y: -3 }}
                    className="w-10 h-10 flex items-center justify-center bg-text-light/10 rounded-full hover:bg-brand-secondary transition-colors"
                  >
                    <img
                      src={`/${social}.svg`}
                      alt={social}
                      className="w-5 h-5"
                    />
                  </motion.a>
                ),
              )}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h4 className="font-bold">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-text-light/70 hover:text-brand-secondary transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className=" border-text-light/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-light/60">
          <p>© 2026 AgroKeep. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Made for farmers in Southwest Nigeria{" "}
            <img src="/footerFlowerIcon.svg" alt="" className="w-4 h-4" />
          </p>
        </div>
      </motion.div>

      {/* Large Background Watermark */}
      <div className="relative mt-8 overflow-hidden select-none">
        <h1 className="text-[12rem] font-bold text-text-light/5 text-center leading-none tracking-tighter">
          AgroKeep
        </h1>
      </div>
    </footer>
  );
}
