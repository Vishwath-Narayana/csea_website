import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PageHeader } from '../../components/ui/PageHeader';
import { ArrowLeft, Image as ImageIcon, Settings, Type, Bold, Italic, Underline, Link, List, Quote, Code, Minus } from 'lucide-react';

export function JournalEditor({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const isEditing = !!id;
  const [hasChanges, setHasChanges] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  // Mock unsaved changes protection
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

  const handleChange = () => setHasChanges(true);

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
              <Button variant="outline" onClick={() => navigate(isEditing ? `journal/${id}` : 'journal/preview')}>Preview</Button>
              <Button variant="outline" onClick={() => setHasChanges(false)}>Save Draft</Button>
              <Button onClick={() => setHasChanges(false)}>{isEditing ? 'Update Article' : 'Publish'}</Button>
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
                placeholder="Article Title" 
                className="w-full bg-transparent text-[40px] font-bold tracking-tight text-foreground placeholder:text-foreground-muted/50 focus:outline-none mb-6"
                onChange={handleChange}
              />
              <div 
                className="w-full min-h-[500px] text-[16px] leading-relaxed text-foreground focus:outline-none"
                contentEditable
                suppressContentEditableWarning
                onInput={handleChange}
                data-placeholder="Start writing..."
              >
                {isEditing ? (
                  <p>The tech industry is moving incredibly fast, and as engineers we must adapt...</p>
                ) : null}
              </div>
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
                    <Select onChange={handleChange}>
                      <option>Technology</option>
                      <option>Academics</option>
                      <option>Tutorials</option>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">Author</label>
                    <Input defaultValue="Vishwath" onChange={handleChange} />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">Tags (comma separated)</label>
                    <Input placeholder="e.g. React, UI, Design" onChange={handleChange} />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[13px] font-semibold tracking-wide uppercase text-foreground-muted mb-4">Media</h3>
                <div>
                  <label className="text-[13px] font-medium block mb-1.5">Cover Image</label>
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg text-foreground-muted hover:bg-surface-secondary/50 cursor-pointer transition-colors" onClick={handleChange}>
                    <ImageIcon size={24} className="mb-2 opacity-50" />
                    <span className="text-[12px]">Click to upload cover</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[13px] font-semibold tracking-wide uppercase text-foreground-muted mb-4">Publishing</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">Status</label>
                    <Select onChange={handleChange}>
                      <option>Draft</option>
                      <option>In Review</option>
                      <option>Published</option>
                      <option>Archived</option>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">Publish Date</label>
                    <Input type="datetime-local" onChange={handleChange} />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border text-accent focus:ring-accent" onChange={handleChange} />
                    <span className="text-[13px] font-medium">Featured Article</span>
                  </label>
                </div>
              </section>

              <section>
                <h3 className="text-[13px] font-semibold tracking-wide uppercase text-foreground-muted mb-4">SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">Slug</label>
                    <Input placeholder="e.g. future-of-ai" onChange={handleChange} />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">SEO Title</label>
                    <Input placeholder="Max 60 characters" onChange={handleChange} />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium block mb-1.5">SEO Description</label>
                    <Textarea placeholder="Max 160 characters" className="min-h-[80px]" onChange={handleChange} />
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
