import React, { useCallback, useRef, useState } from 'react';
import { Puck, type Config, type Data } from '@measured/puck';
import '@measured/puck/puck.css';
import { PuckApiProvider } from '@commercetools-demo/puck-api';
import { usePuckPage } from '@commercetools-demo/puck-api';
import type { PuckData } from '@commercetools-demo/puck-types';
import { defaultPuckConfig } from './config/defaultPuckConfig';
import { EditorToolbar } from './toolbar/EditorToolbar';
import {
  ComponentSearchProvider,
  ComponentsPanel,
  ComponentItemFilter,
} from './overrides/ComponentListSearch';

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
    saving,
    loading,
    error,
    saveDraft,
    publish,
    revertToPublished,
  } = usePuckPage(pageKey);

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
          background: 'var(--bg-void)',
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
        <strong>Error loading page:</strong> {error}
      </div>
    );
  }

  // Use draft state data if available, otherwise fall back to the main page value
  const activeData: PuckData =
    states.draft?.puckData ??
    page?.puckData ?? {
      content: [],
      root: { props: {} },
    };

  return (
    <ComponentSearchProvider>
      <Puck
        config={config}
        data={activeData as Data}
        onChange={handleChange}
        onPublish={handlePublish}
        overrides={{
          headerActions: () => (
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
        }}
      />
    </ComponentSearchProvider>
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
  /** Called after each auto-save */
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
