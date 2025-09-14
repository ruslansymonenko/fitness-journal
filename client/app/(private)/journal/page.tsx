'use client';

import React, { useState } from 'react';
import JournalHeader from '@/components/JournalHeader';
import { withAuth } from '@/lib/withAuth';
import EntriesList from '@/components/private/EntriesList';
import EntriesFilter from '@/components/private/EntriesFilter';
import EditEntryForm from '@/components/private/forms/EditEntryForm';
import { useEntries } from '@/hooks/useEntries';
import { FetchEntriesParams, Entry } from '@/services/entries';
import Button from '@/components/common/Button';

function JournalPage() {
  const [filters, setFilters] = useState<FetchEntriesParams>({});
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isError, error, refetch } = useEntries(filters);

  const handleFiltersChange = (newFilters: FetchEntriesParams) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleEditEntry = (entry: Entry) => {
    setEditingEntry(entry);
  };

  const handleEditSuccess = () => {
    setEditingEntry(null);
    refetch();
  };

  const handleEditCancel = () => {
    setEditingEntry(null);
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <JournalHeader />
        <div className="flex justify-center py-8">
          <div className="text-lg opacity-70">Loading entries...</div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <JournalHeader />
        <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
          {error instanceof Error ? error.message : 'Failed to load entries'}
        </div>
      </section>
    );
  }

  const entries = data?.entries ?? [];
  const pagination = data?.pagination;

  return (
    <section className="space-y-6">
      <JournalHeader />

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Your Fitness Journal {pagination && `(${pagination.total} entries)`}
        </h2>
        <Button variant="ghost" onClick={() => setShowFilters(!showFilters)} className="text-sm">
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <EntriesFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />
      )}

      {/* Edit Entry Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg border border-[color:var(--panel-border)] bg-[var(--background)] p-6">
            <h2 className="mb-4 text-xl font-semibold">Edit Entry</h2>
            <EditEntryForm
              entry={editingEntry}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          </div>
        </div>
      )}

      {/* Entries List */}
      {entries.length === 0 ? (
        <div className="rounded-lg border border-[color:var(--panel-border)] bg-[var(--panel)] p-8 text-center">
          <p className="text-lg opacity-60">
            {Object.keys(filters).length > 0 ? 'No entries match your filters' : 'No entries yet'}
          </p>
          <p className="mt-2 text-sm opacity-40">
            {Object.keys(filters).length > 0
              ? 'Try adjusting your filters or add a new entry'
              : 'Start by adding your first workout entry'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <EntriesList entries={entries} onEdit={handleEditEntry} />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="text-sm"
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="ghost"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="text-sm"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default withAuth(JournalPage);
