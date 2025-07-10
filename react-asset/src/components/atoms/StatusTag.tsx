import React from 'react';
import styled, { css } from 'styled-components';

export interface StatusTagProps {
  status: 'draft' | 'published' | 'archived' | 'error' | 'warning' | 'success' | 'info';
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const getStatusStyles = (status: StatusTagProps['status']) => {
  switch (status) {
    case 'draft':
      return css`
        background-color: #f39c12;
        color: white;
      `;
    case 'published':
      return css`
        background-color: #2ecc71;
        color: white;
      `;
    case 'archived':
      return css`
        background-color: #95a5a6;
        color: white;
      `;
    case 'error':
      return css`
        background-color: #e74c3c;
        color: white;
      `;
    case 'warning':
      return css`
        background-color: #f39c12;
        color: white;
      `;
    case 'success':
      return css`
        background-color: #2ecc71;
        color: white;
      `;
    case 'info':
      return css`
        background-color: #3498db;
        color: white;
      `;
    default:
      return css`
        background-color: #95a5a6;
        color: white;
      `;
  }
};

const getSizeStyles = (size: StatusTagProps['size']) => {
  switch (size) {
    case 'small':
      return css`
        padding: 2px 6px;
        font-size: 10px;
        border-radius: 3px;
      `;
    case 'large':
      return css`
        padding: 6px 12px;
        font-size: 14px;
        border-radius: 6px;
      `;
    default:
      return css`
        padding: 4px 8px;
        font-size: 12px;
        border-radius: 4px;
      `;
  }
};

const StyledTag = styled.span<StatusTagProps>`
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => getStatusStyles(props.status)}
  ${props => getSizeStyles(props.size)}
`;

export const StatusTag: React.FC<StatusTagProps> = ({ 
  status, 
  children, 
  size = 'medium',
  className 
}) => {
  return (
    <StyledTag status={status} size={size} className={className}>
      {children}
    </StyledTag>
  );
}; 