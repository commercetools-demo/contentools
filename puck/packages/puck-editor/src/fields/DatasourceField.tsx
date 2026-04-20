import React from 'react';
import Label from '@commercetools-uikit/label';
import TextInput from '@commercetools-uikit/text-input';
import SelectInput from '@commercetools-uikit/select-input';
import FlatButton from '@commercetools-uikit/flat-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import { PlusThinIcon, CloseBoldIcon } from '@commercetools-uikit/icons';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DatasourceType = 'product-by-sku' | 'products-by-sku';

export interface DatasourceValue {
  type: DatasourceType;
  skus: string[];
  /** Pre-resolved by the server on published/preview endpoints — use directly in render. */
  resolvedData?: unknown;
}

export interface DatasourceFieldProps {
  value: DatasourceValue | undefined;
  onChange: (value: DatasourceValue) => void;
}

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

const TYPE_OPTIONS = [
  { value: 'product-by-sku', label: 'Product by SKU' },
  { value: 'products-by-sku', label: 'Products by SKU' },
];

const EMPTY_VALUE: DatasourceValue = { type: 'product-by-sku', skus: [''] };

// ---------------------------------------------------------------------------
// DatasourceField — custom Puck field component
// ---------------------------------------------------------------------------

export const DatasourceField: React.FC<DatasourceFieldProps> = ({
  value,
  onChange,
}) => {
  const current: DatasourceValue = value ?? EMPTY_VALUE;

  const handleSingleSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...current, skus: [e.target.value] });
  };

  const handleMultiSkuChange = (index: number, val: string) => {
    const updated = [...current.skus];
    updated[index] = val;
    onChange({ ...current, skus: updated });
  };

  const addSku = () => {
    onChange({ ...current, skus: [...current.skus, ''] });
  };

  const removeSku = (index: number) => {
    const updated = current.skus.filter((_, i) => i !== index);
    onChange({ ...current, skus: updated.length > 0 ? updated : [''] });
  };

  return (
    <Spacings.Stack scale="s">
      <Spacings.Stack scale="xs">
        <Label htmlFor="datasource-type">Datasource type</Label>
        <SelectInput
          id="datasource-type"
          name="datasource-type"
          value={current.type}
          options={TYPE_OPTIONS}
          onChange={(e) => {
            const newType = e.target.value as DatasourceType;
            onChange({ type: newType, skus: newType === 'product-by-sku' ? [current.skus[0] ?? ''] : current.skus });
          }}
        />
      </Spacings.Stack>

      {current.type === 'product-by-sku' ? (
        <Spacings.Stack scale="xs">
          <Label htmlFor="datasource-sku">SKU</Label>
          <TextInput
            id="datasource-sku"
            placeholder="Enter product SKU"
            value={current.skus[0] ?? ''}
            onChange={handleSingleSkuChange}
          />
        </Spacings.Stack>
      ) : (
        <Spacings.Stack scale="xs">
          <Label>SKUs</Label>
          <Spacings.Stack scale="xs">
            {current.skus.map((sku, i) => (
              <Spacings.Inline key={i} scale="xs" alignItems="center">
                <div style={{ flex: 1 }}>
                  <TextInput
                    placeholder={`SKU ${i + 1}`}
                    value={sku}
                    onChange={(e) => handleMultiSkuChange(i, e.target.value)}
                  />
                </div>
                <FlatButton
                  tone="critical"
                  label="Remove"
                  icon={<CloseBoldIcon />}
                  onClick={() => removeSku(i)}
                />
              </Spacings.Inline>
            ))}
            <SecondaryButton
              label="Add SKU"
              iconLeft={<PlusThinIcon />}
              onClick={addSku}
              size="small"
            />
          </Spacings.Stack>
        </Spacings.Stack>
      )}
    </Spacings.Stack>
  );
};
