import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';

export function Settings() {
  return (
    <div className="mx-auto max-w-content">
      <div className="mb-8">
        <h1 className="mb-1 text-[20px] font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-[14px] text-foreground-secondary">Configure global platform preferences.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[240px] shrink-0">
          <nav className="flex flex-col space-y-1">
            <a href="#" className="bg-surface-secondary text-foreground px-3 py-2 text-[14px] font-medium rounded-sm">General</a>
            <a href="#" className="text-foreground-secondary hover:bg-surface-secondary/50 px-3 py-2 text-[14px] font-medium rounded-sm">Security</a>
            <a href="#" className="text-foreground-secondary hover:bg-surface-secondary/50 px-3 py-2 text-[14px] font-medium rounded-sm">Notifications</a>
            <a href="#" className="text-foreground-secondary hover:bg-surface-secondary/50 px-3 py-2 text-[14px] font-medium rounded-sm">API Keys</a>
          </nav>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-[16px] font-semibold tracking-tight mb-4">Platform Details</h2>
            <div className="flex flex-col gap-4 max-w-lg">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-foreground">Platform Name</label>
                <Input defaultValue="CSEA Digital Platform" />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-foreground">Support Email</label>
                <Input defaultValue="support@csea.kitsw.ac.in" />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-foreground">Site Description</label>
                <Textarea defaultValue="Official platform for Computer Science & Engineering Association, KITSW." />
              </div>
              <div className="pt-2">
                <Button>Save Changes</Button>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-error/20 bg-error/5 p-6">
            <h2 className="text-[16px] font-semibold tracking-tight text-error mb-2">Danger Zone</h2>
            <p className="text-[13px] text-error/80 mb-4 max-w-lg">
              These actions are destructive and cannot be reversed. Proceed with caution.
            </p>
            <Button variant="danger">Enable Maintenance Mode</Button>
          </section>
        </div>
      </div>
    </div>
  );
}
