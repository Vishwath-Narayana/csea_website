import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isMaintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [isResetModalOpen, setResetModalOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<any>('/control/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch('/control/settings', settings);
      // alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      const newMode = !settings.maintenanceMode;
      setSettings((prev: any) => ({ ...prev, maintenanceMode: newMode }));
      await api.patch('/control/settings', { maintenanceMode: newMode });
    } catch (error) {
      console.error('Failed to toggle maintenance mode:', error);
    } finally {
      setMaintenanceModalOpen(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-foreground-muted" /></div>;
  }

  if (!settings) return null;

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
                <Input 
                  value={settings.platformName} 
                  onChange={(e) => setSettings({...settings, platformName: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Support Email</label>
                <Input 
                  value={settings.supportEmail} 
                  onChange={(e) => setSettings({...settings, supportEmail: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-[13px] font-medium block mb-1.5">Meta Description (SEO)</label>
                <Textarea 
                  value={settings.metaDescription} 
                  onChange={(e) => setSettings({...settings, metaDescription: e.target.value})} 
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 size={16} className="animate-spin mr-2" />}
                Save Changes
              </Button>
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
              <input type="checkbox" className="w-4 h-4 text-accent" checked={settings.maintenanceMode} readOnly />
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
        onConfirm={handleToggleMaintenance}
        title={settings.maintenanceMode ? "Disable Maintenance Mode?" : "Enable Maintenance Mode?"}
        description={settings.maintenanceMode 
          ? "The platform will become accessible to all users again." 
          : "Are you sure? Non-admin users will see a maintenance screen and will not be able to access the platform."}
        isDestructive={!settings.maintenanceMode}
        confirmLabel={settings.maintenanceMode ? "Disable Mode" : "Enable Mode"}
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
