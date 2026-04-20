import React, { useCallback, useRef, useState } from 'react';
import { Puck, type Config, type Data } from '@measured/puck';
import '@measured/puck/puck.css';
import { PuckApiProvider, usePuckPage } from '@commercetools-demo/puck-api';
import type { PuckData } from '@commercetools-demo/puck-types';
import type { PuckPageVersionEntry } from '@commercetools-demo/puck-types';
import {
  VersionHistoryProvider,
  VersionPreviewBanner,
  VersionAwareFieldsPanel,
  VersionHistoryButton,
  useVersionHistoryPanel,
  useVersionDiff,
} from '@commercetools-demo/puck-version-history';
import { defaultPuckConfig } from './config/defaultPuckConfig';
import { EditorToolbar } from './toolbar/EditorToolbar';
import {
  ComponentSearchProvider,
  ComponentsPanel,
  ComponentItemFilter,
} from './overrides/ComponentListSearch';
import Spacings from '@commercetools-uikit/spacings';

// ---------------------------------------------------------------------------
// Inner component (uses context from PuckApiProvider)
// ---------------------------------------------------------------------------

interface PuckEditorInnerProps {
  pageKey: string;
  config: Config;
  onPublish?: (puckData: PuckData) => void;
  onSave?: (puckData: PuckData) => void;
  onError?: (error: Error) => void;
  showPublishButton: boolean;
  autoSaveDebounceMs: number;
}

const PuckEditorInner: React.FC<PuckEditorInnerProps> = ({
  pageKey,
  config,
  onPublish,
  onSave,
  onError,
  showPublishButton,
  autoSaveDebounceMs: _autoSaveDebounceMs,
}) => {
  const {
    page,
    states,
    versions,
    saving,
    loading,
    error,
    saveDraft,
    publish,
    revertToPublished,
    loadVersions,
  } = usePuckPage(pageKey);

  const latestDataRef = useRef<Data | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isApplyingVersion, setIsApplyingVersion] = useState(false);

  // Current live data (draft preferred, fallback to page value)
  const currentData: PuckData =
    states.draft?.puckData ??
    page?.puckData ?? {
      content: [],
      root: { props: {} },
    };

  // Version history panel state
  const versionHistory = useVersionHistoryPanel({
    versions: versions as PuckPageVersionEntry[],
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
    const versionData = versionHistory.previewData;
    if (!versionData) return;
    setIsApplyingVersion(true);
    try {
      await saveDraft(versionData);
      setHasUnsavedChanges(false);
      onSave?.(versionData);
      versionHistory.clearSelection();
    } catch (err) {
      onError?.(err as Error);
    } finally {
      setIsApplyingVersion(false);
    }
  }, [versionHistory, saveDraft, onSave, onError]);

  // -------------------------------------------------------------------------
  // Loading / error states
  // -------------------------------------------------------------------------

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontSize: '16px',
          color: 'var(--puck-color-grey-07)',
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
          color: 'var(--puck-color-red-07)',
          border: '1px solid var(--puck-color-red-04)',
          borderRadius: '8px',
          margin: '16px',
        }}
      >
        <strong>Error loading page:</strong> {error}
      </div>
    );
  }

  // Data shown in the Puck canvas — historical preview takes precedence
  const activeData: PuckData = versionHistory.previewData ?? currentData;

  return (
    <VersionHistoryProvider
      diff={diff}
      isPreviewingHistory={versionHistory.isPreviewingHistory}
      versions={versions as PuckPageVersionEntry[]}
      isLoadingVersions={versionHistory.isLoadingVersions}
      selectedVersionId={versionHistory.selectedVersionId}
      isApplying={isApplyingVersion}
      onVersionSelect={versionHistory.selectVersion}
      onApply={() => void handleApplyVersion()}
      onDiscard={versionHistory.clearSelection}
      onLoadVersions={versionHistory.openPanel}
    >
      <ComponentSearchProvider>
        <Puck
          key={versionHistory.selectedVersionId ?? 'current'}
          config={config}
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
                  states={states}
                  onSave={() => void handleSave()}
                  onPublish={() => void handlePublish(activeData as Data)}
                  onRevert={() => void handleRevert()}
                  showPublishButton={showPublishButton}
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
// Public component (self-contained, wraps PuckApiProvider)
// ---------------------------------------------------------------------------

export interface PuckEditorProps {
  /** Service base URL, e.g. "http://localhost:8080" */
  baseURL: string;
  /** CommerceTools project key */
  projectKey: string;
  /** Business unit key */
  businessUnitKey: string;
  /** JWT bearer token — required for save/publish mutations */
  jwtToken: string;
  /** The key of the puck page to edit */
  pageKey: string;
  /**
   * Puck component config.
   * Defaults to `defaultPuckConfig` (all built-in components).
   * Consumers can extend or replace.
   */
  config?: Config;
  /** Called after a successful publish */
  onPublish?: (puckData: PuckData) => void;
  /** Called after each save */
  onSave?: (puckData: PuckData) => void;
  /** Called when an error occurs */
  onError?: (error: Error) => void;
  /** Show the Publish button in the toolbar. Default: true */
  showPublishButton?: boolean;
  /** Debounce delay for auto-save in ms. Default: 1500 */
  autoSaveDebounceMs?: number;
}

export const PuckEditor: React.FC<PuckEditorProps> = ({
  baseURL,
  projectKey,
  businessUnitKey,
  jwtToken,
  pageKey,
  config = defaultPuckConfig,
  onPublish,
  onSave,
  onError,
  showPublishButton = true,
  autoSaveDebounceMs = 1500,
}) => {
  return (
    <PuckApiProvider
      baseURL={baseURL}
      projectKey={projectKey}
      businessUnitKey={businessUnitKey}
      jwtToken={jwtToken}
    >
      <PuckEditorInner
        pageKey={pageKey}
        config={config}
        onPublish={onPublish}
        onSave={onSave}
        onError={onError}
        showPublishButton={showPublishButton}
        autoSaveDebounceMs={autoSaveDebounceMs}
      />
    </PuckApiProvider>
  );
};
