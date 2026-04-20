import React from 'react';
import Stamp from '@commercetools-uikit/stamp';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import { ClockIcon } from '@commercetools-uikit/icons';

interface VersionPreviewBannerProps {
  timestamp: string;
  onApply: () => void;
  onDiscard: () => void;
  isApplying?: boolean;
}

/**
 * Replaces the normal editor toolbar when previewing a historical version.
 * Shows the version timestamp, an "Apply" button, and a "Discard" button.
 * The normal Save / Publish / Revert to Published buttons must NOT be
 * rendered alongside this component.
 */
export const VersionPreviewBanner: React.FC<VersionPreviewBannerProps> = ({
  timestamp,
  onApply,
  onDiscard,
  isApplying = false,
}) => {
  const formatted = new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <Spacings.Inline scale="s" alignItems="center">
      {/* Version label */}
      <Stamp
        tone="information"
        label={`Previewing: ${formatted}`}
        icon={<ClockIcon />}
      />

      {/* Apply version button */}
      <PrimaryButton
        label={isApplying ? 'Applying…' : 'Apply this Version'}
        onClick={onApply}
        isDisabled={isApplying}
      />

      {/* Discard / back to current */}
      <SecondaryButton
        label="Back to Current"
        onClick={onDiscard}
        isDisabled={isApplying}
      />
    </Spacings.Inline>
  );
};
