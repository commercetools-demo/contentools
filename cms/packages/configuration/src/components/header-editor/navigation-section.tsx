import React from 'react';
import { useFormikContext } from 'formik';
import Card from '@commercetools-uikit/card';
import FlatButton from '@commercetools-uikit/flat-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import {
  HeaderConfiguration,
  NavItemLink,
} from '@commercetools-demo/contentools-types';
import { NavigationItemForm } from './navigation-item-form';

export const NavigationSection: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<HeaderConfiguration>();
  const navigation = values.navigation ?? [];

  const handleRemove = (index: number) => {
    const next = navigation.filter((_, i) => i !== index);
    setFieldValue('navigation', next);
  };

  const handleAdd = () => {
    const next = [
      ...navigation,
      { type: 'link', label: '', href: '' } as NavItemLink,
    ];
    setFieldValue('navigation', next);
  };

  return (
    <Card>
      <Spacings.Stack scale="m">
        <Text.Headline as="h2">Navigation</Text.Headline>
        <Text.Body tone="secondary">
          Top-level navigation items. Reorder and configure each item.
        </Text.Body>
        {navigation.map((item, index) => (
          <NavigationItemForm
            key={index}
            index={index}
            value={item}
            onRemove={() => handleRemove(index)}
          />
        ))}
        <FlatButton label="Add navigation item" onClick={handleAdd} />
      </Spacings.Stack>
    </Card>
  );
};
