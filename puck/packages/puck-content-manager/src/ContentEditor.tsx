import React, { useCallback } from 'react';
import { Puck, type Config, type Data } from '@measured/puck';
import '@measured/puck/puck.css';
import { PuckApiProvider, usePuckContent } from '@commercetools-demo/puck-api';
import type { PuckContentStateInfo, PuckData } from '@commercetools-demo/puck-types';

// ---------------------------------------------------------------------------
// Inline toolbar — mirrors EditorToolbar but uses PuckContentStateInfo
// ---------------------------------------------------------------------------

interface ContentToolbarProps {
  saving: boolean;
  isDirty: boolean;
  states: PuckContentStateInfo;
  onPublish: () => void;
  onRevert: () => void;
}

type BadgeVariant = 'saving' | 'unsaved' | 'draft' | 'published';

const BADGE_STYLES: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  saving:    { bg: 'rgba(251, 191, 36, 0.12)',  color: 'var(--status-saving)',    border: 'rgba(251, 191, 36, 0.3)' },
  unsaved:   { bg: 'rgba(100, 116, 139, 0.12)', color: 'var(--text-muted)',       border: 'rgba(100, 116, 139, 0.3)' },
  draft:     { bg: 'rgba(129, 140, 248, 0.12)', color: 'var(--status-draft)',     border: 'rgba(129, 140, 248, 0.3)' },
  published: { bg: 'rgba(6, 214, 160, 0.12)',   color: 'var(--status-published)', border: 'rgba(6, 214, 160, 0.3)' },
};

const StatusBadge: React.FC<{ label: string; variant: BadgeVariant }> = ({
  label,
  variant,
}) => {
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

const ContentToolbar: React.FC<ContentToolbarProps> = ({
  saving,
  isDirty,
  states,
  onPublish,
  onRevert,
}) => {
  const hasDraft = Boolean(states.draft);
  const hasPublished = Boolean(states.published);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {saving && <StatusBadge label="Saving…" variant="saving" />}
        {!saving && isDirty && <StatusBadge label="Unsaved" variant="unsaved" />}
        {!saving && !isDirty && hasDraft && (
          <StatusBadge label="Draft" variant="draft" />
        )}
        {hasPublished && <StatusBadge label="Published" variant="published" />}
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
// Inner editor component (uses context)
// ---------------------------------------------------------------------------

interface ContentEditorInnerProps {
  contentKey: string;
  config: Config;
  onPublish?: (data: PuckData) => void;
  onSave?: (data: PuckData) => void;
  onError?: (error: Error) => void;
}

const ContentEditorInner: React.FC<ContentEditorInnerProps> = ({
  contentKey,
  config,
  onPublish,
  onSave,
  onError,
}) => {
  const {
    content,
    states,
    saving,
    loading,
    error,
    isDirty,
    saveDraft,
    publish,
    revertToPublished,
  } = usePuckContent(contentKey);

  const handleChange = useCallback(
    (data: Data) => {
      saveDraft(data as PuckData)
        .then(() => onSave?.(data as PuckData))
        .catch((err: Error) => onError?.(err));
    },
    [saveDraft, onSave, onError]
  );

  const handlePublish = useCallback(
    async (data: Data) => {
      try {
        await saveDraft(data as PuckData);
        await publish(false);
        onPublish?.(data as PuckData);
      } catch (err) {
        onError?.(err as Error);
      }
    },
    [saveDraft, publish, onPublish, onError]
  );

  const handleRevert = useCallback(async () => {
    try {
      await revertToPublished();
    } catch (err) {
      onError?.(err as Error);
    }
  }, [revertToPublished, onError]);

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

  // Use draft state data if available, otherwise fall back to the main content value
  const activeData: PuckData =
    states.draft?.data ??
    content?.data ?? {
      content: [],
      root: { props: {} },
    };

  return (
    <Puck
      config={config}
      data={activeData as Data}
      onChange={handleChange}
      onPublish={handlePublish}
      overrides={{
        headerActions: () => (
          <ContentToolbar
            saving={saving}
            isDirty={isDirty}
            states={states}
            onPublish={() => void handlePublish(activeData as Data)}
            onRevert={() => void handleRevert()}
          />
        ),
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// Public component — wraps its own PuckApiProvider
// ---------------------------------------------------------------------------

export interface ContentEditorProps {
  baseURL: string;
  projectKey: string;
  businessUnitKey: string;
  jwtToken: string;
  contentKey: string;
  /** Puck component config — must match what's used in the renderer */
  config: Config;
  onPublish?: (data: PuckData) => void;
  onSave?: (data: PuckData) => void;
  onError?: (error: Error) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  baseURL,
  projectKey,
  businessUnitKey,
  jwtToken,
  contentKey,
  config,
  onPublish,
  onSave,
  onError,
}) => (
  <PuckApiProvider
    baseURL={baseURL}
    projectKey={projectKey}
    businessUnitKey={businessUnitKey}
    jwtToken={jwtToken}
  >
    <ContentEditorInner
      contentKey={contentKey}
      config={config}
      onPublish={onPublish}
      onSave={onSave}
      onError={onError}
    />
  </PuckApiProvider>
);
