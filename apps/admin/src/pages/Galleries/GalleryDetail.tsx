import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { ArrowLeft, CheckCircle2, Shield, Loader2, Image as ImageIcon } from 'lucide-react';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { api } from '../../utils/api';

export function GalleryDetail({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [gallery, setGallery] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchGallery();
  }, [id]);

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<any>(`/control/galleries/${id}`);
      setGallery(response.data);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) ? prev.filter(id => id !== photoId) : [...prev, photoId]
    );
  };

  const handleDeletePhotos = async () => {
    try {
      for (const photoId of selectedPhotos) {
        await api.delete(`/control/galleries/${id}/photos/${photoId}`);
      }
      setSelectedPhotos([]);
      setDeleteModalOpen(false);
      fetchGallery();
    } catch (error) {
      console.error('Failed to delete photos:', error);
      alert('Failed to delete some photos.');
    }
  };

  const handleDeleteGallery = async () => {
    if (!confirm('Are you sure you want to delete this entire album?')) return;
    try {
      await api.delete(`/control/galleries/${id}`);
      navigate('galleries');
    } catch (error) {
      console.error('Failed to delete gallery:', error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-foreground-muted" /></div>;
  }

  if (!gallery) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-foreground-muted mb-4">Gallery not found.</p>
        <Button variant="outline" onClick={() => navigate('galleries')}>Back to Galleries</Button>
      </div>
    );
  }

  const isSelectionMode = selectedPhotos.length > 0;
  const photos = gallery.photos || [];

  return (
    <div className="mx-auto max-w-content pb-12">
      <PageHeader 
        title={gallery.title}
        description={`${gallery.description || 'Event Gallery'} · ${photos.length} photos · ${gallery.visibility}`}
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
                <Button variant="ghost" size="sm" className="h-7 px-2 text-error hover:text-error hover:bg-error/10" onClick={() => setDeleteModalOpen(true)}>Delete</Button>
                <div className="w-px h-4 bg-accent/20 mx-1"></div>
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setSelectedPhotos([])}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('galleries/upload')}>Upload More</Button>
              <Button variant="danger" onClick={handleDeleteGallery}>Delete Album</Button>
            </>
          )
        }
      />

      {photos.length === 0 ? (
        <div className="text-center py-20 text-foreground-muted">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-[15px] font-medium text-foreground mb-1">No photos in this album</p>
          <p className="text-[13px]">Upload some photos to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
          {photos.map((photo: any) => {
            const isSelected = selectedPhotos.includes(photo.id);
            return (
              <div 
                key={photo.id}
                className={`group relative aspect-square rounded-xl bg-surface border shadow-sm overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-accent ring-2 ring-accent/50' : 'border-border hover:border-foreground-muted'}`}
                onClick={() => toggleSelect(photo.id)}
              >
                <img src={photo.url} alt={photo.fileName} className="w-full h-full object-cover" onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%239CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                }} />
                
                {/* Select Indicator */}
                <div className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-accent border-accent text-white' : 'border-white/50 opacity-0 group-hover:opacity-100 shadow-sm'}`}>
                  {isSelected && <CheckCircle2 size={12} strokeWidth={3} />}
                </div>

                {/* Hover Details */}
                {!isSelected && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                    <div className="text-[10px] text-white/80 font-medium truncate pr-2">{photo.fileName}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmationDialog 
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeletePhotos}
        title={`Delete ${selectedPhotos.length} photos?`}
        description="Are you sure you want to delete the selected photos? This action cannot be undone and they will be removed from the public gallery immediately."
        isDestructive={true}
        confirmLabel="Delete Photos"
      />
    </div>
  );
}
