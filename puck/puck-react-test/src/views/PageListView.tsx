import React, { useState } from 'react';
import { usePuckPages } from '@commercetools-demo/puck-api';
import type { CreatePuckPageInput, PuckPageListItem } from '@commercetools-demo/puck-types';
import DataTable from '@commercetools-uikit/data-table';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import FlatButton from '@commercetools-uikit/flat-button';
import Card from '@commercetools-uikit/card';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import TextInput from '@commercetools-uikit/text-input';
import Label from '@commercetools-uikit/label';
import { PlusThinIcon } from '@commercetools-uikit/icons';

interface PageListViewProps {
  onEdit: (page: PuckPageListItem) => void;
  onPreview: (page: PuckPageListItem) => void;
}

// Row type for DataTable — must include `id`
type PageRow = PuckPageListItem & { id: string };

// Simple status badge using CT design tokens
const StatusBadge: React.FC<{ variant: 'draft' | 'published' | 'none' }> = ({ variant }) => {
  const styles: React.CSSProperties =
    variant === 'published'
      ? { background: 'var(--color-success-95)', color: 'var(--color-success-40)', border: '1px solid var(--color-success-85)' }
      : variant === 'draft'
        ? { background: 'var(--color-warning-95)', color: 'var(--color-warning-40)', border: '1px solid var(--color-warning-85)' }
        : { background: 'var(--color-neutral-95)', color: 'var(--color-neutral-50)', border: '1px solid var(--color-neutral-85)' };
  return (
    <span
      style={{
        ...styles,
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 'var(--border-radius-20)',
        fontSize: 'var(--font-size-10)',
        fontWeight: 'var(--font-weight-600)',
        marginRight: '4px',
        whiteSpace: 'nowrap',
      }}
    >
      {variant === 'published' ? 'Published' : variant === 'draft' ? 'Draft' : 'No state'}
    </span>
  );
};

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'status', label: 'Status' },
  { key: 'updatedAt', label: 'Updated' },
  { key: 'actions', label: 'Actions', shouldIgnoreRowClick: true },
];

export const PageListView: React.FC<PageListViewProps> = ({ onEdit, onPreview }) => {
  const { pages, loading, error, createPage, deletePage, refresh } = usePuckPages();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [formError, setFormError] = useState('');

  const handleCreate = async () => {
    if (!newName.trim()) { setFormError('Name is required'); return; }
    if (!newSlug.trim()) { setFormError('Slug is required'); return; }
    setFormError('');
    try {
      const input: CreatePuckPageInput = {
        name: newName.trim(),
        slug: newSlug.trim().startsWith('/') ? newSlug.trim() : `/${newSlug.trim()}`,
      };
      const created = await createPage(input);
      setCreating(false);
      setNewName('');
      setNewSlug('');
      await refresh();
      const createdPage = pages.find((p) => p.key === created.key);
      if (createdPage) onEdit(createdPage);
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  const handleDelete = async (page: PuckPageListItem) => {
    if (!confirm(`Delete "${page.value.name}"? This cannot be undone.`)) return;
    await deletePage(page.key);
  };

  if (loading) {
    return (
      <div style={{ padding: '64px', display: 'flex', justifyContent: 'center' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '32px' }}>
        <Text.Body tone="negative">Error: {error}</Text.Body>
      </div>
    );
  }

  const rows: PageRow[] = pages.map((p) => ({ ...p, id: p.key }));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <Spacings.Stack scale="l">
        {/* Header */}
        <Spacings.Inline justifyContent="space-between" alignItems="center">
          <Text.Headline as="h1">Puck Pages</Text.Headline>
          <PrimaryButton
            label="New Page"
            iconLeft={<PlusThinIcon />}
            onClick={() => setCreating(true)}
          />
        </Spacings.Inline>

        {/* Create form */}
        {creating && (
          <Card insetScale="l">
            <Spacings.Stack scale="m">
              <Text.Subheadline as="h4" isBold>Create New Page</Text.Subheadline>
              <Spacings.Inline scale="m">
                <div style={{ flex: 1 }}>
                  <Spacings.Stack scale="xs">
                    <Label htmlFor="new-name">Name *</Label>
                    <TextInput
                      id="new-name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Home Page"
                    />
                  </Spacings.Stack>
                </div>
                <div style={{ flex: 1 }}>
                  <Spacings.Stack scale="xs">
                    <Label htmlFor="new-slug">Slug *</Label>
                    <TextInput
                      id="new-slug"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      placeholder="/home"
                    />
                  </Spacings.Stack>
                </div>
              </Spacings.Inline>
              {formError && (
                <Text.Body tone="negative">{formError}</Text.Body>
              )}
              <Spacings.Inline scale="s">
                <PrimaryButton label="Create" onClick={() => void handleCreate()} />
                <SecondaryButton
                  label="Cancel"
                  onClick={() => { setCreating(false); setFormError(''); }}
                />
              </Spacings.Inline>
            </Spacings.Stack>
          </Card>
        )}

        {/* Table or empty state */}
        {pages.length === 0 ? (
          <Spacings.Stack scale="m" alignItems="center">
            <Text.Body tone="secondary">No pages yet.</Text.Body>
            <PrimaryButton
              label="Create first page"
              iconLeft={<PlusThinIcon />}
              onClick={() => setCreating(true)}
            />
          </Spacings.Stack>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            itemRenderer={(row: PageRow, column) => {
              switch (column.key) {
                case 'name':
                  return (
                    <Spacings.Stack scale="xs">
                      <Text.Body isBold>{row.value.name}</Text.Body>
                      <Text.Detail tone="secondary">{row.key}</Text.Detail>
                    </Spacings.Stack>
                  );
                case 'slug':
                  return (
                    <code
                      style={{
                        background: 'var(--color-neutral-95)',
                        padding: '2px 6px',
                        borderRadius: 'var(--border-radius-4)',
                        fontSize: 'var(--font-size-10)',
                        fontFamily: 'monospace',
                      }}
                    >
                      {row.value.slug}
                    </code>
                  );
                case 'status':
                  return (
                    <span>
                      {row.states.draft && <StatusBadge variant="draft" />}
                      {row.states.published && <StatusBadge variant="published" />}
                      {!row.states.draft && !row.states.published && (
                        <StatusBadge variant="none" />
                      )}
                    </span>
                  );
                case 'updatedAt':
                  return (
                    <Text.Body tone="secondary">
                      {new Date(row.value.updatedAt).toLocaleString()}
                    </Text.Body>
                  );
                case 'actions':
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <PrimaryButton label="Edit" size="20" onClick={() => onEdit(row)} />
                      <SecondaryButton label="Preview" size="20" onClick={() => onPreview(row)} />
                      <FlatButton
                        tone="critical"
                        label="Delete"
                        onClick={() => void handleDelete(row)}
                      />
                    </div>
                  );
                default:
                  return null;
              }
            }}
          />
        )}
      </Spacings.Stack>
    </div>
  );
};
