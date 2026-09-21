import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, type LucideIcon } from "lucide-react";

interface CustomDropdownProps {
  label: string;
  icon: LucideIcon;
  options: string[];
  onSelect?: (value: string) => void;
}

export function CustomDropdown({
  label,
  icon: Icon,
  options,
  onSelect,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !(target instanceof Element && target.closest("[data-dropdown-menu]"))
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();

      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    onSelect?.(option);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div className="mb-1.5 flex items-center gap-2">
        <Icon className="h-4 w-4 text-stone-500" />

        <span className="text-xs font-medium text-stone-500">{label}</span>
      </div>

      <motion.div
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="flex w-full cursor-pointer items-center justify-between rounded-full border border-stone-200 bg-stone-50 px-4 py-3 shadow-sm"
      >
        <span className="truncate pr-3 font-medium text-stone-700">
          {selected}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-stone-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.ul
                data-dropdown-menu
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: "fixed",
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  width: dropdownPosition.width,
                }}
                className="z-[9999] overflow-hidden rounded-2xl border border-stone-100 bg-white p-1 shadow-xl"
              >
                {options.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleSelect(option)}
                    className="cursor-pointer rounded-xl px-4 py-3 text-sm text-stone-700 transition-colors hover:bg-emerald-50"
                  >
                    {option}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
