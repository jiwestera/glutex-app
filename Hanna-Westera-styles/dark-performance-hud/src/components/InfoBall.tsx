import React, { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface InfoBallProps {
  title?: string;
  content: React.ReactNode;
  size?: 'xs' | 'sm' | 'md';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const InfoBall: React.FC<InfoBallProps> = ({
  title,
  content,
  size = 'sm',
  placement = 'top',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [adjustedPlacement, setAdjustedPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>(placement);
  const [shiftX, setShiftX] = useState<number>(0);

  useEffect(() => {
    setAdjustedPlacement(placement);
  }, [placement]);

  useEffect(() => {
    if (isOpen && popoverRef.current && containerRef.current) {
      const iconRect = containerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 1. Check vertical overflow (auto flip top <-> bottom)
      if (placement === 'top' && popoverRect.top < 12) {
        setAdjustedPlacement('bottom');
      } else if (placement === 'bottom' && popoverRect.bottom > viewportHeight - 12) {
        setAdjustedPlacement('top');
      } else {
        setAdjustedPlacement(placement);
      }

      // 2. Check horizontal clamping
      const iconCenterX = iconRect.left + iconRect.width / 2;
      const popoverWidth = popoverRect.width;

      const naturalLeft = iconCenterX - popoverWidth / 2;
      const naturalRight = iconCenterX + popoverWidth / 2;

      const minMargin = 16;
      let newShift = 0;

      if (naturalLeft < minMargin) {
        newShift = minMargin - naturalLeft;
      } else if (naturalRight > viewportWidth - minMargin) {
        newShift = (viewportWidth - minMargin) - naturalRight;
      }

      setShiftX(newShift);
    } else {
      setShiftX(0);
    }
  }, [isOpen, placement]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const sizeClasses = {
    xs: 'w-3.5 h-3.5 text-[9px]',
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-5 h-5 text-xs'
  };

  const getPopoverPositionClasses = () => {
    if (adjustedPlacement === 'top') {
      return 'bottom-full mb-2 left-1/2';
    }
    if (adjustedPlacement === 'bottom') {
      return 'top-full mt-2 left-1/2';
    }
    if (adjustedPlacement === 'left') {
      return 'right-full mr-2 top-1/2 -translate-y-1/2';
    }
    return 'left-full ml-2 top-1/2 -translate-y-1/2';
  };

  const transformStyle = (adjustedPlacement === 'top' || adjustedPlacement === 'bottom')
    ? { transform: `translateX(calc(-50% + ${shiftX}px))` }
    : undefined;

  return (
    <div className={`relative inline-flex items-center shrink-0 ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onMouseEnter={() => setIsOpen(true)}
        className={`${sizeClasses[size]} rounded-full bg-stone-200 hover:bg-stone-900 text-stone-700 hover:text-cyan-300 font-bold font-mono flex items-center justify-center transition-colors shadow-2xs cursor-pointer focus:outline-hidden`}
        title={title || 'More Info'}
        aria-label={title || 'More Information'}
      >
        i
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          style={transformStyle}
          onClick={(e) => e.stopPropagation()}
          className={`absolute z-50 w-64 sm:w-72 max-w-[calc(100vw-32px)] p-3.5 bg-stone-900 text-stone-100 border border-stone-800 rounded-2xl shadow-xl animate-fadeIn ${getPopoverPositionClasses()} pointer-events-auto`}
        >
          <div className="flex items-start justify-between gap-2 border-b border-stone-800 pb-1.5 mb-2">
            <div className="flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-200">
                {title || 'Information'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-200 transition-colors p-0.5 rounded-md"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="text-xs text-stone-300 font-normal leading-relaxed space-y-1">
            {typeof content === 'string' ? <p>{content}</p> : content}
          </div>
        </div>
      )}
    </div>
  );
};
