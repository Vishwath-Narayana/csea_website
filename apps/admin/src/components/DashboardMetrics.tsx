export function MetricCard({ label, value, change, positive = true }: { label: string; value: string; change?: string; positive?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-medium">
      <div className="mb-2 text-[13px] font-medium text-foreground-muted">{label}</div>
      <div className="text-[32px] font-semibold leading-none tracking-tight text-foreground">{value}</div>
      {change && (
        <div className={`mt-2 text-[12px] font-medium ${positive ? 'text-success' : 'text-error'}`}>
          {positive ? '↑' : '↓'} {change}
        </div>
      )}
    </div>
  );
}
