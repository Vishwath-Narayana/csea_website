import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { FilterBar } from '../../components/ui/FilterBar';
import { Image as ImageIcon, Plus, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';
import { Pagination } from '../../components/ui/Pagination';

export function GalleryList({ navigate }: { navigate: (view: string) => void }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [galleries, setGalleries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchGalleries();
  }, [currentPage]);

  const fetchGalleries = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<any>(`/control/galleries?page=${currentPage}&limit=12`);
      setGalleries(response.data);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch galleries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasGalleries = galleries.length > 0;

  return (
    <div className="mx-auto max-w-content pb-12">
      <PageHeader 
        title="Galleries"
        description="Manage event photography and visual assets."
        actions={
          <Button onClick={() => navigate('galleries/upload')}>
            <Plus size={16} className="mr-2" />
            New Album
          </Button>
        }
      />

      {(hasGalleries || isLoading) && (
        <FilterBar 
          searchPlaceholder="Search albums..."
          filters={[
            {
              id: 'visibility',
              placeholder: 'All Visibilities',
              options: [
                { label: 'Public', value: 'PUBLIC' },
                { label: 'Private', value: 'PRIVATE' }
              ]
            }
          ]}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-foreground-muted" />
        </div>
      ) : !hasGalleries ? (
        <EmptyState 
          icon={<ImageIcon size={24} />}
          title="Create your first album"
          description="Upload high-res photos to create curated event galleries for the community."
          actionLabel="Initialize Album"
          onAction={() => navigate('galleries/upload')}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {galleries.map((album) => (
              <div key={album.id} className="group cursor-pointer" onClick={() => navigate(`galleries/${album.id}`)}>
                <div className="aspect-[4/3] rounded-xl bg-surface border border-border shadow-sm flex items-center justify-center mb-3 group-hover:ring-2 ring-accent ring-offset-2 ring-offset-canvas transition-all overflow-hidden relative">
                  <ImageIcon size={32} className="text-foreground-muted/50" />
                  <div className="absolute top-2 right-2 bg-surface/80 backdrop-blur-sm text-foreground text-[11px] font-medium px-2 py-0.5 rounded-full border border-border">
                    Album
                  </div>
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-foreground tracking-tight line-clamp-1">{album.title}</h3>
                  <p className="text-[12px] text-foreground-secondary">{album.eventDate ? new Date(album.eventDate).toLocaleDateString() : 'No date'} · {album.visibility}</p>
                </div>
              </div>
            ))}
          </div>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
