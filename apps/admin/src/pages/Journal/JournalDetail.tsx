import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/Badge';
import { ArrowLeft, Edit, Calendar, User, Tag, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

export function JournalDetail({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<any>(`/control/journal/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Failed to fetch journal post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!post || post.status === 'PUBLISHED') return;
    try {
      await api.patch(`/control/journal/${id}`, { status: 'PUBLISHED' });
      fetchPost();
    } catch (error) {
      console.error('Failed to publish post:', error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-foreground-muted" /></div>;
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-foreground-muted mb-4">Post not found.</p>
        <Button variant="outline" onClick={() => navigate('journal')}>Back to Journal</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-content h-[calc(100vh-120px)] overflow-y-auto">
      <div className="max-w-[800px] mx-auto pt-4 pb-12">
        <PageHeader 
          title="Preview Article"
          breadcrumbs={
            <div className="flex items-center gap-2 text-[13px] text-foreground-muted mb-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate('journal')}>
              <ArrowLeft size={14} /> Back to Journal
            </div>
          }
          actions={
            <>
              <Button variant="outline" onClick={() => navigate(`journal/${id}/edit`)}>
                <Edit size={16} className="mr-2" /> Edit Content
              </Button>
              {post.status !== 'PUBLISHED' && (
                <Button onClick={handlePublish}>Publish</Button>
              )}
            </>
          }
        />

        <div className="mt-8 bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
          {post.coverImage ? (
            <img src={post.coverImage} alt="Cover" className="h-[300px] w-full object-cover border-b border-border" />
          ) : (
            <div className="h-[300px] w-full bg-surface-secondary flex items-center justify-center border-b border-border">
              <span className="text-foreground-muted">No Cover Image</span>
            </div>
          )}
          
          <div className="p-8 sm:p-12">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-[13px] text-foreground-muted">
              <StatusBadge status={post.status} />
              <div className="flex items-center gap-1.5">
                <Calendar size={14} /> 
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Unpublished'}
              </div>
              <div className="flex items-center gap-1.5"><User size={14} /> {post.authorId || 'Author'}</div>
              {post.category && (
                <div className="flex items-center gap-1.5"><Tag size={14} /> {post.category}</div>
              )}
            </div>

            <h1 className="text-[36px] font-bold tracking-tight text-foreground mb-4 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-[18px] text-foreground-secondary mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div 
              className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground/90"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
