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
} from '@commercetools-demo/puck-editor';
import {
  VersionHistoryProvider,
  VersionHistoryButton,
  VersionPreviewBanner,
  VersionAwareFieldsPanel,
  useVersionHistoryPanel,
  useVersionDiff,
} from '@commercetools-demo/puck-version-history';

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
import Stamp from '@commercetools-uikit/stamp';
import { PlusThinIcon, SearchIcon, AngleLeftIcon } from '@commercetools-uikit/icons';

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
  borderBottom: '1px solid var(--color-neutral-90)',
  zIndex: 200,
  flexShrink: 0,
};

// ---------------------------------------------------------------------------
// Table columns
// ---------------------------------------------------------------------------

type ContentRow = PuckContentListItem & { id: string };

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'contentType', label: 'Content Type' },
  { key: 'status', label: 'Status' },
  { key: 'updatedAt', label: 'Updated' },
  { key: 'actions', label: 'Actions', shouldIgnoreRowClick: true },
];

// ---------------------------------------------------------------------------
// ContentListRoute
// ---------------------------------------------------------------------------

interface ContentListRouteProps {
  defaultContentType?: string;
  backButton?: ReactNode;
}

const ContentListRoute: React.FC<ContentListRouteProps> = ({ defaultContentType, backButton }) => {
  const history = useHistory();
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
        <Spacings.Inline justifyContent="space-between" alignItems="center">
          <Spacings.Inline scale="m" alignItems="center">
            {backButton}
            <Text.Headline as="h1">Content Items</Text.Headline>
          </Spacings.Inline>
          <PrimaryButton
            label="New Content"
            iconLeft={<PlusThinIcon />}
            onClick={() => setShowCreate((v) => !v)}
          />
        </Spacings.Inline>

        {showCreate && (
          <Card insetScale="l">
            <Spacings.Stack scale="m">
              <Text.Subheadline as="h4" isBold>Create Content Item</Text.Subheadline>
              {createError && <Text.Body tone="negative">{createError}</Text.Body>}
              <Spacings.Inline scale="m">
                <div style={{ flex: 1 }}>
                  <Spacings.Stack scale="xs">
                    <Label htmlFor="create-content-name">Name</Label>
                    <TextInput
                      id="create-content-name"
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      placeholder="e.g. Homepage Hero"
                    />
                  </Spacings.Stack>
                </div>
                <div style={{ flex: 1 }}>
                  <Spacings.Stack scale="xs">
                    <Label htmlFor="create-content-type">Content Type</Label>
                    <TextInput
                      id="create-content-type"
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
            columns={COLUMNS}
            rows={rows}
            itemRenderer={(row: ContentRow, column) => {
              switch (column.key) {
                case 'name':
                  return <Text.Body fontWeight="bold">{row.value.name}</Text.Body>;
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
                    <span style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap' }}>
                      {hasDraft && <Stamp tone="warning" label="Draft" isCondensed />}
                      {hasPublished && <Stamp tone="positive" label="Published" isCondensed />}
                      {!hasDraft && !hasPublished && <Stamp tone="secondary" label="No state" isCondensed />}
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
                    <Spacings.Inline scale="s" alignItems="center">
                      <PrimaryButton
                        label="Edit"
                        size="20"
                        onClick={() =>
                          history.push(`/${row.key}`, { contentName: row.value.name })
                        }
                      />
                      <FlatButton
                        tone="critical"
                        label={deleting === row.key ? '…' : 'Delete'}
                        isDisabled={deleting === row.key}
                        onClick={() => void handleDelete(row.key)}
                      />
                    </Spacings.Inline>
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isApplyingVersion, setIsApplyingVersion] = useState(false);

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

  const handleChange = useCallback((data: Data) => {
    if (isPreviewingRef.current) return;
    latestDataRef.current = data;
    setHasUnsavedChanges(true);
  }, []);

  const handleSave = useCallback(async () => {
    const data = latestDataRef.current;
    if (!data) return;
    try {
      await saveDraft(data as PuckData);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('[ContentManagerRouter] save error:', err);
    }
  }, [saveDraft]);

  const handlePublish = useCallback(
    async (data: Data) => {
      try {
        await saveDraft(data as PuckData);
        setHasUnsavedChanges(false);
        await publish(false);
      } catch (err) {
        console.error('[ContentManagerRouter] publish error:', err);
      }
    },
    [saveDraft, publish]
  );

  const handleRevert = useCallback(async () => {
    try {
      await revertToPublished();
      setHasUnsavedChanges(false);
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
      setHasUnsavedChanges(false);
      versionHistory.clearSelection();
    } catch (err) {
      console.error('[ContentManagerRouter] apply version error:', err);
    } finally {
      setIsApplyingVersion(false);
    }
  }, [versionHistory, saveDraft]);

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
        <Spacings.Stack scale="m" alignItems="center">
          <LoadingSpinner />
          <Text.Body tone="secondary">Loading editor…</Text.Body>
        </Spacings.Stack>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '32px' }}>
        <Text.Body tone="negative"><strong>Error loading content:</strong> {error}</Text.Body>
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
          {backButton && <Text.Body tone="secondary">/</Text.Body>}
          <FlatButton
            label="Content Items"
            icon={<AngleLeftIcon />}
            iconPosition="left"
            onClick={() => history.push('/')}
          />
          <Text.Body tone="secondary">/</Text.Body>
          <Text.Body fontWeight="bold">{contentName}</Text.Body>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <ComponentSearchProvider>
            <Puck
              key={versionHistory.selectedVersionId ?? 'current'}
              config={contentConfig}
              data={activeData as Data}
              onChange={handleChange}
              onPublish={handlePublish}
              overrides={{
                headerActions: () =>
                  versionHistory.isPreviewingHistory ? (
                    <Spacings.Inline scale="s" alignItems="center">
                      <VersionPreviewBanner
                        timestamp={versionHistory.selectedVersion!.timestamp}
                        onApply={() => void handleApplyVersion()}
                        onDiscard={versionHistory.clearSelection}
                        isApplying={isApplyingVersion}
                      />
                      <VersionHistoryButton disabled={isApplyingVersion} />
                    </Spacings.Inline>
                  ) : (
                    <EditorToolbar
                      saving={saving}
                      isDirty={hasUnsavedChanges}
                      states={toolbarStates}
                      onSave={() => void handleSave()}
                      onPublish={() => void handlePublish(activeData as Data)}
                      onRevert={() => void handleRevert()}
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
    </VersionHistoryProvider>
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
  config = DEFAULT_CONFIG,
  defaultContentType,
  backButton,
}) => (
  <PuckApiProvider
    baseURL={baseURL}
    projectKey={projectKey}
    businessUnitKey={businessUnitKey}
    jwtToken={jwtToken}
  >
    <BrowserRouter basename={parentUrl}>
      <ContentManagerRouterInner
        config={config}
        defaultContentType={defaultContentType}
        backButton={backButton}
      />
    </BrowserRouter>
  </PuckApiProvider>
);
