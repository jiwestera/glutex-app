import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface HudSelectOption {
  value: string;
  label: string;
  group?: string;
}

interface HudSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: HudSelectOption[];
  placeholder?: string;
  className?: string;
  panelClassName?: string;
}

/**
 * Themed stand-in for a native <select>. Native option lists are always
 * rendered by the OS/browser and can't be restyled with CSS, so this
 * replaces both the closed field and the open list with app-themed markup.
 */
export const HudSelect: React.FC<HudSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  panelClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selected = options.find((opt) => opt.value === value);

  const groups: { name: string | null; options: HudSelectOption[] }[] = [];
  options.forEach((opt) => {
    const groupName = opt.group ?? null;
    let bucket = groups.find((g) => g.name === groupName);
    if (!bucket) {
      bucket = { name: groupName, options: [] };
      groups.push(bucket);
    }
    bucket.options.push(opt);
  });

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center justify-between gap-2 text-left cursor-pointer ${className}`}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-stone-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-30 mt-1.5 left-0 right-0 max-h-64 overflow-y-auto bg-white border border-stone-200 rounded-xl shadow-lg p-1.5 space-y-0.5 ${panelClassName}`}
        >
          {groups.map((group, gIdx) => (
            <div key={gIdx}>
              {group.name && (
                <div className="px-2.5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  {group.name}
                </div>
              )}
              {group.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    opt.value === value
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {opt.value === value && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
