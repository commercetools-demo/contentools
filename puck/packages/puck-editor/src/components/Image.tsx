import React from 'react';
import { FormattedMessage, type IntlShape } from 'react-intl';
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

export const createImageConfig = (intl: IntlShape): ComponentConfig<ImageProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.image.label' }),
  fields: {
    src: {
      type: 'custom',
      label: intl.formatMessage({ id: 'Editor.cfg.image.field.src' }),
      render: ({ value, onChange }) => (
        <ImagePickerField
          value={value as string}
          onChange={onChange}
          imagesOnly={true}
        />
      ),
    },
    alt: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.image.field.alt' }) },
    caption: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.image.field.caption' }) },
    width: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.image.field.width' }) },
    height: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.image.field.height' }) },
    objectFit: {
      type: 'select',
      label: intl.formatMessage({ id: 'Editor.cfg.image.field.objectFit' }),
      options: [
        { value: 'cover', label: intl.formatMessage({ id: 'Editor.cfg.image.objectFit.cover' }) },
        { value: 'contain', label: intl.formatMessage({ id: 'Editor.cfg.image.objectFit.contain' }) },
        { value: 'fill', label: intl.formatMessage({ id: 'Editor.cfg.image.objectFit.fill' }) },
      ],
    },
    borderRadius: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.image.field.borderRadius' }) },
    align: {
      type: 'select',
      label: intl.formatMessage({ id: 'Editor.cfg.image.field.align' }),
      options: [
        { value: 'left', label: intl.formatMessage({ id: 'Editor.cfg.align.left' }) },
        { value: 'center', label: intl.formatMessage({ id: 'Editor.cfg.align.center' }) },
        { value: 'right', label: intl.formatMessage({ id: 'Editor.cfg.align.right' }) },
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
          <FormattedMessage id="Editor.noImageSelected" />
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
});
