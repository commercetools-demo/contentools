import React, { useState } from 'react';
import Label from '@commercetools-uikit/label';
import TextInput from '@commercetools-uikit/text-input';
import SelectInput from '@commercetools-uikit/select-input';
import FlatButton from '@commercetools-uikit/flat-button';
import Spacings from '@commercetools-uikit/spacings';
import { CloseBoldIcon } from '@commercetools-uikit/icons';
import { useProductSearch } from '@commercetools-demo/puck-api';

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
// ProductSearchPicker — typeahead search for product selection (task #4)
// ---------------------------------------------------------------------------

interface ProductSearchPickerProps {
  /** SKUs already selected, so we can mark them in the results. */
  selectedSkus: string[];
  onSelect: (sku: string) => void;
}

const ProductSearchPicker: React.FC<ProductSearchPickerProps> = ({
  selectedSkus,
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useProductSearch(query);

  return (
    <Spacings.Stack scale="xs">
      <Label htmlFor="datasource-product-search">Search products</Label>
      <TextInput
        id="datasource-product-search"
        placeholder="Search by product name…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query.trim() !== '' && (
        <div
          role="listbox"
          aria-label="Product search results"
          aria-busy={loading}
          style={{
            maxHeight: 220,
            overflowY: 'auto',
            border: '1px solid var(--color-neutral-90, #e0e0e0)',
            borderRadius: 'var(--border-radius-4, 4px)',
            background: 'var(--color-surface, #fff)',
          }}
        >
          {loading && (
            <div style={{ padding: 8, fontSize: 13, color: 'var(--color-neutral-40, #666)' }}>
              Searching…
            </div>
          )}
          {error && (
            <div style={{ padding: 8, fontSize: 13, color: 'var(--color-error, #c0392b)' }}>
              {error}
            </div>
          )}
          {!loading && !error && results.length === 0 && (
            <div style={{ padding: 8, fontSize: 13, color: 'var(--color-neutral-40, #666)' }}>
              No products found
            </div>
          )}
          {results.map((product) => {
            const sku = product.sku;
            const alreadySelected = !!sku && selectedSkus.includes(sku);
            return (
              <button
                key={product.id}
                type="button"
                role="option"
                aria-selected={alreadySelected}
                disabled={!sku}
                onClick={() => sku && onSelect(sku)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: 8,
                  border: 'none',
                  borderBottom: '1px solid var(--color-neutral-95, #f4f4f4)',
                  background: alreadySelected
                    ? 'var(--color-primary-95, #e6eefb)'
                    : 'transparent',
                  cursor: sku ? 'pointer' : 'not-allowed',
                  textAlign: 'left',
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt=""
                    style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    style={{ width: 32, height: 32, background: 'var(--color-neutral-95, #f4f4f4)', borderRadius: 4, flexShrink: 0 }}
                  />
                )}
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.name ?? '(unnamed product)'}
                  </span>
                  <span style={{ display: 'block', fontSize: 11, color: 'var(--color-neutral-40, #666)' }}>
                    {sku ? `SKU: ${sku}` : 'No SKU on master variant'}
                  </span>
                </span>
                {alreadySelected && (
                  <span style={{ fontSize: 11, color: 'var(--color-primary, #1a1a2e)' }}>Added</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </Spacings.Stack>
  );
};

// ---------------------------------------------------------------------------
// DatasourceField — custom Puck field component
// ---------------------------------------------------------------------------

export const DatasourceField: React.FC<DatasourceFieldProps> = ({
  value,
  onChange,
}) => {
  const current: DatasourceValue = value ?? EMPTY_VALUE;
  const selectedSkus = current.skus.filter(Boolean);

  const removeSkuValue = (sku: string) => {
    const updated = current.skus.filter((s) => s !== sku);
    onChange({ ...current, skus: updated.length > 0 ? updated : [''] });
  };

  // Add a SKU chosen from the product-search picker.
  const selectProduct = (sku: string) => {
    if (current.type === 'product-by-sku') {
      onChange({ ...current, skus: [sku] });
      return;
    }
    const existing = current.skus.filter(Boolean);
    if (existing.includes(sku)) return;
    onChange({ ...current, skus: [...existing, sku] });
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

      <ProductSearchPicker
        selectedSkus={selectedSkus}
        onSelect={selectProduct}
      />

      <Spacings.Stack scale="xs">
        <Label>
          {current.type === 'product-by-sku'
            ? 'Selected product'
            : 'Selected products'}
        </Label>
        {selectedSkus.length === 0 ? (
          <span style={{ fontSize: 13, color: 'var(--color-neutral-40, #666)' }}>
            No product selected — search above to add one.
          </span>
        ) : (
          <Spacings.Stack scale="xs">
            {selectedSkus.map((sku) => (
              <Spacings.Inline key={sku} scale="xs" alignItems="center" justifyContent="space-between">
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: 13,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  SKU: {sku}
                </span>
                <FlatButton
                  tone="critical"
                  label="Remove"
                  icon={<CloseBoldIcon />}
                  onClick={() => removeSkuValue(sku)}
                />
              </Spacings.Inline>
            ))}
          </Spacings.Stack>
        )}
      </Spacings.Stack>
    </Spacings.Stack>
  );
};
