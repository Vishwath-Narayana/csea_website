import { useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PageHeader } from '../../components/ui/PageHeader';
import { ArrowLeft, Image as ImageIcon, Settings, Type, Bold, Italic, Underline, Link, List, Quote, Code, Minus, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

export function JournalEditor({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const isEditing = !!id;
  const [hasChanges, setHasChanges] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'Technology',
    status: 'DRAFT',
    visibility: 'PUBLIC',
    publishedAt: ''
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
        content: post.content || '',
        coverImage: post.coverImage || '',
        category: post.category || 'Technology',
        status: post.status || 'DRAFT',
        visibility: post.visibility || 'PUBLIC',
        publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : ''
      });
      if (contentRef.current) {
        contentRef.current.innerHTML = post.content || '';
      }
    } catch (error) {
      console.error(error);
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

  const handleContentInput = (e: React.FormEvent<HTMLDivElement>) => {
    setHasChanges(true);
    setFormData(prev => ({ ...prev, content: e.currentTarget.innerHTML }));
  };

  const handleSave = async (forceStatus?: string) => {
    setIsSaving(true);
    try {
      const payload = { ...formData };
      if (forceStatus) {
        payload.status = forceStatus;
      }
      // Set publishedAt to now if publishing and not set
      if (payload.status === 'PUBLISHED' && !payload.publishedAt) {
        payload.publishedAt = new Date().toISOString();
      }

      if (isEditing) {
        await api.patch(`/control/journal/${id}`, payload);
      } else {
        await api.post(`/control/journal`, payload);
      }
      setHasChanges(false);
      navigate('journal');
    } catch (error) {
      console.error(error);
      alert('Failed to save article.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-foreground-muted" /></div>;
  }

  return (
    <div className="mx-auto max-w-[1400px] flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      <div className="shrink-0 mb-6">
        <PageHeader 
          title={isEditing ? "Edit Article" : "New Article"}
          breadcrumbs={
            <div className="flex items-center gap-2 text-[13px] text-foreground-muted mb-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate('journal')}>
              <ArrowLeft size={14} /> Back to Journal
            </div>
          }
          actions={
            <>
              <Button variant="ghost" onClick={() => setShowSettings(!showSettings)}>
                <Settings size={16} className="mr-2" />
                {showSettings ? 'Hide Settings' : 'Settings'}
              </Button>
              <Button variant="outline" disabled={isSaving} onClick={() => handleSave('DRAFT')}>Save Draft</Button>
              <Button disabled={isSaving} onClick={() => handleSave()}>
                {isSaving && <Loader2 size={16} className="animate-spin mr-2" />}
                {isEditing ? 'Update Article' : 'Publish'}
              </Button>
            </>
          }
        />
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
          {/* Mock Toolbar */}
          <div className="shrink-0 flex items-center gap-1 border-b border-border p-2 overflow-x-auto bg-surface-secondary/50">
            <Button variant="ghost" size="icon" className="h-8 w-8"><Type size={14} /></Button>
            <div className="w-px h-4 bg-border mx-1"></div>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Bold size={14} /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Italic size={14} /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Underline size={14} /></Button>
            <div className="w-px h-4 bg-border mx-1"></div>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Link size={14} /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><List size={14} /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Quote size={14} /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Code size={14} /></Button>
            <div className="w-px h-4 bg-border mx-1"></div>
            <Button variant="ghost" size="icon" className="h-8 w-8"><ImageIcon size={14} /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Minus size={14} /></Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 sm:p-12">
            <div className="max-w-editorial mx-auto">
              <input 
                type="text" 
                value={formData.title}
                placeholder="Article Title" 
                className="w-full bg-transparent text-[40px] font-bold tracking-tight text-foreground placeholder:text-foreground-muted/50 focus:outline-none mb-6"
                onChange={(e) => handleChange('title', e.target.value)}
              />
              <div 
                ref={contentRef}
                className="w-full min-h-[500px] text-[16px] leading-relaxed text-foreground focus:outline-none"
                contentEditable
                suppressContentEditableWarning
                onInput={handleContentInput}
                data-placeholder="Start writing..."
              />
            </div>
          </div>
        </div>

        {/* Settings Sidebar */}
        {showSettings && (
          <div className="w-[320px] shrink-0 overflow-y-auto rounded-xl border border-border bg-surface p-6 shadow-sm no-scrollbar">
            <div className="flex flex-col gap-6">
              <section>
                <h3 className="text-[13px] font-semibold tracking-wide uppercase text-foreground-muted mb-4">Metadata</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">Category</label>
                    <Select value={formData.category} onChange={e => handleChange('category', e.target.value)}>
                      <option value="Technology">Technology</option>
                      <option value="Academics">Academics</option>
                      <option value="Tutorials">Tutorials</option>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">Excerpt</label>
                    <Textarea value={formData.excerpt} onChange={e => handleChange('excerpt', e.target.value)} placeholder="Short summary for preview cards" className="min-h-[80px]" />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[13px] font-semibold tracking-wide uppercase text-foreground-muted mb-4">Media</h3>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Cover Image URL</label>
                  <Input type="url" value={formData.coverImage} onChange={e => handleChange('coverImage', e.target.value)} placeholder="https://..." />
                </div>
              </section>

              <section>
                <h3 className="text-[13px] font-semibold tracking-wide uppercase text-foreground-muted mb-4">Publishing</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">Status</label>
                    <Select value={formData.status} onChange={e => handleChange('status', e.target.value)}>
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">Visibility</label>
                    <Select value={formData.visibility} onChange={e => handleChange('visibility', e.target.value)}>
                      <option value="PUBLIC">Public</option>
                      <option value="PRIVATE">Private</option>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">Publish Date</label>
                    <Input type="datetime-local" value={formData.publishedAt} onChange={e => handleChange('publishedAt', e.target.value)} />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[13px] font-semibold tracking-wide uppercase text-foreground-muted mb-4">SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">Slug <span className="text-error">*</span></label>
                    <Input value={formData.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="e.g. future-of-ai" required />
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
