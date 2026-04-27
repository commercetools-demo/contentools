import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import { ImagePickerField } from '../../fields/ImagePickerField';

export interface CategoryGridProps {
  category1Image: string; category1Label: string; category1Link: string;
  category2Image: string; category2Label: string; category2Link: string;
  category3Image: string; category3Label: string; category3Link: string;
  category4Image: string; category4Label: string; category4Link: string;
}

const imgField = (label: string) => ({
  type: 'custom' as const,
  label,
  render: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <ImagePickerField value={value ?? ''} onChange={onChange} />
  ),
});

export const CategoryGrid: ComponentConfig<CategoryGridProps> = {
  label: 'Category Grid',
  fields: {
    category1Image: imgField('Category 1 Image'),
    category1Label: { type: 'text', label: 'Category 1 Label' },
    category1Link: { type: 'text', label: 'Category 1 Link' },
    category2Image: imgField('Category 2 Image'),
    category2Label: { type: 'text', label: 'Category 2 Label' },
    category2Link: { type: 'text', label: 'Category 2 Link' },
    category3Image: imgField('Category 3 Image'),
    category3Label: { type: 'text', label: 'Category 3 Label' },
    category3Link: { type: 'text', label: 'Category 3 Link' },
    category4Image: imgField('Category 4 Image'),
    category4Label: { type: 'text', label: 'Category 4 Label' },
    category4Link: { type: 'text', label: 'Category 4 Link' },
  },
  defaultProps: {
    category1Image: '', category1Label: '', category1Link: '',
    category2Image: '', category2Label: '', category2Link: '',
    category3Image: '', category3Label: '', category3Link: '',
    category4Image: '', category4Label: '', category4Link: '',
  },
  render: (props) => {
    const categories = [
      [props.category1Image, props.category1Label, props.category1Link],
      [props.category2Image, props.category2Label, props.category2Link],
      [props.category3Image, props.category3Label, props.category3Link],
      [props.category4Image, props.category4Label, props.category4Link],
    ].filter(([, label, link]) => label && link) as [string, string, string][];

    if (categories.length === 0) return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#999', fontSize: '13px' }}>
        No categories configured
      </div>
    );

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.5rem',
          padding: '2rem 1rem',
        }}
      >
        {categories.map(([image, label, link], i) => (
          <a
            key={i}
            href={link}
            style={{
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
              color: 'inherit',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ aspectRatio: '1', background: '#f0f0f0', overflow: 'hidden' }}>
              {image && (
                <img
                  src={image}
                  alt={label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
            <span
              style={{
                display: 'block',
                padding: '1rem',
                fontWeight: 600,
                color: '#333',
              }}
            >
              {label}
            </span>
          </a>
        ))}
      </div>
    );
  },
};
