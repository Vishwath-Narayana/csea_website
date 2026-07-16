import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
  onClose?: () => void;
}

export function Toast({ type = 'info', title, description, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle2 className="text-success" size={20} />,
    error: <AlertCircle className="text-error" size={20} />,
    info: <Info className="text-accent" size={20} />
  };

  return (
    <div className="pointer-events-auto flex w-full max-w-md rounded-lg bg-surface shadow-strong ring-1 ring-border animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex w-full items-start p-4">
        <div className="shrink-0 pt-0.5">
          {icons[type]}
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-[14px] font-medium text-foreground">{title}</p>
          {description && <p className="mt-1 text-[13px] text-foreground-secondary">{description}</p>}
        </div>
        {onClose && (
          <div className="ml-4 flex shrink-0">
            <button
              onClick={onClose}
              className="inline-flex rounded-md bg-transparent text-foreground-muted hover:text-foreground focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// In Phase 2, this will be wrapped in a proper Context Provider.
