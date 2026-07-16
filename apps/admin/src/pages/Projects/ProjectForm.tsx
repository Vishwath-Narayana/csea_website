import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PageHeader } from '../../components/ui/PageHeader';
import { ArrowLeft, Trash2, Plus, Code2 } from 'lucide-react';

export function ProjectForm({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const isEditing = !!id;
  const [roles, setRoles] = useState([
    { id: 1, title: 'Frontend Developer', openings: 2, skills: 'React, Tailwind' }
  ]);

  return (
    <div className="mx-auto max-w-[900px] pb-12">
      <PageHeader 
        title={isEditing ? 'Edit Project' : 'Initialize Project'}
        description="Define mission parameters, technology stack, and open roles."
        breadcrumbs={
          <div className="flex items-center gap-2 text-[13px] text-foreground-muted mb-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate('projects')}>
            <ArrowLeft size={14} /> Back to Projects
          </div>
        }
        actions={
          <>
            <Button variant="ghost" onClick={() => navigate('projects')}>Cancel</Button>
            <Button>{isEditing ? 'Save Changes' : 'Launch Project'}</Button>
          </>
        }
      />

      <div className="flex flex-col gap-8">
        
        {/* Core Details */}
        <section className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
          <h2 className="text-[16px] font-semibold tracking-tight border-b border-border pb-4">Mission Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-[13px] font-medium block mb-1.5">Project Name</label>
              <Input placeholder="e.g. CSEA Platform Reboot" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Short Description</label>
                <Textarea placeholder="Brief summary" className="min-h-[80px]" />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Full Description</label>
                <Textarea placeholder="Detailed goals and architecture" className="min-h-[80px]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Project Status</label>
                <Select>
                  <option>Draft</option>
                  <option>Recruiting</option>
                  <option>Active Development</option>
                  <option>Completed</option>
                  <option>Archived</option>
                </Select>
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Project Lead</label>
                <Input placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Timeline</label>
                <Select>
                  <option>Fall 2026</option>
                  <option>Spring 2027</option>
                  <option>Ongoing</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-[13px] font-medium block mb-1.5">Tech Stack</label>
              <Input placeholder="e.g. React, Node.js, PostgreSQL (comma separated)" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Repository URL</label>
                <Input placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Demo / Live URL</label>
                <Input placeholder="https://" />
              </div>
            </div>
          </div>
        </section>

        {/* Roles */}
        <section className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-[16px] font-semibold tracking-tight">Open Roles</h2>
              <p className="text-[13px] text-foreground-secondary mt-1">Specify team requirements to accept applications.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setRoles([...roles, { id: Date.now(), title: 'New Role', openings: 1, skills: '' }])}>
              <Plus size={14} className="mr-1" /> Add Role
            </Button>
          </div>
          
          <div className="flex flex-col gap-6">
            {roles.map((role, index) => (
              <div key={role.id} className="relative flex flex-col gap-4 p-5 border border-border rounded-lg bg-surface-secondary/20">
                <button 
                  className="absolute top-4 right-4 text-foreground-muted hover:text-error transition-colors"
                  onClick={() => setRoles(roles.filter(r => r.id !== role.id))}
                >
                  <Trash2 size={16} />
                </button>
                
                <h3 className="font-medium text-[14px]">Role #{index + 1}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-medium block mb-1.5">Role Name</label>
                    <Input defaultValue={role.title} />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium block mb-1.5">Number of Openings</label>
                    <Input type="number" defaultValue={role.openings.toString()} />
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-medium block mb-1.5">Required Skills</label>
                  <Input defaultValue={role.skills} placeholder="e.g. TypeScript, UI Design" />
                </div>
                
                <div>
                  <label className="text-[12px] font-medium block mb-1.5">Role Description & Eligibility</label>
                  <Textarea placeholder="What will they do? Who can apply?" className="min-h-[60px]" />
                </div>
              </div>
            ))}
            {roles.length === 0 && (
              <div className="text-center py-8 text-foreground-muted">
                <Code2 size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-[14px]">No open roles added yet.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
