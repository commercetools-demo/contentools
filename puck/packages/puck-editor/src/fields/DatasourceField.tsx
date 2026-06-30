import React, { useState } from 'react';
import { Button, FormField, Icon, Select, Stack, Text, TextInput } from '@commercetools/nimbus';
import { Close } from '@commercetools/nimbus-icons';
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
    <Stack direction="column" gap="100">
      <FormField.Root>
        <FormField.Label>Search products</FormField.Label>
        <FormField.Input>
          <TextInput
            placeholder="Search by product name…"
            value={query}
            onChange={(value) => setQuery(value)}
          />
        </FormField.Input>
      </FormField.Root>

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
    </Stack>
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
    <Stack direction="column" gap="200">
      <FormField.Root>
        <FormField.Label>Datasource type</FormField.Label>
        <FormField.Input>
          <Select.Root
            selectedKey={current.type}
            onSelectionChange={(key) => {
              const newType = key as DatasourceType;
              onChange({
                type: newType,
                skus: newType === 'product-by-sku' ? [current.skus[0] ?? ''] : current.skus,
              });
            }}
          >
            <Select.Options>
              {TYPE_OPTIONS.map((o) => (
                <Select.Option key={o.value} id={o.value}>{o.label}</Select.Option>
              ))}
            </Select.Options>
          </Select.Root>
        </FormField.Input>
      </FormField.Root>

      <ProductSearchPicker
        selectedSkus={selectedSkus}
        onSelect={selectProduct}
      />

      <Stack direction="column" gap="100">
        <Text fontSize="sm" fontWeight="700">
          {current.type === 'product-by-sku' ? 'Selected product' : 'Selected products'}
        </Text>
        {selectedSkus.length === 0 ? (
          <Text fontSize="sm" color="neutral.11">
            No product selected — search above to add one.
          </Text>
        ) : (
          <Stack direction="column" gap="100">
            {selectedSkus.map((sku) => (
              <Stack key={sku} direction="row" gap="100" alignItems="center" justifyContent="space-between">
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
                <Button
                  variant="ghost"
                  colorPalette="critical"
                  size="xs"
                  onPress={() => removeSkuValue(sku)}
                >
                  <Icon as={Close} /> Remove
                </Button>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
