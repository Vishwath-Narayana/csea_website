import React, { useState } from 'react';
import './index.css';
import { 
  LayoutDashboard, FileText, Calendar as CalendarIcon, Code2, 
  Image as ImageIcon, Users, Briefcase, Shield, Settings as SettingsIcon,
  Search, Bell, Plus, Menu, X, ChevronRight 
} from 'lucide-react';

import { Dashboard } from './pages/Dashboard/Dashboard';
import { JournalList } from './pages/Journal/JournalList';
import { JournalEditor } from './pages/Journal/JournalEditor';
import { JournalDetail } from './pages/Journal/JournalDetail';
import { EventList } from './pages/Events/EventList';
import { EventForm } from './pages/Events/EventForm';
import { EventAttendees } from './pages/Events/EventAttendees';
import { EventDetail } from './pages/Events/EventDetail';
import { ProjectList } from './pages/Projects/ProjectList';
import { ProjectForm } from './pages/Projects/ProjectForm';
import { ApplicationList } from './pages/Applications/ApplicationList';
import { GalleryList } from './pages/Galleries/GalleryList';
import { GalleryUpload } from './pages/Galleries/GalleryUpload';
import { GalleryDetail } from './pages/Galleries/GalleryDetail';
import { ProjectDetail } from './pages/Projects/ProjectDetail';
import { UsersList } from './pages/Users/UsersList';
import { Settings } from './pages/Settings/Settings';
import { AuditLog } from './pages/Settings/AuditLog';
import { DropdownMenu, DropdownMenuItem } from './components/ui/DropdownMenu';
import { Modal } from './components/ui/Modal';
import { Input } from './components/ui/Input';

// ─── Sidebar Section ───
const SidebarSection = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="mb-6 px-4">
    <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
      {label}
    </div>
    <div className="flex flex-col space-y-0.5">
      {children}
    </div>
  </div>
);

