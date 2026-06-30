import React from 'react';
import { Badge, Button, Icon, Stack } from '@commercetools/nimbus';
import { AccessTime } from '@commercetools/nimbus-icons';

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
    <Stack direction="row" gap="200" alignItems="center">
      {/* Version label */}
      <Badge colorPalette="info">
        <Icon as={AccessTime} size="xs" />
        {`Previewing: ${formatted}`}
      </Badge>

      {/* Apply version button */}
      <Button variant="solid" onPress={onApply} isDisabled={isApplying}>
        {isApplying ? 'Applying…' : 'Apply this Version'}
      </Button>

      {/* Discard / back to current */}
      <Button variant="outline" onPress={onDiscard} isDisabled={isApplying}>
        Back to Current
      </Button>
    </Stack>
  );
};
