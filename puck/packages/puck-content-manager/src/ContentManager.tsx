import React, { useState } from 'react';
import {
  PuckApiProvider,
  usePuckContents,
  usePuckTemplates,
} from '@commercetools-demo/puck-api';
import type {
  CreatePuckContentInput,
  PuckContentListItem,
} from '@commercetools-demo/puck-types';
import {
  Badge,
  Button,
  Card,
  DataTable,
  Dialog,
  FormField,
  Icon,
  IconButton,
  LoadingSpinner,
  Select,
  Stack,
  Text,
  TextInput,
  type DataTableColumnItem,
} from '@commercetools/nimbus';
import { Add, Close, Delete, Edit } from '@commercetools/nimbus-icons';
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
  const { contents, loading, error, createContent, deleteContent } =
    usePuckContents(defaultContentType);
  const { templates } = usePuckTemplates('content');

  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createType, setCreateType] = useState(defaultContentType ?? '');
  const [templateKey, setTemplateKey] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  // Content item targeted by the (Nimbus) delete-confirmation dialog.
  const [pendingDelete, setPendingDelete] = useState<PuckContentListItem | null>(null);

  const handleCreate = async () => {
    setCreateError(null);
    if (!createName.trim()) { setCreateError('Name is required'); return; }
    if (!createType.trim()) { setCreateError('Content type is required'); return; }
    setCreating(true);
    try {
      const template = templateKey
        ? templates.find((t) => t.key === templateKey)
        : undefined;
      const input: CreatePuckContentInput = {
        name: createName.trim(),
        contentType: createType.trim(),
        data: template?.value.puckData ?? { content: [], root: { props: {} } },
      };
      await createContent(input);
      setShowCreate(false);
      setCreateName('');
      setCreateType(defaultContentType ?? '');
      setTemplateKey('');
    } catch (err) {
      setCreateError((err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (item: PuckContentListItem) => {
    setDeleting(item.key);
    try {
      await deleteContent(item.key);
      setPendingDelete(null);
    } finally {
      setDeleting(null);
    }
  };

  const term = search.trim().toLowerCase();
  const filteredContents = term
    ? contents.filter(
        (c) =>
          c.value.name.toLowerCase().includes(term) ||
          c.value.contentType.toLowerCase().includes(term)
      )
    : contents;

  const rows: ContentRow[] = filteredContents.map((c) => ({ ...c, id: c.key }));

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
        <Stack direction="row" gap="100" alignItems="center">
          <IconButton
            aria-label={`Edit ${row.value.name}`}
            variant="ghost"
            size="xs"
            onPress={() => onEdit(row)}
          >
            <Edit />
          </IconButton>
          <IconButton
            aria-label={`Delete ${row.value.name}`}
            variant="ghost"
            colorPalette="critical"
            size="xs"
            isDisabled={deleting === row.key}
            onPress={() => setPendingDelete(row)}
          >
            <Delete />
          </IconButton>
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
                <FormField.Root>
                  <FormField.Label>Template</FormField.Label>
                  <FormField.Input>
                    <Select.Root
                      aria-label="Template"
                      selectedKey={templateKey || 'empty'}
                      onSelectionChange={(key) =>
                        setTemplateKey(key == null || key === 'empty' ? '' : String(key))
                      }
                    >
                      <Select.Options>
                        <Select.Option id="empty">Empty</Select.Option>
                        {templates.map((t) => (
                          <Select.Option key={t.key} id={t.key}>
                            {t.value.name}
                          </Select.Option>
                        ))}
                      </Select.Options>
                    </Select.Root>
                  </FormField.Input>
                </FormField.Root>
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

        {/* Search by name or content type */}
        <div style={{ maxWidth: 360 }}>
          <TextInput
            aria-label="Search content"
            placeholder="Search by name or content type…"
            value={search}
            onChange={(v) => setSearch(v)}
            width="100%"
            trailingElement={
              search !== '' ? (
                <IconButton
                  aria-label="Clear search"
                  variant="ghost"
                  colorPalette="neutral"
                  size="2xs"
                  onPress={() => setSearch('')}
                >
                  <Close />
                </IconButton>
              ) : undefined
            }
          />
        </div>

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

      {/* Delete confirmation (Nimbus) */}
      <Dialog.Root
        isOpen={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Delete content item?</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body>
            <Text>
              Are you sure you want to delete{' '}
              <Text as="span" fontWeight="700">
                {pendingDelete?.value.name}
              </Text>{' '}
              and all its versions? This cannot be undone.
            </Text>
          </Dialog.Body>
          <Dialog.Footer>
            <Button slot="close" variant="outline" isDisabled={deleting !== null}>
              Cancel
            </Button>
            <Button
              colorPalette="critical"
              isDisabled={deleting !== null}
              onPress={() => {
                if (pendingDelete) void handleDelete(pendingDelete);
              }}
            >
              {deleting !== null ? 'Deleting…' : 'Delete'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
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