// ─── Main Application ───
function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle keyboard shortcut for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (view: string) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
    setIsSearchOpen(false);
  };

  const NavItem = ({ id, icon: IconComponent, label }: { id: string, icon: any, label: string }) => {
    const isActive = currentView === id || currentView.startsWith(`${id}/`);
    return (
      <div 
        onClick={() => navigate(id)}
        className={`group mx-2 mb-0.5 flex cursor-pointer items-center gap-2.5 rounded-sm px-4 py-2 text-[14px] transition-all duration-150 ${isActive ? 'bg-accent/10 font-medium text-accent' : 'font-normal text-foreground-secondary hover:bg-surface-secondary hover:text-foreground'}`}
      >
        <span className={isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}><IconComponent size={18} /></span>
        {label}
      </div>
    );
  };

  // Router logic
  const renderView = () => {
    const parts = currentView.split('/');
    const module = parts[0];
    
    // Handle paths like 'events/create' or 'events/123/edit' or 'events/123'
    let id: string | undefined = undefined;
    let action: string | undefined = undefined;

    if (parts.length === 2) {
      if (parts[1] === 'create' || parts[1] === 'upload') {
        action = parts[1];
      } else {
        id = parts[1];
        action = 'detail';
      }
    } else if (parts.length === 3) {
      id = parts[1];
      action = parts[2];
    }

    switch (module) {
      case 'dashboard': return <Dashboard />;
      case 'journal':
        if (action === 'create' || action === 'edit') return <JournalEditor navigate={navigate} id={id} />;
        if (action === 'detail') return <JournalDetail navigate={navigate} id={id} />;
        return <JournalList navigate={navigate} />;
      case 'events':
        if (action === 'create' || action === 'edit') return <EventForm navigate={navigate} id={id} />;
        if (action === 'attendees') return <EventAttendees navigate={navigate} id={id} />;
        if (action === 'detail') return <EventDetail navigate={navigate} id={id} />;
        return <EventList navigate={navigate} />;
      case 'projects':
        if (action === 'create' || action === 'edit') return <ProjectForm navigate={navigate} id={id} />;
        if (action === 'detail') return <ProjectDetail navigate={navigate} id={id} />;
        return <ProjectList navigate={navigate} />;
      case 'applications': return <ApplicationList />;
      case 'galleries':
        if (action === 'upload') return <GalleryUpload navigate={navigate} />;
        if (action === 'detail') return <GalleryDetail navigate={navigate} id={id} />;
        return <GalleryList navigate={navigate} />;
      case 'users': return <UsersList />;
      case 'settings': return <Settings />;
      case 'audit': return <AuditLog />;
      default: return <Dashboard />;
    }
  };

  // Breadcrumbs generator
  const getBreadcrumbs = () => {
    const parts = currentView.split('/');
    const module = parts[0];
    const isCreate = parts[1] === 'create' || parts[1] === 'upload';
    const hasId = parts.length >= 2 && !isCreate;
    const action = parts.length === 3 ? parts[2] : (isCreate ? parts[1] : undefined);
    
    let label = module.charAt(0).toUpperCase() + module.slice(1);
    if (module === 'dashboard') label = 'Dashboard';
    if (module === 'journal') label = 'Journal';
    if (module === 'users') label = 'Users & Roles';
    
    return (
      <div className="hidden items-center gap-2 text-[13px] md:flex">
        <span className="text-foreground-muted cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate(module)}>{label}</span>
        {hasId && (
          <>
            <ChevronRight size={14} className="text-foreground-muted/50" />
            <span className="text-foreground-muted cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate(`${module}/${parts[1]}`)}>Detail</span>
          </>
        )}
        {action && (
          <>
            <ChevronRight size={14} className="text-foreground-muted/50" />
            <span className="text-foreground font-medium capitalize">{action}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-canvas text-foreground selection:bg-accent/20">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-canvas/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ═══ SIDEBAR ═══ */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-[260px] shrink-0 flex-col overflow-y-auto border-r border-border bg-surface
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0 shadow-strong' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:shadow-none
      `}>
        {/* Logo */}
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-border px-6">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            CSEA CONTROL
          </span>
          <button 
            className="text-foreground-muted hover:text-foreground lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-6">
          <SidebarSection label="Overview">
            <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          </SidebarSection>
          <SidebarSection label="Content">
            <NavItem id="journal" icon={FileText} label="Journal" />
            <NavItem id="events" icon={CalendarIcon} label="Events" />
            <NavItem id="projects" icon={Code2} label="Projects" />
            <NavItem id="galleries" icon={ImageIcon} label="Galleries" />
          </SidebarSection>
          <SidebarSection label="Operations">
            <NavItem id="applications" icon={Briefcase} label="Applications" />
            <NavItem id="users" icon={Users} label="Users & Roles" />
          </SidebarSection>
          <SidebarSection label="System">
            <NavItem id="audit" icon={Shield} label="Audit Logs" />
            <NavItem id="settings" icon={SettingsIcon} label="Settings" />
          </SidebarSection>
        </nav>

        {/* User Profile Footer */}
        <div className="mt-auto border-t border-border p-4">
          <DropdownMenu
            trigger={
              <div className="flex w-full cursor-pointer items-center gap-3 rounded-md p-2 transition-colors hover:bg-surface-secondary">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[12px] font-medium text-white">
                  A
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="truncate text-[13px] font-medium text-foreground">Admin User</div>
                  <div className="truncate text-[12px] text-foreground-muted">admin@csea.kitsw.ac.in</div>
                </div>
              </div>
            }
          >
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <div className="my-1 border-t border-border"></div>
            <DropdownMenuItem destructive>Sign Out</DropdownMenuItem>
          </DropdownMenu>
        </div>
      </aside>

      {/* ═══ MAIN AREA ═══ */}
      <div className="flex w-full flex-1 flex-col overflow-hidden">

        {/* ═══ TOP BAR ═══ */}
        <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-border bg-surface px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              className="text-foreground-muted hover:text-foreground lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            {getBreadcrumbs()}
            <div className="md:hidden">
              <span className="text-[15px] font-medium text-foreground capitalize">{currentView.split('/')[0]}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Search */}
            <button 
              className="hidden cursor-pointer items-center gap-1.5 rounded-sm border border-border bg-surface-secondary/50 px-3 py-1.5 text-[13px] text-foreground-muted transition-colors hover:bg-surface-secondary sm:flex"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={14} />
              <span>Search platform...</span>
              <kbd className="ml-4 rounded-[4px] border border-border bg-surface px-1.5 py-px font-mono text-[10px]">⌘K</kbd>
            </button>

            <button 
              className="p-2 text-foreground-muted sm:hidden hover:text-foreground"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={18} />
            </button>

            {/* Notifications */}
            <DropdownMenu
              align="right"
              trigger={
                <button className="relative cursor-pointer rounded-sm border-none bg-transparent p-2 text-foreground-muted transition-colors hover:bg-surface-secondary hover:text-foreground">
                  <Bell size={18} />
                  <span className="absolute right-[6px] top-[6px] h-1.5 w-1.5 rounded-full bg-accent"></span>
                </button>
              }
            >
              <div className="px-4 py-3 border-b border-border w-[300px]">
                <h3 className="font-semibold text-[14px]">Notifications</h3>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1 w-full py-1">
                    <span className="font-medium text-[13px]">New project application received</span>
                    <span className="text-[12px] text-foreground-muted">Alice applied for Frontend Dev</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1 w-full py-1">
                    <span className="font-medium text-[13px]">Article awaiting review</span>
                    <span className="text-[12px] text-foreground-muted">"Web3 Guide" needs approval</span>
                  </div>
                </DropdownMenuItem>
              </div>
              <div className="px-4 py-2 border-t border-border text-center">
                <button className="text-[12px] font-medium text-accent hover:underline">Mark all as read</button>
              </div>
            </DropdownMenu>

            <div className="mx-2 h-4 w-px bg-border hidden sm:block"></div>

            {/* Quick Create Menu */}
            <DropdownMenu
              align="right"
              trigger={
                <button className="hidden cursor-pointer items-center gap-1 rounded-sm border-none bg-foreground px-3.5 py-1.5 text-[13px] font-medium text-canvas transition-opacity hover:opacity-90 sm:flex">
                  <Plus size={14} />
                  <span>Create</span>
                </button>
              }
            >
              <DropdownMenuItem onClick={() => navigate('journal/create')}>New Article</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('events/create')}>New Event</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('projects/create')}>New Project</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('galleries/upload')}>New Album</DropdownMenuItem>
            </DropdownMenu>
          </div>
        </header>

        {/* ═══ DASHBOARD CONTENT ═══ */}
        <main className="flex-1 w-full overflow-y-auto bg-canvas p-4 lg:p-8">
          {renderView()}
        </main>
      </div>

      {/* Command Palette Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[20vh]">
          <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
          <div className="relative w-full max-w-[600px] mx-4 bg-surface border border-border shadow-strong rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center px-4 py-3 border-b border-border">
              <Search size={18} className="text-foreground-muted mr-3" />
              <input 
                autoFocus
                placeholder="Search modules, pages, or content..." 
                className="flex-1 bg-transparent border-none outline-none text-[15px] placeholder:text-foreground-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <kbd className="hidden sm:inline-block rounded border border-border bg-surface-secondary px-1.5 py-0.5 text-[10px] font-mono text-foreground-muted">ESC</kbd>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2">
              {/* Mock Results */}
              <div className="px-3 py-2 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Navigation</div>
              <button className="w-full text-left px-3 py-2.5 rounded-lg text-[14px] hover:bg-surface-secondary flex items-center justify-between" onClick={() => navigate('dashboard')}>
                <span>Dashboard</span>
                <ChevronRight size={14} className="text-foreground-muted" />
              </button>
              <button className="w-full text-left px-3 py-2.5 rounded-lg text-[14px] hover:bg-surface-secondary flex items-center justify-between" onClick={() => navigate('events')}>
                <span>Events</span>
                <ChevronRight size={14} className="text-foreground-muted" />
              </button>
              
              <div className="px-3 py-2 mt-2 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Actions</div>
              <button className="w-full text-left px-3 py-2.5 rounded-lg text-[14px] hover:bg-surface-secondary flex items-center gap-2" onClick={() => navigate('events/create')}>
                <Plus size={14} className="text-foreground-muted" /> Create New Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
