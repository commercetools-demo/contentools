import React, { useEffect } from 'react';
import styled from 'styled-components';
import IconButton from '@commercetools-uikit/icon-button';
import { CloseIcon } from '@commercetools-uikit/icons';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onReject: () => void;
  confirmTitle: string;
  rejectTitle: string;
  size?: number; // in percent
  children?: React.ReactNode;
  loading?: boolean;
}

const ModalOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: var(--confirmation-modal-overlay-top, 0);
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div<{ isVisible: boolean; size: number }>`
  width: ${(props) => props.size}%;
  max-width: 600px;
  min-width: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  transform: scale(${(props) => (props.isVisible ? '1' : '0.9')});
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: transform 0.3s ease, opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: var(--modal-header-border-bottom, 1px solid #e0e0e0);
  background-color: var(--modal-header-background-color, #f5f5f5);
  border-radius: 8px 8px 0 0;
`;

const ModalBody = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 24px;
  border-top: var(--modal-footer-border-top, 1px solid #e0e0e0);
  background-color: var(--modal-footer-background-color, #f5f5f5);
  border-radius: 0 0 8px 8px;
`;

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onReject,
  confirmTitle,
  rejectTitle,
  size = 40,
  children,
  loading,
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const handleReject = () => {
    onReject();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isVisible={isOpen} onClick={handleOverlayClick}>
      <ModalContainer isVisible={isOpen} size={size}>
        <ModalHeader>
          <Text.Subheadline as="h4">Confirmation</Text.Subheadline>
          <IconButton
            icon={<CloseIcon />}
            label="Close"
            onClick={onClose}
            size="medium"
          />
        </ModalHeader>
        <ModalBody>
          <Spacings.Stack scale="m" alignItems="flex-start">
            {children}
          </Spacings.Stack>
        </ModalBody>
        <ModalFooter>
          <SecondaryButton
            label={rejectTitle}
            onClick={handleReject}
            size="medium"
          />
          <PrimaryButton
            label={confirmTitle}
            onClick={handleConfirm}
            isDisabled={loading}
            size="medium"
            iconRight={loading ? <LoadingSpinner /> : undefined}
          />
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};
