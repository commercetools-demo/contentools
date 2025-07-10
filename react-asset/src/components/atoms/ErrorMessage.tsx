import React from 'react';
import styled, { css } from 'styled-components';

export interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const getTypeStyles = (type: ErrorMessageProps['type']) => {
  switch (type) {
    case 'error':
      return css`
        background-color: #fee;
        border-color: #e74c3c;
        color: #c0392b;
      `;
    case 'warning':
      return css`
        background-color: #fef9e7;
        border-color: #f39c12;
        color: #d68910;
      `;
    case 'info':
      return css`
        background-color: #e8f4f8;
        border-color: #3498db;
        color: #2980b9;
      `;
    case 'success':
      return css`
        background-color: #e8f5e8;
        border-color: #2ecc71;
        color: #27ae60;
      `;
    default:
      return css`
        background-color: #fee;
        border-color: #e74c3c;
        color: #c0392b;
      `;
  }
};

const MessageContainer = styled.div<{ type: ErrorMessageProps['type'] }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 4px;
  border-left: 4px solid;
  font-size: 14px;
  line-height: 1.4;
  
  ${props => getTypeStyles(props.type)}
`;

const MessageContent = styled.div`
  flex: 1;
`;

const MessageIcon = styled.span<{ type: ErrorMessageProps['type'] }>`
  display: inline-flex;
  align-items: center;
  margin-top: 2px;
  
  &::before {
    content: ${props => {
      switch (props.type) {
        case 'error':
          return '"⚠"';
        case 'warning':
          return '"⚠"';
        case 'info':
          return '"ℹ"';
        case 'success':
          return '"✓"';
        default:
          return '"⚠"';
      }
    }};
    font-size: 16px;
  }
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: inherit;
  font-size: 18px;
  line-height: 1;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
  
  &:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    border-radius: 2px;
  }
  
  &::before {
    content: '×';
  }
`;

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  type = 'error',
  dismissible = false,
  onDismiss,
  className 
}) => {
  return (
    <MessageContainer type={type} className={className} role="alert">
      <MessageIcon type={type} />
      <MessageContent>
        {message}
      </MessageContent>
      {dismissible && onDismiss && (
        <DismissButton
          onClick={onDismiss}
          aria-label="Dismiss message"
        />
      )}
    </MessageContainer>
  );
}; 