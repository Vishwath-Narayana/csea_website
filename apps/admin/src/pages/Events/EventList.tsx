import { useState } from 'react';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DropdownMenu, DropdownMenuItem } from '../../components/ui/DropdownMenu';
import { MoreHorizontal, Plus, Calendar, List } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

export function EventList({ navigate }: { navigate: (view: string) => void }) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const events = [
    { id: 1, title: "CSEA Orientation 2026", date: "Aug 15, 2026", capacity: "148 / 400", status: "Active", type: "Main Event" },
    { id: 2, title: "Tech Talk: Distributed Systems", date: "Aug 22, 2026", capacity: "67 / 150", status: "Draft", type: "Workshop" },
    { id: 3, title: "Autumn Hackathon 2026", date: "Sep 10, 2026", capacity: "0 / 200", status: "Draft", type: "Competition" },
  ];

  return (
    <div className="mx-auto max-w-content">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-[20px] font-semibold tracking-tight text-foreground">Events</h1>
          <p className="text-[14px] text-foreground-secondary">Manage upcoming and past events, track registrations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-sm border border-border bg-surface p-0.5">
            <button 
              className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-surface-secondary text-foreground' : 'text-foreground-muted hover:text-foreground'}`}
              onClick={() => setViewMode('grid')}
            >
              <Calendar size={16} />
            </button>
            <button 
              className={`p-1.5 rounded-sm transition-colors ${viewMode === 'table' ? 'bg-surface-secondary text-foreground' : 'text-foreground-muted hover:text-foreground'}`}
              onClick={() => setViewMode('table')}
            >
              <List size={16} />
            </button>
          </div>
          <Button onClick={() => navigate('events/create')}>
            <Plus size={16} className="mr-2" />
            Create Event
          </Button>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <div key={event.id} className="flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-medium">
              <div className="mb-4 flex items-start justify-between">
                <StatusBadge status={event.status} />
                <DropdownMenu trigger={<button className="text-foreground-muted hover:text-foreground"><MoreHorizontal size={18} /></button>}>
                  <DropdownMenuItem onClick={() => navigate(`events/edit/${event.id}`)}>Edit Event</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`events/attendees/${event.id}`)}>Manage Attendees</DropdownMenuItem>
                  <DropdownMenuItem destructive>Cancel Event</DropdownMenuItem>
                </DropdownMenu>
              </div>
              <h3 className="mb-1 text-[16px] font-medium tracking-tight text-foreground">{event.title}</h3>
              <div className="mb-6 text-[13px] text-foreground-secondary">{event.date} · {event.type}</div>
              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-[13px]">
                <span className="text-foreground-muted">Registrations</span>
                <span className="font-medium text-foreground">{event.capacity}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Event Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Registrations</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium text-foreground">{event.title}</TableCell>
                  <TableCell className="text-foreground-secondary">{event.type}</TableCell>
                  <TableCell><StatusBadge status={event.status} /></TableCell>
                  <TableCell className="text-foreground-secondary">{event.date}</TableCell>
                  <TableCell className="text-foreground-secondary">{event.capacity}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu 
                      trigger={<Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>}
                      align="right"
                    >
                      <DropdownMenuItem onClick={() => navigate(`events/edit/${event.id}`)}>Edit Event</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`events/attendees/${event.id}`)}>Manage Attendees</DropdownMenuItem>
                      <DropdownMenuItem destructive>Cancel Event</DropdownMenuItem>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
