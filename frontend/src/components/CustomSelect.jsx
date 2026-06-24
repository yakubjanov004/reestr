import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CustomSelect({ value, onChange, options, placeholder = "Hammasi" }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-select-wrapper" ref={wrapperRef}>
      <div 
        className={`custom-select-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span>{displayLabel}</span>
        <ChevronDown size={16} />
      </div>
      
      {open && (
        <div className="custom-select-dropdown">
          <div 
            className={`custom-select-option ${value === "" ? 'selected' : ''}`}
            onClick={() => { onChange(""); setOpen(false); }}
          >
            {placeholder}
          </div>
          {options.map((opt) => (
            <div 
              key={opt.value}
              className={`custom-select-option ${value === opt.value ? 'selected' : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
