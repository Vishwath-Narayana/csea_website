import { useState } from 'react';
import './index.css';
import { JournalAdmin, EventsAdmin, ProjectsAdmin, GalleriesAdmin, ApplicationsAdmin } from './pages/AdminPages';

// ─── Icon Components (inline SVG for zero dependencies) ───
const Icon = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  journal: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20",
  events: "M8 2v4 M16 2v4 M3 10h18 M21 8v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  projects: "M2 20h20 M5 20V10l7-7 7 7v10 M9 20v-6h6v6",
  gallery: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  registrations: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  applications: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  team: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  audit: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  search: "M11 11a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  plus: "M12 5v14 M5 12h14",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  x: "M18 6L6 18 M6 6l12 12",
};

// ─── Sidebar Section ───
function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-foreground-muted px-4 mb-2">
        {label}
      </div>
      {children}
    </div>
  );
}



// ─── Metric Card ───
function MetricCard({ label, value, change, positive = true }: { label: string; value: string; change?: string; positive?: boolean }) {
  return (
    <div className="bg-surface border border-border rounded p-5">
      <div className="text-[13px] font-medium text-foreground-muted mb-2">{label}</div>
      <div className="text-[32px] font-semibold tracking-[-0.02em] text-foreground leading-none">{value}</div>
      {change && (
        <div className={`text-[12px] font-medium mt-2 ${positive ? 'text-success' : 'text-error'}`}>
          {positive ? '↑' : '↓'} {change}
        </div>
      )}
    </div>
  );
}

// ─── Activity Row ───
function ActivityRow({ title, description, time, status }: { title: string; description: string; time: string; status?: string }) {
  const getStatusColor = () => {
    if (status === 'Published') return 'bg-success/10 text-success';
    if (status === 'Draft') return 'bg-surface-secondary text-foreground-muted';
    return 'bg-accent-muted text-accent';
  };

  return (
    <div className="flex justify-between items-center py-3.5 border-b border-border last:border-0">
      <div>
        <div className="text-[14px] font-medium text-foreground">{title}</div>
        <div className="text-[13px] text-foreground-muted mt-0.5">{description}</div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {status && (
          <span className={`text-[11px] font-semibold tracking-[0.04em] uppercase px-2.5 py-0.5 rounded-pill ${getStatusColor()}`}>
            {status}
          </span>
        )}
        <span className="text-[12px] text-foreground-subtle whitespace-nowrap">{time}</span>
      </div>
    </div>
  );
}

