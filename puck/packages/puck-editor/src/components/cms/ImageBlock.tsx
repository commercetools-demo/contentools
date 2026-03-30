import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import { ImagePickerField } from '../../fields/ImagePickerField';

export interface ImageBlockProps {
  image: string;
  caption: string;
  link: string;
}

export const ImageBlock: ComponentConfig<ImageBlockProps> = {
  label: 'Image Block',
  fields: {
    image: {
      type: 'custom', label: 'Image',
      render: ({ value, onChange }) => <ImagePickerField value={value ?? ''} onChange={onChange} />,
    },
    caption: { type: 'text', label: 'Caption' },
    link: { type: 'text', label: 'Link URL' },
  },
  defaultProps: { image: '', caption: '', link: '' },
  render: ({ image, caption, link }) => {
    if (!image) return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#999', background: '#f5f5f5', borderRadius: '4px' }}>
        No image selected
      </div>
    );
    const img = (
      <img
        src={image}
        alt={caption || 'Image'}
        style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
      />
    );
    return (
      <figure style={{ margin: '1rem 0', textAlign: 'center' }}>
        {link ? <a href={link} style={{ display: 'inline-block' }}>{img}</a> : img}
        {caption && (
          <figcaption style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            {caption}
          </figcaption>
        )}
      </figure>
    );
  },
};
