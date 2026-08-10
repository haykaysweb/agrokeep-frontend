import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface CustomDropdownProps {
  label: string;
  icon: any;
  options: string[];
  onSelect?: (value: string) => void; // 👈 Added optional callback prop
}

export function CustomDropdown({ label, icon: Icon, options, onSelect }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="relative w-full flex flex-col px-2">
      <label className="text-sm text-stone-600 flex items-center gap-2 mb-1.5 ml-1">
        <Icon className="h-4 w-4" /> {label}
      </label>
      
      <motion.div 
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-stone-50 border border-stone-200 rounded-full px-4 py-3 flex justify-between items-center cursor-pointer shadow-sm"
      >
        <span className="text-stone-700 font-medium">{selected}</span>
        <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 w-[calc(100%-1rem)] bg-white border border-stone-100 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            {options.map((option) => (
              <li 
                key={option}
                onClick={() => { 
                  setSelected(option); 
                  setIsOpen(false); 
                  if (onSelect) onSelect(option); // 👈 Triggers parent filter state update
                }}
                className="px-4 py-3 hover:bg-emerald-50 text-stone-700 cursor-pointer transition-colors"
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