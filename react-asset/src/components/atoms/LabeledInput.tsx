import React from 'react';
import styled from 'styled-components';

export interface LabeledInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
}

const InputContainer = styled.div`
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

const FormInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.hasError ? '#e74c3c' : '#ddd'};
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
  
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

export const LabeledInput: React.FC<LabeledInputProps> = ({ 
  label, 
  onChange, 
  error,
  helperText,
  required,
  className,
  ...props 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <InputContainer className={className}>
      <FormLabel required={required}>
        {label}
      </FormLabel>
      <FormInput
        hasError={!!error}
        onChange={handleChange}
        required={required}
        {...props}
      />
      {error && <ErrorText>{error}</ErrorText>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </InputContainer>
  );
}; 