import React, { useEffect } from 'react';
import styled from 'styled-components';
import IconButton from '@commercetools-uikit/icon-button';
import { CloseIcon } from '@commercetools-uikit/icons';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import Card from '@commercetools-uikit/card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  topBarPreviousPathLabel?: string;
  size?: number; // in percent
  children?: React.ReactNode;
}

const ModalOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const ModalContainer = styled.div<{ isVisible: boolean; size: number }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: ${props => props.size}%;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  transform: translateX(${props => props.isVisible ? '0' : '100%'});
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5f5f5;
`;

const ModalHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModalBody = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const Breadcrumb = styled.span`
  color: #666;
  font-size: 14px;
  &:after {
    content: ' › ';
    margin: 0 4px;
  }
`;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  topBarPreviousPathLabel,
  size = 50,
  children,
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

  return (
    <ModalOverlay isVisible={isOpen} onClick={handleOverlayClick}>
      <ModalContainer isVisible={isOpen} size={size}>
        <ModalHeader>
          <ModalHeaderContent>
            {topBarPreviousPathLabel && (
              <Breadcrumb>{topBarPreviousPathLabel}</Breadcrumb>
            )}
            <Text.Subheadline as="h4">{title}</Text.Subheadline>
          </ModalHeaderContent>
          <IconButton
            icon={<CloseIcon />}
            label="Close"
            onClick={onClose}
            size="medium"
          />
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};
