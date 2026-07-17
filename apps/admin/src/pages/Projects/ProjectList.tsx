import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { FilterBar } from '../../components/ui/FilterBar';
import { StatusBadge } from '../../components/ui/Badge';
import { Code2, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';
import { Pagination } from '../../components/ui/Pagination';

export function ProjectList({ navigate }: { navigate: (view: string) => void }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProjects();
  }, [currentPage]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<any>(`/control/projects?page=${currentPage}&limit=9`);
      setProjects(response.data);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasProjects = projects.length > 0;

  return (
    <div className="mx-auto max-w-content pb-12">
      <PageHeader 
        title="Projects"
        description="Oversee technical projects, team recruitment, and open source initiatives."
        actions={
          <Button onClick={() => navigate('projects/create')}>New Project</Button>
        }
      />

      {(hasProjects || isLoading) && (
        <FilterBar 
          searchPlaceholder="Search projects..."
          filters={[
            {
              id: 'status',
              placeholder: 'All Statuses',
              options: [
                { label: 'Draft', value: 'DRAFT' },
                { label: 'Recruiting', value: 'RECRUITING' },
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Completed', value: 'COMPLETED' },
                { label: 'Archived', value: 'ARCHIVED' }
              ]
            }
          ]}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-foreground-muted" />
        </div>
      ) : !hasProjects ? (
        <EmptyState 
          icon={<Code2 size={24} />}
          title="No projects yet"
          description="Create engineering missions, specify required tech stacks, and recruit students."
          actionLabel="Initialize Project"
          onAction={() => navigate('projects/create')}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projects.map(proj => (
              <div key={proj.id} className="group flex flex-col bg-surface border border-border rounded-xl shadow-sm overflow-hidden hover:shadow-medium transition-shadow cursor-pointer" onClick={() => navigate(`projects/${proj.id}`)}>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 bg-surface-secondary border border-border rounded-lg flex items-center justify-center shrink-0">
                      <Code2 size={20} className="text-foreground-muted" />
                    </div>
                    <StatusBadge status={proj.status} />
                  </div>
                  <h3 className="text-[16px] font-semibold tracking-tight text-foreground mb-1">{proj.title}</h3>
                  <p className="text-[13px] text-foreground-secondary mb-4 line-clamp-2 flex-1">
                    {proj.shortDescription || 'No description provided.'}
                  </p>
                  <div className="flex items-center justify-between text-[13px] text-foreground-muted border-t border-border pt-4 mt-auto">
                    <span className="truncate pr-2">Lead: {proj.projectLead || 'TBA'}</span>
                    {proj.techStack && proj.techStack.length > 0 && <span className="text-accent font-medium">{proj.techStack.length} Techs</span>}
                  </div>
                </div>
                <div className="bg-surface-secondary/50 px-6 py-3 border-t border-border flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[13px] font-medium text-foreground">View Project</span>
                  <ArrowRight size={14} className="text-foreground" />
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
