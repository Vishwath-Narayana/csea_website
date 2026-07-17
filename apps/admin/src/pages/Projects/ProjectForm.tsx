import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PageHeader } from '../../components/ui/PageHeader';
import { ArrowLeft, Trash2, Plus, Code2, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

export function ProjectForm({ navigate, id }: { navigate: (view: string) => void, id?: string }) {
  const isEditing = !!id;
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    coverImage: '',
    status: 'DRAFT',
    projectLead: '',
    timeline: '',
    techStack: '',
    repositoryUrl: '',
    demoUrl: '',
    applicationUrl: ''
  });

  useEffect(() => {
    if (isEditing) fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get<any>(`/control/projects/${id}`);
      const proj = res.data;
      setFormData({
        title: proj.title || '',
        slug: proj.slug || '',
        shortDescription: proj.shortDescription || '',
        fullDescription: proj.fullDescription || '',
        coverImage: proj.coverImage || '',
        status: proj.status || 'DRAFT',
        projectLead: proj.projectLead || '',
        timeline: proj.timeline || '',
        techStack: proj.techStack ? proj.techStack.join(', ') : '',
        repositoryUrl: proj.repositoryUrl || '',
        demoUrl: proj.demoUrl || '',
        applicationUrl: proj.applicationUrl || ''
      });
      // Future: fetch project roles
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (!isEditing && field === 'title') {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
      };
      
      if (isEditing) {
        await api.patch(`/control/projects/${id}`, payload);
      } else {
        await api.post(`/control/projects`, payload);
      }
      navigate('projects');
    } catch (error) {
      console.error(error);
      alert('Failed to save project. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-foreground-muted" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[900px] pb-12">
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
            <Button type="button" variant="ghost" onClick={() => navigate('projects')}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 size={16} className="animate-spin mr-2" />}
              {isEditing ? 'Save Changes' : 'Launch Project'}
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-8">
        
        {/* Core Details */}
        <section className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
          <h2 className="text-[16px] font-semibold tracking-tight border-b border-border pb-4">Mission Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-[13px] font-medium block mb-1.5">Project Name <span className="text-error">*</span></label>
              <Input required value={formData.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g. CSEA Platform Reboot" />
            </div>

            <div>
              <label className="text-[13px] font-medium block mb-1.5">Slug <span className="text-error">*</span></label>
              <Input required value={formData.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="e.g. csea-platform-reboot" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Short Description</label>
                <Textarea value={formData.shortDescription} onChange={e => handleChange('shortDescription', e.target.value)} placeholder="Brief summary" className="min-h-[80px]" />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Full Description</label>
                <Textarea value={formData.fullDescription} onChange={e => handleChange('fullDescription', e.target.value)} placeholder="Detailed goals and architecture" className="min-h-[80px]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Project Status</label>
                <Select value={formData.status} onChange={e => handleChange('status', e.target.value)}>
                  <option value="DRAFT">Draft</option>
                  <option value="RECRUITING">Recruiting</option>
                  <option value="ACTIVE">Active Development</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ARCHIVED">Archived</option>
                </Select>
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Project Lead</label>
                <Input value={formData.projectLead} onChange={e => handleChange('projectLead', e.target.value)} placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Timeline</label>
                <Input value={formData.timeline} onChange={e => handleChange('timeline', e.target.value)} placeholder="e.g. Fall 2026" />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-medium block mb-1.5">Tech Stack</label>
              <Input value={formData.techStack} onChange={e => handleChange('techStack', e.target.value)} placeholder="e.g. React, Node.js, PostgreSQL (comma separated)" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Repository URL</label>
                <Input type="url" value={formData.repositoryUrl} onChange={e => handleChange('repositoryUrl', e.target.value)} placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Demo / Live URL</label>
                <Input type="url" value={formData.demoUrl} onChange={e => handleChange('demoUrl', e.target.value)} placeholder="https://" />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Application Form URL</label>
                <Input type="url" value={formData.applicationUrl} onChange={e => handleChange('applicationUrl', e.target.value)} placeholder="https://forms.google.com/..." />
              </div>
            </div>
          </div>
        </section>

        {/* Roles - UI only for now */}
        <section className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-[16px] font-semibold tracking-tight">Open Roles</h2>
              <p className="text-[13px] text-foreground-secondary mt-1">Specify team requirements to accept applications (Coming Soon in Roles API).</p>
            </div>
            <Button disabled variant="outline" size="sm" onClick={() => setRoles([...roles, { id: Date.now(), title: 'New Role', openings: 1, skills: '' }])}>
              <Plus size={14} className="mr-1" /> Add Role
            </Button>
          </div>
          
          <div className="flex flex-col gap-6">
            {roles.length === 0 && (
              <div className="text-center py-8 text-foreground-muted">
                <Code2 size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-[14px]">No open roles added yet.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </form>
  );
}
