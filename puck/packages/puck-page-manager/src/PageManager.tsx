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
import { PuckEditor } from '@commercetools-demo/puck-editor';
import { PuckRenderer } from '@commercetools-demo/puck-renderer';
import type { Config } from '@measured/puck';
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
import { PlusThinIcon, AngleLeftIcon } from '@commercetools-uikit/icons';

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
  borderBottom: '1px solid var(--color-neutral-90)',
  zIndex: 200,
  flexShrink: 0,
};

// ---------------------------------------------------------------------------
// Table columns
// ---------------------------------------------------------------------------

type PageRow = PuckPageListItem & { id: string };

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'status', label: 'Status' },
  { key: 'updatedAt', label: 'Updated' },
  { key: 'actions', label: 'Actions', shouldIgnoreRowClick: true },
];

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
        <Text.Body tone="negative">Error: {error}</Text.Body>
      </div>
    );
  }

  const rows: PageRow[] = pages.map((p: PuckPageListItem) => ({ ...p, id: p.key }));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <Spacings.Stack scale="l">
        <Spacings.Inline justifyContent="space-between" alignItems="center">
          <Spacings.Inline scale="m" alignItems="center">
            {backButton}
            <Text.Headline as="h1">Puck Pages</Text.Headline>
          </Spacings.Inline>
          <PrimaryButton
            label="New Page"
            iconLeft={<PlusThinIcon />}
            onClick={() => setCreating(true)}
          />
        </Spacings.Inline>

        {creating && (
          <Card insetScale="l">
            <Spacings.Stack scale="m">
              <Text.Subheadline as="h4" isBold>Create New Page</Text.Subheadline>
              <Spacings.Inline scale="m">
                <div style={{ flex: 1 }}>
                  <Spacings.Stack scale="xs">
                    <Label htmlFor="new-page-name">Name *</Label>
                    <TextInput
                      id="new-page-name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Home Page"
                    />
                  </Spacings.Stack>
                </div>
                <div style={{ flex: 1 }}>
                  <Spacings.Stack scale="xs">
                    <Label htmlFor="new-page-slug">Slug *</Label>
                    <TextInput
                      id="new-page-slug"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      placeholder="/home"
                    />
                  </Spacings.Stack>
                </div>
              </Spacings.Inline>
              {formError && <Text.Body tone="negative">{formError}</Text.Body>}
              <Spacings.Inline scale="s">
                <PrimaryButton
                  label={submitting ? 'Creating…' : 'Create'}
                  onClick={() => void handleCreate()}
                  isDisabled={submitting}
                />
                <SecondaryButton
                  label="Cancel"
                  onClick={() => { setCreating(false); setFormError(''); }}
                />
              </Spacings.Inline>
            </Spacings.Stack>
          </Card>
        )}

        {pages.length === 0 && !creating ? (
          <Spacings.Stack scale="m" alignItems="center">
            <Text.Body tone="secondary">No pages yet.</Text.Body>
            <PrimaryButton
              label="Create first page"
              iconLeft={<PlusThinIcon />}
              onClick={() => setCreating(true)}
            />
          </Spacings.Stack>
        ) : pages.length > 0 ? (
          <DataTable
            columns={COLUMNS}
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
                      {!row.states.draft && !row.states.published && <StatusBadge variant="none" />}
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
                      <PrimaryButton
                        label="Edit"
                        size="20"
                        onClick={() =>
                          history.push(`/${row.key}/edit`, { pageName: row.value.name })
                        }
                      />
                      <SecondaryButton
                        label="Preview"
                        size="20"
                        onClick={() =>
                          history.push(`/${row.key}/preview`, { pageName: row.value.name })
                        }
                      />
                      <FlatButton
                        tone="critical"
                        label={deleting === row.key ? '…' : 'Delete'}
                        isDisabled={deleting === row.key}
                        onClick={() => void handleDelete(row)}
                      />
                    </div>
                  );
                default:
                  return null;
              }
            }}
          />
        ) : null}
      </Spacings.Stack>
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
  const { baseURL, projectKey, businessUnitKey, jwtToken } = usePuckApiContext();
  const pageName =
    (location.state as { pageName?: string } | null)?.pageName ?? pageKey ?? 'Page';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={NAV_BAR_STYLE}>
        {backButton}
        {backButton && <Text.Body tone="secondary">/</Text.Body>}
        <FlatButton
          label="Pages"
          icon={<AngleLeftIcon />}
          iconPosition="left"
          onClick={() => history.push('/')}
        />
        <Text.Body tone="secondary">/</Text.Body>
        <Text.Body isBold>{pageName}</Text.Body>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PuckEditor
          baseURL={baseURL}
          projectKey={projectKey}
          businessUnitKey={businessUnitKey}
          jwtToken={jwtToken ?? ''}
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
        {backButton && <Text.Body tone="secondary">/</Text.Body>}
        <FlatButton
          label="Pages"
          icon={<AngleLeftIcon />}
          iconPosition="left"
          onClick={() => history.push('/')}
        />
        <Text.Body tone="secondary">/</Text.Body>
        <Text.Body isBold>{pageName}</Text.Body>
        <span
          style={{
            background: 'var(--color-primary-95)',
            color: 'var(--color-primary-25)',
            border: '1px solid var(--color-primary-85)',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 10px',
            borderRadius: 'var(--border-radius-20)',
            fontSize: 'var(--font-size-10)',
            fontWeight: 'var(--font-weight-600)',
          }}
        >
          Preview
        </span>
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
  /** Puck component config — passed to editor and preview */
  config: Config;
  /** Optional element rendered before the breadcrumb in editor/preview headers */
  backButton?: ReactNode;
}

export const PageManager: React.FC<PageManagerProps> = ({
  parentUrl,
  baseURL,
  projectKey,
  businessUnitKey,
  jwtToken,
  config,
  backButton,
}) => (
  <PuckApiProvider
    baseURL={baseURL}
    projectKey={projectKey}
    businessUnitKey={businessUnitKey}
    jwtToken={jwtToken}
  >
    <BrowserRouter basename={parentUrl}>
      <PageManagerInner config={config} backButton={backButton} />
    </BrowserRouter>
  </PuckApiProvider>
);
