import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface CustomDropdownProps {
  label: string;
  icon: any;
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

  // Close dropdown when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);

    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Label */}
      <div className="mb-1.5 flex items-center gap-2">
        <Icon className="h-4 w-4 text-stone-500" />

        <span className="text-xs font-medium text-stone-500">{label}</span>
      </div>

      {/* Dropdown Button */}
      <motion.div
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="
          w-full
          bg-stone-50
          border
          border-stone-200
          rounded-full
          px-4
          py-3
          flex
          justify-between
          items-center
          cursor-pointer
          shadow-sm
        "
      >
        <span className="text-stone-700 font-medium">{selected}</span>

        <ChevronDown
          className={`h-4 w-4 text-stone-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.div>

      {/* Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="
              absolute
              top-full
              left-0
              mt-2
              w-full
              bg-white
              border
              border-stone-100
              rounded-2xl
              shadow-xl
              z-50
              overflow-hidden
              p-1
            "
          >
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className="
                  px-4
                  py-3
                  rounded-xl
                  hover:bg-emerald-50
                  text-stone-700
                  cursor-pointer
                  transition-colors
                  text-sm
                "
              >
                {option}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
