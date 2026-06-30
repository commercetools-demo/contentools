import React from 'react';
import { IconButton } from '@commercetools/nimbus';
import { History } from '@commercetools/nimbus-icons';
import { useVersionHistoryContext } from '../context/VersionHistoryContext';

interface VersionHistoryButtonProps {
  disabled?: boolean;
}

/**
 * Toggles the History tab in the Puck left sidebar.
 * Reads active state from VersionHistoryContext — no onClick/isActive props needed.
 */
export const VersionHistoryButton: React.FC<VersionHistoryButtonProps> = ({
  disabled = false,
}) => {
  const { isHistoryTabActive, openHistoryTab, closeHistoryTab } =
    useVersionHistoryContext();

  const handleClick = () => {
    if (isHistoryTabActive) {
      closeHistoryTab();
    } else {
      openHistoryTab();
    }
  };

  return (
    <IconButton
      aria-label={isHistoryTabActive ? 'Hide version history' : 'Show version history'}
      variant={isHistoryTabActive ? 'solid' : 'ghost'}
      onPress={handleClick}
      isDisabled={disabled}
    >
      <History />
    </IconButton>
  );
};
