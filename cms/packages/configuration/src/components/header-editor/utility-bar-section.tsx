import React from 'react';
import { useFormikContext } from 'formik';
import Card from '@commercetools-uikit/card';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import FieldLabel from '@commercetools-uikit/field-label';
import TextInput from '@commercetools-uikit/text-input';
import FlatButton from '@commercetools-uikit/flat-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import {
  HeaderConfiguration,
  UtilityBarItem,
} from '@commercetools-demo/contentools-types';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon } from '@commercetools-uikit/icons';

export const UtilityBarSection: React.FC = () => {
  const { values, setFieldValue, handleBlur } =
    useFormikContext<HeaderConfiguration>();
  const utilityBar = values.utilityBar ?? { enabled: false, items: [] };
  const items = utilityBar.items ?? [];

  const handleAdd = () => {
    const next = [...items, { label: '', href: '' }];
    setFieldValue('utilityBar.items', next);
  };

  const handleRemove = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    setFieldValue('utilityBar.items', next);
  };

  return (
    <Card>
      <Spacings.Stack scale="m" alignItems='flex-start'>
        <Text.Headline as="h2">Utility bar</Text.Headline>
        <Text.Body tone="secondary">
          Optional secondary bar above the main header.
        </Text.Body>
        <CheckboxInput
          name="utilityBar.enabled"
          value="enabled"
          isChecked={!!utilityBar.enabled}
          onChange={(e) =>
            setFieldValue('utilityBar.enabled', e.target.checked)
          }
        >
          Enable utility bar
        </CheckboxInput>
        {utilityBar.enabled && (
          <Spacings.Stack scale="s">
            {items.map((item: UtilityBarItem, index: number) => (
              <Spacings.Inline key={index} scale="s" alignItems="center">
                <TextInput
                  name={`utilityBar.items.${index}.label`}
                  value={item.label ?? ''}
                  onChange={(e) =>
                    setFieldValue(
                      `utilityBar.items.${index}.label`,
                      e.target.value
                    )
                  }
                  onBlur={handleBlur}
                  placeholder="Label"
                />
                <TextInput
                  name={`utilityBar.items.${index}.href`}
                  value={item.href ?? ''}
                  onChange={(e) =>
                    setFieldValue(
                      `utilityBar.items.${index}.href`,
                      e.target.value
                    )
                  }
                  onBlur={handleBlur}
                  placeholder="URL"
                />
                <IconButton
                  label="Remove"
                  icon={<BinLinearIcon />}
                  onClick={() => handleRemove(index)}
                />
              </Spacings.Inline>
            ))}
            <FlatButton label="Add utility item" onClick={handleAdd} />
          </Spacings.Stack>
        )}
      </Spacings.Stack>
    </Card>
  );
};
