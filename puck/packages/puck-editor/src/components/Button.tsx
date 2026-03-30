import React from 'react';
import type { ComponentConfig } from '@measured/puck';

export interface ButtonProps {
  label: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
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

export const Button: ComponentConfig<ButtonProps> = {
  label: 'Button',
  fields: {
    label: { type: 'text', label: 'Button Label' },
    href: { type: 'text', label: 'Link URL' },
    variant: {
      type: 'select',
      label: 'Variant',
      options: [
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'outline', label: 'Outline' },
      ],
    },
    size: {
      type: 'select',
      label: 'Size',
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
      ],
    },
    align: {
      type: 'select',
      label: 'Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
    },
    openInNewTab: { type: 'radio', label: 'Open in New Tab', options: [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ]},
  },
  defaultProps: {
    label: 'Click me',
    variant: 'primary',
    size: 'md',
    align: 'left',
    openInNewTab: false,
  },
  render: ({ label, href, variant = 'primary', size = 'md', align = 'left', openInNewTab }) => (
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
        }}
      >
        {label}
      </a>
    </div>
  ),
};
