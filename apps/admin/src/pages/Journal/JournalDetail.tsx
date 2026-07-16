import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/Badge';
import { ArrowLeft, Edit, Calendar, User, Tag } from 'lucide-react';

export function JournalDetail({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  // Mock article data
  const article = {
    title: 'The Future of AI in Engineering',
    author: 'Vishwath',
    status: 'Published',
    date: 'Aug 14, 2026',
    category: 'Technology',
    tags: ['AI', 'Engineering', 'Future'],
    content: `
      The tech industry is moving incredibly fast, and as engineers we must adapt. 
      Artificial Intelligence is no longer just a buzzword; it is becoming a foundational building block of modern engineering.
      From code generation to complex system design, AI tools are augmenting human capabilities at an unprecedented scale.
    `
  };

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
              <Button>Publish</Button>
            </>
          }
        />

        <div className="mt-8 bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
          {/* Mock Cover Image */}
          <div className="h-[300px] w-full bg-surface-secondary flex items-center justify-center border-b border-border">
            <span className="text-foreground-muted">Cover Image (1200x600)</span>
          </div>
          
          <div className="p-8 sm:p-12">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-[13px] text-foreground-muted">
              <StatusBadge status={article.status} />
              <div className="flex items-center gap-1.5"><Calendar size={14} /> {article.date}</div>
              <div className="flex items-center gap-1.5"><User size={14} /> {article.author}</div>
              <div className="flex items-center gap-1.5"><Tag size={14} /> {article.category}</div>
            </div>

            <h1 className="text-[36px] font-bold tracking-tight text-foreground mb-8 leading-tight">
              {article.title}
            </h1>

            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground/90">
              {article.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 leading-relaxed">{paragraph}</p>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-border">
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-foreground-muted mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-surface-secondary rounded-full text-[13px] text-foreground-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
