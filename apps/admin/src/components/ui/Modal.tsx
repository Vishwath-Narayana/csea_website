import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, description, children, footer }: ModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-canvas/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative z-50 w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-strong animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              {title && <h2 className="text-[18px] font-semibold text-foreground tracking-tight">{title}</h2>}
              {description && <p className="text-[13px] text-foreground-secondary mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-canvas transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X size={18} />
              <span className="sr-only">Close</span>
            </button>
          </div>
          
          <div className="py-2">
            {children}
          </div>

          {footer && (
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
