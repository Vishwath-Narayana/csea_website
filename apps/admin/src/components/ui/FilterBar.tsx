import React from 'react';
import { SearchInput } from './Input';
import { Select } from './Select';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  placeholder: string;
  options: FilterOption[];
}

interface FilterBarProps {
  searchPlaceholder?: string;
  filters?: FilterGroup[];
  actions?: React.ReactNode;
  onSearchChange?: (val: string) => void;
  onFilterChange?: (filterId: string, val: string) => void;
}

export function FilterBar({ searchPlaceholder = "Search...", filters = [], actions, onSearchChange, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-[280px]">
          <SearchInput placeholder={searchPlaceholder} onChange={e => onSearchChange?.(e.target.value)} />
        </div>
        
        {filters.length > 0 && (
          <div className="flex w-full sm:w-auto items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {filters.map(filter => (
              <div key={filter.id} className="min-w-[140px]">
                <Select onChange={e => onFilterChange?.(filter.id, e.target.value)}>
                  <option value="">{filter.placeholder}</option>
                  {filter.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {actions && (
        <div className="flex shrink-0 items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
