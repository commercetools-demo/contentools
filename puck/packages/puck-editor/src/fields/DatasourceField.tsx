import React, { useState } from 'react';

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
// Inline styles
// ---------------------------------------------------------------------------

const s = {
  root: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    fontFamily: 'inherit',
    fontSize: '13px',
  },
  label: { fontSize: '12px', fontWeight: 600, color: '#374151' } as React.CSSProperties,
  select: {
    width: '100%',
    padding: '7px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    background: '#fff',
    boxSizing: 'border-box' as const,
  },
  skuRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  input: {
    flex: 1,
    padding: '7px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,
  removeBtn: {
    padding: '5px 8px',
    border: '1px solid #fca5a5',
    borderRadius: '4px',
    background: '#fff',
    color: '#dc2626',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    lineHeight: 1,
    flexShrink: 0,
  } as React.CSSProperties,
  addBtn: {
    padding: '5px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    background: '#fff',
    color: '#374151',
    fontWeight: 500,
    fontSize: '12px',
    cursor: 'pointer',
    alignSelf: 'flex-start' as const,
  } as React.CSSProperties,
  skuList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
};

// ---------------------------------------------------------------------------
// DatasourceField — custom Puck field component
// ---------------------------------------------------------------------------

const EMPTY_VALUE: DatasourceValue = { type: 'product-by-sku', skus: [''] };

export const DatasourceField: React.FC<DatasourceFieldProps> = ({
  value,
  onChange,
}) => {
  const current: DatasourceValue = value ?? EMPTY_VALUE;

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as DatasourceType;
    onChange({ type: newType, skus: newType === 'product-by-sku' ? [current.skus[0] ?? ''] : current.skus });
  };

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
    <div style={s.root}>
      <div>
        <div style={s.label}>Datasource type</div>
        <select style={s.select} value={current.type} onChange={handleTypeChange}>
          <option value="product-by-sku">Product by SKU</option>
          <option value="products-by-sku">Products by SKU</option>
        </select>
      </div>

      {current.type === 'product-by-sku' ? (
        <div>
          <div style={s.label}>SKU</div>
          <input
            style={s.input}
            type="text"
            placeholder="Enter product SKU"
            value={current.skus[0] ?? ''}
            onChange={handleSingleSkuChange}
          />
        </div>
      ) : (
        <div>
          <div style={s.label}>SKUs</div>
          <div style={s.skuList}>
            {current.skus.map((sku, i) => (
              <div key={i} style={s.skuRow}>
                <input
                  style={s.input}
                  type="text"
                  placeholder={`SKU ${i + 1}`}
                  value={sku}
                  onChange={(e) => handleMultiSkuChange(i, e.target.value)}
                />
                <button
                  style={s.removeBtn}
                  onClick={() => removeSku(i)}
                  title="Remove SKU"
                >
                  ×
                </button>
              </div>
            ))}
            <button style={s.addBtn} onClick={addSku}>
              + Add SKU
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
