import React, { useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  useHistory,
  useParams,
  useLocation,
} from 'react-router-dom';
import { Puck, type Config, type Data } from '@measured/puck';
import '@measured/puck/puck.css';
import {
  ComponentSearchProvider,
  ComponentsPanel,
  ComponentItemFilter,
  defaultPuckConfig,
  EditorToolbar,
  nimbusFieldTypes,
  UnsavedChangesDialog,
  useDirtyState,
} from '@commercetools-demo/puck-editor';
import { PuckRenderer } from '@commercetools-demo/puck-renderer';
import {
  VersionHistoryProvider,
  VersionHistoryButton,
  VersionPreviewBanner,
  VersionAwareFieldsPanel,
  useVersionHistoryPanel,
  useVersionDiff,
} from '@commercetools-demo/puck-version-history';
import { EnsureIntlProvider } from './EnsureIntlProvider';
import { EnsureNimbusProvider } from './EnsureNimbusProvider';

const DEFAULT_CONFIG: Config = {
  ...defaultPuckConfig,
  components: { ...defaultPuckConfig.components },
};
import {
  PuckApiProvider,
  usePuckContents,
  usePuckContent,
} from '@commercetools-demo/puck-api';
import type {
  CreatePuckContentInput,
  PuckContentListItem,
  PuckContentVersionEntry,
  PuckData,
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
  Stack,
  Text,
  TextInput,
  type DataTableColumnItem,
} from '@commercetools/nimbus';
import {
  Add,
  ChevronLeft,
  Close,
  Delete,
  Edit,
  Visibility,
} from '@commercetools/nimbus-icons';

// ---------------------------------------------------------------------------
// Nav bar style
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

type ContentRow = PuckContentListItem & { id: string; [key: string]: unknown };

// ---------------------------------------------------------------------------
// ContentListRoute
// ---------------------------------------------------------------------------

interface ContentListRouteProps {
  defaultContentType?: string;
  backButton?: ReactNode;
}

const ContentListRoute: React.FC<ContentListRouteProps> = ({ defaultContentType, backButton }) => {
  const history = useHistory();
  const { contents, loading, error, createContent, deleteContent } =
    usePuckContents(defaultContentType);

  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createType, setCreateType] = useState(defaultContentType ?? '');
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
      const input: CreatePuckContentInput = {
        name: createName.trim(),
        contentType: createType.trim(),
        data: { content: [], root: { props: {} } },
      };
      const created = await createContent(input);
      setShowCreate(false);
      setCreateName('');
      setCreateType(defaultContentType ?? '');
      history.push(`/${created.key}`, { contentName: created.value.name });
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
            onPress={() => history.push(`/${row.key}`, { contentName: row.value.name })}
          >
            <Edit />
          </IconButton>
          <IconButton
            aria-label={`Preview ${row.value.name}`}
            variant="ghost"
            size="xs"
            onPress={() =>
              history.push(`/${row.key}/preview`, { contentName: row.value.name })
            }
          >
            <Visibility />
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
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" gap="400" alignItems="center">
            {backButton}
            <Text as="h1" fontSize="2xl" fontWeight="700">Content Items</Text>
          </Stack>
          <Button variant="solid" onPress={() => setShowCreate((v) => !v)}>
            <Icon as={Add} /> New Content
          </Button>
        </Stack>

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
// ContentEditorRoute
// ---------------------------------------------------------------------------

interface ContentEditorRouteProps {
  config: Config;
  backButton?: ReactNode;
}

