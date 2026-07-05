import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import UserAvatar from "./UserAvatar"; 
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Find storage", href: "#find-storage" },
  { name: "About us", href: "#about" },
  { name: "Contact us", href: "#contact" },
];

export default function Navbar() {
  // 💡 Added isAuthenticating to prevent flash of "Sign In" buttons
  const { user, isAuthenticating } = useAuth();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-background"
    >
<<<<<<< HEAD
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-12">
        {/* Logo */}
        <div className="cursor-pointer">
          <span className="text-2xl font-bold tracking-tight md:text-3xl">
=======
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center cursor-pointer">
          <span className="text-2xl md:text-3xl font-bold tracking-tight">
>>>>>>> 668b0d55bcb51868df9e8cfc592941776e8437d6
            <span className="text-brand-primary">Agro</span>
            <span className="text-brand-secondary">Keep</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
<<<<<<< HEAD
                whileHover={{ y: -2 }}
                className="font-medium text-text-subtle transition-colors hover:text-brand-primary"
=======
                className="relative inline-block text-text-subtle font-medium text-base py-2 hover:text-brand-primary transition-colors duration-200"
>>>>>>> 668b0d55bcb51868df9e8cfc592941776e8437d6
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

<<<<<<< HEAD
        {/* Right Side */}
        <div className="flex items-center gap-4 md:gap-6">
          <motion.a
            href="#sign-in"
            whileHover={{ y: -2 }}
            className="hidden font-medium text-text-main transition-colors hover:text-brand-primary sm:block"
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

            {/* Button */}
            <span className="relative z-10 flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-text-light">
              <span className="text-sm font-medium md:text-base">
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
=======
        {/* RIGHT SIDE CTAs */}
        <div className="flex items-center gap-6">
          {/* 💡 Wait for authentication check before showing buttons */}
          {!isAuthenticating && (
            user ? (
              <UserAvatar name={user.fullName || "User"} />
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-text-main font-medium text-base inline-block hover:text-brand-primary transition-colors duration-200"
                >
                  Sign in
                </Link>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative inline-block"
                >
                  <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary"></span>
                  <Link
                    to="/auth/register"
                    className="relative z-10 flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-text-light"
                  >
                    <span className="text-base font-medium">Get Started</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary">
                      <ArrowUpRight className="h-3.5 w-3.5 text-text-light" strokeWidth={2.5} />
                    </span>
                  </Link>
                </motion.div>
              </>
            )
          )}
>>>>>>> 668b0d55bcb51868df9e8cfc592941776e8437d6
        </div>
      </div>
    </motion.nav>
  );
}