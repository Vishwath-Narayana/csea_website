import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PageHeader } from '../../components/ui/PageHeader';
import { ArrowLeft, Image as ImageIcon, Plus, Trash2, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

export function GalleryUpload({ navigate }: { navigate: (view: string) => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    eventDate: '',
    visibility: 'PUBLIC'
  });

  const [photoUrls, setPhotoUrls] = useState<{url: string, name: string}[]>([]);
  const [newUrl, setNewUrl] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'title') {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handleAddUrl = () => {
    if (newUrl.trim()) {
      setPhotoUrls(prev => [...prev, { url: newUrl.trim(), name: `Photo ${prev.length + 1}` }]);
      setNewUrl('');
    }
  };

  const handleRemoveUrl = (index: number) => {
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      // 1. Create Gallery
      const payload = { ...formData, eventDate: formData.eventDate || undefined };
      const res = await api.post<any>('/control/galleries', payload);
      const galleryId = res.data.id;

      // 2. Add Photos
      for (const photo of photoUrls) {
        await api.post(`/control/galleries/${galleryId}/photos`, {
          url: photo.url,
          fileName: photo.name
        });
      }

      navigate('galleries');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'VALIDATION_ERROR' && err.details) {
        const fieldErrors = Object.entries(err.details)
          .filter(([key]) => key !== '_errors')
          .map(([key, value]: [string, any]) => `${key}: ${value._errors.join(', ')}`)
          .join('; ');
        setError(`Validation Error - ${fieldErrors || err.message}`);
      } else {
        setError(err?.message || 'Failed to save gallery. Please check the fields and try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[900px] flex flex-col h-[calc(100vh-120px)] overflow-hidden pb-8">
      <div className="shrink-0 mb-6">
        <PageHeader 
          title="New Album"
          description="Create a new gallery and provide external image URLs."
          breadcrumbs={
            <div className="flex items-center gap-2 text-[13px] text-foreground-muted mb-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate('galleries')}>
              <ArrowLeft size={14} /> Back to Galleries
            </div>
          }
          actions={
            <>
              <Button variant="ghost" onClick={() => navigate('galleries')}>Cancel</Button>
              <Button disabled={isSaving} onClick={handleSave}>
                {isSaving && <Loader2 size={16} className="animate-spin mr-2" />}
                Create & Publish
              </Button>
            </>
          }
        />

        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500 animate-in fade-in slide-in-from-top-2">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20">
              <span className="text-xs font-bold">!</span>
            </div>
            <p>{error}</p>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-8">
        {/* Metadata */}
        <section className="bg-surface rounded-xl border border-border p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Album Title <span className="text-error">*</span></label>
                <Input required value={formData.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g. Orientation 2026" />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Slug <span className="text-error">*</span></label>
                <Input required value={formData.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="e.g. orientation-2026" />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Description</label>
                <Textarea value={formData.description} onChange={e => handleChange('description', e.target.value)} placeholder="Short description of the gallery..." />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Event Date</label>
                <Input type="date" value={formData.eventDate} onChange={e => handleChange('eventDate', e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Visibility</label>
                <Select value={formData.visibility} onChange={e => handleChange('visibility', e.target.value)}>
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* External URL Zone */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold tracking-tight text-foreground">Add Photos (External URLs)</h2>
          </div>
          
          <div className="flex gap-2">
            <Input 
              type="url"
              placeholder="https://example.com/image.jpg"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
            />
            <Button onClick={handleAddUrl}><Plus size={16} className="mr-2" /> Add URL</Button>
          </div>

          {photoUrls.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {photoUrls.map((photo, idx) => (
                <div key={idx} className="group relative aspect-[4/3] bg-surface-secondary border border-border rounded-xl overflow-hidden shadow-sm">
                  <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%239CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                  }} />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="danger" size="icon" onClick={() => handleRemoveUrl(idx)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-foreground-muted border-2 border-dashed border-border rounded-xl mt-4">
              <ImageIcon size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-[14px]">No photos added yet.</p>
              <p className="text-[12px] mt-1">Paste an image URL above to add to this album.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
