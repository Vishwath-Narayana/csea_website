import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ArrowLeft, Clock, MapPin, Users } from 'lucide-react';

export function EventForm({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const isEditing = !!id;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('events')}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-foreground">
            {isEditing ? 'Edit Event' : 'Create Event'}
          </h1>
          <p className="text-[14px] text-foreground-secondary">
            Configure event details and registration settings.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        
        {/* Basic Details */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[15px] font-semibold tracking-tight border-b border-border pb-2">Basic Details</h2>
          
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">Event Title</label>
            <Input placeholder="e.g. Autumn Hackathon 2026" defaultValue={isEditing ? 'CSEA Orientation 2026' : ''} />
          </div>
          
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">Description</label>
            <Textarea placeholder="Describe the event..." className="min-h-[100px]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">Event Type</label>
              <Select>
                <option>Main Event</option>
                <option>Workshop</option>
                <option>Hackathon</option>
                <option>Social</option>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">Visibility</label>
              <Select>
                <option>Public</option>
                <option>Members Only</option>
                <option>Invite Only</option>
              </Select>
            </div>
          </div>
        </section>

        {/* Date & Location */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[15px] font-semibold tracking-tight border-b border-border pb-2">Date & Location</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">Start Date</label>
              <Input type="date" icon={<Clock size={14} />} />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">End Date (Optional)</label>
              <Input type="date" icon={<Clock size={14} />} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">Venue</label>
            <Input placeholder="e.g. Main Auditorium" icon={<MapPin size={14} />} defaultValue={isEditing ? 'Main Auditorium' : ''} />
          </div>
        </section>

        {/* Registration Settings */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[15px] font-semibold tracking-tight border-b border-border pb-2">Registration Settings</h2>
          
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">Capacity limit</label>
            <Input type="number" placeholder="Leave empty for unlimited" icon={<Users size={14} />} defaultValue={isEditing ? 400 : undefined} />
            <p className="mt-1.5 text-[12px] text-foreground-muted">Registration will automatically close when this limit is reached.</p>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={() => navigate('events')}>Cancel</Button>
          <Button>{isEditing ? 'Save Changes' : 'Create Event'}</Button>
        </div>
      </div>
    </div>
  );
}
