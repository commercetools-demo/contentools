import React from 'react';
import { useVersionHistoryContext } from '../context/VersionHistoryContext';
import { VersionCard } from './VersionCard';
import { DiffSummary } from './DiffSummary';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';

/**
 * Inline version history panel for Puck's left sidebar.
 * Reads all state from VersionHistoryContext — no props needed.
 */
export const VersionHistorySidebarContent: React.FC = () => {
  const {
    versions,
    isLoadingVersions,
    selectedVersionId,
    isPreviewingHistory,
    isApplying,
    diff,
    onVersionSelect,
    onApply,
    onDiscard,
  } = useVersionHistoryContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Scrollable version list */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '8px' }}>
        {isLoadingVersions ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
            <LoadingSpinner />
          </div>
        ) : versions.length === 0 ? (
          <div style={{ padding: '12px 0' }}>
            <Text.Body tone="secondary">No saved versions yet</Text.Body>
          </div>
        ) : (
          <Spacings.Stack scale="s">
            <Text.Detail isBold>Saved versions</Text.Detail>
            {versions.map((v, i) => (
              <VersionCard
                key={v.id}
                version={v}
                isSelected={selectedVersionId === v.id}
                isCurrent={i === 0}
                onClick={onVersionSelect}
              />
            ))}
          </Spacings.Stack>
        )}

        {/* Diff summary when a version is selected */}
        {diff && selectedVersionId && (
          <div
            style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--puck-color-grey-04, #e5e7eb)',
            }}
          >
            <DiffSummary diff={diff} />
          </div>
        )}
      </div>

      {/* Apply / Discard footer — visible only when previewing a version */}
      {isPreviewingHistory && (
        <div
          style={{
            paddingTop: '12px',
            borderTop: '1px solid var(--puck-color-grey-04, #e5e7eb)',
            flexShrink: 0,
          }}
        >
          <Spacings.Inline scale="s" justifyContent='space-between'>
              <PrimaryButton
                label={isApplying ? 'Applying…' : 'Apply'}
                onClick={onApply}
                isDisabled={isApplying}
                size='10'
              />
              <SecondaryButton
                label="Revert"
                onClick={onDiscard}
                isDisabled={isApplying}
                size='10'
              />
          </Spacings.Inline>
        </div>
      )}
    </div>
  );
};
