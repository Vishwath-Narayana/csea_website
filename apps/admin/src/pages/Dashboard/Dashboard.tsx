import { MetricCard } from '../../components/DashboardMetrics';
import { ActivityRow } from '../../components/ActivityRow';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/LoadingState';

export function Dashboard() {
  const isLoading = false;

  const upcomingEvents = [
    { id: 1, name: 'CSEA Orientation 2026', date: 'Aug 15', venue: 'Main Auditorium', count: 142, capacity: 200, status: 'Registration Open' },
    { id: 2, name: 'Tech Talk: Web3', date: 'Aug 22', venue: 'Seminar Hall 1', count: 45, capacity: 100, status: 'Upcoming' },
  ];

  return (
    <div className="mx-auto max-w-content space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
        ) : (
          <>
            <MetricCard label="Published Content" value="24" change="+3 this month" />
            <MetricCard label="Open Registrations" value="4" change="2 closing soon" />
            <MetricCard label="Active Projects" value="5" change="2 recruiting" />
            <MetricCard label="Pending Applications" value="18" change="-4 since yesterday" positive={false} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Events & Approvals */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          
          {/* Upcoming Events */}
          <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-4 text-[16px] font-semibold tracking-tight text-foreground">Upcoming Events</h2>
            {isLoading ? (
              <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date & Venue</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingEvents.map(evt => (
                      <TableRow key={evt.id}>
                        <TableCell className="font-medium text-foreground">{evt.name}</TableCell>
                        <TableCell>
                          <div className="text-foreground-secondary">{evt.date}</div>
                          <div className="text-[12px] text-foreground-muted">{evt.venue}</div>
                        </TableCell>
                        <TableCell><StatusBadge status={evt.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>

          {/* Pending Approvals */}
          <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-4 text-[16px] font-semibold tracking-tight text-foreground">Pending Approvals</h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-surface-secondary cursor-pointer transition-colors">
                <div>
                  <div className="text-[14px] font-medium text-foreground">Project Application: Frontend Engineer</div>
                  <div className="text-[13px] text-foreground-secondary">Submitted by John Doe (b26cs042)</div>
                </div>
                <StatusBadge status="Pending" />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-surface-secondary cursor-pointer transition-colors">
                <div>
                  <div className="text-[14px] font-medium text-foreground">Journal Draft: "Getting Started with React"</div>
                  <div className="text-[13px] text-foreground-secondary">Submitted by Jane Smith</div>
                </div>
                <StatusBadge status="In Review" />
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Activity & Health */}
        <div className="flex flex-col gap-8">
          
          <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-4 text-[16px] font-semibold tracking-tight text-foreground">Platform Health</h2>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-foreground-secondary">Total Users</span>
                <span className="text-[14px] font-medium text-foreground">1,452</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-foreground-secondary">Total Gallery Assets</span>
                <span className="text-[14px] font-medium text-foreground">428</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-foreground-secondary">Storage Usage</span>
                <span className="text-[14px] font-medium text-foreground">1.2 GB / 10 GB</span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6 shadow-sm flex-1">
            <h2 className="mb-4 text-[16px] font-semibold tracking-tight text-foreground">Recent Activity</h2>
            <div className="flex flex-col gap-4">
              <ActivityRow title="Updated Event" description="Admin User updated 'CSEA Orientation'" time="2h ago" status="Success" />
              <ActivityRow title="New Application" description="Sarah applied for 'Backend Engineer'" time="4h ago" status="Pending" />
              <ActivityRow title="Published Article" description="Editor published 'Web3 Guide'" time="1d ago" status="Success" />
              <ActivityRow title="Failed Login" description="Unknown IP attempt" time="2d ago" status="Error" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
