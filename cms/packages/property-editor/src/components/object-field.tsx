import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import Spacings from '@commercetools-uikit/spacings';
import FieldLabel from '@commercetools-uikit/field-label';
import Text from '@commercetools-uikit/text';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import {MultilineTextInput} from '@commercetools-demo/contentools-ui-components';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: flex-start;
  align-items: flex-start;
`;

const StyledMultilineTextInput = styled(MultilineTextInput)`
  width: 100%;
  position: relative;
`;

const HighlightedContainer = styled.div<{ $highlight: boolean }>`
  position: relative;
  width: 100%;

  ${({ $highlight }) =>
    $highlight &&
    `
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -1px;
      background: linear-gradient(90deg, #ffd700, #ffed4e);
      border-radius: 4px;
      z-index: 0;
    }
  `}
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

interface ObjectFieldProps {
  fieldKey: string;
  label: string;
  value: any;
  highlight?: boolean;
  required?: boolean;
  error?: string;
  onFieldChange: (key: string, value: any) => void;
}

export const ObjectField: React.FC<ObjectFieldProps> = ({
  fieldKey,
  label,
  value,
  highlight = false,
  required = false,
  error,
  onFieldChange,
}) => {
  const [textValue, setTextValue] = useState(() => {
    try {
      return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    } catch {
      return value || '';
    }
  });

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      setTextValue(newValue);
      
      // Try to parse and update the actual value
      try {
        const parsed = JSON.parse(newValue);
        onFieldChange(fieldKey, parsed);
      } catch {
        // If parsing fails, store as string for now
        onFieldChange(fieldKey, newValue);
      }
    },
    [fieldKey, onFieldChange]
  );

  const beautifyJson = useCallback(() => {
    try {
      let cleanedText = textValue;
      
      // Fix common JSON mistakes
      // 1. Replace single quotes with double quotes (but not inside strings)
      cleanedText = cleanedText.replace(/'/g, '"');
      
      // 2. Add quotes around unquoted keys
      cleanedText = cleanedText.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
      
      // 3. Try to parse and format
      const parsed = JSON.parse(cleanedText);
      const formatted = JSON.stringify(parsed, null, 2);
      
      setTextValue(formatted);
      onFieldChange(fieldKey, parsed);
    } catch (parseError) {
      // If we still can't parse, try to fix more issues
      try {
        let fixedText = textValue;
        
        // More aggressive fixes
        // Replace single quotes with double quotes
        fixedText = fixedText.replace(/'/g, '"');
        
        // Fix unquoted keys (more comprehensive)
        fixedText = fixedText.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
        
        // Fix trailing commas
        fixedText = fixedText.replace(/,(\s*[}\]])/g, '$1');
        
        // Fix missing commas between properties
        fixedText = fixedText.replace(/"\s*\n\s*"/g, '",\n"');
        fixedText = fixedText.replace(/}\s*\n\s*"/g, '},\n"');
        fixedText = fixedText.replace(/]\s*\n\s*"/g, '],\n"');
        
        const parsed = JSON.parse(fixedText);
        const formatted = JSON.stringify(parsed, null, 2);
        
        setTextValue(formatted);
        onFieldChange(fieldKey, parsed);
      } catch (secondError) {
        // If all else fails, just format what we can
        console.warn('Could not beautify JSON:', secondError);
      }
    }
  }, [textValue, fieldKey, onFieldChange]);

  const validateJson = useCallback(() => {
    try {
      JSON.parse(textValue);
      return null;
    } catch (parseError: any) {
      return `Invalid JSON: ${parseError.message}`;
    }
  }, [textValue]);

  const jsonError = validateJson();
  const displayError = error || jsonError;

  return (
    <Container>
      <FieldLabel
        title={label}
        hasRequiredIndicator={required}
        htmlFor={fieldKey}
      />
      <HighlightedContainer $highlight={highlight}>
        <StyledMultilineTextInput
          id={fieldKey}
          name={fieldKey}
          value={textValue}
          onChange={handleTextChange}
          hasError={!!displayError}
          minRows={6}
          maxRows={20}
          placeholder="Enter JSON object..."
        />
      </HighlightedContainer>
      
      <ActionsContainer>
        <SecondaryButton
          label="Beautify JSON"
          onClick={beautifyJson}
          size="small"
          iconLeft={<span>✨</span>}
        />
      </ActionsContainer>
      
      {displayError && <Text.Detail tone="negative">{displayError}</Text.Detail>}
    </Container>
  );
};