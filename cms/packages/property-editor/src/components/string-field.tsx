import React, { useCallback } from 'react';
import styled from 'styled-components';
import TextInput from '@commercetools-uikit/text-input';
import Spacings from '@commercetools-uikit/spacings';
import FieldLabel from '@commercetools-uikit/field-label';
import Text from '@commercetools-uikit/text';

const HighlightedContainer = styled.div<{ $highlight: boolean }>`
  position: relative;
  
  ${({ $highlight }) => $highlight && `
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(90deg, #ffd700, #ffed4e);
      border-radius: 4px;
      z-index: -1;
    }
  `}
`;

interface StringFieldProps {
  fieldKey: string;
  label: string;
  value: string;
  highlight?: boolean;
  required?: boolean;
  error?: string;
  onFieldChange: (key: string, value: any) => void;
}

export const StringField: React.FC<StringFieldProps> = ({
  fieldKey,
  label,
  value,
  highlight = false,
  required = false,
  error,
  onFieldChange,
}) => {
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange(fieldKey, event.target.value);
  }, [fieldKey, onFieldChange]);

  return (
    <Spacings.Stack scale="xs">
      <FieldLabel
        title={label}
        hasRequiredIndicator={required}
        htmlFor={fieldKey}
      />
      <HighlightedContainer $highlight={highlight}>
        <TextInput
          id={fieldKey}
          name={fieldKey}
          value={value}
          onChange={handleChange}
          hasError={!!error}
        />
      </HighlightedContainer>
      {error && (
        <Text.Detail tone="negative">
          {error}
        </Text.Detail>
      )}
    </Spacings.Stack>
  );
}; 