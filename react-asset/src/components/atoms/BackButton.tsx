import React from 'react';
import styled from 'styled-components';
import { Button } from './Button';

export interface BackButtonProps {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const BackIcon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 4px;
  
  &::before {
    content: '←';
    font-size: 16px;
    font-weight: bold;
  }
`;

const StyledBackButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  label = 'Back',
  disabled = false,
  className 
}) => {
  return (
    <StyledBackButton
      variant="secondary"
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={`Go back: ${label}`}
    >
      <BackIcon />
      {label}
    </StyledBackButton>
  );
}; 