const ContentEditorRoute: React.FC<ContentEditorRouteProps> = ({ config, backButton }) => {
  const { contentKey } = useParams<{ contentKey: string }>();
  const history = useHistory();
  const location = useLocation();
  const contentName =
    (location.state as { contentName?: string } | null)?.contentName ?? contentKey ?? 'Content';

  const {
    content,
    states,
    versions,
    saving,
    loading,
    error,
    saveDraft,
    publish,
    revertToPublished,
    loadVersions,
  } = usePuckContent(contentKey!);

  const latestDataRef = useRef<Data | null>(null);
  const [isApplyingVersion, setIsApplyingVersion] = useState(false);
  // Bumped on revert so the Puck canvas remounts and re-reads the restored data.
  const [reloadNonce, setReloadNonce] = useState(0);
  // Deferred navigation while the unsaved-changes dialog is open.
  const [pendingNav, setPendingNav] = useState<(() => void) | null>(null);

  const currentData: PuckData =
    states.draft?.data ??
    content?.data ?? { content: [], root: { props: {} } };

  const versionHistory = useVersionHistoryPanel({
    versions: versions as PuckContentVersionEntry[],
    loadVersions,
    currentData,
  });

  const diff = useVersionDiff(versionHistory.previewData, currentData);

  const isPreviewingRef = useRef(false);
  isPreviewingRef.current = versionHistory.isPreviewingHistory;

  // Unsaved-changes tracking — keyed so a new content item / version / revert
  // gets a fresh baseline (and ignores Puck's normalising onChange on mount).
  const canvasKey = `${contentKey}:${versionHistory.selectedVersionId ?? 'current'}:${reloadNonce}`;
  const { isDirty: hasUnsavedChanges, markChange, markSaved } =
    useDirtyState(canvasKey);

  const guardedNavigate = useCallback(
    (navFn: () => void) => {
      if (hasUnsavedChanges) {
        setPendingNav(() => navFn);
      } else {
        navFn();
      }
    },
    [hasUnsavedChanges]
  );

  const handleChange = useCallback(
    (data: Data) => {
      if (isPreviewingRef.current) return;
      latestDataRef.current = data;
      markChange(data);
    },
    [markChange]
  );

  const handleSave = useCallback(async () => {
    const data = latestDataRef.current;
    if (!data) return;
    try {
      await saveDraft(data as PuckData);
      markSaved(data);
    } catch (err) {
      console.error('[ContentManagerRouter] save error:', err);
    }
  }, [saveDraft, markSaved]);

  const handlePublish = useCallback(
    async (data: Data) => {
      try {
        await saveDraft(data as PuckData);
        markSaved(data);
        await publish(false);
      } catch (err) {
        console.error('[ContentManagerRouter] publish error:', err);
      }
    },
    [saveDraft, publish, markSaved]
  );

  const handleRevert = useCallback(async () => {
    try {
      await revertToPublished();
      setReloadNonce((n) => n + 1);
    } catch (err) {
      console.error('[ContentManagerRouter] revert error:', err);
    }
  }, [revertToPublished]);

  const handleApplyVersion = useCallback(async () => {
    const versionData = versionHistory.previewData;
    if (!versionData) return;
    setIsApplyingVersion(true);
    try {
      await saveDraft(versionData);
      markSaved(versionData);
      versionHistory.clearSelection();
    } catch (err) {
      console.error('[ContentManagerRouter] apply version error:', err);
    } finally {
      setIsApplyingVersion(false);
    }
  }, [versionHistory, saveDraft, markSaved]);

  const contentConfig = useMemo((): Config => {
    const otherRootFields = Object.fromEntries(
      Object.entries(config.root?.fields ?? {}).filter(([k]) => k !== 'title')
    );
    return {
      ...config,
      root: {
        ...config.root,
        fields: {
          title: { type: 'text', label: 'Content Title' },
          slot: { type: 'text', label: 'Slot' },
          ...otherRootFields,
        },
        defaultProps: {
          title: 'New Content',
          slot: '',
          ...config.root?.defaultProps,
        },
      },
    };
  }, [config]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Stack direction="column" gap="400" alignItems="center">
          <LoadingSpinner />
          <Text color="neutral.11">Loading editor…</Text>
        </Stack>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '32px' }}>
        <Text color="critical.11"><strong>Error loading content:</strong> {error}</Text>
      </div>
    );
  }

  const activeData: PuckData = versionHistory.previewData ?? currentData;
  const toolbarStates = states as unknown as Parameters<typeof EditorToolbar>[0]['states'];

  return (
    <VersionHistoryProvider
      diff={diff}
      isPreviewingHistory={versionHistory.isPreviewingHistory}
      versions={versions as PuckContentVersionEntry[]}
      isLoadingVersions={versionHistory.isLoadingVersions}
      selectedVersionId={versionHistory.selectedVersionId}
      isApplying={isApplyingVersion}
      onVersionSelect={versionHistory.selectVersion}
      onApply={() => void handleApplyVersion()}
      onDiscard={versionHistory.clearSelection}
      onLoadVersions={versionHistory.openPanel}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={NAV_BAR_STYLE}>
          {backButton}
          {backButton && <Text color="neutral.11">/</Text>}
          <Button
            variant="ghost"
            onPress={() => guardedNavigate(() => history.push('/'))}
          >
            <Icon as={ChevronLeft} /> Content Items
          </Button>
          <Text color="neutral.11">/</Text>
          <Text fontWeight="bold">{contentName}</Text>
        </div>
        <div className="puck-editor-fill" style={{ flex: 1, overflow: 'hidden' }}>
          <ComponentSearchProvider>
            <Puck
              key={`${versionHistory.selectedVersionId ?? 'current'}:${reloadNonce}`}
              config={contentConfig}
              data={activeData as Data}
              onChange={handleChange}
              onPublish={handlePublish}
              overrides={{
                fieldTypes: nimbusFieldTypes,
                header: () =>
                  versionHistory.isPreviewingHistory ? (
                    <Stack
                      gridArea="header"
                      direction="row"
                      gap="200"
                      alignItems="center"
                      justifyContent="flex-end"
                      padding="200"
                    >
                      <VersionPreviewBanner
                        timestamp={versionHistory.selectedVersion!.timestamp}
                        onApply={() => void handleApplyVersion()}
                        onDiscard={versionHistory.clearSelection}
                        isApplying={isApplyingVersion}
                      />
                      <VersionHistoryButton disabled={isApplyingVersion} />
                    </Stack>
                  ) : (
                    <EditorToolbar
                      title={content?.name ?? contentName}
                      saving={saving}
                      isDirty={hasUnsavedChanges}
                      states={toolbarStates}
                      onSave={() => void handleSave()}
                      onPublish={() => void handlePublish(activeData as Data)}
                      onRevert={() => void handleRevert()}
                      onPreview={() =>
                        guardedNavigate(() =>
                          history.push(`/${contentKey}/preview`, { contentName })
                        )
                      }
                      showPublishButton
                    />
                  ),
                components: ({ children }) => <ComponentsPanel>{children}</ComponentsPanel>,
                componentItem: ({ children, name }) => (
                  <ComponentItemFilter name={name}>{children}</ComponentItemFilter>
                ),
                fields: ({ children, isLoading }) => (
                  <VersionAwareFieldsPanel isLoading={isLoading}>
                    {children}
                  </VersionAwareFieldsPanel>
                ),
              }}
            />
          </ComponentSearchProvider>
        </div>
      </div>
      <UnsavedChangesDialog
        isOpen={pendingNav !== null}
        onOpenChange={(open) => {
          if (!open) setPendingNav(null);
        }}
        onConfirm={() => pendingNav?.()}
      />
    </VersionHistoryProvider>
  );
};

