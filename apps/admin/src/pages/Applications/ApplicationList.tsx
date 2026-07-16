import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';

export function ApplicationList() {
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const applications = [
    { id: 1, name: "John Doe", email: "b26cs042@kitsw.ac.in", project: "CSEA Digital Platform", role: "Frontend Engineer", status: "Pending", date: "Aug 15" },
    { id: 2, name: "Sarah Smith", email: "b26it012@kitsw.ac.in", project: "Orientation App", role: "Backend Engineer", status: "Pending", date: "Aug 14" },
    { id: 3, name: "Mike Johnson", email: "b25cs102@kitsw.ac.in", project: "CSEA Digital Platform", role: "UI Designer", status: "Accepted", date: "Aug 10" },
  ];

  return (
    <div className="mx-auto max-w-content">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-[20px] font-semibold tracking-tight text-foreground">Applications</h1>
          <p className="text-[14px] text-foreground-secondary">Review student applications for open project roles.</p>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">Applicant</TableHead>
              <TableHead>Project / Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div className="font-medium text-foreground">{app.name}</div>
                  <div className="text-[12px] text-foreground-secondary">{app.email}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">{app.project}</div>
                  <div className="text-[12px] text-foreground-secondary">{app.role}</div>
                </TableCell>
                <TableCell><StatusBadge status={app.status} /></TableCell>
                <TableCell className="text-foreground-secondary">{app.date}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>Review</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Drawer 
        isOpen={!!selectedApp} 
        onClose={() => setSelectedApp(null)}
        title="Application Review"
        description={selectedApp ? `${selectedApp.name} for ${selectedApp.role}` : ''}
        footer={
          <>
            <Button variant="outline" className="text-error border-error/30 hover:bg-error/10 hover:text-error" onClick={() => setSelectedApp(null)}>Reject</Button>
            <Button onClick={() => setSelectedApp(null)}>Accept Candidate</Button>
          </>
        }
      >
        {selectedApp && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-foreground-muted mb-2">Applicant Profile</h3>
              <div className="rounded-xl border border-border bg-surface-secondary/20 p-4 text-[13px]">
                <div className="grid grid-cols-2 gap-y-3">
                  <div className="text-foreground-muted">Email</div>
                  <div className="font-medium">{selectedApp.email}</div>
                  <div className="text-foreground-muted">GitHub</div>
                  <div className="font-medium text-accent">github.com/johndoe</div>
                  <div className="text-foreground-muted">Portfolio</div>
                  <div className="font-medium text-accent">johndoe.dev</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-foreground-muted mb-2">Why do you want to join?</h3>
              <p className="text-[14px] leading-relaxed text-foreground bg-surface-secondary/20 p-4 rounded-xl border border-border">
                I'm really passionate about building frontend applications and have been working with React for 2 years. I want to contribute to the CSEA platform to help streamline our department's operations and learn from senior members.
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
