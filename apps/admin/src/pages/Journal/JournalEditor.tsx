import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ArrowLeft, Image as ImageIcon, Settings } from 'lucide-react';

export function JournalEditor({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const isEditing = !!id;

  return (
    <div className="mx-auto max-w-content h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('journal')}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-[18px] font-semibold tracking-tight text-foreground">
              {isEditing ? 'Edit Article' : 'New Article'}
            </h1>
            <p className="text-[13px] text-foreground-secondary">
              {isEditing ? 'Last saved 2 hours ago' : 'Drafting new story'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Settings size={16} className="mr-2" />
            Post Settings
          </Button>
          <Button variant="secondary">Save Draft</Button>
          <Button>Publish</Button>
        </div>
      </div>
      
      <div className="flex flex-1 gap-8 min-h-0">
        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto pr-4">
          <div className="flex flex-col gap-6">
            <input 
              type="text"
              placeholder="Article Title..." 
              className="w-full bg-transparent text-[40px] font-semibold tracking-tight text-foreground placeholder:text-foreground-muted/50 focus:outline-none"
              defaultValue={isEditing ? 'Architecting the New CSEA Platform' : ''}
            />
            
            <div className="h-[240px] w-full rounded-xl border border-dashed border-border bg-surface-secondary/20 flex flex-col items-center justify-center text-foreground-muted transition-colors hover:bg-surface-secondary/40 cursor-pointer">
              <ImageIcon size={24} className="mb-2 opacity-50" />
              <span className="text-[13px] font-medium">Add Cover Image</span>
              <span className="text-[12px] opacity-70">1200 x 630px recommended</span>
            </div>

            <textarea 
              placeholder="Start writing your story..."
              className="w-full flex-1 resize-none bg-transparent text-[17px] leading-relaxed text-foreground placeholder:text-foreground-muted/50 focus:outline-none min-h-[400px]"
              defaultValue={isEditing ? 'The journey of rebuilding the CSEA platform started with a simple question...' : ''}
            />
          </div>
        </div>

        {/* Sidebar Settings (Mocked as always visible on desktop) */}
        <div className="w-[300px] shrink-0 border-l border-border pl-8 hidden lg:block overflow-y-auto">
          <h3 className="text-[14px] font-semibold mb-4 tracking-tight">Metadata</h3>
          
          <div className="flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground-secondary">Author</label>
              <Select>
                <option>Tech Team</option>
                <option>Leadership</option>
                <option>Events Team</option>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground-secondary">Category</label>
              <Select>
                <option>Engineering</option>
                <option>Announcements</option>
                <option>Community</option>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground-secondary">Excerpt</label>
              <Textarea 
                placeholder="Brief summary for preview cards..." 
                className="h-[100px]"
                defaultValue={isEditing ? 'A deep dive into the technical decisions behind our new platform.' : ''}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
