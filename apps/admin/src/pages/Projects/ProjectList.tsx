import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { FilterBar } from '../../components/ui/FilterBar';
import { StatusBadge } from '../../components/ui/Badge';
import { Code2, ArrowRight } from 'lucide-react';

export function ProjectList({ navigate }: { navigate: (view: string) => void }) {
  const [hasProjects] = useState(true);

  const projects = [
    { id: 1, name: 'CSEA Platform Reboot', status: 'Recruiting', lead: 'John Doe', roles: 2, tech: 'React, Tailwind' },
    { id: 2, name: 'Orientation Mobile App', status: 'Active Development', lead: 'Jane Smith', roles: 0, tech: 'Flutter, Firebase' },
    { id: 3, name: 'Algorithm Visualizer', status: 'Completed', lead: 'Dr. Rao', roles: 0, tech: 'Vue, D3.js' },
  ];

  return (
    <div className="mx-auto max-w-content pb-12">
      <PageHeader 
        title="Projects"
        description="Oversee technical projects, team recruitment, and open source initiatives."
        actions={
          hasProjects && (
            <Button onClick={() => navigate('projects/create')}>New Project</Button>
          )
        }
      />

      {hasProjects && (
        <FilterBar 
          searchPlaceholder="Search projects..."
          filters={[
            {
              id: 'status',
              placeholder: 'All Statuses',
              options: [
                { label: 'Recruiting', value: 'recruiting' },
                { label: 'Active Development', value: 'active' },
                { label: 'Completed', value: 'completed' },
                { label: 'Archived', value: 'archived' }
              ]
            }
          ]}
        />
      )}

      {!hasProjects ? (
        <EmptyState 
          icon={<Code2 size={24} />}
          title="No projects yet"
          description="Create engineering missions, specify required tech stacks, and recruit students."
          actionLabel="Initialize Project"
          onAction={() => navigate('projects/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(proj => (
            <div key={proj.id} className="group flex flex-col bg-surface border border-border rounded-xl shadow-sm overflow-hidden hover:shadow-medium transition-shadow cursor-pointer" onClick={() => navigate(`projects/${proj.id}`)}>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 bg-surface-secondary border border-border rounded-lg flex items-center justify-center shrink-0">
                    <Code2 size={20} className="text-foreground-muted" />
                  </div>
                  <StatusBadge status={proj.status} />
                </div>
                <h3 className="text-[16px] font-semibold tracking-tight text-foreground mb-1">{proj.name}</h3>
                <p className="text-[13px] text-foreground-secondary mb-4 line-clamp-2 flex-1">
                  Tech Stack: {proj.tech}
                </p>
                <div className="flex items-center justify-between text-[13px] text-foreground-muted border-t border-border pt-4 mt-auto">
                  <span>Lead: {proj.lead}</span>
                  {proj.roles > 0 && <span className="text-accent font-medium">{proj.roles} Open Roles</span>}
                </div>
              </div>
              <div className="bg-surface-secondary/50 px-6 py-3 border-t border-border flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[13px] font-medium text-foreground">View Project</span>
                <ArrowRight size={14} className="text-foreground" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
