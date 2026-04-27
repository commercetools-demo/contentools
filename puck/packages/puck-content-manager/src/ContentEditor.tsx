import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Puck, type Config, type Data } from '@measured/puck';
import '@measured/puck/puck.css';
import { PuckApiProvider, usePuckContent } from '@commercetools-demo/puck-api';
import type { PuckContentVersionEntry, PuckData } from '@commercetools-demo/puck-types';
import {
  ComponentSearchProvider,
  ComponentsPanel,
  ComponentItemFilter,
  EditorToolbar,
} from '@commercetools-demo/puck-editor';
import {
  VersionHistoryProvider,
  VersionPreviewBanner,
  VersionAwareFieldsPanel,
  VersionHistoryButton,
  useVersionHistoryPanel,
  useVersionDiff,
} from '@commercetools-demo/puck-version-history';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';

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

  // Data shown in Puck canvas — historical preview takes precedence
  const activeData: PuckData = versionHistory.previewData ?? currentData;

  // Cast states for EditorToolbar (PuckContentStateInfo is compatible with PuckStateInfo)
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
