import React, { useState } from 'react';
import { PuckApiProvider, usePuckContents } from '@commercetools-demo/puck-api';
import type {
  CreatePuckContentInput,
  PuckContentListItem,
} from '@commercetools-demo/puck-types';
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
import { PlusThinIcon, SearchIcon } from '@commercetools-uikit/icons';

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Row type for DataTable
// ---------------------------------------------------------------------------

type ContentRow = PuckContentListItem & { id: string };

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'contentType', label: 'Content Type' },
  { key: 'status', label: 'Status' },
  { key: 'updatedAt', label: 'Updated' },
  { key: 'actions', label: 'Actions', shouldIgnoreRowClick: true },
];

// ---------------------------------------------------------------------------
// Inner list component (uses context)
// ---------------------------------------------------------------------------

interface ContentListProps {
  defaultContentType?: string;
  onEdit: (item: PuckContentListItem) => void;
}

const ContentList: React.FC<ContentListProps> = ({ defaultContentType, onEdit }) => {
  const { contents, loading, error, fetchContents, createContent, deleteContent, refresh } =
    usePuckContents(defaultContentType);

  const [filterType, setFilterType] = useState(defaultContentType ?? '');
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createType, setCreateType] = useState(defaultContentType ?? '');
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleFilter = () => void fetchContents(filterType || undefined);

  const handleCreate = async () => {
    setCreateError(null);
    if (!createName.trim()) { setCreateError('Name is required'); return; }
    if (!createType.trim()) { setCreateError('Content type is required'); return; }
    setCreating(true);
    try {
      const input: CreatePuckContentInput = {
        name: createName.trim(),
        contentType: createType.trim(),
        data: { content: [], root: { props: {} } },
      };
      await createContent(input);
      setShowCreate(false);
      setCreateName('');
      setCreateType(defaultContentType ?? '');
    } catch (err) {
      setCreateError((err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm('Delete this content item and all its versions?')) return;
    setDeleting(key);
    try {
      await deleteContent(key);
    } finally {
      setDeleting(null);
    }
  };

  const rows: ContentRow[] = contents.map((c) => ({ ...c, id: c.key }));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <Spacings.Stack scale="l">
        {/* Header */}
        <Spacings.Inline justifyContent="space-between" alignItems="center">
          <Text.Headline as="h1">Content Items</Text.Headline>
          <PrimaryButton
            label="New Content"
            iconLeft={<PlusThinIcon />}
            onClick={() => setShowCreate((v) => !v)}
          />
        </Spacings.Inline>

        {/* Create form */}
        {showCreate && (
          <Card insetScale="l">
            <Spacings.Stack scale="m">
              <Text.Subheadline as="h4" isBold>Create Content Item</Text.Subheadline>
              {createError && <Text.Body tone="negative">{createError}</Text.Body>}
              <Spacings.Inline scale="m">
                <div style={{ flex: 1 }}>
                  <Spacings.Stack scale="xs">
                    <Label htmlFor="create-name">Name</Label>
                    <TextInput
                      id="create-name"
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      placeholder="e.g. Homepage Hero"
                    />
                  </Spacings.Stack>
                </div>
                <div style={{ flex: 1 }}>
                  <Spacings.Stack scale="xs">
                    <Label htmlFor="create-type">Content Type</Label>
                    <TextInput
                      id="create-type"
                      value={createType}
                      onChange={(e) => setCreateType(e.target.value)}
                      placeholder="e.g. hero, banner"
                    />
                  </Spacings.Stack>
                </div>
              </Spacings.Inline>
              <Spacings.Inline scale="s">
                <PrimaryButton
                  label={creating ? 'Creating…' : 'Create'}
                  onClick={() => void handleCreate()}
                  isDisabled={creating}
                />
                <SecondaryButton label="Cancel" onClick={() => setShowCreate(false)} />
              </Spacings.Inline>
            </Spacings.Stack>
          </Card>
        )}

        {/* Filter row */}
        <Spacings.Inline scale="s" alignItems="center">
          <div style={{ flex: 1, maxWidth: '280px' }}>
            <TextInput
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              placeholder="Filter by content type…"
            />
          </div>
          <SecondaryButton
            label="Filter"
            iconLeft={<SearchIcon />}
            onClick={handleFilter}
          />
          <FlatButton
            label="Clear"
            onClick={() => { setFilterType(''); void fetchContents(undefined); }}
          />
          <FlatButton label="Refresh" onClick={() => void refresh()} />
        </Spacings.Inline>

        {error && <Text.Body tone="negative">{error}</Text.Body>}

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <LoadingSpinner />
          </div>
        ) : contents.length === 0 ? (
          <Spacings.Stack scale="m" alignItems="center">
            <Text.Body tone="secondary">No content items found.</Text.Body>
          </Spacings.Stack>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            itemRenderer={(row: ContentRow, column) => {
              switch (column.key) {
                case 'name':
                  return <Text.Body isBold>{row.value.name}</Text.Body>;
                case 'contentType':
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
                      {row.value.contentType}
                    </code>
                  );
                case 'status': {
                  const hasDraft = !!row.states.draft;
                  const hasPublished = !!row.states.published;
                  return (
                    <span>
                      {hasDraft && <StatusBadge variant="draft" />}
                      {hasPublished && <StatusBadge variant="published" />}
                      {!hasDraft && !hasPublished && <StatusBadge variant="none" />}
                    </span>
                  );
                }
                case 'updatedAt':
                  return (
                    <Text.Body tone="secondary">
                      {new Date(row.value.updatedAt).toLocaleDateString()}
                    </Text.Body>
                  );
                case 'actions':
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <PrimaryButton label="Edit" size="20" onClick={() => onEdit(row)} />
                      <FlatButton
                        tone="critical"
                        label={deleting === row.key ? '…' : 'Delete'}
                        isDisabled={deleting === row.key}
                        onClick={() => void handleDelete(row.key)}
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

// ---------------------------------------------------------------------------
// Public component — wraps its own PuckApiProvider
// ---------------------------------------------------------------------------

export interface ContentManagerProps {
  baseURL: string;
  projectKey: string;
  businessUnitKey: string;
  jwtToken: string;
  defaultContentType?: string;
  onEdit: (item: PuckContentListItem) => void;
}

export const ContentManager: React.FC<ContentManagerProps> = ({
  baseURL,
  projectKey,
  businessUnitKey,
  jwtToken,
  defaultContentType,
  onEdit,
}) => (
  <PuckApiProvider
    baseURL={baseURL}
    projectKey={projectKey}
    businessUnitKey={businessUnitKey}
    jwtToken={jwtToken}
  >
    <ContentList defaultContentType={defaultContentType} onEdit={onEdit} />
  </PuckApiProvider>
);
