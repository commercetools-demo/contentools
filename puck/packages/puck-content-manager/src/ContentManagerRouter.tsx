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
} from '@commercetools-demo/puck-editor';
import {
  PuckApiProvider,
  usePuckContents,
  usePuckContent,
} from '@commercetools-demo/puck-api';
import type {
  CreatePuckContentInput,
  PuckContentListItem,
  PuckContentStateInfo,
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
import { PlusThinIcon, SearchIcon, AngleLeftIcon } from '@commercetools-uikit/icons';

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
// Content toolbar (status badges + publish/revert buttons)
// ---------------------------------------------------------------------------

type BadgeVariant = 'saving' | 'unsaved' | 'draft' | 'published';

const BADGE_STYLES: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  saving:    { bg: 'rgba(251, 191, 36, 0.12)',  color: 'var(--status-saving)',    border: 'rgba(251, 191, 36, 0.3)' },
  unsaved:   { bg: 'rgba(100, 116, 139, 0.12)', color: 'var(--text-muted)',       border: 'rgba(100, 116, 139, 0.3)' },
  draft:     { bg: 'rgba(129, 140, 248, 0.12)', color: 'var(--status-draft)',     border: 'rgba(129, 140, 248, 0.3)' },
  published: { bg: 'rgba(6, 214, 160, 0.12)',   color: 'var(--status-published)', border: 'rgba(6, 214, 160, 0.3)' },
};

const EditorStatusBadge: React.FC<{ label: string; variant: BadgeVariant }> = ({ label, variant }) => {
  const bs = BADGE_STYLES[variant];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        background: bs.bg,
        color: bs.color,
        border: `1px solid ${bs.border}`,
      }}
    >
      {label}
    </span>
  );
};

interface ContentToolbarProps {
  saving: boolean;
  isDirty: boolean;
  states: PuckContentStateInfo;
  onSave: () => void;
  onPublish: () => void;
  onRevert: () => void;
}

const ContentToolbar: React.FC<ContentToolbarProps> = ({ saving, isDirty, states, onSave, onPublish, onRevert }) => {
  const hasDraft = Boolean(states.draft);
  const hasPublished = Boolean(states.published);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {saving && <EditorStatusBadge label="Saving…" variant="saving" />}
        {!saving && isDirty && <EditorStatusBadge label="Unsaved" variant="unsaved" />}
        {!saving && !isDirty && hasDraft && <EditorStatusBadge label="Draft" variant="draft" />}
        {hasPublished && <EditorStatusBadge label="Published" variant="published" />}
      </div>
      {hasDraft && hasPublished && (
        <button
          onClick={onRevert}
          disabled={saving}
          style={{
            padding: '6px 14px',
            borderRadius: '4px',
            border: '1px solid var(--border-glow)',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontWeight: 500,
            fontSize: '13px',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.5 : 1,
          }}
        >
          Revert to Published
        </button>
      )}
      <button
        onClick={onSave}
        disabled={!isDirty || saving}
        style={{
          padding: '6px 14px',
          borderRadius: '4px',
          border: '1px solid var(--border-glow)',
          background: 'transparent',
          color: 'var(--text-muted)',
          fontWeight: 500,
          fontSize: '13px',
          cursor: (!isDirty || saving) ? 'not-allowed' : 'pointer',
          opacity: (!isDirty || saving) ? 0.4 : 1,
        }}
      >
        Save
      </button>
      <button
        onClick={onPublish}
        disabled={saving}
        style={{
          padding: '6px 16px',
          borderRadius: '4px',
          border: '1px solid var(--accent-cyan)',
          background: 'rgba(0, 212, 255, 0.1)',
          color: 'var(--accent-cyan)',
          fontWeight: 600,
          fontSize: '13px',
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.5 : 1,
          boxShadow: '0 0 12px rgba(0, 212, 255, 0.15)',
        }}
      >
        {hasPublished ? 'Re-publish' : 'Publish'}
      </button>
    </div>
  );
};

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
    saving,
    loading,
    error,
    saveDraft,
    publish,
    revertToPublished,
  } = usePuckContent(contentKey!);

  const latestDataRef = useRef<Data | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleChange = useCallback((data: Data) => {
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

  // Override root fields with content-specific labels and add slot field.
  // Stored in content.data.root.props (title, slot, backgroundColor, etc.).
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontSize: '16px',
          color: 'var(--text-muted)',
        }}
      >
        Loading editor…
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '32px',
          color: 'var(--status-error)',
          background: 'rgba(248, 113, 113, 0.08)',
          border: '1px solid rgba(248, 113, 113, 0.25)',
          borderRadius: '8px',
          margin: '16px',
        }}
      >
        <strong>Error loading content:</strong> {error}
      </div>
    );
  }

  const activeData: PuckData =
    states.draft?.data ??
    content?.data ?? {
      content: [],
      root: { props: {} },
    };

  return (
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
        <Text.Body isBold>{contentName}</Text.Body>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ComponentSearchProvider>
          <Puck
            config={contentConfig}
            data={activeData as Data}
            onChange={handleChange}
            onPublish={handlePublish}
            overrides={{
              headerActions: () => (
                <ContentToolbar
                  saving={saving}
                  isDirty={hasUnsavedChanges}
                  states={states}
                  onSave={() => void handleSave()}
                  onPublish={() => void handlePublish(activeData as Data)}
                  onRevert={() => void handleRevert()}
                />
              ),
              components: ({ children }) => <ComponentsPanel>{children}</ComponentsPanel>,
              componentItem: ({ children, name }) => (
                <ComponentItemFilter name={name}>{children}</ComponentItemFilter>
              ),
            }}
          />
        </ComponentSearchProvider>
      </div>
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
    <Route
      path="/:contentKey"
      render={() => <ContentEditorRoute config={config} backButton={backButton} />}
    />
  </Switch>
);

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export interface ContentManagerRouterProps {
  /** URL path where this manager is mounted, e.g. "/content" — used as router basename */
  parentUrl: string;
  baseURL: string;
  projectKey: string;
  businessUnitKey: string;
  jwtToken: string;
  /** Puck component config — must match what's used in the renderer */
  config: Config;
  defaultContentType?: string;
  /** Optional element rendered before the breadcrumb in the editor header */
  backButton?: ReactNode;
}

export const ContentManagerRouter: React.FC<ContentManagerRouterProps> = ({
  parentUrl,
  baseURL,
  projectKey,
  businessUnitKey,
  jwtToken,
  config,
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
