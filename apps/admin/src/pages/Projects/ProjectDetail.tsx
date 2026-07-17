import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { ArrowLeft, Edit, ExternalLink, Code2, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

export function ProjectDetail({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<any>(`/control/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    try {
      await api.delete(`/control/projects/${id}`);
      navigate('projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-foreground-muted" /></div>;
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-foreground-muted mb-4">Project not found.</p>
        <Button variant="outline" onClick={() => navigate('projects')}>Back to Projects</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-content flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      <div className="shrink-0 mb-6">
        <PageHeader 
          title={project.title}
          description={project.shortDescription || "No description provided."}
          breadcrumbs={
            <div className="flex items-center gap-2 text-[13px] text-foreground-muted mb-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate('projects')}>
              <ArrowLeft size={14} /> Back to Projects
            </div>
          }
          actions={
            <>
              <Button variant="outline" onClick={() => navigate(`projects/${id}/edit`)}>
                <Edit size={16} className="mr-2" /> Edit Project
              </Button>
            </>
          }
        />
        <Tabs 
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'recruitment', label: 'Recruitment' },
            { id: 'settings', label: 'Settings' }
          ]}
        />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[16px] font-semibold">Project Details</h3>
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[13px] text-foreground-muted">Full Description</p>
                      <p className="text-[14px] whitespace-pre-wrap">{project.fullDescription || 'No detailed description.'}</p>
                    </div>
                  </div>
                </section>
                
                {project.techStack && project.techStack.length > 0 && (
                  <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                    <h3 className="text-[16px] font-semibold mb-4">Technology Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((t: string) => (
                        <span key={t} className="px-3 py-1 bg-surface-secondary rounded-md text-[13px] font-medium text-foreground-secondary border border-border">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
              
              <div className="space-y-6">
                <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-[16px] font-semibold mb-4">Information</h3>
                  <ul className="space-y-4">
                    <li className="flex flex-col gap-1 text-[13px]">
                      <span className="text-foreground-secondary">Project Lead</span>
                      <span className="font-medium">{project.projectLead || '-'}</span>
                    </li>
                    <li className="flex flex-col gap-1 text-[13px]">
                      <span className="text-foreground-secondary">Timeline</span>
                      <span className="font-medium">{project.timeline || '-'}</span>
                    </li>
                    {project.repositoryUrl && (
                      <li className="flex flex-col gap-1 text-[13px]">
                        <span className="text-foreground-secondary">Repository</span>
                        <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="font-medium text-accent flex items-center gap-1 hover:underline break-all">
                          <Code2 size={14} className="shrink-0" /> {project.repositoryUrl}
                        </a>
                      </li>
                    )}
                    {project.demoUrl && (
                      <li className="flex flex-col gap-1 text-[13px]">
                        <span className="text-foreground-secondary">Live Demo</span>
                        <a href={project.demoUrl} target="_blank" rel="noreferrer" className="font-medium text-accent flex items-center gap-1 hover:underline break-all">
                          <ExternalLink size={14} className="shrink-0" /> {project.demoUrl}
                        </a>
                      </li>
                    )}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recruitment' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
            <div className="p-6 bg-surface border border-border rounded-xl shadow-sm space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Recruitment Form</h3>
                <p className="text-[13px] text-foreground-secondary">
                  {project.applicationUrl ? "This project handles applications via an external form." : "No application URL configured."}
                </p>
              </div>
              
              {project.applicationUrl && (
                <div className="space-y-4 bg-surface-secondary/20 p-4 rounded-lg border border-border">
                  <div>
                    <p className="text-[12px] font-medium text-foreground-muted uppercase tracking-wider mb-1">Application Link</p>
                    <a href={project.applicationUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline text-[14px] font-medium break-all">
                      {project.applicationUrl}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate(`projects/${id}/edit`)}>Edit Link Settings</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-300 max-w-2xl space-y-6">
            <div className="p-6 bg-error/5 border border-error/20 rounded-xl">
              <h3 className="font-semibold text-error mb-4">Danger Zone</h3>
              <p className="text-[13px] text-error/80 mb-4">Once you delete this project, it will be permanently removed from the system.</p>
              <Button variant="danger" onClick={handleDelete}>Delete Project</Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
