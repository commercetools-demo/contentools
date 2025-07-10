import React from 'react';
import styled from 'styled-components';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
}

const SelectContainer = styled.div`
  margin-bottom: 15px;
`;

const FormLabel = styled.label<{ required?: boolean }>`
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
  
  &:after {
    content: ${props => props.required ? '" *"' : '""'};
    color: #e74c3c;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const FormSelect = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.hasError ? '#e74c3c' : '#ddd'};
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  padding-right: 32px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e74c3c' : '#3498db'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)'};
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const ErrorText = styled.span`
  display: block;
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
`;

const HelperText = styled.span`
  display: block;
  color: #666;
  font-size: 12px;
  margin-top: 4px;
`;

export const Select: React.FC<SelectProps> = ({ 
  label, 
  options,
  onChange, 
  error,
  helperText,
  required,
  placeholder,
  className,
  value,
  ...props 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <SelectContainer className={className}>
      {label && (
        <FormLabel required={required}>
          {label}
        </FormLabel>
      )}
      <SelectWrapper>
        <FormSelect
          hasError={!!error}
          onChange={handleChange}
          required={required}
          value={value}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(option => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </FormSelect>
      </SelectWrapper>
      {error && <ErrorText>{error}</ErrorText>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </SelectContainer>
  );
}; 