import React from 'react';
import { useFormikContext } from 'formik';
import Card from '@commercetools-uikit/card';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { HeaderConfiguration, HeaderVariant } from '@commercetools-demo/contentools-types';

const VARIANTS: HeaderVariant[] = ['full', 'minimal', 'custom'];

const VISIBILITY_KEYS: (keyof NonNullable<HeaderConfiguration['variantMap']['full']>)[] = [
  'showNavigation',
  'showSearch',
  'showCart',
  'showAccount',
  'showWishlist',
  'showLanguageSwitcher',
  'showCompanySwitcher',
  'showQuickOrder',
];

const LABELS: Record<string, string> = {
  showNavigation: 'Navigation',
  showSearch: 'Search',
  showCart: 'Cart',
  showAccount: 'Account',
  showWishlist: 'Wishlist',
  showLanguageSwitcher: 'Language switcher',
  showCompanySwitcher: 'Company switcher',
  showQuickOrder: 'Quick order',
};

export const VariantVisibilitySection: React.FC = () => {
  const { values, setFieldValue, handleBlur } = useFormikContext<HeaderConfiguration>();

  return (
    <Card>
      <Spacings.Stack scale="m">
        <Text.Headline as="h2">Variant visibility</Text.Headline>
        <Text.Body tone="secondary">
          Toggle which elements are visible for each header variant.
        </Text.Body>
        {VARIANTS.map((variant) => {
          const visibility = values.variantMap?.[variant];
          if (!visibility) return null;
          return (
            <Spacings.Stack key={variant} scale="s">
              <Text.Subheadline as="h4">{variant}</Text.Subheadline>
              <Spacings.Inline scale="s" alignItems="center">
                {VISIBILITY_KEYS.filter((k) => visibility[k] !== undefined).map((key) => (
                  <CheckboxInput
                    key={key}
                    name={`variantMap.${variant}.${key}`}
                    value={key}
                    isChecked={!!visibility[key]}
                    onChange={(e) =>
                      setFieldValue(`variantMap.${variant}.${key}`, e.target.checked)
                    }
                  >
                    {LABELS[key] ?? key}
                  </CheckboxInput>
                ))}
              </Spacings.Inline>
            </Spacings.Stack>
          );
        })}
      </Spacings.Stack>
    </Card>
  );
};