function DashboardOverview() {
  return (
    <div className="max-w-content mx-auto">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Published Content" value="12" change="3 this week" />
        <MetricCard label="Event Registrations" value="148" change="23 today" />
        <MetricCard label="Active Projects" value="3" />
        <MetricCard label="Applications" value="18" change="5 pending" />
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

        {/* Recent Activity */}
        <div className="bg-surface border border-border rounded p-5 lg:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[16px] font-semibold">Recent Activity</h2>
            <button className="text-[13px] text-accent bg-transparent border-none cursor-pointer hover:underline">View all</button>
          </div>

          <ActivityRow title="Orientation 2026" description="Event created by Admin" time="2h ago" status="Published" />
          <ActivityRow title="Welcome to CSEA Platform" description="Journal post published" time="3h ago" status="Published" />
          <ActivityRow title="CSEA Website Reboot" description="Project updated — 12 builders joined" time="5h ago" status="Active" />
          <ActivityRow title="Inside CSEA: Week 04" description="Draft saved by Editor" time="1d ago" status="Draft" />
          <ActivityRow title="Hackathon '26 Gallery" description="342 photos uploaded" time="2d ago" status="Published" />
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">

          {/* Upcoming Events */}
          <div className="bg-surface border border-border rounded p-5 lg:p-6">
            <h3 className="text-[14px] font-semibold mb-3.5">Upcoming Events</h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[14px] font-medium">Orientation 2026</div>
                  <div className="text-[12px] text-foreground-muted">15 Aug · Main Auditorium</div>
                </div>
                <span className="text-[13px] font-semibold text-accent">148</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[14px] font-medium">Tech Talk Series #1</div>
                  <div className="text-[12px] text-foreground-muted">22 Aug · Seminar Hall</div>
                </div>
                <span className="text-[13px] font-semibold text-accent">67</span>
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-surface border border-border rounded p-5 lg:p-6">
            <h3 className="text-[14px] font-semibold mb-3.5">Pending Approvals</h3>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <div>
                  <div className="text-[13px] font-medium">5 project applications</div>
                  <div className="text-[12px] text-foreground-muted">Platform Reboot</div>
                </div>
                <button className="text-[12px] font-medium text-accent bg-accent-muted border-none px-2.5 py-1 rounded-sm cursor-pointer hover:bg-accent hover:text-white transition-colors">Review</button>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <div className="text-[13px] font-medium">2 draft stories</div>
                  <div className="text-[12px] text-foreground-muted">Awaiting review</div>
                </div>
                <button className="text-[12px] font-medium text-accent bg-accent-muted border-none px-2.5 py-1 rounded-sm cursor-pointer hover:bg-accent hover:text-white transition-colors">Review</button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-surface border border-border rounded p-5 lg:p-6">
            <h3 className="text-[14px] font-semibold mb-3.5">Platform Health</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-foreground-muted">Users</div>
                <div className="text-[24px] font-semibold mt-1">342</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-foreground-muted">Photos</div>
                <div className="text-[24px] font-semibold mt-1">14.2K</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  const NavItem = ({ id, icon, label }: { id: string, icon: string, label: string }) => (
    <div 
      onClick={() => { setCurrentView(id); setIsSidebarOpen(false); }}
      className={`flex items-center gap-2.5 px-4 py-2 mx-2 rounded-sm text-[14px] cursor-pointer transition-all duration-150 ${currentView === id ? 'font-medium text-accent bg-accent-muted' : 'font-normal text-foreground-secondary hover:bg-surface-secondary'}`}
    >
      <span className={currentView === id ? 'opacity-100' : 'opacity-60'}><Icon d={icon} size={18} /></span>
      {label}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ═══ SIDEBAR ═══ */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[240px] bg-surface border-r border-border flex flex-col shrink-0 overflow-y-auto
        transform transition-transform duration-fast
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="h-[56px] flex flex-row items-center justify-between px-5 border-b border-border shrink-0">
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
            CSEA CONTROL
          </span>
          <button 
            className="lg:hidden p-1 text-foreground-muted hover:text-foreground"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Icon d={icons.x} size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-4">
          <SidebarSection label="Overview">
            <NavItem id="dashboard" icon={icons.dashboard} label="Dashboard" />
          </SidebarSection>
          <SidebarSection label="Content">
            <NavItem id="journal" icon={icons.journal} label="Journal" />
            <NavItem id="events" icon={icons.events} label="Events" />
            <NavItem id="projects" icon={icons.projects} label="Projects" />
            <NavItem id="galleries" icon={icons.gallery} label="Galleries" />
          </SidebarSection>
          <SidebarSection label="Operations">
            <NavItem id="registrations" icon={icons.registrations} label="Registrations" />
            <NavItem id="applications" icon={icons.applications} label="Applications" />
          </SidebarSection>
          <SidebarSection label="People">
            <NavItem id="team" icon={icons.team} label="Team" />
            <NavItem id="users" icon={icons.registrations} label="Users" />
          </SidebarSection>
          <SidebarSection label="System">
            <NavItem id="audit" icon={icons.audit} label="Audit Logs" />
            <NavItem id="settings" icon={icons.settings} label="Settings" />
          </SidebarSection>
        </nav>
      </aside>

      {/* ═══ MAIN AREA ═══ */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">

        {/* ═══ TOP BAR ═══ */}
        <header className="h-[56px] bg-surface border-b border-border flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-1 text-foreground-muted hover:text-foreground"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Icon d={icons.menu} size={20} />
            </button>
            <div>
              <span className="text-[15px] font-medium text-foreground hidden sm:inline-block">{greeting}, Admin</span>
              <span className="text-[15px] font-medium text-foreground sm:hidden">Admin</span>
              <span className="text-[13px] text-foreground-muted ml-2 hidden md:inline-block">
                Here's what's happening across CSEA.
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border bg-transparent cursor-pointer text-[13px] text-foreground-muted hover:bg-surface-secondary">
              <Icon d={icons.search} size={14} />
              <span>Search</span>
              <kbd className="text-[11px] px-1.5 py-px rounded-[4px] border border-border bg-surface-secondary ml-2 font-mono">⌘K</kbd>
            </button>

            <button className="sm:hidden p-2 text-foreground-muted">
              <Icon d={icons.search} size={18} />
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-sm border-none bg-transparent cursor-pointer text-foreground-muted relative hover:bg-surface-secondary">
              <Icon d={icons.bell} size={18} />
              <span className="absolute top-[6px] right-[6px] w-1.5 h-1.5 rounded-full bg-accent"></span>
            </button>

            {/* Quick Create */}
            <button className="hidden sm:flex items-center gap-1 px-3.5 py-1.5 rounded-sm border-none bg-accent text-white cursor-pointer text-[13px] font-medium hover:bg-accent-hover">
              <Icon d={icons.plus} size={14} />
              <span>Create</span>
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center text-[13px] font-semibold text-foreground-muted ml-1 cursor-pointer hover:opacity-80">
              A
            </div>
          </div>
        </header>

        {/* ═══ DASHBOARD CONTENT ═══ */}
        <main className="flex-1 overflow-y-auto bg-canvas p-4 lg:p-8 w-full">
          {currentView === 'dashboard' && <DashboardOverview />}
          {currentView === 'journal' && <JournalAdmin />}
          {currentView === 'events' && <EventsAdmin />}
          {currentView === 'projects' && <ProjectsAdmin />}
          {currentView === 'galleries' && <GalleriesAdmin />}
          {currentView === 'applications' && <ApplicationsAdmin />}
          {['registrations', 'team', 'users', 'audit', 'settings'].includes(currentView) && (
            <div className="max-w-content mx-auto p-12 text-center text-foreground-muted bg-surface border border-border rounded-xl">
              <h3 className="text-[16px] font-medium text-foreground mb-2">Module Not Initialized</h3>
              <p className="text-[14px]">The {currentView} module is pending backend integration.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
