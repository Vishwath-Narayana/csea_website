import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import { MetricCard } from '../../components/DashboardMetrics';
import { api } from '../../utils/api';

export function EventDetail({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<any>(`/control/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try {
      await api.delete(`/control/events/${id}`);
      navigate('events');
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-foreground-muted" /></div>;
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-foreground-muted mb-4">Event not found.</p>
        <Button variant="outline" onClick={() => navigate('events')}>Back to Events</Button>
      </div>
    );
  }

  const startDateStr = new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="mx-auto max-w-content flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      <div className="shrink-0 mb-6">
        <PageHeader 
          title={event.title}
          description={`${startDateStr} · ${event.venue || 'TBA'}`}
          breadcrumbs={
            <div className="flex items-center gap-2 text-[13px] text-foreground-muted mb-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate('events')}>
              <ArrowLeft size={14} /> Back to Events
            </div>
          }
          actions={
            <>
              <Button variant="outline" onClick={() => navigate(`events/${id}/edit`)}>
                <Edit size={16} className="mr-2" /> Edit Event
              </Button>
            </>
          }
        />
        <Tabs 
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'registration', label: 'Registration' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'settings', label: 'Settings' }
          ]}
        />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard label="Status" value={event.status} change={event.visibility} />
              <MetricCard label="Event Type" value={event.eventType || 'N/A'} change={event.format} />
              <MetricCard label="Registrations" value="N/A" change={event.registrationEnabled ? "External Form" : "Disabled"} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-[16px] font-semibold mb-4">Event Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[13px] text-foreground-muted">Short Description</p>
                      <p className="text-[14px]">{event.shortDescription || 'No description provided.'}</p>
                    </div>
                    {event.fullDescription && (
                      <div className="pt-2">
                        <p className="text-[13px] text-foreground-muted">Full Description</p>
                        <p className="text-[14px] whitespace-pre-wrap">{event.fullDescription}</p>
                      </div>
                    )}
                  </div>
                </section>
                
                <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-[16px] font-semibold mb-4">Team & Contacts</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[13px] text-foreground-muted">Faculty Coordinator</p>
                      <p className="text-[14px]">{event.facultyCoordinator || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[13px] text-foreground-muted">Student Coordinator</p>
                      <p className="text-[14px]">{event.studentCoordinator || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[13px] text-foreground-muted">Contact Email</p>
                      <p className="text-[14px]">{event.contactEmail || '-'}</p>
                    </div>
                  </div>
                </section>
              </div>
              
              <div className="space-y-6">
                <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-[16px] font-semibold mb-4">Dates</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center text-[13px]">
                      <span className="text-foreground-secondary">Starts</span>
                      <span className="font-medium">{new Date(event.startDate).toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between items-center text-[13px]">
                      <span className="text-foreground-secondary">Ends</span>
                      <span className="font-medium">{new Date(event.endDate).toLocaleString()}</span>
                    </li>
                  </ul>
                </section>
                
                {event.meetingUrl && (
                  <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                    <h3 className="text-[16px] font-semibold mb-4">Virtual Link</h3>
                    <a href={event.meetingUrl} target="_blank" rel="noreferrer" className="text-[13px] text-accent hover:underline break-all">
                      {event.meetingUrl}
                    </a>
                  </section>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'registration' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
            <div className="p-6 bg-surface border border-border rounded-xl shadow-sm space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Registration Status</h3>
                <p className="text-[13px] text-foreground-secondary">
                  {event.registrationEnabled ? "This event handles registrations via an external provider." : "Registrations are not enabled for this event."}
                </p>
              </div>
              
              {event.registrationEnabled && event.registrationUrl && (
                <div className="space-y-4 bg-surface-secondary/20 p-4 rounded-lg border border-border">
                  <div>
                    <p className="text-[12px] font-medium text-foreground-muted uppercase tracking-wider mb-1">Registration Link</p>
                    <a href={event.registrationUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline text-[14px] font-medium break-all">
                      {event.registrationUrl}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate(`events/${id}/edit`)}>Edit Registration Settings</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="animate-in fade-in duration-300 flex flex-col items-center justify-center p-12 text-foreground-muted border-2 border-dashed border-border rounded-xl">
            <p className="mb-4">Galleries API not yet implemented.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-300 max-w-2xl space-y-6">
            <div className="p-6 bg-error/5 border border-error/20 rounded-xl">
              <h3 className="font-semibold text-error mb-4">Danger Zone</h3>
              <p className="text-[13px] text-error/80 mb-4">Once you delete an event, there is no going back. Please be certain.</p>
              <Button variant="danger" onClick={handleDelete}>Delete Event</Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
