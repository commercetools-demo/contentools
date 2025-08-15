import React, { useCallback } from 'react';
import styled from 'styled-components';
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

const WysiwygTextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  position: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
  }
`;

const WysiwygToolbar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px 4px 0 0;
  position: inherit;
`;

const ToolbarButton = styled.button`
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: white;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: #f0f0f0;
  }
`;

interface WysiwygFieldProps {
  fieldKey: string;
  label: string;
  value: string;
  highlight?: boolean;
  required?: boolean;
  error?: string;
  onFieldChange: (key: string, value: any) => void;
}

export const WysiwygField: React.FC<WysiwygFieldProps> = ({
  fieldKey,
  label,
  value,
  highlight = false,
  required = false,
  error,
  onFieldChange,
}) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onFieldChange(fieldKey, event.target.value);
    },
    [fieldKey, onFieldChange]
  );

  const insertText = useCallback(
    (textToInsert: string) => {
      const textarea = document.getElementById(fieldKey) as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;

      const newText =
        text.substring(0, start) + textToInsert + text.substring(end);
      onFieldChange(fieldKey, newText);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = start + textToInsert.length;
        textarea.selectionEnd = start + textToInsert.length;
        textarea.focus();
      }, 0);
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
      <Text.Detail tone="secondary">
        Rich text editor (HTML supported)
      </Text.Detail>
      <HighlightedContainer $highlight={highlight}>
        <WysiwygToolbar>
          <ToolbarButton
            type="button"
            onClick={() => insertText('<strong></strong>')}
          >
            Bold
          </ToolbarButton>
          <ToolbarButton type="button" onClick={() => insertText('<em></em>')}>
            Italic
          </ToolbarButton>
          <ToolbarButton type="button" onClick={() => insertText('<h2></h2>')}>
            H2
          </ToolbarButton>
          <ToolbarButton type="button" onClick={() => insertText('<h3></h3>')}>
            H3
          </ToolbarButton>
          <ToolbarButton type="button" onClick={() => insertText('<p></p>')}>
            Paragraph
          </ToolbarButton>
          <ToolbarButton
            type="button"
            onClick={() => insertText('<a href=""></a>')}
          >
            Link
          </ToolbarButton>
          <ToolbarButton
            type="button"
            onClick={() => insertText('<ul><li></li></ul>')}
          >
            List
          </ToolbarButton>
        </WysiwygToolbar>
        <WysiwygTextArea
          id={fieldKey}
          name={fieldKey}
          value={value}
          onChange={handleChange}
          placeholder="Enter your content here..."
        />
      </HighlightedContainer>
      {error && <Text.Detail tone="negative">{error}</Text.Detail>}
    </Spacings.Stack>
  );
};
