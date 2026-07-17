import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DropdownMenu, DropdownMenuItem } from '../../components/ui/DropdownMenu';
import { FilterBar } from '../../components/ui/FilterBar';
import { Pagination } from '../../components/ui/Pagination';
import { PageHeader } from '../../components/ui/PageHeader';
import { MoreHorizontal, Plus, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

export function EventList({ navigate }: { navigate: (view: string) => void }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, [currentPage]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<any>(`/control/events?page=${currentPage}&limit=10`);
      setEvents(response.data);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // Optional: Add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/control/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

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
              { label: 'Draft', value: 'DRAFT' },
              { label: 'Published', value: 'PUBLISHED' },
              { label: 'Completed', value: 'COMPLETED' },
              { label: 'Cancelled', value: 'CANCELLED' }
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="animate-spin mx-auto text-foreground-muted" />
                </TableCell>
              </TableRow>
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-foreground-muted">
                  No events found.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium text-foreground">{event.title}</TableCell>
                  <TableCell className="text-foreground-secondary">{event.eventType || 'N/A'}</TableCell>
                  <TableCell className="text-foreground-secondary">
                    {new Date(event.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell><StatusBadge status={event.status} /></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu 
                      trigger={<Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>}
                      align="right"
                    >
                      <DropdownMenuItem onClick={() => navigate(`events/${event.id}`)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`events/${event.id}/edit`)}>Edit Event</DropdownMenuItem>
                      <div className="h-px bg-border my-1 mx-1"></div>
                      <DropdownMenuItem destructive onClick={() => handleDelete(event.id)}>Delete</DropdownMenuItem>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
