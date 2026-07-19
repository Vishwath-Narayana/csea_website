import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PageHeader } from '../../components/ui/PageHeader';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

export function JournalEditor({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const isEditing = !!id;
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    googleDriveUrl: '',
    category: 'Technology',
    status: 'DRAFT',
    visibility: 'PUBLIC',
  });

  useEffect(() => {
    if (isEditing) fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await api.get<any>(`/control/journal/${id}`);
      const post = res.data;
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        googleDriveUrl: post.googleDriveUrl || '',
        category: post.category || 'Technology',
        status: post.status || 'DRAFT',
        visibility: post.visibility || 'PUBLIC',
      });
    } catch (error) {
      console.error(error);
      setError('Failed to load entry');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const handleChange = (field: string, value: any) => {
    setHasChanges(true);
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (!isEditing && field === 'title') {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handleSave = async (forceStatus?: string) => {
    setIsSaving(true);
    setError('');
    try {
      const payload = { ...formData };

      if (forceStatus) {
        payload.status = forceStatus;
      }

      if (isEditing) {
        await api.patch(`/control/journal/${id}`, payload);
      } else {
        await api.post(`/control/journal`, payload);
      }
      setHasChanges(false);
      navigate('journal');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'VALIDATION_ERROR' && err.details) {
        const fieldErrors = Object.entries(err.details)
          .filter(([key]) => key !== '_errors')
          .map(([key, value]: [string, any]) => `${key}: ${value._errors.join(', ')}`)
          .join('; ');
        setError(`Validation Error - ${fieldErrors || err.message}`);
      } else {
        setError(err?.message || 'Failed to save. Please check the fields and try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-foreground-muted" /></div>;
  }

  return (
    <div className="mx-auto max-w-[900px] pt-6">
      <PageHeader
        title={isEditing ? "Edit Journal Entry" : "New Journal Entry"}
        breadcrumbs={
          <div className="flex items-center gap-2 text-[13px] text-foreground-muted mb-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate('journal')}>
            <ArrowLeft size={14} /> Back to Journal
          </div>
        }
      />

      {error && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500 animate-in fade-in slide-in-from-top-2 mb-6">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20">
            <span className="text-xs font-bold">!</span>
          </div>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm mb-6">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          {/* Title */}
          <div>
            <label className="text-[13px] font-medium block mb-2">Title <span className="text-error">*</span></label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Journal entry title"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="text-[13px] font-medium block mb-2">Slug <span className="text-error">*</span></label>
            <Input
              type="text"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="e.g. my-journal-entry"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-[13px] font-medium block mb-2">Description/Excerpt</label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Short summary displayed on listing"
              className="min-h-[80px]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-[13px] font-medium block mb-2">Category</label>
            <Select value={formData.category} onChange={e => handleChange('category', e.target.value)}>
              <option value="Technology">Technology</option>
              <option value="Academics">Academics</option>
              <option value="Tutorials">Tutorials</option>
              <option value="Announcements">Announcements</option>
            </Select>
          </div>

          {/* Google Drive URL */}
          <div>
            <label className="text-[13px] font-medium block mb-2">Google Drive Report URL</label>
            <Input
              type="url"
              value={formData.googleDriveUrl}
              onChange={(e) => handleChange('googleDriveUrl', e.target.value)}
              placeholder="https://drive.google.com/..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-[13px] font-medium block mb-2">Status</label>
            <Select value={formData.status} onChange={e => handleChange('status', e.target.value)}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </div>

          {/* Visibility */}
          <div>
            <label className="text-[13px] font-medium block mb-2">Visibility</label>
            <Select value={formData.visibility} onChange={e => handleChange('visibility', e.target.value)}>
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('journal')}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSave('DRAFT')}
              disabled={isSaving}
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              onClick={() => handleSave('PUBLISHED')}
              disabled={isSaving}
            >
              {isSaving && <Loader2 size={16} className="animate-spin mr-2" />}
              Publish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
