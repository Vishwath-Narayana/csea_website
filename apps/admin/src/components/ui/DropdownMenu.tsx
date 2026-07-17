import React, { useState, useRef, useEffect } from 'react';

export function DropdownMenu({ 
  trigger, 
  children, 
  align = 'right',
  position = 'bottom'
}: { 
  trigger: React.ReactNode; 
  children: React.ReactNode; 
  align?: 'left' | 'right';
  position?: 'top' | 'bottom';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const positionClass = position === 'top' ? 'bottom-full mb-2' : 'mt-2';
  const originClass = position === 'top' 
    ? `origin-bottom-${align}` 
    : `origin-top-${align}`;

  return (
    <div className="relative w-full text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`absolute z-50 w-full min-w-[180px] ${positionClass} ${originClass} rounded-md bg-surface shadow-medium ring-1 ring-border focus:outline-none animate-in fade-in zoom-in-95 duration-100 ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          <div className="py-1" onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick, className, destructive }: { children: React.ReactNode, onClick?: () => void, className?: string, destructive?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-4 py-2 text-[13px] hover:bg-surface-secondary transition-colors ${destructive ? 'text-error hover:text-error' : 'text-foreground'} ${className || ''}`}
    >
      {children}
    </button>
  );
}

