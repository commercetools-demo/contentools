import React, { useState } from 'react';
import { PuckApiProvider, usePuckContents } from '@commercetools-demo/puck-api';
import type {
  CreatePuckContentInput,
  PuckContentListItem,
} from '@commercetools-demo/puck-types';
import {
  Badge,
  Button,
  Card,
  DataTable,
  FormField,
  Icon,
  LoadingSpinner,
  Stack,
  Text,
  TextInput,
  type DataTableColumnItem,
} from '@commercetools/nimbus';
import { Add, Search } from '@commercetools/nimbus-icons';
import { EnsureIntlProvider } from './EnsureIntlProvider';
import { EnsureNimbusProvider } from './EnsureNimbusProvider';

// ---------------------------------------------------------------------------
// Row type for DataTable
// ---------------------------------------------------------------------------

type ContentRow = PuckContentListItem & { id: string; [key: string]: unknown };

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

  const columns: DataTableColumnItem<ContentRow>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: (row) => row.value.name,
      render: ({ row }) => <Text fontWeight="bold">{row.value.name}</Text>,
    },
    {
      id: 'contentType',
      header: 'Content Type',
      accessor: (row) => row.value.contentType,
      render: ({ row }) => (
        <code
          style={{
            background: '#f4f4f4',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '11px',
            fontFamily: 'monospace',
          }}
        >
          {row.value.contentType}
        </code>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: () => '',
      isSortable: false,
      render: ({ row }) => {
        const hasDraft = !!row.states.draft;
        const hasPublished = !!row.states.published;
        return (
          <Stack direction="row" gap="100" wrap="wrap">
            {hasDraft && <Badge colorPalette="warning" size="xs">Draft</Badge>}
            {hasPublished && <Badge colorPalette="positive" size="xs">Published</Badge>}
            {!hasDraft && !hasPublished && <Badge colorPalette="neutral" size="xs">No state</Badge>}
          </Stack>
        );
      },
    },
    {
      id: 'updatedAt',
      header: 'Updated',
      accessor: (row) => row.value.updatedAt,
      render: ({ row }) => (
        <Text color="neutral.11">
          {new Date(row.value.updatedAt).toLocaleDateString()}
        </Text>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => '',
      isSortable: false,
      render: ({ row }) => (
        <Stack direction="row" gap="200" alignItems="center">
          <Button variant="solid" size="xs" onPress={() => onEdit(row)}>Edit</Button>
          <Button
            variant="ghost"
            colorPalette="critical"
            size="xs"
            isDisabled={deleting === row.key}
            onPress={() => void handleDelete(row.key)}
          >
            {deleting === row.key ? '…' : 'Delete'}
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <Stack direction="column" gap="600">
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Text as="h1" fontSize="2xl" fontWeight="700">Content Items</Text>
          <Button variant="solid" onPress={() => setShowCreate((v) => !v)}>
            <Icon as={Add} /> New Content
          </Button>
        </Stack>

        {/* Create form */}
        {showCreate && (
          <Card.Root variant="outlined">
            <Card.Body>
              <Stack direction="column" gap="400">
                <Text as="h4" fontSize="xl" fontWeight="700">Create Content Item</Text>
                {createError && <Text color="critical.11">{createError}</Text>}
                <Stack direction="row" gap="400">
                  <div style={{ flex: 1 }}>
                    <FormField.Root>
                      <FormField.Label>Name</FormField.Label>
                      <FormField.Input>
                        <TextInput
                          value={createName}
                          onChange={(v) => setCreateName(v)}
                          placeholder="e.g. Homepage Hero"
                        />
                      </FormField.Input>
                    </FormField.Root>
                  </div>
                  <div style={{ flex: 1 }}>
                    <FormField.Root>
                      <FormField.Label>Content Type</FormField.Label>
                      <FormField.Input>
                        <TextInput
                          value={createType}
                          onChange={(v) => setCreateType(v)}
                          placeholder="e.g. hero, banner"
                        />
                      </FormField.Input>
                    </FormField.Root>
                  </div>
                </Stack>
                <Stack direction="row" gap="200">
                  <Button variant="solid" onPress={() => void handleCreate()} isDisabled={creating}>
                    {creating ? 'Creating…' : 'Create'}
                  </Button>
                  <Button variant="outline" onPress={() => setShowCreate(false)}>Cancel</Button>
                </Stack>
              </Stack>
            </Card.Body>
          </Card.Root>
        )}

        {/* Filter row */}
        <Stack direction="row" gap="200" alignItems="center">
          <div style={{ flex: 1, maxWidth: '280px' }}>
            <TextInput
              value={filterType}
              onChange={(v) => setFilterType(v)}
              placeholder="Filter by content type…"
            />
          </div>
          <Button variant="outline" onPress={handleFilter}>
            <Icon as={Search} /> Filter
          </Button>
          <Button
            variant="ghost"
            onPress={() => { setFilterType(''); void fetchContents(undefined); }}
          >
            Clear
          </Button>
          <Button variant="ghost" onPress={() => void refresh()}>Refresh</Button>
        </Stack>

        {error && <Text color="critical.11">{error}</Text>}

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <LoadingSpinner />
          </div>
        ) : contents.length === 0 ? (
          <Stack direction="column" gap="400" alignItems="center">
            <Text color="neutral.11">No content items found.</Text>
          </Stack>
        ) : (
          <DataTable columns={columns} rows={rows} aria-label="Content items" />
        )}
      </Stack>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Public component — wraps its own PuckApiProvider
// ---------------------------------------------------------------------------

export interface ContentManagerListProps {
  baseURL: string;
  projectKey: string;
  businessUnitKey: string;
  jwtToken: string;
  defaultContentType?: string;
  onEdit: (item: PuckContentListItem) => void;
}

export const ContentManagerList: React.FC<ContentManagerListProps> = ({
  baseURL,
  projectKey,
  businessUnitKey,
  jwtToken,
  defaultContentType,
  onEdit,
}) => (
  <EnsureNimbusProvider>
    <EnsureIntlProvider>
      <PuckApiProvider
        baseURL={baseURL}
        projectKey={projectKey}
        businessUnitKey={businessUnitKey}
        jwtToken={jwtToken}
      >
        <ContentList defaultContentType={defaultContentType} onEdit={onEdit} />
      </PuckApiProvider>
    </EnsureIntlProvider>
  </EnsureNimbusProvider>
);
