import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Code2 } from 'lucide-react';

export function ProjectList({ navigate }: { navigate: (view: string) => void }) {
  // Let's assume we have no projects yet to show the EmptyState
  const hasProjects = false;

  return (
    <div className="mx-auto max-w-content">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-[20px] font-semibold tracking-tight text-foreground">Projects</h1>
          <p className="text-[14px] text-foreground-secondary">Oversee technical projects and team recruitment.</p>
        </div>
        {hasProjects && (
          <Button onClick={() => navigate('projects/create')}>New Project</Button>
        )}
      </div>

      {!hasProjects ? (
        <EmptyState 
          icon={<Code2 size={24} />}
          title="No projects yet"
          description="Create engineering missions, specify required tech stacks, and recruit students."
          actionLabel="Initialize Project"
          onAction={() => navigate('projects/create')}
        />
      ) : (
        <div>{/* List of projects goes here */}</div>
      )}
    </div>
  );
}
