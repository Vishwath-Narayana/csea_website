import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { ArrowLeft, CheckCircle2, Download, Shield } from 'lucide-react';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';

export function GalleryDetail({ navigate }: { navigate: (view: string) => void, id?: string }) {
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // Mock photos
  const photos = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    url: null, // placeholder
    name: `IMG_${8000 + i}.jpg`,
    size: '2.4 MB'
  }));

  const toggleSelect = (photoId: number) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) ? prev.filter(id => id !== photoId) : [...prev, photoId]
    );
  };

  const isSelectionMode = selectedPhotos.length > 0;

  return (
    <div className="mx-auto max-w-content pb-12">
      <PageHeader 
        title="Orientation 2026"
        description="Event Gallery · 12 photos · Public"
        breadcrumbs={
          <div className="flex items-center gap-2 text-[13px] text-foreground-muted mb-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate('galleries')}>
            <ArrowLeft size={14} /> Back to Galleries
          </div>
        }
        actions={
          isSelectionMode ? (
            <div className="flex items-center gap-4 bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full animate-in fade-in zoom-in-95">
              <span className="text-[13px] font-medium text-accent">{selectedPhotos.length} selected</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-7 px-2">Download</Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-error hover:text-error hover:bg-error/10" onClick={() => setDeleteModalOpen(true)}>Delete</Button>
                <div className="w-px h-4 bg-accent/20 mx-1"></div>
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setSelectedPhotos([])}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('galleries/upload')}>Upload More</Button>
              <Button variant="outline">
                <Shield size={16} className="mr-2" /> Make Private
              </Button>
            </>
          )
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
        {photos.map((photo) => {
          const isSelected = selectedPhotos.includes(photo.id);
          return (
            <div 
              key={photo.id}
              className={`group relative aspect-square rounded-xl bg-surface border shadow-sm overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-accent ring-2 ring-accent/50' : 'border-border hover:border-foreground-muted'}`}
              onClick={() => toggleSelect(photo.id)}
            >
              <div className="w-full h-full flex items-center justify-center text-[10px] text-foreground-muted/40 font-mono p-4 text-center break-all">
                {photo.name}
              </div>
              
              {/* Select Indicator */}
              <div className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-accent border-accent text-white' : 'border-white/50 opacity-0 group-hover:opacity-100 shadow-sm'}`}>
                {isSelected && <CheckCircle2 size={12} strokeWidth={3} />}
              </div>

              {/* Hover Actions */}
              {!isSelected && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                  <div className="text-[10px] text-white/80 font-medium truncate pr-2">{photo.size}</div>
                  <button className="text-white hover:text-accent transition-colors" onClick={(e) => { e.stopPropagation(); }}>
                    <Download size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmationDialog 
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          setSelectedPhotos([]);
          setDeleteModalOpen(false);
        }}
        title={`Delete ${selectedPhotos.length} photos?`}
        description="Are you sure you want to delete the selected photos? This action cannot be undone and they will be removed from the public gallery immediately."
        isDestructive={true}
        confirmLabel="Delete Photos"
      />
    </div>
  );
}
