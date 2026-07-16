import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  isLoading = false,
}: ConfirmationDialogProps) {
  
  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} disabled={isLoading}>
        {cancelLabel}
      </Button>
      <Button 
        variant={isDestructive ? "danger" : "primary"} 
        onClick={onConfirm} 
        isLoading={isLoading}
      >
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      footer={footer}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start pt-2 pb-4">
        <div className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-full ${isDestructive ? 'bg-error/10 text-error' : 'bg-accent/10 text-accent'}`}>
          <AlertTriangle size={20} />
        </div>
        <div>
          <h2 className="text-[16px] font-semibold text-foreground tracking-tight">{title}</h2>
          <p className="text-[13px] text-foreground-secondary mt-1">{description}</p>
        </div>
      </div>
    </Modal>
  );
}
