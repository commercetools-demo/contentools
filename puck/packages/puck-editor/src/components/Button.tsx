import React from 'react';
import type { ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';
import { createFontSizeField } from '../fields/fontSizeField';

export interface ButtonProps {
  label: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fontSize?: string;
  align?: 'left' | 'center' | 'right';
  openInNewTab?: boolean;
}

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  primary: { background: '#1a1a2e', color: '#fff', border: '2px solid #1a1a2e' },
  secondary: { background: '#e94560', color: '#fff', border: '2px solid #e94560' },
  outline: { background: 'transparent', color: '#1a1a2e', border: '2px solid #1a1a2e' },
};

const SIZE_STYLES: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 16px', fontSize: '14px' },
  md: { padding: '10px 24px', fontSize: '16px' },
  lg: { padding: '14px 32px', fontSize: '18px' },
};

export const createButtonConfig = (intl: IntlShape): ComponentConfig<ButtonProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.button.label' }),
  fields: {
    label: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.button.field.label' }) },
    href: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.button.field.href' }) },
    variant: {
      type: 'select',
      label: intl.formatMessage({ id: 'Editor.cfg.button.field.variant' }),
      options: [
        { value: 'primary', label: intl.formatMessage({ id: 'Editor.cfg.button.variant.primary' }) },
        { value: 'secondary', label: intl.formatMessage({ id: 'Editor.cfg.button.variant.secondary' }) },
        { value: 'outline', label: intl.formatMessage({ id: 'Editor.cfg.button.variant.outline' }) },
      ],
    },
    size: {
      type: 'select',
      label: intl.formatMessage({ id: 'Editor.cfg.button.field.size' }),
      options: [
        { value: 'sm', label: intl.formatMessage({ id: 'Editor.cfg.button.size.small' }) },
        { value: 'md', label: intl.formatMessage({ id: 'Editor.cfg.button.size.medium' }) },
        { value: 'lg', label: intl.formatMessage({ id: 'Editor.cfg.button.size.large' }) },
      ],
    },
    fontSize: createFontSizeField(intl, intl.formatMessage({ id: 'Editor.cfg.button.field.fontSize' })),
    align: {
      type: 'select',
      label: intl.formatMessage({ id: 'Editor.cfg.button.field.align' }),
      options: [
        { value: 'left', label: intl.formatMessage({ id: 'Editor.cfg.align.left' }) },
        { value: 'center', label: intl.formatMessage({ id: 'Editor.cfg.align.center' }) },
        { value: 'right', label: intl.formatMessage({ id: 'Editor.cfg.align.right' }) },
      ],
    },
    openInNewTab: { type: 'radio', label: intl.formatMessage({ id: 'Editor.cfg.button.field.openInNewTab' }), options: [
      { value: true, label: intl.formatMessage({ id: 'Editor.cfg.yesNo.yes' }) },
      { value: false, label: intl.formatMessage({ id: 'Editor.cfg.yesNo.no' }) },
    ]},
  },
  defaultProps: {
    label: 'Click me',
    variant: 'primary',
    size: 'md',
    align: 'left',
    openInNewTab: false,
  },
  render: ({ label, href, variant = 'primary', size = 'md', fontSize, align = 'left', openInNewTab }) => (
    <div style={{ padding: '12px 16px', textAlign: align, boxSizing: 'border-box' }}>
      <a
        href={href ?? '#'}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        style={{
          display: 'inline-block',
          borderRadius: '4px',
          textDecoration: 'none',
          fontWeight: 600,
          cursor: 'pointer',
          ...VARIANT_STYLES[variant],
          ...SIZE_STYLES[size],
          ...(fontSize ? { fontSize } : {}),
        }}
      >
        {label}
      </a>
    </div>
  ),
});
