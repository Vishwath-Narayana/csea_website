import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/Input';
import { DropdownMenu, DropdownMenuItem } from '../../components/ui/DropdownMenu';
import { ArrowLeft, MoreHorizontal, Download } from 'lucide-react';

export function EventAttendees({ navigate, id: _id }: { navigate: (view: string) => void, id?: string }) {
  const attendees = [
    { id: 1, name: "Alice Johnson", email: "b26cs012@kitsw.ac.in", branch: "CSE", status: "Confirmed", registeredAt: "Aug 10, 2026" },
    { id: 2, name: "Bob Smith", email: "b26it045@kitsw.ac.in", branch: "IT", status: "Confirmed", registeredAt: "Aug 11, 2026" },
    { id: 3, name: "Charlie Davis", email: "b26cs102@kitsw.ac.in", branch: "CSE", status: "Waitlisted", registeredAt: "Aug 12, 2026" },
  ];

  return (
    <div className="mx-auto max-w-content">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('events')}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="mb-1 text-[20px] font-semibold tracking-tight text-foreground">Manage Attendees</h1>
            <p className="text-[14px] text-foreground-secondary">CSEA Orientation 2026 · 148 Registered</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-[240px]">
            <SearchInput placeholder="Search attendees..." />
          </div>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendees.map((attendee) => (
              <TableRow key={attendee.id}>
                <TableCell className="font-medium text-foreground">{attendee.name}</TableCell>
                <TableCell className="text-foreground-secondary">{attendee.email}</TableCell>
                <TableCell className="text-foreground-secondary">{attendee.branch}</TableCell>
                <TableCell><StatusBadge status={attendee.status} /></TableCell>
                <TableCell className="text-foreground-secondary">{attendee.registeredAt}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu 
                    trigger={<Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>}
                    align="right"
                  >
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    {attendee.status === 'Waitlisted' ? (
                      <DropdownMenuItem>Confirm Registration</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>Move to Waitlist</DropdownMenuItem>
                    )}
                    <DropdownMenuItem destructive>Remove Attendee</DropdownMenuItem>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
