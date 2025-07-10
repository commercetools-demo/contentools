import React from 'react';
import styled from 'styled-components';

export interface ToggleButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const getSizeStyles = (size: ToggleButtonProps['size']) => {
  switch (size) {
    case 'small':
      return {
        width: '32px',
        height: '18px',
        thumbSize: '14px',
        thumbOffset: '2px',
        fontSize: '12px'
      };
    case 'large':
      return {
        width: '48px',
        height: '26px',
        thumbSize: '22px',
        thumbOffset: '2px',
        fontSize: '16px'
      };
    default:
      return {
        width: '40px',
        height: '22px',
        thumbSize: '18px',
        thumbOffset: '2px',
        fontSize: '14px'
      };
  }
};

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleLabel = styled.label<{ disabled?: boolean; fontSize: string }>`
  font-size: ${props => props.fontSize};
  color: ${props => props.disabled ? '#999' : '#333'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  user-select: none;
`;

const ToggleSwitch = styled.div<{ 
  checked: boolean; 
  disabled?: boolean; 
  width: string; 
  height: string; 
}>`
  position: relative;
  width: ${props => props.width};
  height: ${props => props.height};
  background-color: ${props => {
    if (props.disabled) return '#f5f5f5';
    return props.checked ? '#3498db' : '#ddd';
  }};
  border-radius: ${props => props.height};
  transition: background-color 0.2s;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  border: 1px solid ${props => {
    if (props.disabled) return '#ddd';
    return props.checked ? '#3498db' : '#ccc';
  }};
`;

const ToggleThumb = styled.div<{ 
  checked: boolean; 
  disabled?: boolean; 
  thumbSize: string; 
  thumbOffset: string;
  width: string;
}>`
  position: absolute;
  top: ${props => props.thumbOffset};
  left: ${props => props.checked ? `calc(100% - ${props.thumbSize} - ${props.thumbOffset})` : props.thumbOffset};
  width: ${props => props.thumbSize};
  height: ${props => props.thumbSize};
  background-color: ${props => props.disabled ? '#ccc' : 'white'};
  border-radius: 50%;
  transition: left 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

export const ToggleButton: React.FC<ToggleButtonProps> = ({ 
  checked, 
  onChange, 
  label,
  disabled = false,
  size = 'medium',
  className 
}) => {
  const sizeStyles = getSizeStyles(size);

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <ToggleContainer className={className}>
      <ToggleSwitch
        checked={checked}
        disabled={disabled}
        width={sizeStyles.width}
        height={sizeStyles.height}
        onClick={handleToggle}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
      >
        <HiddenInput
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          disabled={disabled}
        />
        <ToggleThumb
          checked={checked}
          disabled={disabled}
          thumbSize={sizeStyles.thumbSize}
          thumbOffset={sizeStyles.thumbOffset}
          width={sizeStyles.width}
        />
      </ToggleSwitch>
      {label && (
        <ToggleLabel 
          disabled={disabled} 
          fontSize={sizeStyles.fontSize}
          onClick={handleToggle}
        >
          {label}
        </ToggleLabel>
      )}
    </ToggleContainer>
  );
}; 