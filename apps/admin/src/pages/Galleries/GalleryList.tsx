import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { FilterBar } from '../../components/ui/FilterBar';
import { Image as ImageIcon, Plus } from 'lucide-react';

export function GalleryList({ navigate }: { navigate: (view: string) => void }) {
  const [hasGalleries] = useState(true);

  const albums = [
    { id: 1, title: 'Orientation 2026', event: 'Orientation', date: 'Aug 15', photos: 120, visibility: 'Public', cover: null },
    { id: 2, title: 'Hackathon Winners', event: 'Hackathon', date: 'Jul 28', photos: 45, visibility: 'Public', cover: null },
    { id: 3, title: 'Faculty Meet', event: 'Networking', date: 'Jul 10', photos: 12, visibility: 'Private', cover: null },
  ];

  return (
    <div className="mx-auto max-w-content pb-12">
      <PageHeader 
        title="Galleries"
        description="Manage event photography and visual assets."
        actions={
          hasGalleries && (
            <Button onClick={() => navigate('galleries/upload')}>
              <Plus size={16} className="mr-2" />
              New Album
            </Button>
          )
        }
      />

      {hasGalleries && (
        <FilterBar 
          searchPlaceholder="Search albums..."
          filters={[
            {
              id: 'visibility',
              placeholder: 'All Visibilities',
              options: [
                { label: 'Public', value: 'public' },
                { label: 'Private', value: 'private' }
              ]
            }
          ]}
        />
      )}

      {!hasGalleries ? (
        <EmptyState 
          icon={<ImageIcon size={24} />}
          title="Create your first album"
          description="Upload high-res photos to create curated event galleries for the community."
          actionLabel="Select Files"
          onAction={() => navigate('galleries/upload')}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map((album) => (
            <div key={album.id} className="group cursor-pointer" onClick={() => navigate(`galleries/${album.id}`)}>
              <div className="aspect-[4/3] rounded-xl bg-surface border border-border shadow-sm flex items-center justify-center mb-3 group-hover:ring-2 ring-accent ring-offset-2 ring-offset-canvas transition-all overflow-hidden relative">
                {album.cover ? (
                  <img src={album.cover} alt={album.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={32} className="text-foreground-muted/50" />
                )}
                <div className="absolute top-2 right-2 bg-surface/80 backdrop-blur-sm text-foreground text-[11px] font-medium px-2 py-0.5 rounded-full border border-border">
                  {album.photos} photos
                </div>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground tracking-tight line-clamp-1">{album.title}</h3>
                <p className="text-[12px] text-foreground-secondary">{album.date} · {album.visibility}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
