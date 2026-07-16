import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="border-b border-border overflow-x-auto no-scrollbar">
      <nav className="-mb-px flex space-x-6 min-w-max px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                whitespace-nowrap py-3 px-1 border-b-2 font-medium text-[13px] transition-colors flex items-center gap-2
                ${isActive 
                  ? 'border-accent text-accent' 
                  : 'border-transparent text-foreground-secondary hover:text-foreground hover:border-border'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
