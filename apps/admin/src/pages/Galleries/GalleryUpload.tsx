import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PageHeader } from '../../components/ui/PageHeader';
import { ArrowLeft, UploadCloud, FileImage, X, CheckCircle2, AlertCircle } from 'lucide-react';

export function GalleryUpload({ navigate }: { navigate: (view: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUploadClick = () => {
    if (selectedFiles.length > 0) {
      setIsUploading(true);
    }
  };

  return (
    <div className="mx-auto max-w-[900px] flex flex-col h-[calc(100vh-120px)] overflow-hidden pb-8">
      <div className="shrink-0 mb-6">
        <PageHeader 
          title="New Album"
          description="Create a new gallery and upload high-resolution photos."
          breadcrumbs={
            <div className="flex items-center gap-2 text-[13px] text-foreground-muted mb-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate('galleries')}>
              <ArrowLeft size={14} /> Back to Galleries
            </div>
          }
          actions={
            <>
              <Button variant="ghost" onClick={() => navigate('galleries')}>Cancel</Button>
              <Button onClick={() => navigate('galleries/1')}>Create & Publish</Button>
            </>
          }
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-8">
        {/* Metadata */}
        <section className="bg-surface rounded-xl border border-border p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Album Title</label>
                <Input placeholder="e.g. Orientation 2026" />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Related Event</label>
                <Select>
                  <option>Select an event...</option>
                  <option>CSEA Orientation 2026</option>
                  <option>Tech Talk: Web3</option>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Event Date</label>
                <Input type="date" />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Visibility</label>
                <Select>
                  <option>Public</option>
                  <option>Private</option>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Zone */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold tracking-tight text-foreground">Upload Photos</h2>
            {selectedFiles.length > 0 && !isUploading && (
              <Button onClick={handleUploadClick}>Start Upload ({selectedFiles.length})</Button>
            )}
          </div>
          
          <label 
            className="w-full min-h-[240px] rounded-xl border-2 border-dashed border-border bg-surface-secondary/20 flex flex-col items-center justify-center text-foreground-muted hover:bg-surface-secondary/40 hover:border-foreground-muted/30 transition-all cursor-pointer relative"
          >
            <input 
              type="file" 
              multiple 
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <UploadCloud size={32} className="mb-4 opacity-50" />
            <h3 className="text-[15px] font-medium text-foreground mb-1">Drag & drop photos</h3>
            <p className="text-[13px] text-foreground-secondary mb-4">JPEG, PNG or WEBP up to 10MB each</p>
            <Button variant="outline" disabled={isUploading} type="button" className="pointer-events-none">Browse Files</Button>
          </label>

          {/* Local Preview List */}
          {selectedFiles.length > 0 && !isUploading && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="bg-surface rounded-lg border border-border p-3 flex items-center gap-3">
                  <FileImage size={18} className="text-foreground-muted shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-[11px] text-foreground-secondary">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Progress UI */}
          {isUploading && (
            <div className="mt-4 bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-surface-secondary/50 flex items-center justify-between">
                <span className="text-[13px] font-medium">Uploading {selectedFiles.length} files...</span>
                <span className="text-[12px] text-foreground-muted">0 / {selectedFiles.length} complete</span>
              </div>
              <div className="divide-y divide-border">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 shrink-0 bg-surface-secondary rounded-lg flex items-center justify-center border border-border">
                      <FileImage size={20} className="text-foreground-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] font-medium text-foreground truncate">{file.name}</span>
                        <span className="text-[12px] text-foreground-muted">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent animate-pulse" 
                          style={{ width: '45%' }}
                        />
                      </div>
                    </div>
                    <div className="shrink-0 ml-2">
                      <button className="text-foreground-muted hover:text-foreground"><X size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
