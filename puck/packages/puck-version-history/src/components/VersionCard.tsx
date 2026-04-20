import React from 'react';
import type { VersionEntry } from '../types';
import Stamp from '@commercetools-uikit/stamp';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import {Tag} from '@commercetools-uikit/tag';

interface VersionCardProps {
  version: VersionEntry;
  isSelected: boolean;
  isCurrent?: boolean;
  onClick: (id: string) => void;
}

/**
 * Renders a single version entry as a selectable card showing the timestamp.
 */
export const VersionCard: React.FC<VersionCardProps> = ({
  version,
  isSelected,
  isCurrent = false,
  onClick,
}) => {
  const formatted = new Date(version.timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <Tag
      onClick={() => onClick(version.id)}
      isDisabled={isSelected}
    >
      <Spacings.Inline justifyContent="space-between" alignItems="center" scale="xs">
        <Text.Detail
          isBold={isSelected}
        >
          {formatted}
        </Text.Detail>
        {isCurrent && (
          <Stamp tone="positive" label="current" isCondensed />
        )}
      </Spacings.Inline>
    </Tag>
  );
};
