import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, icon, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-secondary/20 p-12 text-center animate-in fade-in duration-500">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-foreground-muted shadow-sm">
        {icon || <FileText size={20} />}
      </div>
      <h3 className="mb-1 text-[15px] font-medium text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-[13px] text-foreground-secondary">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
