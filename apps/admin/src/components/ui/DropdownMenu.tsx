import React, { useState, useRef, useEffect } from 'react';

export function DropdownMenu({ trigger, children, align = 'right' }: { trigger: React.ReactNode, children: React.ReactNode, align?: 'left' | 'right' }) {
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
      document.addEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`absolute z-50 mt-2 w-48 origin-top-${align} rounded-md bg-surface shadow-medium ring-1 ring-border focus:outline-none animate-in fade-in zoom-in-95 duration-100 ${align === 'right' ? 'right-0' : 'left-0'}`}
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
