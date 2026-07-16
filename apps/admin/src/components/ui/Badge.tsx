import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'draft';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-pill px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] transition-colors';
  
  const variants = {
    default: 'bg-surface-secondary text-foreground-muted',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    draft: 'bg-accent-muted text-accent',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className || ''}`} {...props}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  let variant: BadgeProps['variant'] = 'default';
  
  switch (status.toLowerCase()) {
    case 'published':
    case 'active':
    case 'accepted':
    case 'completed':
      variant = 'success';
      break;
    case 'draft':
    case 'in review':
    case 'waitlisted':
    case 'pending':
      variant = 'warning';
      break;
    case 'rejected':
    case 'archived':
    case 'inactive':
      variant = 'default';
      break;
    default:
      variant = 'draft'; // using 'draft' as a generic accent color fallback
  }

  return <Badge variant={variant}>{status}</Badge>;
}
