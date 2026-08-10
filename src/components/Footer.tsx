import { motion } from "framer-motion";
import { Link } from "react-router";

export default function Footer() {
  const footerLinks = {
    "Quick Links": [
      { label: "Home", href: "/" },
      { label: "Find Storage", href: "/storage" },
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],

    "For Farmers": [
      { label: "Pricing", href: "/pricing" },
      { label: "Crop Guide", href: "/crop-guide" },
      { label: "Support", href: "/support" },
    ],

    "For Partners": [
      { label: "Become a Partner", href: "/partners" },
      { label: "Partner Resources", href: "/partner-resources" },
    ],

    Legal: [
      { label: "Terms & Privacy", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
      { label: "Trust & Safety", href: "/trust-safety" },
    ],
  };

  const socials = [
    {
      name: "Facebook",
      href: "#",
      icon: "/facebook.svg",
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: "/linkedin.svg",
    },
    {
      name: "Instagram",
      href: "#",
      icon: "/instagram.svg",
    },
    {
      name: "Twitter",
      href: "#",
      icon: "/twitter.svg",
    },
  ];

  return (
    <footer className="overflow-hidden bg-brand-primary text-text-light">
      {/* Main Footer Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-7xl flex-col space-y-12 px-4 py-14 md:px-12 md:py-16"
      >
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Logo & Description */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-block text-2xl font-bold tracking-tight"
            >
              Agro<span className="text-brand-secondary">Keep</span>
            </Link>

            <p className=" text-sm leading-relaxed text-text-light/70">
              Verified post-harvest storage for Nigerian farmers and
              agribusinesses.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-text-light/10 transition-colors hover:bg-brand-secondary"
                  aria-label={social.name}
                >
                  <img src={social.icon} alt="" className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h4 className="font-bold text-text-light">{title}</h4>

              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-text-light/70 transition hover:text-brand-secondary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4  border-text-light/10 text-xs text-text-light/60 md:flex-row">
          <p>© 2026 AgroKeep. All rights reserved.</p>

          <p className="flex items-center gap-2">
            Made for farmers in Southwest Nigeria
            <img src="/footerFlowerIcon.svg" alt="" className="h-4 w-4" />
          </p>
        </div>
      </motion.div>

      {/* Large Background Watermark */}
      <div className="relative mt-2 select-none overflow-hidden">
        <h1 className="whitespace-nowrap text-center text-[clamp(5rem,18vw,12rem)] font-bold leading-none tracking-tighter text-text-light/5">
          AgroKeep
        </h1>
      </div>
    </footer>
  );
}
