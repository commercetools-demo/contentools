import React, { useCallback } from 'react';
import styled from 'styled-components';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import Spacings from '@commercetools-uikit/spacings';
import FieldLabel from '@commercetools-uikit/field-label';
import Text from '@commercetools-uikit/text';

const HighlightedContainer = styled.div<{ $highlight: boolean }>`
  position: relative;

  ${({ $highlight }) =>
    $highlight &&
    `
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(90deg, #ffd700, #ffed4e);
      border-radius: 4px;
      z-index: 0;
    }
  `}
`;

interface BooleanFieldProps {
  fieldKey: string;
  label: string;
  value: boolean | undefined;
  highlight?: boolean;
  required?: boolean;
  error?: string;
  onFieldChange: (key: string, value: any) => void;
}

export const BooleanField: React.FC<BooleanFieldProps> = ({
  fieldKey,
  label,
  value,
  highlight = false,
  required = false,
  error,
  onFieldChange,
}) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(fieldKey, event.target.checked);
    },
    [fieldKey, onFieldChange]
  );

  return (
    <Spacings.Stack scale="xs">
      <FieldLabel
        title={label}
        hasRequiredIndicator={required}
        htmlFor={fieldKey}
      />
      <HighlightedContainer $highlight={highlight}>
        <CheckboxInput
          id={fieldKey}
          name={fieldKey}
          isChecked={value || false}
          onChange={handleChange}
          hasError={!!error}
        />
      </HighlightedContainer>
      {error && <Text.Detail tone="negative">{error}</Text.Detail>}
    </Spacings.Stack>
  );
};
