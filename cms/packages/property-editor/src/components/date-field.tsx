import DateTimeInput from '@commercetools-uikit/date-time-input';
import FieldLabel from '@commercetools-uikit/field-label';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import momentTimeZone from 'moment-timezone';
import React from 'react';
import styled from 'styled-components';
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

interface DateTimeFieldProps {
  fieldKey: string;
  label: string;
  value?: string;
  highlight?: boolean;
  required?: boolean;
  error?: string;
  onFieldChange: (value: any) => void;
}

export const DateTimeField: React.FC<DateTimeFieldProps> = ({
  fieldKey,
  label,
  value,
  highlight = false,
  required = false,
  error,
  onFieldChange,
}) => {
  return (
    <Spacings.Stack scale="xs">
      <FieldLabel
        title={label}
        hasRequiredIndicator={required}
        htmlFor={fieldKey}
      />
      <HighlightedContainer $highlight={highlight}>
        <DateTimeInput
          placeholder="Select a date..."
          timeZone={momentTimeZone.tz.guess()}
          value={value ?? ''}
          onChange={(event) => onFieldChange(event.target.value ? event.target.value : undefined)}
        />
      </HighlightedContainer>
      {error && <Text.Detail tone="negative">{error}</Text.Detail>}
    </Spacings.Stack>
  );
};
