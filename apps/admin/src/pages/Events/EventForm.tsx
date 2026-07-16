import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PageHeader } from '../../components/ui/PageHeader';
import { ArrowLeft } from 'lucide-react';

export function EventForm({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const isEditing = !!id;
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'location', 'registration', 'team', 'publish'
  const [registrationEnabled, setRegistrationEnabled] = useState(true);

  return (
    <div className="mx-auto max-w-[1000px]">
      <PageHeader 
        title={isEditing ? "Edit Event" : "Create Event"}
        breadcrumbs={
          <div className="flex items-center gap-2 text-[13px] text-foreground-muted mb-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate('events')}>
            <ArrowLeft size={14} /> Back to Events
          </div>
        }
        actions={
          <>
            <Button variant="ghost" onClick={() => navigate('events')}>Cancel</Button>
            <Button>{isEditing ? 'Save Changes' : 'Create Event'}</Button>
          </>
        }
      />

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-[240px] shrink-0">
          <nav className="flex flex-col space-y-1 sticky top-4">
            <button onClick={() => setActiveTab('basic')} className={`px-4 py-2.5 text-left text-[14px] font-medium rounded-md transition-colors ${activeTab === 'basic' ? 'bg-surface border border-border shadow-sm text-foreground' : 'text-foreground-secondary hover:bg-surface-secondary'}`}>
              Basic Information
            </button>
            <button onClick={() => setActiveTab('location')} className={`px-4 py-2.5 text-left text-[14px] font-medium rounded-md transition-colors ${activeTab === 'location' ? 'bg-surface border border-border shadow-sm text-foreground' : 'text-foreground-secondary hover:bg-surface-secondary'}`}>
              Date & Location
            </button>
            <button onClick={() => setActiveTab('registration')} className={`px-4 py-2.5 text-left text-[14px] font-medium rounded-md transition-colors ${activeTab === 'registration' ? 'bg-surface border border-border shadow-sm text-foreground' : 'text-foreground-secondary hover:bg-surface-secondary'}`}>
              Registration
            </button>
            <button onClick={() => setActiveTab('team')} className={`px-4 py-2.5 text-left text-[14px] font-medium rounded-md transition-colors ${activeTab === 'team' ? 'bg-surface border border-border shadow-sm text-foreground' : 'text-foreground-secondary hover:bg-surface-secondary'}`}>
              Event Team
            </button>
            <button onClick={() => setActiveTab('publish')} className={`px-4 py-2.5 text-left text-[14px] font-medium rounded-md transition-colors ${activeTab === 'publish' ? 'bg-surface border border-border shadow-sm text-foreground' : 'text-foreground-secondary hover:bg-surface-secondary'}`}>
              Publishing
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-surface rounded-xl border border-border shadow-sm p-6 sm:p-8 min-h-[500px]">
          
          {activeTab === 'basic' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-[18px] font-semibold tracking-tight">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Event Name</label>
                  <Input placeholder="e.g. CSEA Orientation 2026" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Event Type</label>
                  <Select>
                    <option>Orientation</option>
                    <option>Workshop</option>
                    <option>Seminar</option>
                    <option>Competition</option>
                    <option>Networking</option>
                  </Select>
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Short Description</label>
                  <Textarea placeholder="A brief summary for cards and lists (Max 120 chars)" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Full Description</label>
                  <Textarea placeholder="Detailed event description" className="min-h-[150px]" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Event Banner / Poster</label>
                  <div className="flex items-center justify-center p-8 border-2 border-dashed border-border rounded-lg text-foreground-muted hover:bg-surface-secondary cursor-pointer transition-colors">
                    Upload Banner Image
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-[18px] font-semibold tracking-tight">Date & Location</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Start Date</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Start Time</label>
                  <Input type="time" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">End Date</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">End Time</label>
                  <Input type="time" />
                </div>
              </div>

              <hr className="border-border" />

              <div className="space-y-4">
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Format</label>
                  <Select>
                    <option>Offline</option>
                    <option>Online</option>
                    <option>Hybrid</option>
                  </Select>
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Venue</label>
                  <Input placeholder="e.g. Main Auditorium" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Meeting URL (if applicable)</label>
                  <Input placeholder="https://" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'registration' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-[18px] font-semibold tracking-tight">Registration</h2>
              
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-surface-secondary/20">
                <div>
                  <p className="font-medium text-[14px]">Enable Registration</p>
                  <p className="text-[13px] text-foreground-secondary">Allow users to register for this event via an external form.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={registrationEnabled}
                  onChange={(e) => setRegistrationEnabled(e.target.checked)}
                  className="w-4 h-4 text-accent" 
                />
              </div>

              {registrationEnabled && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">
                      Registration Form URL <span className="text-error">*</span>
                    </label>
                    <Input placeholder="https://forms.google.com/..." required />
                    <p className="text-[12px] text-foreground-muted mt-1.5">Enter the external link (e.g. Google Forms) where students will register.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[13px] font-medium block mb-1.5">Registration Button Text</label>
                      <Input defaultValue="Register Now" />
                    </div>
                    <div>
                      <label className="text-[13px] font-medium block mb-1.5">Registration Deadline</label>
                      <Input type="datetime-local" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">Registration Status</label>
                    <Select>
                      <option>Open</option>
                      <option>Closed</option>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" size="sm" type="button">Test Registration Link</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-[18px] font-semibold tracking-tight">Event Team</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Faculty Coordinator</label>
                  <Input placeholder="Name of faculty" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Student Coordinator</label>
                  <Input placeholder="Name of student lead" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Contact Email</label>
                  <Input placeholder="support@event.com" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Contact Phone (Optional)</label>
                  <Input placeholder="+91" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'publish' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-[18px] font-semibold tracking-tight">Publishing</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Event Status</label>
                  <Select>
                    <option>Draft</option>
                    <option>Registration Open</option>
                    <option>Upcoming</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </Select>
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Visibility</label>
                  <Select>
                    <option>Public (Visible to everyone)</option>
                    <option>Private (Unlisted, link only)</option>
                  </Select>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
