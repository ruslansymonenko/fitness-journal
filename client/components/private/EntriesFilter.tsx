import React from 'react';
import { FetchEntriesParams } from '@/services/entries';
import Button from '@/components/common/Button';

interface Props {
  filters: FetchEntriesParams;
  onFiltersChange: (filters: FetchEntriesParams) => void;
  onReset: () => void;
}

const EntriesFilter: React.FC<Props> = ({ filters, onFiltersChange, onReset }) => {
  const handleFilterChange = (key: keyof FetchEntriesParams, value: any) => {
    onFiltersChange({ ...filters, [key]: value || undefined });
  };

  return (
    <div className="space-y-4 rounded-lg border border-[color:var(--panel-border)] bg-[var(--panel)] p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filter & Sort</h3>
        <Button variant="ghost" onClick={onReset} className="text-xs">
          Reset Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Sort By */}
        <div>
          <label className="mb-1 block text-sm opacity-70">Sort By</label>
          <select
            value={filters.sortBy || 'date'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full rounded-md border border-[color:var(--panel-border)] bg-[var(--panel)] px-3 py-2 outline-none focus:border-brand.accent"
          >
            <option value="date">Date</option>
            <option value="workoutType">Workout Type</option>
            <option value="duration">Duration</option>
            <option value="createdAt">Created At</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="mb-1 block text-sm opacity-70">Sort Order</label>
          <select
            value={filters.sortOrder || 'desc'}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="w-full rounded-md border border-[color:var(--panel-border)] bg-[var(--panel)] px-3 py-2 outline-none focus:border-brand.accent"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* Workout Type Filter */}
        <div>
          <label className="mb-1 block text-sm opacity-70">Workout Type</label>
          <input
            type="text"
            value={filters.workoutType || ''}
            onChange={(e) => handleFilterChange('workoutType', e.target.value)}
            placeholder="e.g. Running, Yoga..."
            className="w-full rounded-md border border-[color:var(--panel-border)] bg-[var(--panel)] px-3 py-2 outline-none focus:border-brand.accent"
          />
        </div>

        {/* Date From */}
        <div>
          <label className="mb-1 block text-sm opacity-70">Date From</label>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="w-full rounded-md border border-[color:var(--panel-border)] bg-[var(--panel)] px-3 py-2 outline-none focus:border-brand.accent"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="mb-1 block text-sm opacity-70">Date To</label>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="w-full rounded-md border border-[color:var(--panel-border)] bg-[var(--panel)] px-3 py-2 outline-none focus:border-brand.accent"
          />
        </div>

        {/* Min Duration */}
        <div>
          <label className="mb-1 block text-sm opacity-70">Min Duration (minutes)</label>
          <input
            type="number"
            min="1"
            value={filters.minDuration || ''}
            onChange={(e) =>
              handleFilterChange('minDuration', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="e.g. 30"
            className="w-full rounded-md border border-[color:var(--panel-border)] bg-[var(--panel)] px-3 py-2 outline-none focus:border-brand.accent"
          />
        </div>

        {/* Max Duration */}
        <div>
          <label className="mb-1 block text-sm opacity-70">Max Duration (minutes)</label>
          <input
            type="number"
            min="1"
            value={filters.maxDuration || ''}
            onChange={(e) =>
              handleFilterChange('maxDuration', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="e.g. 120"
            className="w-full rounded-md border border-[color:var(--panel-border)] bg-[var(--panel)] px-3 py-2 outline-none focus:border-brand.accent"
          />
        </div>

        {/* Limit */}
        <div>
          <label className="mb-1 block text-sm opacity-70">Results per page</label>
          <select
            value={filters.limit || 10}
            onChange={(e) => handleFilterChange('limit', Number(e.target.value))}
            className="w-full rounded-md border border-[color:var(--panel-border)] bg-[var(--panel)] px-3 py-2 outline-none focus:border-brand.accent"
          >
            <option value={5}>5 entries</option>
            <option value={10}>10 entries</option>
            <option value={20}>20 entries</option>
            <option value={50}>50 entries</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EntriesFilter;
