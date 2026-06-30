import React, { useState, type ReactNode } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  useHistory,
  useParams,
  useLocation,
} from 'react-router-dom';
import {
  PuckApiProvider,
  usePuckPages,
  usePuckApiContext,
} from '@commercetools-demo/puck-api';
import { PuckEditor, defaultPuckConfig } from '@commercetools-demo/puck-editor';
import { PuckRenderer } from '@commercetools-demo/puck-renderer';
import { EnsureIntlProvider } from './EnsureIntlProvider';
import { EnsureNimbusProvider } from './EnsureNimbusProvider';

const DEFAULT_CONFIG: Config = {
  ...defaultPuckConfig,
  components: { ...defaultPuckConfig.components },
};
import type { Config } from '@measured/puck';
import type { CreatePuckPageInput, PuckPageListItem } from '@commercetools-demo/puck-types';
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
import { Add, ChevronLeft } from '@commercetools/nimbus-icons';

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

const STATUS_BADGE: Record<
  'draft' | 'published' | 'none',
  { colorPalette: 'warning' | 'positive' | 'neutral'; label: string }
> = {
  draft: { colorPalette: 'warning', label: 'Draft' },
  published: { colorPalette: 'positive', label: 'Published' },
  none: { colorPalette: 'neutral', label: 'No state' },
};

const StatusBadge: React.FC<{ variant: 'draft' | 'published' | 'none' }> = ({ variant }) => {
  const meta = STATUS_BADGE[variant];
  return <Badge colorPalette={meta.colorPalette} size="xs">{meta.label}</Badge>;
};

// ---------------------------------------------------------------------------
// Shared nav bar style
// ---------------------------------------------------------------------------

const NAV_BAR_STYLE: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px 16px',
  background: 'var(--color-surface, #fff)',
  borderBottom: '1px solid var(--color-neutral-90, #e0e0e0)',
  zIndex: 200,
  flexShrink: 0,
};

// ---------------------------------------------------------------------------
// Table row type
// ---------------------------------------------------------------------------

type PageRow = PuckPageListItem & { id: string; [key: string]: unknown };

// ---------------------------------------------------------------------------
// PageList route
// ---------------------------------------------------------------------------

interface PageListProps {
  backButton?: ReactNode;
}

