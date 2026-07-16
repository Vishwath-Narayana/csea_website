import { StatusBadge } from './ui/Badge';

export function ActivityRow({ title, description, time, status }: { title: string; description: string; time: string; status?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3.5 last:border-0 hover:bg-surface-secondary/20 transition-colors -mx-5 px-5 lg:-mx-6 lg:px-6">
      <div>
        <div className="text-[14px] font-medium text-foreground">{title}</div>
        <div className="mt-0.5 text-[13px] text-foreground-muted">{description}</div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {status && <StatusBadge status={status} />}
        <span className="whitespace-nowrap text-[12px] text-foreground-subtle">{time}</span>
      </div>
    </div>
  );
}
