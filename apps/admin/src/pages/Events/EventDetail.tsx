import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { ArrowLeft, Edit } from 'lucide-react';
import { MetricCard } from '../../components/DashboardMetrics';

export function EventDetail({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="mx-auto max-w-content flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      <div className="shrink-0 mb-6">
        <PageHeader 
          title="CSEA Orientation 2026"
          description="Aug 15, 2026 · Main Auditorium"
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
              <Button>Close Registrations</Button>
            </>
          }
        />
        <Tabs 
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'registration', label: 'Registration Link' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'settings', label: 'Settings' }
          ]}
        />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard label="Event Capacity" value="200" change="Unlimited allowed via external form" positive={true} />
              <MetricCard label="Event Status" value="Open" change="Ends in 12 days" />
              <MetricCard label="Page Views" value="842" change="+120 today" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-[16px] font-semibold mb-4">Event Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[13px] text-foreground-muted">Description</p>
                      <p className="text-[14px]">The annual orientation program for incoming computer science and engineering freshmen. Welcome to the department!</p>
                    </div>
                  </div>
                </section>
              </div>
              
              <div className="space-y-6">
                <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-[16px] font-semibold mb-4">Important Dates</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center text-[13px]">
                      <span className="text-foreground-secondary">Reg. Opens</span>
                      <span className="font-medium">Aug 01, 10:00 AM</span>
                    </li>
                    <li className="flex justify-between items-center text-[13px]">
                      <span className="text-foreground-secondary">Reg. Closes</span>
                      <span className="font-medium">Aug 14, 11:59 PM</span>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'registration' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
            <div className="p-6 bg-surface border border-border rounded-xl shadow-sm space-y-6">
              <div>
                <h3 className="font-semibold mb-2">External Registration Setup</h3>
                <p className="text-[13px] text-foreground-secondary">This event handles registrations via an external provider (like Google Forms).</p>
              </div>
              
              <div className="space-y-4 bg-surface-secondary/20 p-4 rounded-lg border border-border">
                <div>
                  <p className="text-[12px] font-medium text-foreground-muted uppercase tracking-wider mb-1">Registration Link</p>
                  <a href="#" className="text-accent hover:underline text-[14px] font-medium break-all">https://forms.google.com/forms/d/e/1FAIpQLSc...</a>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-[12px] font-medium text-foreground-muted uppercase tracking-wider mb-1">Button Text</p>
                    <p className="text-[14px] text-foreground">Register Now</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-foreground-muted uppercase tracking-wider mb-1">Deadline</p>
                    <p className="text-[14px] text-foreground">Aug 14, 11:59 PM</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline">Test Link</Button>
                <Button variant="outline" onClick={() => navigate(`events/${id}/edit`)}>Edit Link Settings</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="animate-in fade-in duration-300 flex flex-col items-center justify-center p-12 text-foreground-muted border-2 border-dashed border-border rounded-xl">
            <p className="mb-4">No gallery connected.</p>
            <Button variant="outline">Connect Album</Button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-300 max-w-2xl space-y-6">
            <div className="p-6 bg-surface border border-border rounded-xl shadow-sm">
              <h3 className="font-semibold mb-4">Event Configuration</h3>
              <p className="text-[13px] text-foreground-secondary mb-4">Manage high-level settings and integrations.</p>
              <Button variant="outline">Duplicate Event</Button>
            </div>
            <div className="p-6 bg-error/5 border border-error/20 rounded-xl">
              <h3 className="font-semibold text-error mb-4">Danger Zone</h3>
              <p className="text-[13px] text-error/80 mb-4">Once you delete an event, there is no going back. Please be certain.</p>
              <Button variant="danger">Delete Event</Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
