import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { FilterBar } from '../../components/ui/FilterBar';
import { DropdownMenu, DropdownMenuItem } from '../../components/ui/DropdownMenu';
import { Modal } from '../../components/ui/Modal';
import { MoreHorizontal, Shield, Mail, CheckCircle2 } from 'lucide-react';

export function UsersList() {
  const [activeTab, setActiveTab] = useState('users');
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [inviteSent, setInviteSent] = useState(false);

  const users = [
    { id: 1, name: "Vishwath", email: "vishwath@kitsw.ac.in", role: "Super Admin", status: "Active", lastActive: "Just now" },
    { id: 2, name: "Jane Smith", email: "jane@kitsw.ac.in", role: "Editor", status: "Active", lastActive: "2 hours ago" },
    { id: 3, name: "Dr. Rao", email: "rao@kitsw.ac.in", role: "Faculty Advisor", status: "Active", lastActive: "1 day ago" },
    { id: 4, name: "Pending User", email: "student@kitsw.ac.in", role: "Event Manager", status: "Pending", lastActive: "Never" },
  ];

  const handleInvite = () => {
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setInviteModalOpen(false);
      setInviteEmail('');
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-content pb-12">
      <div className="mb-6">
        <PageHeader 
          title="Users & Roles"
          description="Manage team access, permissions, and security."
          actions={
            <Button onClick={() => setInviteModalOpen(true)}>
              <Mail size={16} className="mr-2" /> Invite User
            </Button>
          }
        />
        <Tabs 
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: 'users', label: 'Team Members' },
            { id: 'roles', label: 'Roles & Permissions' },
          ]}
        />
      </div>

      <div className="flex-1">
        {activeTab === 'users' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <FilterBar 
              searchPlaceholder="Search users..."
              filters={[
                {
                  id: 'role',
                  placeholder: 'All Roles',
                  options: [
                    { label: 'Super Admin', value: 'admin' },
                    { label: 'Editor', value: 'editor' },
                    { label: 'Event Manager', value: 'event' }
                  ]
                },
                {
                  id: 'status',
                  placeholder: 'All Statuses',
                  options: [
                    { label: 'Active', value: 'active' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Disabled', value: 'disabled' }
                  ]
                }
              ]}
            />
            
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-[12px] text-foreground-secondary">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground">
                          {user.role === 'Super Admin' && <Shield size={14} className="text-accent" />}
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell><StatusBadge status={user.status} /></TableCell>
                      <TableCell className="text-foreground-secondary">{user.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu 
                          trigger={<Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>}
                          align="right"
                        >
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          {user.status === 'Pending' && <DropdownMenuItem>Resend Invite</DropdownMenuItem>}
                          <div className="h-px bg-border my-1 mx-1"></div>
                          <DropdownMenuItem destructive>Remove Access</DropdownMenuItem>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-surface border border-border rounded-xl shadow-sm p-6">
              <h3 className="text-[16px] font-semibold mb-6">Permissions Matrix</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead className="text-center">Super Admin</TableHead>
                      <TableHead className="text-center">Editor</TableHead>
                      <TableHead className="text-center">Event Manager</TableHead>
                      <TableHead className="text-center">Faculty Advisor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { perm: 'Manage Users & Roles', a: true, e: false, v: false, f: false },
                      { perm: 'Global System Settings', a: true, e: false, v: false, f: false },
                      { perm: 'Publish Journal Articles', a: true, e: true, v: false, f: true },
                      { perm: 'Edit Journal Articles', a: true, e: true, v: false, f: false },
                      { perm: 'Manage Events', a: true, e: false, v: true, f: false },
                      { perm: 'Manage Projects', a: true, e: true, v: true, f: true },
                      { perm: 'View Audit Logs', a: true, e: false, v: false, f: true },
                    ].map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{row.perm}</TableCell>
                        <TableCell className="text-center">
                          {row.a ? <CheckCircle2 size={16} className="mx-auto text-accent" /> : <span className="text-foreground-muted">-</span>}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.e ? <CheckCircle2 size={16} className="mx-auto text-accent" /> : <span className="text-foreground-muted">-</span>}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.v ? <CheckCircle2 size={16} className="mx-auto text-accent" /> : <span className="text-foreground-muted">-</span>}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.f ? <CheckCircle2 size={16} className="mx-auto text-accent" /> : <span className="text-foreground-muted">-</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Team Member"
        footer={
          <div className="flex w-full justify-between items-center">
            <Button variant="ghost" onClick={() => setInviteModalOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite} disabled={!inviteEmail || inviteSent} className="min-w-[120px]">
              {inviteSent ? 'Sent!' : 'Send Invite'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-4">
          <p className="text-[13px] text-foreground-secondary mb-4">
            Invite a new member to the admin platform. They will receive an email with instructions to set their password.
          </p>
          <div>
            <label className="text-[13px] font-medium block mb-1.5">Email Address</label>
            <Input 
              type="email" 
              placeholder="name@kitsw.ac.in" 
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[13px] font-medium block mb-1.5">Role</label>
            <Select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
              <option>Super Admin</option>
              <option>Editor</option>
              <option>Event Manager</option>
              <option>Faculty Advisor</option>
            </Select>
          </div>
        </div>
      </Modal>

    </div>
  );
}
