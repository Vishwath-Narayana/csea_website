import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, UploadCloud } from 'lucide-react';

export function GalleryUpload({ navigate }: { navigate: (view: string) => void }) {
  return (
    <div className="mx-auto max-w-2xl flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-8 flex items-center gap-4 shrink-0">
        <Button variant="ghost" size="icon" onClick={() => navigate('galleries')}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-foreground">
            New Album
          </h1>
          <p className="text-[14px] text-foreground-secondary">
            Upload and organize photos.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8 flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">Album Title</label>
            <Input placeholder="e.g. Orientation 2026" />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">Event Date</label>
            <Input type="date" />
          </div>
        </div>

        <div className="flex-1 min-h-[300px] rounded-xl border-2 border-dashed border-border bg-surface-secondary/20 flex flex-col items-center justify-center text-foreground-muted hover:bg-surface-secondary/40 transition-colors cursor-pointer">
          <UploadCloud size={32} className="mb-4 opacity-50" />
          <h3 className="text-[15px] font-medium text-foreground mb-1">Drag & drop photos</h3>
          <p className="text-[13px] text-foreground-secondary mb-4">JPEG, PNG or WEBP up to 10MB each</p>
          <Button variant="outline">Browse Files</Button>
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-3 pt-4 shrink-0 mt-4">
        <Button variant="ghost" onClick={() => navigate('galleries')}>Cancel</Button>
        <Button>Create Album</Button>
      </div>
    </div>
  );
}
