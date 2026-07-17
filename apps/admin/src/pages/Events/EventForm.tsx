import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PageHeader } from '../../components/ui/PageHeader';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

export function EventForm({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const isEditing = !!id;
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'location', 'registration', 'team', 'publish'
  
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    eventType: 'Orientation',
    shortDescription: '',
    fullDescription: '',
    coverImage: '',
    startDate: '',
    endDate: '',
    format: 'OFFLINE',
    venue: '',
    meetingUrl: '',
    registrationEnabled: false,
    registrationUrl: '',
    facultyCoordinator: '',
    studentCoordinator: '',
    contactEmail: '',
    contactPhone: '',
    status: 'DRAFT',
    visibility: 'PUBLIC'
  });

  useEffect(() => {
    if (isEditing) fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get<any>(`/control/events/${id}`);
      const ev = res.data;
      setFormData({
        title: ev.title || '',
        slug: ev.slug || '',
        eventType: ev.eventType || 'Orientation',
        shortDescription: ev.shortDescription || '',
        fullDescription: ev.fullDescription || '',
        coverImage: ev.coverImage || '',
        startDate: ev.startDate ? new Date(ev.startDate).toISOString().slice(0, 16) : '',
        endDate: ev.endDate ? new Date(ev.endDate).toISOString().slice(0, 16) : '',
        format: ev.format || 'OFFLINE',
        venue: ev.venue || '',
        meetingUrl: ev.meetingUrl || '',
        registrationEnabled: ev.registrationEnabled || false,
        registrationUrl: ev.registrationUrl || '',
        facultyCoordinator: ev.facultyCoordinator || '',
        studentCoordinator: ev.studentCoordinator || '',
        contactEmail: ev.contactEmail || '',
        contactPhone: ev.contactPhone || '',
        status: ev.status || 'DRAFT',
        visibility: ev.visibility || 'PUBLIC'
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (!isEditing && field === 'title') {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    // Pre-validate dates to prevent RangeError: Invalid time value
    if (!formData.startDate || isNaN(new Date(formData.startDate).getTime())) {
      setError('Please enter a valid Start Date and Time.');
      setIsSaving(false);
      return;
    }
    if (!formData.endDate || isNaN(new Date(formData.endDate).getTime())) {
      setError('Please enter a valid End Date and Time.');
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };
      
      if (isEditing) {
        await api.patch(`/control/events/${id}`, payload);
      } else {
        await api.post(`/control/events`, payload);
      }
      navigate('events');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'VALIDATION_ERROR' && err.details) {
        const fieldErrors = Object.entries(err.details)
          .filter(([key]) => key !== '_errors')
          .map(([key, value]: [string, any]) => `${key}: ${value._errors.join(', ')}`)
          .join('; ');
        setError(`Validation Error - ${fieldErrors || err.message}`);
      } else {
        setError(err?.message || 'Failed to save event. Please check the fields and try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-foreground-muted" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[1000px]">
      <PageHeader 
        title={isEditing ? "Edit Event" : "Create Event"}
        breadcrumbs={
          <div className="flex items-center gap-2 text-[13px] text-foreground-muted mb-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate('events')}>
            <ArrowLeft size={14} /> Back to Events
          </div>
        }
        actions={
          <>
            <Button type="button" variant="ghost" onClick={() => navigate('events')}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 size={16} className="animate-spin mr-2" />}
              {isEditing ? 'Save Changes' : 'Create Event'}
            </Button>
          </>
        }
      />

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500 animate-in fade-in slide-in-from-top-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20">
            <span className="text-xs font-bold">!</span>
          </div>
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-[240px] shrink-0">
          <nav className="flex flex-col space-y-1 sticky top-4">
            <button type="button" onClick={() => setActiveTab('basic')} className={`px-4 py-2.5 text-left text-[14px] font-medium rounded-md transition-colors ${activeTab === 'basic' ? 'bg-surface border border-border shadow-sm text-foreground' : 'text-foreground-secondary hover:bg-surface-secondary'}`}>
              Basic Information
            </button>
            <button type="button" onClick={() => setActiveTab('location')} className={`px-4 py-2.5 text-left text-[14px] font-medium rounded-md transition-colors ${activeTab === 'location' ? 'bg-surface border border-border shadow-sm text-foreground' : 'text-foreground-secondary hover:bg-surface-secondary'}`}>
              Date & Location
            </button>
            <button type="button" onClick={() => setActiveTab('registration')} className={`px-4 py-2.5 text-left text-[14px] font-medium rounded-md transition-colors ${activeTab === 'registration' ? 'bg-surface border border-border shadow-sm text-foreground' : 'text-foreground-secondary hover:bg-surface-secondary'}`}>
              Registration
            </button>
            <button type="button" onClick={() => setActiveTab('team')} className={`px-4 py-2.5 text-left text-[14px] font-medium rounded-md transition-colors ${activeTab === 'team' ? 'bg-surface border border-border shadow-sm text-foreground' : 'text-foreground-secondary hover:bg-surface-secondary'}`}>
              Event Team
            </button>
            <button type="button" onClick={() => setActiveTab('publish')} className={`px-4 py-2.5 text-left text-[14px] font-medium rounded-md transition-colors ${activeTab === 'publish' ? 'bg-surface border border-border shadow-sm text-foreground' : 'text-foreground-secondary hover:bg-surface-secondary'}`}>
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
                  <label className="text-[13px] font-medium block mb-1.5">Event Name <span className="text-error">*</span></label>
                  <Input required value={formData.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g. CSEA Orientation 2026" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Slug <span className="text-error">*</span></label>
                  <Input required value={formData.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="e.g. csea-orientation-2026" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Event Type</label>
                  <Select value={formData.eventType} onChange={e => handleChange('eventType', e.target.value)}>
                    <option value="Orientation">Orientation</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Competition">Competition</option>
                    <option value="Networking">Networking</option>
                    <option value="Talk">Talk</option>
                  </Select>
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Short Description</label>
                  <Textarea value={formData.shortDescription} onChange={e => handleChange('shortDescription', e.target.value)} placeholder="A brief summary for cards and lists (Max 120 chars)" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Full Description</label>
                  <Textarea value={formData.fullDescription} onChange={e => handleChange('fullDescription', e.target.value)} placeholder="Detailed event description" className="min-h-[150px]" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Cover Image URL</label>
                  <Input type="url" value={formData.coverImage} onChange={e => handleChange('coverImage', e.target.value)} placeholder="https://..." />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-[18px] font-semibold tracking-tight">Date & Location</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Start Date & Time <span className="text-error">*</span></label>
                  <Input required type="datetime-local" value={formData.startDate} onChange={e => handleChange('startDate', e.target.value)} />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">End Date & Time <span className="text-error">*</span></label>
                  <Input required type="datetime-local" value={formData.endDate} onChange={e => handleChange('endDate', e.target.value)} />
                </div>
              </div>

              <hr className="border-border" />

              <div className="space-y-4">
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Format</label>
                  <Select value={formData.format} onChange={e => handleChange('format', e.target.value)}>
                    <option value="OFFLINE">Offline</option>
                    <option value="ONLINE">Online</option>
                    <option value="HYBRID">Hybrid</option>
                  </Select>
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Venue</label>
                  <Input value={formData.venue} onChange={e => handleChange('venue', e.target.value)} placeholder="e.g. Main Auditorium" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Meeting URL (if applicable)</label>
                  <Input type="url" value={formData.meetingUrl} onChange={e => handleChange('meetingUrl', e.target.value)} placeholder="https://" />
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
                  checked={formData.registrationEnabled}
                  onChange={(e) => handleChange('registrationEnabled', e.target.checked)}
                  className="w-4 h-4 text-accent" 
                />
              </div>

              {formData.registrationEnabled && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">
                      Registration Form URL <span className="text-error">*</span>
                    </label>
                    <Input type="url" value={formData.registrationUrl} onChange={e => handleChange('registrationUrl', e.target.value)} placeholder="https://forms.google.com/..." required={formData.registrationEnabled} />
                    <p className="text-[12px] text-foreground-muted mt-1.5">Enter the external link (e.g. Google Forms) where students will register.</p>
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
                  <Input value={formData.facultyCoordinator} onChange={e => handleChange('facultyCoordinator', e.target.value)} placeholder="Name of faculty" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Student Coordinator</label>
                  <Input value={formData.studentCoordinator} onChange={e => handleChange('studentCoordinator', e.target.value)} placeholder="Name of student lead" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Contact Email</label>
                  <Input type="email" value={formData.contactEmail} onChange={e => handleChange('contactEmail', e.target.value)} placeholder="support@event.com" />
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Contact Phone (Optional)</label>
                  <Input value={formData.contactPhone} onChange={e => handleChange('contactPhone', e.target.value)} placeholder="+91" />
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
                  <Select value={formData.status} onChange={e => handleChange('status', e.target.value)}>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Select>
                </div>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Visibility</label>
                  <Select value={formData.visibility} onChange={e => handleChange('visibility', e.target.value)}>
                    <option value="PUBLIC">Public (Visible to everyone)</option>
                    <option value="PRIVATE">Private (Unlisted, link only)</option>
                  </Select>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </form>
  );
}
