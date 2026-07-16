import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isMaintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isResetModalOpen, setResetModalOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[800px] pb-12">
      <div className="mb-6">
        <PageHeader 
          title="Settings"
          description="Configure global platform preferences."
        />
        <Tabs 
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: 'general', label: 'General' },
            { id: 'branding', label: 'Branding' },
            { id: 'integrations', label: 'Integrations' },
            { id: 'advanced', label: 'Advanced' }
          ]}
        />
      </div>

      {activeTab === 'general' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <section className="bg-surface rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-[16px] font-semibold mb-4">Platform Identity</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Platform Name</label>
                <Input defaultValue="CSEA Digital Platform" />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Support Email</label>
                <Input defaultValue="support@csea.kitsw.ac.in" />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Meta Description (SEO)</label>
                <Textarea defaultValue="The official platform for Computer Science & Engineering Association, KITSW." />
              </div>
            </div>
            <div className="mt-6">
              <Button>Save Changes</Button>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'branding' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <section className="bg-surface rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-[16px] font-semibold mb-4">Logos & Assets</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Primary Logo</label>
                <div className="flex items-center justify-center p-6 border-2 border-dashed border-border rounded-lg text-foreground-muted">
                  Upload Logo (SVG/PNG)
                </div>
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Favicon</label>
                <div className="flex items-center justify-center p-6 border-2 border-dashed border-border rounded-lg text-foreground-muted">
                  Upload Favicon (.ico)
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <section className="bg-surface rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-[16px] font-semibold mb-4">Third-Party Services</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <h4 className="font-medium text-[14px]">SendGrid API</h4>
                  <p className="text-[13px] text-foreground-secondary">Required for sending automated emails.</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <h4 className="font-medium text-[14px]">AWS S3</h4>
                  <p className="text-[13px] text-foreground-secondary">Used for storing gallery images and assets.</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'advanced' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <section className="bg-surface rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-[16px] font-semibold mb-4">Maintenance Mode</h3>
            <p className="text-[13px] text-foreground-secondary mb-4">
              Enable maintenance mode to prevent non-admin users from accessing the platform.
            </p>
            <label className="flex items-center gap-2 cursor-pointer mt-2" onClick={(e) => {
              e.preventDefault();
              setMaintenanceModalOpen(true);
            }}>
              <input type="checkbox" className="w-4 h-4 text-accent" checked={isMaintenanceMode} readOnly />
              <span className="text-[14px] font-medium">Enable Maintenance Mode</span>
            </label>
          </section>
          
          <section className="bg-error/5 rounded-xl border border-error/20 p-6">
            <h3 className="text-[16px] font-semibold text-error mb-4">Factory Reset</h3>
            <p className="text-[13px] text-error/80 mb-4">
              Clear all database tables and reset the platform to a pristine state. This action is irreversible.
            </p>
            <Button variant="danger" onClick={() => setResetModalOpen(true)}>Reset System</Button>
          </section>
        </div>
      )}

      <ConfirmationDialog 
        isOpen={isMaintenanceModalOpen}
        onClose={() => setMaintenanceModalOpen(false)}
        onConfirm={() => {
          setIsMaintenanceMode(!isMaintenanceMode);
          setMaintenanceModalOpen(false);
        }}
        title={isMaintenanceMode ? "Disable Maintenance Mode?" : "Enable Maintenance Mode?"}
        description={isMaintenanceMode 
          ? "The platform will become accessible to all users again." 
          : "Are you sure? Non-admin users will see a maintenance screen and will not be able to access the platform."}
        isDestructive={!isMaintenanceMode}
        confirmLabel={isMaintenanceMode ? "Disable" : "Enable Mode"}
      />

      <ConfirmationDialog 
        isOpen={isResetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={() => {
          setResetModalOpen(false);
          alert("Factory Reset initiated (Mock).");
        }}
        title="Confirm Factory Reset"
        description="Are you absolutely sure? This will wipe all data across the platform and cannot be undone."
        isDestructive={true}
        confirmLabel="I understand, Reset System"
      />
    </div>
  );
}
