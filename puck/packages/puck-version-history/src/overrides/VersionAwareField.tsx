import React from 'react';
import { usePuck } from '@measured/puck';
import { useVersionHistoryContext } from '../context/VersionHistoryContext';
import { Tag } from '@commercetools-uikit/tag';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';

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
          <Spacings.Stack scale="xs">
            <Text.Detail isBold>Fields changed from this version:</Text.Detail>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {componentDiff.changedProps
                // hide internal puck `id` prop
                .filter((p) => p !== 'id')
                .map((prop) => (
                  <Tag key={prop} type="normal">{prop}</Tag>
                ))}
            </div>
          </Spacings.Stack>
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
          <Spacings.Stack scale="xs">
            <Text.Detail isBold>Root fields changed:</Text.Detail>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {diff.rootChanges.map((prop) => (
                <Tag key={prop} type="normal">{prop}</Tag>
              ))}
            </div>
          </Spacings.Stack>
        </div>
      )}

      {children}
    </div>
  );
};
