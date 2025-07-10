import React from 'react';
import styled, { css } from 'styled-components';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'critical' | 'outline' | 'text' | 'icon';
  size?: 'small' | 'medium' | 'large' | 'full-width';
  children: React.ReactNode;
}

const getVariantStyles = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: #3498db;
        color: white;
        border: none;
        
        &:hover:not(:disabled) {
          background-color: #2980b9;
        }
      `;
    case 'secondary':
      return css`
        background-color: #f5f5f5;
        color: #555;
        border: 1px solid #ddd;
        
        &:hover:not(:disabled) {
          background-color: #e8e8e8;
        }
      `;
    case 'success':
      return css`
        background-color: #2ecc71;
        color: white;
        border: none;
        
        &:hover:not(:disabled) {
          background-color: #27ae60;
        }
      `;
    case 'warning':
      return css`
        background-color: #f39c12;
        color: white;
        border: none;
        
        &:hover:not(:disabled) {
          background-color: #e67e22;
        }
      `;
    case 'critical':
      return css`
        background-color: #e74c3c;
        color: white;
        border: none;
        
        &:hover:not(:disabled) {
          background-color: #c0392b;
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: #3498db;
        border: 1px solid currentColor;
        
        &:hover:not(:disabled) {
          background-color: rgba(52, 152, 219, 0.1);
        }
      `;
    case 'text':
      return css`
        background: none;
        border: none;
        color: #3498db;
        padding: 8px 10px;
        
        &:hover:not(:disabled) {
          background-color: rgba(52, 152, 219, 0.1);
        }
      `;
    case 'icon':
      return css`
        padding: 8px;
        border-radius: 4px;
        background-color: #f5f5f5;
        color: #555;
        border: 1px solid #ddd;
        
        &:hover:not(:disabled) {
          background-color: #e8e8e8;
        }
      `;
    default:
      return css``;
  }
};

const getSizeStyles = (size: ButtonProps['size']) => {
  switch (size) {
    case 'small':
      return css`
        padding: 4px 10px;
        font-size: 12px;
      `;
    case 'large':
      return css`
        padding: 10px 20px;
        font-size: 16px;
      `;
    case 'full-width':
      return css`
        width: 100%;
        padding: 8px 15px;
        font-size: 14px;
      `;
    default:
      return css`
        padding: 8px 15px;
        font-size: 14px;
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  text-align: center;
  border: 1px solid transparent;
  
  ${props => getVariantStyles(props.variant)}
  ${props => getSizeStyles(props.size)}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3);
  }
`;

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  ...props 
}) => {
  return (
    <StyledButton variant={variant} size={size} {...props}>
      {children}
    </StyledButton>
  );
}; 