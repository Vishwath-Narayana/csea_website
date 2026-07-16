import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DropdownMenu, DropdownMenuItem } from '../../components/ui/DropdownMenu';
import { FilterBar } from '../../components/ui/FilterBar';
import { Pagination } from '../../components/ui/Pagination';
import { PageHeader } from '../../components/ui/PageHeader';
import { MoreHorizontal, Plus } from 'lucide-react';

export function EventList({ navigate }: { navigate: (view: string) => void }) {
  const [currentPage, setCurrentPage] = useState(1);

  const events = [
    { id: 1, name: "CSEA Orientation 2026", type: "Orientation", date: "Aug 15, 2026", status: "Registration Open" },
    { id: 2, name: "Tech Talk: Web3", type: "Seminar", date: "Aug 22, 2026", status: "Upcoming" },
    { id: 3, name: "Alumni Meetup", type: "Networking", date: "Sep 05, 2026", status: "Draft" },
  ];

  return (
    <div className="mx-auto max-w-content">
      <PageHeader 
        title="Events"
        description="Plan, organize, and manage registrations for CSEA events."
        actions={
          <Button onClick={() => navigate('events/create')}>
            <Plus size={16} className="mr-2" />
            New Event
          </Button>
        }
      />

      <FilterBar 
        searchPlaceholder="Search events..."
        filters={[
          {
            id: 'status',
            placeholder: 'All Statuses',
            options: [
              { label: 'Draft', value: 'draft' },
              { label: 'Registration Open', value: 'registration_open' },
              { label: 'Upcoming', value: 'upcoming' },
              { label: 'Completed', value: 'completed' }
            ]
          },
          {
            id: 'type',
            placeholder: 'All Types',
            options: [
              { label: 'Orientation', value: 'orientation' },
              { label: 'Seminar', value: 'seminar' },
              { label: 'Networking', value: 'networking' }
            ]
          }
        ]}
      />
      
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium text-foreground">{event.name}</TableCell>
                <TableCell className="text-foreground-secondary">{event.type}</TableCell>
                <TableCell className="text-foreground-secondary">{event.date}</TableCell>
                <TableCell><StatusBadge status={event.status} /></TableCell>
                <TableCell className="text-right">
                  <DropdownMenu 
                    trigger={<Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>}
                    align="right"
                  >
                    <DropdownMenuItem onClick={() => navigate(`events/${event.id}`)}>View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`events/${event.id}/edit`)}>Edit Event</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate Event</DropdownMenuItem>
                    <div className="h-px bg-border my-1 mx-1"></div>
                    <DropdownMenuItem destructive>Delete</DropdownMenuItem>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={5}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
