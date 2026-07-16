import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

export function LoadingState({ message = "Loading...", fullPage = false }: LoadingStateProps) {
  const containerClasses = fullPage 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas/80 backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-12 min-h-[200px]";

  return (
    <div className={containerClasses}>
      <Loader2 className="h-8 w-8 animate-spin text-accent mb-4" />
      <p className="text-[13px] font-medium text-foreground-muted">{message}</p>
    </div>
  );
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-sm bg-surface-secondary/80 ${className || ''}`}
      {...props}
    />
  );
}