// ---------------------------------------------------------------------------
// ContentPreviewRoute
// ---------------------------------------------------------------------------

const ContentPreviewRoute: React.FC<ContentEditorRouteProps> = ({ config, backButton }) => {
  const { contentKey } = useParams<{ contentKey: string }>();
  const history = useHistory();
  const location = useLocation();
  const contentName =
    (location.state as { contentName?: string } | null)?.contentName ?? contentKey ?? 'Content';

  return (
    <div>
      <div style={NAV_BAR_STYLE}>
        {backButton}
        {backButton && <Text color="neutral.11">/</Text>}
        <Button variant="ghost" onPress={() => history.push('/')}>
          <Icon as={ChevronLeft} /> Content Items
        </Button>
        <Text color="neutral.11">/</Text>
        <Button
          variant="ghost"
          onPress={() => history.push(`/${contentKey}`, { contentName })}
        >
          {contentName}
        </Button>
        <Badge colorPalette="primary" size="xs">Preview</Badge>
        <div style={{ marginLeft: 'auto' }}>
          <Button variant="outline" size="xs" onPress={() => history.goBack()}>
            <Icon as={Close} /> Close preview
          </Button>
        </div>
      </div>
      <PuckRenderer type="content" contentKey={contentKey} mode="preview" config={config} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Inner router component
// ---------------------------------------------------------------------------

interface ContentManagerRouterInnerProps {
  config: Config;
  defaultContentType?: string;
  backButton?: ReactNode;
}

const ContentManagerRouterInner: React.FC<ContentManagerRouterInnerProps> = ({
  config,
  defaultContentType,
  backButton,
}) => (
  <Switch>
    <Route
      exact
      path="/"
      render={() => (
        <ContentListRoute defaultContentType={defaultContentType} backButton={backButton} />
      )}
    />
    {/* Preview must precede the catch-all editor route ("/:contentKey" also
        matches "/:contentKey/preview" because it is not exact). */}
    <Route
      path="/:contentKey/preview"
      render={() => <ContentPreviewRoute config={config} backButton={backButton} />}
    />
    <Route
      path="/:contentKey"
      render={() => <ContentEditorRoute config={config} backButton={backButton} />}
    />
  </Switch>
);

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export interface ContentManagerProps {
  /** URL path where this manager is mounted, e.g. "/content" — used as router basename */
  parentUrl: string;
  baseURL: string;
  projectKey: string;
  businessUnitKey: string;
  jwtToken: string;
  /** Content locale (e.g. "en-US") used for locale-aware calls like product search */
  locale?: string;
  /** Puck component config — must match what's used in the renderer. Defaults to defaultPuckConfig. */
  config?: Config;
  defaultContentType?: string;
  /** Optional element rendered before the breadcrumb in the editor header */
  backButton?: ReactNode;
}

export const ContentManager: React.FC<ContentManagerProps> = ({
  parentUrl,
  baseURL,
  projectKey,
  businessUnitKey,
  jwtToken,
  locale,
  config = DEFAULT_CONFIG,
  defaultContentType,
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
          <ContentManagerRouterInner
            config={config}
            defaultContentType={defaultContentType}
            backButton={backButton}
          />
        </BrowserRouter>
      </PuckApiProvider>
    </EnsureIntlProvider>
  </EnsureNimbusProvider>
);
