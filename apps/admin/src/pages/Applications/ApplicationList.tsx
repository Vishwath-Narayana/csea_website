import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { FilterBar } from '../../components/ui/FilterBar';
import { PageHeader } from '../../components/ui/PageHeader';
import { Pagination } from '../../components/ui/Pagination';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export function ApplicationList() {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const applications = [
    { id: 1, name: "John Doe", email: "b26cs042@kitsw.ac.in", branch: "CSE", year: "3rd", project: "CSEA Digital Platform", role: "Frontend Engineer", status: "Pending", date: "Aug 15" },
    { id: 2, name: "Sarah Smith", email: "b26it012@kitsw.ac.in", branch: "IT", year: "2nd", project: "Orientation App", role: "Backend Engineer", status: "Under Review", date: "Aug 14" },
    { id: 3, name: "Mike Johnson", email: "b25cs102@kitsw.ac.in", branch: "CSE", year: "4th", project: "CSEA Digital Platform", role: "UI Designer", status: "Accepted", date: "Aug 10" },
  ];

  return (
    <div className="mx-auto max-w-content pb-12">
      <PageHeader 
        title="Applications"
        description="Review student applications for open project roles."
      />

      <FilterBar 
        searchPlaceholder="Search applicants..."
        filters={[
          {
            id: 'status',
            placeholder: 'All Statuses',
            options: [
              { label: 'Pending', value: 'pending' },
              { label: 'Under Review', value: 'review' },
              { label: 'Accepted', value: 'accepted' },
              { label: 'Rejected', value: 'rejected' }
            ]
          },
          {
            id: 'project',
            placeholder: 'All Projects',
            options: [
              { label: 'CSEA Digital Platform', value: 'csea' },
              { label: 'Orientation App', value: 'orientation' }
            ]
          }
        ]}
      />
      
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm mb-4">
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

      <Pagination 
        currentPage={currentPage}
        totalPages={8}
        onPageChange={setCurrentPage}
      />

      <Drawer 
        isOpen={!!selectedApp} 
        onClose={() => setSelectedApp(null)}
        title="Application Review"
        description={selectedApp ? `Submitted ${selectedApp.date}` : ''}
        footer={
          <div className="flex w-full items-center justify-between">
            <Button variant="outline" onClick={() => setSelectedApp(null)}>
              <Clock size={16} className="mr-2" /> Mark In Review
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-error hover:text-error hover:bg-error/10" onClick={() => setSelectedApp(null)}>
                <XCircle size={16} className="mr-2" /> Reject
              </Button>
              <Button onClick={() => setSelectedApp(null)}>
                <CheckCircle2 size={16} className="mr-2" /> Accept
              </Button>
            </div>
          </div>
        }
      >
        {selectedApp && (
          <div className="flex flex-col gap-8 pb-8">
            {/* Header section in drawer */}
            <div>
              <h2 className="text-[20px] font-bold text-foreground mb-1">{selectedApp.name}</h2>
              <p className="text-[14px] text-foreground-secondary">{selectedApp.role} · {selectedApp.project}</p>
            </div>

            <div className="grid grid-cols-2 gap-y-4 text-[13px]">
              <div>
                <p className="text-foreground-muted mb-1">Email</p>
                <p className="font-medium text-foreground">{selectedApp.email}</p>
              </div>
              <div>
                <p className="text-foreground-muted mb-1">Roll Number</p>
                <p className="font-medium text-foreground uppercase">b26cs042</p>
              </div>
              <div>
                <p className="text-foreground-muted mb-1">Branch</p>
                <p className="font-medium text-foreground">{selectedApp.branch}</p>
              </div>
              <div>
                <p className="text-foreground-muted mb-1">Year</p>
                <p className="font-medium text-foreground">{selectedApp.year}</p>
              </div>
            </div>

            <hr className="border-border" />

            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-foreground-muted mb-3">Links & Portfolio</h3>
              <div className="grid grid-cols-1 gap-y-3 text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="text-foreground-secondary w-20">GitHub</span>
                  <a href="#" className="font-medium text-accent hover:underline">github.com/johndoe</a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground-secondary w-20">Portfolio</span>
                  <a href="#" className="font-medium text-accent hover:underline">johndoe.dev</a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground-secondary w-20">Resume</span>
                  <a href="#" className="font-medium text-accent hover:underline">johndoe_resume.pdf</a>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-foreground-muted mb-3">Questionnaire</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="font-medium text-[14px] text-foreground mb-2">Why do you want to join this project?</p>
                  <p className="text-[14px] leading-relaxed text-foreground-secondary bg-surface-secondary/20 p-4 rounded-xl border border-border">
                    I'm really passionate about building frontend applications and have been working with React for 2 years. I want to contribute to the CSEA platform to help streamline our department's operations and learn from senior members.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-[14px] text-foreground mb-2">Describe a recent technical challenge you solved.</p>
                  <p className="text-[14px] leading-relaxed text-foreground-secondary bg-surface-secondary/20 p-4 rounded-xl border border-border">
                    In my last project, I had to optimize a large list rendering issue. I implemented virtual scrolling using react-window which reduced the DOM nodes from 5000 to just 20, dropping the render time from 400ms to 16ms.
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-foreground-muted mb-3">Admin Notes (Private)</h3>
              <textarea 
                className="w-full bg-surface border border-border rounded-lg p-3 text-[13px] text-foreground placeholder:text-foreground-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all min-h-[100px]" 
                placeholder="Add notes about this candidate..."
              ></textarea>
            </div>

          </div>
        )}
      </Drawer>
    </div>
  );
}
