

// ─── Shared Admin Components ───
export function PageHeader({ title, description, actionLabel }: { title: string, description: string, actionLabel?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-[20px] font-semibold tracking-tight text-foreground mb-1">{title}</h1>
        <p className="text-[14px] text-foreground-secondary">{description}</p>
      </div>
      {actionLabel && (
        <button className="btn btn-primary text-[13px] h-9">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const getColors = () => {
    switch (status.toLowerCase()) {
      case 'published':
      case 'active':
      case 'accepted':
        return 'bg-success/10 text-success';
      case 'draft':
      case 'in review':
      case 'waitlisted':
        return 'bg-warning/10 text-warning';
      case 'rejected':
      case 'archived':
        return 'bg-surface-secondary text-foreground-muted';
      default:
        return 'bg-accent-muted text-accent';
    }
  };
  return (
    <span className={`text-[11px] font-semibold tracking-[0.04em] uppercase px-2.5 py-1 rounded-pill ${getColors()}`}>
      {status}
    </span>
  );
}

// ─── Journal Admin Page ───
export function JournalAdmin() {
  const articles = [
    { id: 1, title: "Architecting the New CSEA Platform", author: "Tech Team", status: "Published", date: "Aug 12, 2026" },
    { id: 2, title: "Registration Open for Orientation '26", author: "Leadership", status: "Published", date: "Aug 05, 2026" },
    { id: 3, title: "Lessons from the Summer Hackathon", author: "Events", status: "Draft", date: "Jul 28, 2026" },
  ];

  return (
    <div className="max-w-content mx-auto">
      <PageHeader title="Journal" description="Manage technical reports and dispatches." actionLabel="New Article" />
      
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50">
                <th className="px-5 py-3 text-[12px] font-medium text-foreground-muted">Article Title</th>
                <th className="px-5 py-3 text-[12px] font-medium text-foreground-muted">Author</th>
                <th className="px-5 py-3 text-[12px] font-medium text-foreground-muted">Status</th>
                <th className="px-5 py-3 text-[12px] font-medium text-foreground-muted">Date</th>
                <th className="px-5 py-3 text-[12px] font-medium text-foreground-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id} className="border-b border-border hover:bg-surface-secondary/30 transition-colors">
                  <td className="px-5 py-4 text-[14px] font-medium text-foreground">{article.title}</td>
                  <td className="px-5 py-4 text-[13px] text-foreground-secondary">{article.author}</td>
                  <td className="px-5 py-4"><StatusBadge status={article.status} /></td>
                  <td className="px-5 py-4 text-[13px] text-foreground-secondary">{article.date}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-[13px] font-medium text-accent hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Events Admin Page ───
export function EventsAdmin() {
  const events = [
    { id: 1, title: "CSEA Orientation 2026", date: "Aug 15, 2026", capacity: "148 / 400", status: "Active" },
    { id: 2, title: "Tech Talk: Distributed Systems", date: "Aug 22, 2026", capacity: "67 / 150", status: "Draft" },
    { id: 3, title: "Autumn Hackathon 2026", date: "Sep 10, 2026", capacity: "0 / 200", status: "Draft" },
  ];

  return (
    <div className="max-w-content mx-auto">
      <PageHeader title="Events" description="Manage upcoming and past events, track registrations." actionLabel="Create Event" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-surface border border-border rounded-xl p-5 shadow-sm hover:shadow-medium transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <StatusBadge status={event.status} />
              <button className="text-foreground-muted hover:text-foreground">•••</button>
            </div>
            <h3 className="text-[16px] font-medium text-foreground mb-1">{event.title}</h3>
            <div className="text-[13px] text-foreground-secondary mb-4">{event.date}</div>
            <div className="pt-4 border-t border-border flex justify-between items-center text-[13px]">
              <span className="text-foreground-muted">Registrations</span>
              <span className="font-medium text-foreground">{event.capacity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Projects Admin Page ───
export function ProjectsAdmin() {
  return (
    <div className="max-w-content mx-auto">
      <PageHeader title="Projects" description="Oversee technical projects and team recruitment." actionLabel="New Project" />
      <div className="bg-surface border border-border rounded-xl p-8 text-center">
        <h3 className="text-[16px] font-medium text-foreground mb-2">Manage Projects</h3>
        <p className="text-[14px] text-foreground-secondary mb-6 max-w-md mx-auto">
          Create engineering missions, specify required tech stacks, and recruit students.
        </p>
        <button className="btn btn-outline text-[13px]">Initialize Project</button>
      </div>
    </div>
  );
}

// ─── Galleries Admin Page ───
export function GalleriesAdmin() {
  return (
    <div className="max-w-content mx-auto">
      <PageHeader title="Galleries" description="Upload and manage event photography albums." actionLabel="New Album" />
      <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col items-center justify-center p-12 border-dashed border-2 bg-surface-secondary/20">
        <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mb-4 text-foreground-muted">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
        <h3 className="text-[15px] font-medium text-foreground mb-1">Create your first album</h3>
        <p className="text-[13px] text-foreground-secondary mb-4">Drag and drop high-res photos here to bulk upload.</p>
        <button className="btn btn-primary text-[13px]">Select Files</button>
      </div>
    </div>
  );
}

// ─── Applications Admin Page ───
export function ApplicationsAdmin() {
  return (
    <div className="max-w-content mx-auto">
      <PageHeader title="Applications" description="Review student applications for open project roles." />
      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="flex justify-between items-center py-3 border-b border-border">
          <div>
            <div className="text-[14px] font-medium text-foreground">John Doe <span className="text-[13px] font-normal text-foreground-muted ml-2">b26cs042@kitsw.ac.in</span></div>
            <div className="text-[13px] text-foreground-secondary mt-0.5">Applied for Frontend Engineer · CSEA Digital Platform</div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline text-[12px] h-8 px-3">Reject</button>
            <button className="btn btn-primary text-[12px] h-8 px-3">Accept</button>
          </div>
        </div>
      </div>
    </div>
  );
}
