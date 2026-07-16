import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: 'right' | 'left';
}

export function Drawer({ isOpen, onClose, title, description, children, footer, position = 'right' }: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-canvas/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer Container */}
      <div 
        className={`fixed inset-y-0 ${position === 'right' ? 'right-0' : 'left-0'} z-50 flex w-full max-w-md flex-col border-${position === 'right' ? 'l' : 'r'} border-border bg-surface shadow-strong animate-in slide-in-from-${position} duration-300`}
      >
        <div className="flex h-[64px] items-center justify-between border-b border-border px-6">
          <div>
            {title && <h2 className="text-[16px] font-semibold text-foreground tracking-tight">{title}</h2>}
            {description && <p className="text-[13px] text-foreground-secondary">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
          >
            <X size={18} />
            <span className="sr-only">Close</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-border p-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
