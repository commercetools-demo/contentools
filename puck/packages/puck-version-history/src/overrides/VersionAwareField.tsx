import React from 'react';
import { usePuck } from '@measured/puck';
import { useVersionHistoryContext } from '../context/VersionHistoryContext';

interface VersionAwareFieldsPanelProps {
  children: React.ReactNode;
  isLoading: boolean;
}

/**
 * Puck `fields` override that injects a "Changed props" banner above the
 * fields panel whenever the editor is in version-preview mode and the
 * currently selected component has properties that differ from the current draft.
 *
 * Usage:
 *   overrides={{ fields: VersionAwareFieldsPanel }}
 */
export const VersionAwareFieldsPanel: React.FC<VersionAwareFieldsPanelProps> = ({
  children,
}) => {
  const { diff, isPreviewingHistory } = useVersionHistoryContext();
  const { appState } = usePuck();

  if (!isPreviewingHistory || !diff) {
    return <>{children}</>;
  }

  const itemSelector = appState.ui.itemSelector;
  const selectedItem =
    itemSelector != null ? appState.data.content[itemSelector.index] : null;

  const componentDiff = selectedItem
    ? diff.components.find(
        (c) =>
          c.id === (selectedItem.props.id as string) && c.status === 'changed'
      )
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Changed-props banner — only rendered when there are differences */}
      {componentDiff && componentDiff.changedProps.length > 0 && (
        <div
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
            background: 'rgba(245, 158, 11, 0.07)',
          }}
        >
          <p
            style={{
              margin: '0 0 5px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#f59e0b',
            }}
          >
            Fields changed from this version:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {componentDiff.changedProps
              // hide internal puck `id` prop
              .filter((p) => p !== 'id')
              .map((prop) => (
                <span
                  key={prop}
                  style={{
                    fontSize: '11px',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    background: 'rgba(245, 158, 11, 0.14)',
                    color: '#f59e0b',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    fontWeight: 500,
                  }}
                >
                  {prop}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Root-level changes indicator when no component is selected */}
      {!selectedItem && diff.rootChanges.length > 0 && (
        <div
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
            background: 'rgba(245, 158, 11, 0.07)',
          }}
        >
          <p
            style={{
              margin: '0 0 5px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#f59e0b',
            }}
          >
            Root fields changed:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {diff.rootChanges.map((prop) => (
              <span
                key={prop}
                style={{
                  fontSize: '11px',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  background: 'rgba(245, 158, 11, 0.14)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  fontWeight: 500,
                }}
              >
                {prop}
              </span>
            ))}
          </div>
        </div>
      )}

      {children}
    </div>
  );
};
