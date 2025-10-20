import React, { useCallback } from 'react';
import styled from 'styled-components';
import NumberInput from '@commercetools-uikit/number-input';
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

interface NumberFieldProps {
  fieldKey: string;
  label: string;
  value: number | undefined;
  highlight?: boolean;
  required?: boolean;
  error?: string;
  onFieldChange: (value: any) => void;
}

export const NumberField: React.FC<NumberFieldProps> = ({
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
      const numericValue =
        event.target.value === '' ? undefined : Number(event.target.value);
      onFieldChange(numericValue);
    },
    [onFieldChange]
  );

  return (
    <Spacings.Stack scale="xs">
      <FieldLabel
        title={label}
        hasRequiredIndicator={required}
        htmlFor={fieldKey}
      />
      <HighlightedContainer $highlight={highlight}>
        <NumberInput
          id={fieldKey}
          name={fieldKey}
          value={value ?? ''}
          onChange={handleChange}
          hasError={!!error}
        />
      </HighlightedContainer>
      {error && <Text.Detail tone="negative">{error}</Text.Detail>}
    </Spacings.Stack>
  );
};
