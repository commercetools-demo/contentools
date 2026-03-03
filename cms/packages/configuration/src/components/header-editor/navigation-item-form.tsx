import React from 'react';
import { useFormikContext } from 'formik';
import FieldLabel from '@commercetools-uikit/field-label';
import TextInput from '@commercetools-uikit/text-input';
import SelectInput from '@commercetools-uikit/select-input';
import Spacings from '@commercetools-uikit/spacings';
import FlatButton from '@commercetools-uikit/flat-button';
import {
  HeaderConfiguration,
  NavigationItem,
  NavItemLink,
  NavItemMenu,
  NavItemCategoryMegaMenu,
} from '@commercetools-demo/contentools-types';
import Grid from '@commercetools-uikit/grid';
import { BinLinearIcon } from '@commercetools-uikit/icons';

const TYPE_OPTIONS = [
  { value: 'link', label: 'Link' },
  { value: 'menu', label: 'Menu' },
  { value: 'category-mega-menu', label: 'Category mega menu' },
];

interface NavigationItemFormProps {
  index: number;
  value: NavigationItem;
  onRemove: () => void;
}

export const NavigationItemForm: React.FC<NavigationItemFormProps> = ({
  index,
  value,
  onRemove,
}) => {
  const { setFieldValue, handleBlur } = useFormikContext<HeaderConfiguration>();
  const namePrefix = `navigation.${index}`;
  const type = value.type;

  const setType = (newType: NavigationItem['type']) => {
    if (newType === 'link') {
      setFieldValue(namePrefix, {
        type: 'link',
        label: (value as NavItemLink).label ?? '',
        href: (value as NavItemLink).href ?? '',
      } as NavItemLink);
    } else if (newType === 'menu') {
      setFieldValue(namePrefix, {
        type: 'menu',
        label: (value as NavItemMenu).label ?? '',
        columns: (value as NavItemMenu).columns ?? [],
      } as NavItemMenu);
    } else {
      setFieldValue(namePrefix, {
        type: 'category-mega-menu',
        label: (value as NavItemCategoryMegaMenu).label ?? '',
        categoryRoots: (value as NavItemCategoryMegaMenu).categoryRoots ?? [],
      } as NavItemCategoryMegaMenu);
    }
  };

  return (
    <Grid
      gridGap="16px"
      gridAutoColumns="1fr"
      gridTemplateColumns={`repeat(${
        type === 'category-mega-menu' ? 10 : 8
      }, 1fr)`}
      alignItems="center"
    >
      <Grid.Item>
        <FieldLabel title={`Item ${index + 1}`} />
      </Grid.Item>

      <Grid.Item gridColumn="span 2">
        <SelectInput
          value={type}
          onChange={(e) => setType(e.target.value as NavigationItem['type'])}
          options={TYPE_OPTIONS}
        />
      </Grid.Item>
      <Grid.Item gridColumn="span 2">
        <TextInput
          name={`${namePrefix}.label`}
          value={value.label ?? ''}
          onChange={(e) => setFieldValue(`${namePrefix}.label`, e.target.value)}
          onBlur={handleBlur}
          placeholder="Label"
        />
      </Grid.Item>
      {(type === 'link' || type === 'menu') && (
        <Grid.Item gridColumn="span 2">
          <TextInput
            name={`${namePrefix}.href`}
            value={
              ((type === 'link' ? value : value) as NavItemLink | NavItemMenu)
                .href ?? ''
            }
            onChange={(e) =>
              setFieldValue(`${namePrefix}.href`, e.target.value)
            }
            onBlur={handleBlur}
            placeholder="URL (optional for menu)"
          />
        </Grid.Item>
      )}
      {type === 'category-mega-menu' && (
        <Grid.Item gridColumn="span 2">
          <TextInput
            name={`${namePrefix}.categoryRoots`}
            value={
              (value as NavItemCategoryMegaMenu).categoryRoots?.join(', ') ?? ''
            }
            onChange={(e) =>
              setFieldValue(
                `${namePrefix}.categoryRoots`,
                e.target.value
                  ? e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  : []
              )
            }
            onBlur={handleBlur}
            placeholder="Category IDs or keys (comma-separated)"
          />
        </Grid.Item>
      )}
      {type === 'category-mega-menu' && (
        <Grid.Item gridColumn="span 2">
          <TextInput
            name={`${namePrefix}.maxDepth`}
            value={String((value as NavItemCategoryMegaMenu).maxDepth ?? '')}
            onChange={(e) => {
              const v = e.target.value;
              setFieldValue(
                `${namePrefix}.maxDepth`,
                v === '' ? undefined : Number(v)
              );
            }}
            onBlur={handleBlur}
            placeholder="Max depth (optional)"
          />
        </Grid.Item>
      )}
      <Grid.Item gridColumn="span 1">
        <FlatButton
          label="Remove"
          onClick={onRemove}
          tone="secondary"
          icon={<BinLinearIcon />}
        />
      </Grid.Item>
    </Grid>
  );
};
