import React from 'react';
import styled, { keyframes } from 'styled-components';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const getSize = (size: LoadingSpinnerProps['size']) => {
  switch (size) {
    case 'small':
      return '16px';
    case 'large':
      return '48px';
    default:
      return '24px';
  }
};

const getBorderWidth = (size: LoadingSpinnerProps['size']) => {
  switch (size) {
    case 'small':
      return '2px';
    case 'large':
      return '4px';
    default:
      return '3px';
  }
};

const SpinnerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div<LoadingSpinnerProps>`
  width: ${props => getSize(props.size)};
  height: ${props => getSize(props.size)};
  border: ${props => getBorderWidth(props.size)} solid #f3f3f3;
  border-top: ${props => getBorderWidth(props.size)} solid ${props => props.color || '#3498db'};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#3498db',
  className 
}) => {
  return (
    <SpinnerContainer className={className}>
      <Spinner size={size} color={color} />
    </SpinnerContainer>
  );
}; 