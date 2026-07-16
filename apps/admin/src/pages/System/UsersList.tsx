import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/Input';
import { DropdownMenu, DropdownMenuItem } from '../../components/ui/DropdownMenu';
import { MoreHorizontal, Shield } from 'lucide-react';

export function UsersList() {
  const users = [
    { id: 1, name: "Admin User", email: "admin@csea.kitsw.ac.in", role: "Super Admin", status: "Active", lastActive: "Just now" },
    { id: 2, name: "Editor One", email: "editor1@csea.kitsw.ac.in", role: "Editor", status: "Active", lastActive: "2h ago" },
    { id: 3, name: "Student Rep", email: "rep@csea.kitsw.ac.in", role: "Viewer", status: "Inactive", lastActive: "5d ago" },
  ];

  return (
    <div className="mx-auto max-w-content">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-[20px] font-semibold tracking-tight text-foreground">Users & Roles</h1>
          <p className="text-[14px] text-foreground-secondary">Manage administrative access to CSEA Control.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-[240px]">
            <SearchInput placeholder="Search users..." />
          </div>
          <Button>
            <Shield size={16} className="mr-2" />
            Invite User
          </Button>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">User</TableHead>
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
                  <span className="inline-flex items-center rounded-sm bg-surface-secondary px-2 py-1 text-[12px] font-medium text-foreground-secondary">
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
                    <DropdownMenuItem>Reset Password</DropdownMenuItem>
                    <DropdownMenuItem destructive>Revoke Access</DropdownMenuItem>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
