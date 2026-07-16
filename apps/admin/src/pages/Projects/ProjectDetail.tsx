import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { ArrowLeft, Edit, ExternalLink, Code2 } from 'lucide-react';
import { ActivityRow } from '../../components/ActivityRow';

export function ProjectDetail({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const [activeTab, setActiveTab] = useState('overview');

  const project = {
    name: 'CSEA Platform Reboot',
    status: 'Recruiting',
    lead: 'John Doe',
    timeline: 'Fall 2026',
    tech: 'React, Tailwind, Node.js',
    repo: 'github.com/csea-kitsw/platform',
    demo: 'csea.kitsw.ac.in',
  };

  const applications = [
    { id: 1, name: "Alice Johnson", role: "Frontend Developer", status: "Under Review", date: "2 days ago" },
    { id: 2, name: "Bob Smith", role: "Backend Engineer", status: "Pending", date: "1 day ago" },
  ];

  return (
    <div className="mx-auto max-w-content flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      <div className="shrink-0 mb-6">
        <PageHeader 
          title={project.name}
          description="A complete reboot of the main CSEA digital platform."
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
              <Button>Review Applications</Button>
            </>
          }
        />
        <Tabs 
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'team', label: 'Team' },
            { id: 'roles', label: 'Open Roles' },
            { id: 'applications', label: 'Applications' },
            { id: 'activity', label: 'Activity' },
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
                      <p className="text-[13px] text-foreground-muted">Description</p>
                      <p className="text-[14px]">Building the next generation platform for the CSEA department to manage events, projects, and journal publications.</p>
                    </div>
                  </div>
                </section>
                
                <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-[16px] font-semibold mb-4">Technology Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.split(',').map(t => (
                      <span key={t} className="px-3 py-1 bg-surface-secondary rounded-md text-[13px] font-medium text-foreground-secondary border border-border">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
              
              <div className="space-y-6">
                <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-[16px] font-semibold mb-4">Information</h3>
                  <ul className="space-y-4">
                    <li className="flex flex-col gap-1 text-[13px]">
                      <span className="text-foreground-secondary">Project Lead</span>
                      <span className="font-medium">{project.lead}</span>
                    </li>
                    <li className="flex flex-col gap-1 text-[13px]">
                      <span className="text-foreground-secondary">Timeline</span>
                      <span className="font-medium">{project.timeline}</span>
                    </li>
                    <li className="flex flex-col gap-1 text-[13px]">
                      <span className="text-foreground-secondary">Repository</span>
                      <a href="#" className="font-medium text-accent flex items-center gap-1 hover:underline">
                        <Code2 size={14} /> {project.repo}
                      </a>
                    </li>
                    <li className="flex flex-col gap-1 text-[13px]">
                      <span className="text-foreground-secondary">Live Demo</span>
                      <a href="#" className="font-medium text-accent flex items-center gap-1 hover:underline">
                        <ExternalLink size={14} /> {project.demo}
                      </a>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between bg-surface-secondary border border-border p-4 rounded-xl">
              <div>
                <h3 className="font-medium text-foreground">Actively Recruiting</h3>
                <p className="text-[13px] text-foreground-secondary">Students can view and apply to these roles on the public site.</p>
              </div>
              <Button variant="outline" onClick={() => navigate(`projects/${id}/edit`)}>Manage Roles</Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-surface border border-border rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">Frontend Developer</h4>
                  <span className="text-[12px] font-medium bg-accent/10 text-accent px-2 py-1 rounded-sm">2 Openings</span>
                </div>
                <p className="text-[13px] text-foreground-secondary mb-4">Build beautiful, responsive user interfaces using React and Tailwind CSS.</p>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-foreground-muted">Skills:</span>
                  <span className="text-[12px] text-foreground-secondary">React, Typescript, Tailwind</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Applied For</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map(app => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.name}</TableCell>
                      <TableCell className="text-foreground-secondary">{app.role}</TableCell>
                      <TableCell><StatusBadge status={app.status} /></TableCell>
                      <TableCell className="text-foreground-secondary text-[13px]">{app.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => navigate(`applications/${app.id}`)}>
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="animate-in fade-in duration-300 flex items-center justify-center p-12 text-foreground-muted border-2 border-dashed border-border rounded-xl">
            Team roster visualization will go here.
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4 max-w-2xl animate-in fade-in duration-300">
            <ActivityRow title="Application Accepted" description="John Doe accepted Alice for Frontend Dev." time="1h ago" status="Success" />
            <ActivityRow title="Role Added" description="John Doe added 'Backend Engineer' role." time="2d ago" />
            <ActivityRow title="Project Created" description="Admin initialized the project." time="1w ago" />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-300 max-w-2xl space-y-6">
            <div className="p-6 bg-error/5 border border-error/20 rounded-xl">
              <h3 className="font-semibold text-error mb-4">Danger Zone</h3>
              <p className="text-[13px] text-error/80 mb-4">Once you delete this project, all applications and data will be permanently removed.</p>
              <Button variant="danger">Delete Project</Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
