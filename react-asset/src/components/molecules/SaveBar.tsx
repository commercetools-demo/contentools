import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Button } from '../atoms/Button';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

export interface SaveBarProps {
  isVisible: boolean;
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel?: () => void;
  saveLabel?: string;
  discardLabel?: string;
  cancelLabel?: string;
  message?: string;
  className?: string;
}

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const SaveBarContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top: 1px solid #e1e5e9;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  padding: 16px 24px;
  display: ${props => props.isVisible ? 'flex' : 'none'};
  align-items: center;
  justify-content: space-between;
  z-index: 999;
  animation: ${props => props.isVisible ? slideUp : slideDown} 0.3s ease-out;
`;

const MessageSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const StatusIndicator = styled.div<{ hasChanges: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.hasChanges ? '#f39c12' : '#2ecc71'};
  animation: ${props => props.hasChanges ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

const MessageText = styled.span<{ hasChanges: boolean }>`
  font-size: 14px;
  color: ${props => props.hasChanges ? '#d68910' : '#27ae60'};
  font-weight: 500;
`;

const ActionSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SavingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
`;

export const SaveBar: React.FC<SaveBarProps> = ({
  isVisible,
  hasChanges,
  isSaving,
  onSave,
  onDiscard,
  onCancel,
  saveLabel = 'Save',
  discardLabel = 'Discard',
  cancelLabel = 'Cancel',
  message,
  className
}) => {
  const getDefaultMessage = () => {
    if (isSaving) return 'Saving changes...';
    if (hasChanges) return 'You have unsaved changes';
    return 'All changes saved';
  };

  const displayMessage = message || getDefaultMessage();

  if (!isVisible) return null;

  return (
    <SaveBarContainer isVisible={isVisible} className={className}>
      <MessageSection>
        <StatusIndicator hasChanges={hasChanges && !isSaving} />
        <MessageText hasChanges={hasChanges && !isSaving}>
          {displayMessage}
        </MessageText>
      </MessageSection>

      <ActionSection>
        {isSaving ? (
          <SavingIndicator>
            <LoadingSpinner size="small" />
            <span>Saving...</span>
          </SavingIndicator>
        ) : (
          <>
            {onCancel && (
              <Button
                variant="text"
                size="small"
                onClick={onCancel}
                disabled={isSaving}
              >
                {cancelLabel}
              </Button>
            )}
            
            <Button
              variant="secondary"
              size="small"
              onClick={onDiscard}
              disabled={isSaving || !hasChanges}
            >
              {discardLabel}
            </Button>
            
            <Button
              variant="primary"
              size="small"
              onClick={onSave}
              disabled={isSaving || !hasChanges}
            >
              {saveLabel}
            </Button>
          </>
        )}
      </ActionSection>
    </SaveBarContainer>
  );
}; 