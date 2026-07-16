import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/Input';
import { Download } from 'lucide-react';

export function AuditLog() {
  const logs = [
    { id: 1, action: "User Login", user: "Admin User", resource: "System", timestamp: "Aug 15, 2026, 09:42 AM", ip: "192.168.1.1" },
    { id: 2, action: "Published Article", user: "Editor One", resource: "Journal: ID 42", timestamp: "Aug 14, 2026, 14:20 PM", ip: "10.0.0.54" },
    { id: 3, action: "Created Event", user: "Admin User", resource: "Events: Orientation 26", timestamp: "Aug 12, 2026, 11:05 AM", ip: "192.168.1.1" },
    { id: 4, action: "Deleted User", user: "Admin User", resource: "Users: ID 12", timestamp: "Aug 10, 2026, 16:30 PM", ip: "192.168.1.1" },
  ];

  return (
    <div className="mx-auto max-w-content">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-[20px] font-semibold tracking-tight text-foreground">Audit Logs</h1>
          <p className="text-[14px] text-foreground-secondary">Chronological record of system activity and data changes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-[240px]">
            <SearchInput placeholder="Search logs..." />
          </div>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium text-foreground">{log.action}</TableCell>
                <TableCell className="text-foreground-secondary">{log.user}</TableCell>
                <TableCell className="font-mono text-[12px] text-foreground-muted">{log.resource}</TableCell>
                <TableCell className="font-mono text-[12px] text-foreground-muted">{log.ip}</TableCell>
                <TableCell className="text-right text-foreground-secondary text-[13px]">{log.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
