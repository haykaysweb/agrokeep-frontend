import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Find storage", href: "#find-storage" },
  { name: "About us", href: "#about" },
  { name: "Contact us", href: "#contact" },
];

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full bg-background px-4 md:px-12 lg:px-16 py-4 sticky top-0 z-50"
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center cursor-pointer">
          <span className="text-2xl md:text-3xl font-bold tracking-tight">
            <span className="text-brand-primary">Agro</span>
            <span className="text-brand-secondary">Keep</span>
          </span>
        </div>

        {/* NAV LINKS */}
        <ul className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.name}>
              <motion.a
                href={link.href}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative inline-block text-text-subtle font-medium text-base py-2 hover:text-brand-primary transition-colors duration-200"
              >
                {link.name}
              </motion.a>
            </li>
          ))}
        </ul>

        {/* RIGHT SIDE CTAs */}
        <div className="flex items-center gap-6">
          <motion.a
            href="#sign-in"
            whileHover={{ y: -2 }}
            className="text-text-main font-medium text-base inline-block hover:text-brand-primary transition-colors duration-200"
          >
            Sign in
          </motion.a>

          <motion.a
            href="#get-started"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative inline-block"
          >
            {/* Orange Offset */}
            <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary"></span>

            {/* Main Button */}
            <span className="relative z-10 flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-text-light">
              <span className="text-base font-medium">
                Get Started
              </span>

              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary">
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-text-light"
                  strokeWidth={2.5}
                />
              </span>
            </span>
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}