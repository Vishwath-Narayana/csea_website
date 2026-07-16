import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { ArrowLeft, Trash2, Plus } from 'lucide-react';

export function ProjectForm({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const isEditing = !!id;
  const [roles, setRoles] = useState([{ id: 1, title: 'Frontend Developer', filled: false }]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('projects')}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-foreground">
            {isEditing ? 'Edit Project' : 'Initialize Project'}
          </h1>
          <p className="text-[14px] text-foreground-secondary">
            Define mission parameters and open roles.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <section className="flex flex-col gap-4">
          <h2 className="text-[15px] font-semibold tracking-tight border-b border-border pb-2">Mission Details</h2>
          
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">Project Name</label>
            <Input placeholder="e.g. CSEA Platform Reboot" />
          </div>
          
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">Description</label>
            <Textarea placeholder="What is the goal of this project?" className="min-h-[100px]" />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">Tech Stack</label>
            <Input placeholder="e.g. React, Node.js, PostgreSQL (comma separated)" />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-[15px] font-semibold tracking-tight">Open Roles</h2>
            <Button variant="ghost" size="sm" onClick={() => setRoles([...roles, { id: Date.now(), title: '', filled: false }])}>
              <Plus size={14} className="mr-1" /> Add Role
            </Button>
          </div>
          
          <div className="flex flex-col gap-3">
            {roles.map((role) => (
              <div key={role.id} className="flex gap-3">
                <Input className="flex-1" placeholder="e.g. Backend Engineer" defaultValue={role.title} />
                <Button variant="outline" size="icon" onClick={() => setRoles(roles.filter(r => r.id !== role.id))}>
                  <Trash2 size={14} className="text-foreground-muted" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={() => navigate('projects')}>Cancel</Button>
          <Button>{isEditing ? 'Save Changes' : 'Launch Project'}</Button>
        </div>
      </div>
    </div>
  );
}
