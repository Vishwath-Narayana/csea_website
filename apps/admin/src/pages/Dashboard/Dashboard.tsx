import { MetricCard } from '../../components/DashboardMetrics';
import { ActivityRow } from '../../components/ActivityRow';

export function Dashboard() {
  return (
    <div className="mx-auto max-w-content">
      {/* Metrics Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Published Content" value="12" change="3 this week" positive />
        <MetricCard label="Event Registrations" value="148" change="23 today" positive />
        <MetricCard label="Active Projects" value="3" />
        <MetricCard label="Applications" value="18" change="5 pending" positive={false} />
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm lg:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold tracking-tight">Recent Activity</h2>
            <button className="cursor-pointer border-none bg-transparent text-[13px] text-accent hover:underline">View all</button>
          </div>

          <div className="flex flex-col">
            <ActivityRow title="Orientation 2026" description="Event created by Admin" time="2h ago" status="Published" />
            <ActivityRow title="Welcome to CSEA Platform" description="Journal post published" time="3h ago" status="Published" />
            <ActivityRow title="CSEA Website Reboot" description="Project updated — 12 builders joined" time="5h ago" status="Active" />
            <ActivityRow title="Inside CSEA: Week 04" description="Draft saved by Editor" time="1d ago" status="Draft" />
            <ActivityRow title="Hackathon '26 Gallery" description="342 photos uploaded" time="2d ago" status="Published" />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">
          {/* Upcoming Events */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm lg:p-6">
            <h3 className="mb-4 text-[14px] font-semibold tracking-tight">Upcoming Events</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-medium text-foreground">Orientation 2026</div>
                  <div className="text-[12px] text-foreground-muted">15 Aug · Main Auditorium</div>
                </div>
                <span className="text-[13px] font-semibold text-accent">148</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-medium text-foreground">Tech Talk Series #1</div>
                  <div className="text-[12px] text-foreground-muted">22 Aug · Seminar Hall</div>
                </div>
                <span className="text-[13px] font-semibold text-accent">67</span>
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm lg:p-6">
            <h3 className="mb-4 text-[14px] font-semibold tracking-tight">Pending Approvals</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <div className="text-[13px] font-medium text-foreground">5 project applications</div>
                  <div className="text-[12px] text-foreground-muted">Platform Reboot</div>
                </div>
                <button className="cursor-pointer rounded-sm border-none bg-accent-muted px-2.5 py-1 text-[12px] font-medium text-accent transition-colors hover:bg-accent hover:text-white">Review</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-medium text-foreground">2 draft stories</div>
                  <div className="text-[12px] text-foreground-muted">Awaiting review</div>
                </div>
                <button className="cursor-pointer rounded-sm border-none bg-accent-muted px-2.5 py-1 text-[12px] font-medium text-accent transition-colors hover:bg-accent hover:text-white">Review</button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm lg:p-6">
            <h3 className="mb-4 text-[14px] font-semibold tracking-tight">Platform Health</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-foreground-muted">Users</div>
                <div className="mt-1 text-[24px] font-semibold tracking-tight text-foreground">342</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-foreground-muted">Photos</div>
                <div className="mt-1 text-[24px] font-semibold tracking-tight text-foreground">14.2K</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
