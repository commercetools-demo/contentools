import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Puck, type Config, type Data } from '@measured/puck';
import '@measured/puck/puck.css';
import { PuckApiProvider, usePuckContent } from '@commercetools-demo/puck-api';
import type { PuckContentStateInfo, PuckContentVersionEntry, PuckData } from '@commercetools-demo/puck-types';
import {
  ComponentSearchProvider,
  ComponentsPanel,
  ComponentItemFilter,
} from '@commercetools-demo/puck-editor';
import {
  VersionHistoryProvider,
  VersionHistoryPanel,
  VersionHistoryButton,
  VersionPreviewBanner,
  VersionAwareFieldsPanel,
  useVersionHistoryPanel,
  useVersionDiff,
} from '@commercetools-demo/puck-version-history';

// ---------------------------------------------------------------------------
// Inline toolbar — shown during normal editing (no version preview)
// ---------------------------------------------------------------------------

interface ContentToolbarProps {
  saving: boolean;
  isDirty: boolean;
  states: PuckContentStateInfo;
  onSave: () => void;
  onPublish: () => void;
  onRevert: () => void;
  onVersionHistory: () => void;
  isVersionHistoryActive: boolean;
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
  onSave,
  onPublish,
  onRevert,
  onVersionHistory,
  isVersionHistoryActive,
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

      {/* Version history toggle */}
      <VersionHistoryButton
        onClick={onVersionHistory}
        isActive={isVersionHistoryActive}
        disabled={saving}
      />
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
    versions,
    saving,
    loading,
    error,
    saveDraft,
    publish,
    revertToPublished,
    loadVersions,
  } = usePuckContent(contentKey);

  const latestDataRef = useRef<Data | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isApplyingVersion, setIsApplyingVersion] = useState(false);

  // Current live data (draft preferred, fallback to content value)
  const currentData: PuckData =
    states.draft?.data ??
    content?.data ?? {
      content: [],
      root: { props: {} },
    };

  // Version history panel state
  const versionHistory = useVersionHistoryPanel({
    versions: versions as PuckContentVersionEntry[],
    loadVersions,
    currentData,
  });

  // Diff between selected historical version and current draft
  const diff = useVersionDiff(
    versionHistory.previewData,
    currentData
  );

  // Ref so handleChange can read the latest preview state without stale closure
  const isPreviewingRef = useRef(false);
  isPreviewingRef.current = versionHistory.isPreviewingHistory;

  // -------------------------------------------------------------------------
  // Normal editor handlers
  // -------------------------------------------------------------------------

  const handleChange = useCallback((data: Data) => {
    // Puck fires onChange on remount; ignore it while previewing a version
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
      onSave?.(data as PuckData);
    } catch (err) {
      onError?.(err as Error);
    }
  }, [saveDraft, onSave, onError]);

  const handlePublish = useCallback(
    async (data: Data) => {
      try {
        await saveDraft(data as PuckData);
        setHasUnsavedChanges(false);
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
      setHasUnsavedChanges(false);
    } catch (err) {
      onError?.(err as Error);
    }
  }, [revertToPublished, onError]);

  // -------------------------------------------------------------------------
  // Version history handlers
  // -------------------------------------------------------------------------

  const handleApplyVersion = useCallback(async () => {
    // Read data before closing the panel so selectedVersionId stays set
    // until the save resolves. Puck will then remount with the freshly-saved
    // currentData when closePanel() finally nulls out selectedVersionId.
    const versionData = versionHistory.previewData;
    if (!versionData) return;
    setIsApplyingVersion(true);
    try {
      await saveDraft(versionData);
      setHasUnsavedChanges(false);
      onSave?.(versionData);
      // Close panel AFTER save so currentData is up-to-date when Puck remounts
      versionHistory.closePanel();
    } catch (err) {
      onError?.(err as Error);
    } finally {
      setIsApplyingVersion(false);
    }
  }, [versionHistory, saveDraft, onSave, onError]);

  // -------------------------------------------------------------------------
  // Content-specific Puck config: inject title + slot root fields
  // -------------------------------------------------------------------------

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

  // Data shown in Puck canvas — historical preview takes precedence
  const activeData: PuckData = versionHistory.previewData ?? currentData;

  return (
    <VersionHistoryProvider
      diff={diff}
      isPreviewingHistory={versionHistory.isPreviewingHistory}
    >
      {/* Version history side panel */}
      <VersionHistoryPanel
        isOpen={versionHistory.isPanelOpen}
        versions={versions as PuckContentVersionEntry[]}
        isLoading={versionHistory.isLoadingVersions}
        selectedVersionId={versionHistory.selectedVersionId}
        diff={diff}
        isPreviewingHistory={versionHistory.isPreviewingHistory}
        onVersionSelect={versionHistory.selectVersion}
        onApply={() => void handleApplyVersion()}
        onDiscard={versionHistory.clearSelection}
        onClose={versionHistory.closePanel}
        isApplying={isApplyingVersion}
      />

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <VersionPreviewBanner
                    timestamp={versionHistory.selectedVersion!.timestamp}
                    onApply={() => void handleApplyVersion()}
                    onDiscard={versionHistory.clearSelection}
                    isApplying={isApplyingVersion}
                  />
                  {/* Keep history button accessible during preview */}
                  <button
                    onClick={versionHistory.closePanel}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: '1px solid rgba(129, 140, 248, 0.6)',
                      background: 'rgba(129, 140, 248, 0.15)',
                      color: 'var(--status-draft, #818cf8)',
                      fontWeight: 500,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    History
                  </button>
                </div>
              ) : (
                <ContentToolbar
                  saving={saving}
                  isDirty={hasUnsavedChanges}
                  states={states}
                  onSave={() => void handleSave()}
                  onPublish={() => void handlePublish(activeData as Data)}
                  onRevert={() => void handleRevert()}
                  onVersionHistory={() => void versionHistory.openPanel()}
                  isVersionHistoryActive={versionHistory.isPanelOpen}
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
    </VersionHistoryProvider>
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
