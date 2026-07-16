import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Image as ImageIcon, Plus } from 'lucide-react';

export function GalleryList({ navigate }: { navigate: (view: string) => void }) {
  const hasGalleries = false;

  return (
    <div className="mx-auto max-w-content">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-[20px] font-semibold tracking-tight text-foreground">Galleries</h1>
          <p className="text-[14px] text-foreground-secondary">Upload and manage event photography albums.</p>
        </div>
        {hasGalleries && (
          <Button onClick={() => navigate('galleries/upload')}>
            <Plus size={16} className="mr-2" />
            New Album
          </Button>
        )}
      </div>

      {!hasGalleries ? (
        <EmptyState 
          icon={<ImageIcon size={24} />}
          title="Create your first album"
          description="Upload high-res photos to create curated event galleries for the community."
          actionLabel="Select Files"
          onAction={() => navigate('galleries/upload')}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Gallery items would go here */}
        </div>
      )}
    </div>
  );
}
