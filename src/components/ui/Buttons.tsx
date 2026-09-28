import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function PrimaryButton({
  text,
  onClick,
  href,
  type = "button",
  openInNewTab = false,
  ...props
}: {
  text: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  openInNewTab?: boolean;
  [key: string]: unknown;
}) {
  const content = (
    <>
      <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary" />
      <span className="relative z-10 flex h-12 items-center gap-3 rounded-full bg-brand-primary px-8 py-3 text-text-light">
        <span className="text-sm font-medium md:text-base whitespace-nowrap cursor-pointer">
          {text}
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary">
          <ArrowUpRight className="h-4 w-4 text-text-light" strokeWidth={2.5} />
        </span>
      </span>
    </>
  );

  const buttonClass = "relative inline-block";

  if (href) {
    return (
      <motion.a
        href={href}
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className={buttonClass}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={buttonClass}
      {...props}
    >
      {content}
    </motion.button>
  );
}

export function SecondaryButton({
  text,
  onClick,
  href,
  type = "button",
  openInNewTab = false,
  ...props
}: {
  text: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  openInNewTab?: boolean;
  [key: string]: unknown;
}) {
  const content = (
    <>
      <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary" />
      <span className="relative z-10 flex h-12 items-center justify-center rounded-full bg-white px-8 py-3 text-brand-primary font-medium text-sm md:text-base whitespace-nowrap cursor-pointer">
        {text}
      </span>
    </>
  );

  const buttonClass = "relative inline-block";

  if (href) {
    return (
      <motion.a
        href={href}
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className={buttonClass}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={buttonClass}
      {...props}
    >
      {content}
    </motion.button>
  );
}
