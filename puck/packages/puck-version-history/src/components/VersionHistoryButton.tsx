import React from 'react';
import IconBiutton from '@commercetools-uikit/icon-button';
import { ClockIcon, ClockWithArrowIcon } from '@commercetools-uikit/icons';
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

  if (isHistoryTabActive) {
    return (
      <IconBiutton
        label="History"
        icon={<ClockWithArrowIcon />}
        onClick={handleClick}
        isDisabled={disabled}
        style={{
          stroke: 'var(--puck-color-grey-12, #818181)',
        }}
      />
    );
  }

  return (
    <IconBiutton
      label="History"
      icon={<ClockWithArrowIcon />}
      onClick={handleClick}
      isDisabled={disabled}
    />
  );
};
