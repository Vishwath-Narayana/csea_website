import React from 'react';

export function Table({ className, children }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full text-left text-[13px] ${className || ''}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={`border-b border-border bg-surface-secondary/50 ${className || ''}`}>{children}</thead>;
}

export function TableBody({ className, children }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={`divide-y divide-border ${className || ''}`}>{children}</tbody>;
}

export function TableRow({ className, children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`transition-colors hover:bg-surface-secondary/30 ${className || ''}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ className, children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`h-10 px-4 text-left align-middle font-medium text-foreground-muted ${className || ''}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`p-4 align-middle ${className || ''}`} {...props}>
      {children}
    </td>
  );
}
