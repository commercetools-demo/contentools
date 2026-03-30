import React from 'react';
import type { ComponentConfig } from '@measured/puck';
import { ImagePickerField } from '../fields/ImagePickerField';

export interface ImageProps {
  src: string;
  alt?: string;
  caption?: string;
  width?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  borderRadius?: string;
  align?: 'left' | 'center' | 'right';
}

export const Image: ComponentConfig<ImageProps> = {
  label: 'Image',
  fields: {
    src: {
      type: 'custom',
      label: 'Image',
      render: ({ value, onChange }) => (
        <ImagePickerField
          value={value as string}
          onChange={onChange}
          imagesOnly={true}
        />
      ),
    },
    alt: { type: 'text', label: 'Alt Text' },
    caption: { type: 'text', label: 'Caption' },
    width: { type: 'text', label: 'Width (CSS, e.g. 100%)' },
    height: { type: 'text', label: 'Height (CSS, e.g. 300px)' },
    objectFit: {
      type: 'select',
      label: 'Object Fit',
      options: [
        { value: 'cover', label: 'Cover' },
        { value: 'contain', label: 'Contain' },
        { value: 'fill', label: 'Fill' },
      ],
    },
    borderRadius: { type: 'text', label: 'Border Radius (CSS)' },
    align: {
      type: 'select',
      label: 'Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
    },
  },
  defaultProps: {
    src: '',
    alt: '',
    width: '100%',
    objectFit: 'cover',
    align: 'center',
  },
  render: ({ src, alt, caption, width, height, objectFit, borderRadius, align }) => (
    <figure
      style={{
        margin: 0,
        padding: '16px',
        textAlign: align ?? 'center',
        boxSizing: 'border-box',
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? ''}
          style={{
            width: width ?? '100%',
            height: height,
            objectFit: objectFit ?? 'cover',
            borderRadius,
            display: 'inline-block',
            maxWidth: '100%',
          }}
        />
      ) : (
        <div
          style={{
            width: width ?? '100%',
            height: height ?? '200px',
            background: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888',
            fontSize: '14px',
            borderRadius,
          }}
        >
          No image selected
        </div>
      )}
      {caption && (
        <figcaption
          style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  ),
};
