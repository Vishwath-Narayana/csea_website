import { useState, useEffect } from 'react';
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
import { MoreHorizontal, Shield, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';
import { Pagination } from '../../components/ui/Pagination';

export function UsersList() {
  const [activeTab, setActiveTab] = useState('users');
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('EDITOR');
  const [inviteSent, setInviteSent] = useState(false);

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<any>(`/control/users?page=${currentPage}&limit=10`);
      setUsers(response.data);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async () => {
    try {
      await api.post('/control/users/invite', { email: inviteEmail, role: inviteRole });
      setInviteSent(true);
      setTimeout(() => {
        setInviteSent(false);
        setInviteModalOpen(false);
        setInviteEmail('');
        fetchUsers();
      }, 1500);
    } catch (error) {
      console.error('Failed to invite user:', error);
      alert('Failed to invite user.');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/control/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Failed to change role:', error);
      alert('Failed to change user role.');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return;
    try {
      await api.delete(`/control/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user.');
    }
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
                    { label: 'Super Admin', value: 'SUPER_ADMIN' },
                    { label: 'Admin', value: 'ADMIN' },
                    { label: 'Editor', value: 'EDITOR' },
                    { label: 'Viewer', value: 'VIEWER' }
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="animate-spin mx-auto text-foreground-muted" />
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-foreground-muted">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium text-foreground">{user.name}</div>
                          <div className="text-[12px] text-foreground-secondary">{user.email}</div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground">
                            {user.role === 'SUPER_ADMIN' && <Shield size={14} className="text-accent" />}
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell><StatusBadge status="ACTIVE" /></TableCell>
                        <TableCell className="text-foreground-secondary">
                          {new Date(user.lastActive).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu 
                            trigger={<Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>}
                            align="right"
                          >
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'SUPER_ADMIN')}>Make Super Admin</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'ADMIN')}>Make Admin</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'EDITOR')}>Make Editor</DropdownMenuItem>
                            <div className="h-px bg-border my-1 mx-1"></div>
                            <DropdownMenuItem destructive onClick={() => handleDelete(user.id)}>Remove Access</DropdownMenuItem>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {!isLoading && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
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
                      <TableHead className="text-center">Admin</TableHead>
                      <TableHead className="text-center">Editor</TableHead>
                      <TableHead className="text-center">Viewer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { perm: 'Manage Users & Roles', a: true, e: false, v: false, f: false },
                      { perm: 'Global System Settings', a: true, e: false, v: false, f: false },
                      { perm: 'Publish Content', a: true, e: true, v: true, f: false },
                      { perm: 'Edit Content', a: true, e: true, v: true, f: false },
                      { perm: 'Delete Content', a: true, e: true, v: false, f: false },
                      { perm: 'View Audit Logs', a: true, e: false, v: false, f: false },
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
            Add a new member to the admin platform directly. Their account will be created immediately.
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
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="EDITOR">Editor</option>
              <option value="VIEWER">Viewer</option>
            </Select>
          </div>
        </div>
      </Modal>

    </div>
  );
}
