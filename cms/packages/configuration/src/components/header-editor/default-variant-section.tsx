import React from 'react';
import { useFormikContext } from 'formik';
import Card from '@commercetools-uikit/card';
import FieldLabel from '@commercetools-uikit/field-label';
import SelectInput from '@commercetools-uikit/select-input';
import TextInput from '@commercetools-uikit/text-input';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import {
  HeaderConfiguration,
  HeaderVariant,
} from '@commercetools-demo/contentools-types';

const HEADER_VARIANT_OPTIONS: { value: HeaderVariant; label: string }[] = [
  { value: 'full', label: 'Full' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'custom', label: 'Custom' },
];

export const DefaultVariantSection: React.FC = () => {
  const { values, setFieldValue, handleBlur } =
    useFormikContext<HeaderConfiguration>();

  return (
    <Card>
      <Spacings.Stack scale="m" alignItems='flex-start'>
        <Text.Headline as="h2">Default variant & route overrides</Text.Headline>
        <FieldLabel title="Default variant" htmlFor="defaultVariant" />
        <SelectInput
          id="defaultVariant"
          name="defaultVariant"
          value={values.defaultVariant}
          onChange={(e) =>
            setFieldValue('defaultVariant', e.target.value as HeaderVariant)
          }
          onBlur={handleBlur}
          options={HEADER_VARIANT_OPTIONS}
        />
        {values.routeVariantOverrides &&
          Object.keys(values.routeVariantOverrides).length > 0 && (
            <Spacings.Stack scale="s">
              <Text.Subheadline as="h4">Route overrides</Text.Subheadline>
              {Object.entries(values.routeVariantOverrides).map(
                ([route, variant]) => (
                  <Spacings.Inline key={route} scale="s" alignItems="center">
                    <TextInput value={route} onChange={() => {}} isReadOnly />
                    <SelectInput
                      value={variant}
                      onChange={(e) =>
                        setFieldValue(
                          `routeVariantOverrides.${route}`,
                          e.target.value as HeaderVariant
                        )
                      }
                      options={HEADER_VARIANT_OPTIONS}
                    />
                  </Spacings.Inline>
                )
              )}
            </Spacings.Stack>
          )}
      </Spacings.Stack>
    </Card>
  );
};
