import { StatusBadge } from './ui/Badge';

export function ActivityRow({ title, description, time, status }: { title: string; description: string; time: string; status?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent/40 ring-4 ring-accent/10"></div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium leading-none text-foreground">{title}</p>
          <span className="text-[11px] text-foreground-muted">{time}</span>
        </div>
        <p className="text-[13px] text-foreground-secondary">{description}</p>
      </div>
      {status && (
        <div className="shrink-0 pt-1">
          <StatusBadge status={status} />
        </div>
      )}
    </div>
  );
}
