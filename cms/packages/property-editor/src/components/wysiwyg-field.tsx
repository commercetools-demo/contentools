import React, { useCallback } from 'react';
import styled from 'styled-components';
import Spacings from '@commercetools-uikit/spacings';
import FieldLabel from '@commercetools-uikit/field-label';
import Text from '@commercetools-uikit/text';
import { SimpleEditor } from '@commercetools-demo/contentools-property-editor-wisiwyg';

const HighlightedContainer = styled.div<{ $highlight: boolean }>`
  position: relative;
  border: 1px solid #ddd;
  border-radius: 4px;

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

interface WysiwygFieldProps {
  fieldKey: string;
  label: string;
  value: any;
  hydratedUrl: string;
  highlight?: boolean;
  required?: boolean;
  error?: string;
  onFieldChange: (key: string, value: any) => void;
}

export const WysiwygField: React.FC<WysiwygFieldProps> = ({
  fieldKey,
  label,
  value,
  hydratedUrl,
  highlight = false,
  required = false,
  error,
  onFieldChange,
}) => {
  const onChange = useCallback((json: any) => {
    onFieldChange(fieldKey, json);
  }, []);

  return (
    <Spacings.Stack scale="xs">
      <FieldLabel
        title={label}
        hasRequiredIndicator={required}
        htmlFor={fieldKey}
      />
      <HighlightedContainer $highlight={highlight}>
        <SimpleEditor
          hydratedUrl={hydratedUrl}
          value={value}
          onChange={onChange}
        />
      </HighlightedContainer>
      {error && <Text.Detail tone="negative">{error}</Text.Detail>}
    </Spacings.Stack>
  );
};