const PageList: React.FC<PageListProps> = ({ backButton }) => {
  const history = useHistory();
  const { pages, loading, error, createPage, deletePage, refresh } = usePuckPages();

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newName.trim()) { setFormError('Name is required'); return; }
    if (!newSlug.trim()) { setFormError('Slug is required'); return; }
    setFormError('');
    setSubmitting(true);
    try {
      const input: CreatePuckPageInput = {
        name: newName.trim(),
        slug: newSlug.trim().startsWith('/') ? newSlug.trim() : `/${newSlug.trim()}`,
      };
      const created = await createPage(input);
      setCreating(false);
      setNewName('');
      setNewSlug('');
      history.push(`/${created.key}/edit`, { pageName: created.value.name });
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (page: PuckPageListItem) => {
    if (!confirm(`Delete "${page.value.name}"? This cannot be undone.`)) return;
    setDeleting(page.key);
    try {
      await deletePage(page.key);
      await refresh();
    } finally {
      setDeleting(null);
    }
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
        <Text color="critical.11">Error: {error}</Text>
      </div>
    );
  }

  const rows: PageRow[] = pages.map((p: PuckPageListItem) => ({ ...p, id: p.key }));

  const columns: DataTableColumnItem<PageRow>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: (row) => row.value.name,
      render: ({ row }) => (
        <Stack direction="column" gap="100">
          <Text fontWeight="bold">{row.value.name}</Text>
          <Text fontSize="sm" color="neutral.11">{row.key}</Text>
        </Stack>
      ),
    },
    {
      id: 'slug',
      header: 'Slug',
      accessor: (row) => row.value.slug,
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
          {row.value.slug}
        </code>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: () => '',
      isSortable: false,
      render: ({ row }) => (
        <Stack direction="row" gap="100" wrap="wrap">
          {row.states.draft && <StatusBadge variant="draft" />}
          {row.states.published && <StatusBadge variant="published" />}
          {!row.states.draft && !row.states.published && <StatusBadge variant="none" />}
        </Stack>
      ),
    },
    {
      id: 'updatedAt',
      header: 'Updated',
      accessor: (row) => row.value.updatedAt,
      render: ({ row }) => (
        <Text color="neutral.11">
          {new Date(row.value.updatedAt).toLocaleString()}
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
          <Button
            variant="solid"
            size="xs"
            onPress={() => history.push(`/${row.key}/edit`, { pageName: row.value.name })}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="xs"
            onPress={() => history.push(`/${row.key}/preview`, { pageName: row.value.name })}
          >
            Preview
          </Button>
          <Button
            variant="ghost"
            colorPalette="critical"
            size="xs"
            isDisabled={deleting === row.key}
            onPress={() => void handleDelete(row)}
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
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" gap="400" alignItems="center">
            {backButton}
            <Text as="h1" fontSize="2xl" fontWeight="700">Pages</Text>
          </Stack>
          <Button variant="solid" onPress={() => setCreating(true)}>
            <Icon as={Add} /> New Page
          </Button>
        </Stack>

        {creating && (
          <Card.Root variant="outlined">
            <Card.Body>
              <Stack direction="column" gap="400">
                <Text as="h4" fontSize="xl" fontWeight="700">Create New Page</Text>
                <Stack direction="row" gap="400">
                  <div style={{ flex: 1 }}>
                    <FormField.Root isRequired>
                      <FormField.Label>Name</FormField.Label>
                      <FormField.Input>
                        <TextInput
                          value={newName}
                          onChange={(v) => setNewName(v)}
                          placeholder="Home Page"
                        />
                      </FormField.Input>
                    </FormField.Root>
                  </div>
                  <div style={{ flex: 1 }}>
                    <FormField.Root isRequired>
                      <FormField.Label>Slug</FormField.Label>
                      <FormField.Input>
                        <TextInput
                          value={newSlug}
                          onChange={(v) => setNewSlug(v)}
                          placeholder="/home"
                        />
                      </FormField.Input>
                    </FormField.Root>
                  </div>
                </Stack>
                {formError && <Text color="critical.11">{formError}</Text>}
                <Stack direction="row" gap="200">
                  <Button variant="solid" onPress={() => void handleCreate()} isDisabled={submitting}>
                    {submitting ? 'Creating…' : 'Create'}
                  </Button>
                  <Button
                    variant="outline"
                    onPress={() => { setCreating(false); setFormError(''); }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Card.Body>
          </Card.Root>
        )}

        {pages.length === 0 && !creating ? (
          <Stack direction="column" gap="400" alignItems="center">
            <Text color="neutral.11">No pages yet.</Text>
            <Button variant="solid" onPress={() => setCreating(true)}>
              <Icon as={Add} /> Create first page
            </Button>
          </Stack>
        ) : pages.length > 0 ? (
          <DataTable columns={columns} rows={rows} aria-label="Pages" />
        ) : null}
      </Stack>
    </div>
  );
};

// ---------------------------------------------------------------------------
// PageEditorRoute
// ---------------------------------------------------------------------------

interface RouteProps {
  config: Config;
  backButton?: ReactNode;
}

const PageEditorRoute: React.FC<RouteProps> = ({ config, backButton }) => {
  const { pageKey } = useParams<{ pageKey: string }>();
  const history = useHistory();
  const location = useLocation();
  const { baseURL, projectKey, businessUnitKey, jwtToken, locale } = usePuckApiContext();
  const pageName =
    (location.state as { pageName?: string } | null)?.pageName ?? pageKey ?? 'Page';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={NAV_BAR_STYLE}>
        {backButton}
        {backButton && <Text color="neutral.11">/</Text>}
        <Button variant="ghost" onPress={() => history.push('/')}>
          <Icon as={ChevronLeft} /> Pages
        </Button>
        <Text color="neutral.11">/</Text>
        <Text fontWeight="bold">{pageName}</Text>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PuckEditor
          baseURL={baseURL}
          projectKey={projectKey}
          businessUnitKey={businessUnitKey}
          jwtToken={jwtToken ?? ''}
          locale={locale}
          pageKey={pageKey!}
          config={config}
          onError={(err: Error) => { console.error('[PageManager] editor error:', err); }}
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// PagePreviewRoute
// ---------------------------------------------------------------------------

const PagePreviewRoute: React.FC<RouteProps> = ({ config, backButton }) => {
  const { pageKey } = useParams<{ pageKey: string }>();
  const history = useHistory();
  const location = useLocation();
  const pageName =
    (location.state as { pageName?: string } | null)?.pageName ?? pageKey ?? 'Page';

  return (
    <div>
      <div style={NAV_BAR_STYLE}>
        {backButton}
        {backButton && <Text color="neutral.11">/</Text>}
        <Button variant="ghost" onPress={() => history.push('/')}>
          <Icon as={ChevronLeft} /> Pages
        </Button>
        <Text color="neutral.11">/</Text>
        <Text fontWeight="bold">{pageName}</Text>
        <Badge colorPalette="primary" size="xs">Preview</Badge>
      </div>
      <PuckRenderer pageKey={pageKey} mode="preview" config={config} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Inner router component
// ---------------------------------------------------------------------------

interface PageManagerInnerProps {
  config: Config;
  backButton?: ReactNode;
}

const PageManagerInner: React.FC<PageManagerInnerProps> = ({ config, backButton }) => (
  <Switch>
    <Route exact path="/" render={() => <PageList backButton={backButton} />} />
    <Route
      path="/:pageKey/edit"
      render={() => <PageEditorRoute config={config} backButton={backButton} />}
    />
    <Route
      path="/:pageKey/preview"
      render={() => <PagePreviewRoute config={config} backButton={backButton} />}
    />
  </Switch>
);

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export interface PageManagerProps {
  /** URL path where this manager is mounted, e.g. "/pages" — used as router basename */
  parentUrl: string;
  baseURL: string;
  projectKey: string;
  businessUnitKey: string;
  jwtToken: string;
  /** Content locale (e.g. "en-US") used for locale-aware calls like product search */
  locale?: string;
  /** Puck component config — passed to editor and preview. Defaults to defaultPuckConfig. */
  config?: Config;
  /** Optional element rendered before the breadcrumb in editor/preview headers */
  backButton?: ReactNode;
}

export const PageManager: React.FC<PageManagerProps> = ({
  parentUrl,
  baseURL,
  projectKey,
  businessUnitKey,
  jwtToken,
  locale,
  config = DEFAULT_CONFIG,
  backButton,
}) => (
  <EnsureNimbusProvider locale={locale}>
    <EnsureIntlProvider>
      <PuckApiProvider
        baseURL={baseURL}
        projectKey={projectKey}
        businessUnitKey={businessUnitKey}
        jwtToken={jwtToken}
        locale={locale}
      >
        <BrowserRouter basename={parentUrl}>
          <PageManagerInner config={config} backButton={backButton} />
        </BrowserRouter>
      </PuckApiProvider>
    </EnsureIntlProvider>
  </EnsureNimbusProvider>
);
