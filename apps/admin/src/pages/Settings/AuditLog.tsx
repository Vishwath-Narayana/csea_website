import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { FilterBar } from '../../components/ui/FilterBar';
import { Pagination } from '../../components/ui/Pagination';
import { Button } from '../../components/ui/Button';
import { Download } from 'lucide-react';

export function AuditLog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const allLogs = [
    { id: 1, action: 'User Login', user: 'vishwath@kitsw.ac.in', target: 'System', time: '10 mins ago', ip: '192.168.1.1', status: 'Success' },
    { id: 2, action: 'Update Settings', user: 'vishwath@kitsw.ac.in', target: 'Global Config', time: '1 hour ago', ip: '192.168.1.1', status: 'Success' },
    { id: 3, action: 'Delete Article', user: 'jane@kitsw.ac.in', target: 'Journal ID: 45', time: '3 hours ago', ip: '10.0.0.5', status: 'Success' },
    { id: 4, action: 'Failed Login', user: 'unknown', target: 'System', time: '5 hours ago', ip: '45.22.11.90', status: 'Failure' },
  ];

  const logs = allLogs.filter(log => {
    if (search && !Object.values(log).some(v => String(v).toLowerCase().includes(search.toLowerCase()))) return false;
    if (statusFilter && log.status.toLowerCase() !== statusFilter) return false;
    return true;
  });

  const handleExport = () => {
    alert("Exporting audit logs as CSV...");
  };

  return (
    <div className="mx-auto max-w-content pb-12">
      <PageHeader 
        title="Audit Log"
        description="Track system activity, administrative actions, and security events."
        actions={
          <Button variant="outline" onClick={handleExport}>
            <Download size={16} className="mr-2" /> Export Logs
          </Button>
        }
      />

      <FilterBar 
        searchPlaceholder="Search events, users, or IPs..."
        filters={[
          {
            id: 'status',
            placeholder: 'Status',
            options: [
              { label: 'Success', value: 'success' },
              { label: 'Failure', value: 'failure' }
            ]
          },
          {
            id: 'time',
            placeholder: 'Timeframe',
            options: [
              { label: 'Last 24 Hours', value: '24h' },
              { label: 'Last 7 Days', value: '7d' },
              { label: 'Last 30 Days', value: '30d' }
            ]
          }
        ]}
        onSearchChange={setSearch}
        onFilterChange={(id, val) => {
          if (id === 'status') setStatusFilter(val);
        }}
      />

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-foreground-secondary whitespace-nowrap">{log.time}</TableCell>
                <TableCell className="font-medium text-foreground">{log.action}</TableCell>
                <TableCell className="text-foreground-secondary">{log.user}</TableCell>
                <TableCell className="text-foreground-secondary">{log.target}</TableCell>
                <TableCell className="font-mono text-[12px] text-foreground-secondary">{log.ip}</TableCell>
                <TableCell className="text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${log.status === 'Success' ? 'bg-success/10 text-success border-success/20' : 'bg-error/10 text-error border-error/20'}`}>
                    {log.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-foreground-muted">
                  No logs found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={24}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
