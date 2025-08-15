import React, { useCallback } from 'react';
import styled from 'styled-components';
import TextInput from '@commercetools-uikit/text-input';
import Spacings from '@commercetools-uikit/spacings';
import FieldLabel from '@commercetools-uikit/field-label';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
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

const ArrayItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .array-item-input {
    flex: 1;
  }
`;

interface ArrayFieldProps {
  fieldKey: string;
  label: string;
  value: any[];
  highlight?: boolean;
  required?: boolean;
  error?: string;
  onFieldChange: (key: string, value: any) => void;
}

export const ArrayField: React.FC<ArrayFieldProps> = ({
  fieldKey,
  label,
  value,
  highlight = false,
  required = false,
  error,
  onFieldChange,
}) => {
  const handleItemChange = useCallback(
    (index: number, itemValue: string) => {
      const newArray = [...value];
      newArray[index] = itemValue;
      onFieldChange(fieldKey, newArray);
    },
    [fieldKey, value, onFieldChange]
  );

  const handleAddItem = useCallback(() => {
    const newArray = [...value, ''];
    onFieldChange(fieldKey, newArray);
  }, [fieldKey, value, onFieldChange]);

  const handleRemoveItem = useCallback(
    (index: number) => {
      const newArray = value.filter((_, i) => i !== index);
      onFieldChange(fieldKey, newArray);
    },
    [fieldKey, value, onFieldChange]
  );

  return (
    <Spacings.Stack scale="xs">
      <FieldLabel
        title={label}
        hasRequiredIndicator={required}
        htmlFor={fieldKey}
      />
      <HighlightedContainer $highlight={highlight}>
        <Spacings.Stack scale="xs">
          {value.map((item, index) => (
            <ArrayItemContainer key={index}>
              <div className="array-item-input">
                <TextInput
                  id={`${fieldKey}-${index}`}
                  name={`${fieldKey}-${index}`}
                  value={String(item)}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleItemChange(index, event.target.value)
                  }
                  placeholder={`Item ${index + 1}`}
                />
              </div>
              <IconButton
                icon={<BinLinearIcon />}
                label="Remove item"
                size="small"
                onClick={() => handleRemoveItem(index)}
              />
            </ArrayItemContainer>
          ))}
          <SecondaryButton
            iconLeft={<PlusBoldIcon />}
            label="Add item"
            size="small"
            onClick={handleAddItem}
          />
        </Spacings.Stack>
      </HighlightedContainer>
      {error && <Text.Detail tone="negative">{error}</Text.Detail>}
    </Spacings.Stack>
  );
};
