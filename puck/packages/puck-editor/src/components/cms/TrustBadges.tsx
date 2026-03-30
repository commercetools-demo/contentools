import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import { ImagePickerField } from '../../fields/ImagePickerField';

export interface TrustBadgesProps {
  badge1Icon: string; badge1Label: string;
  badge2Icon: string; badge2Label: string;
  badge3Icon: string; badge3Label: string;
  badge4Icon: string; badge4Label: string;
}

const iconField = (label: string) => ({
  type: 'custom' as const,
  label,
  render: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <ImagePickerField value={value ?? ''} onChange={onChange} />
  ),
});

export const TrustBadges: ComponentConfig<TrustBadgesProps> = {
  label: 'Trust Badges',
  fields: {
    badge1Icon: iconField('Badge 1 Icon'),
    badge1Label: { type: 'text', label: 'Badge 1 Label' },
    badge2Icon: iconField('Badge 2 Icon'),
    badge2Label: { type: 'text', label: 'Badge 2 Label' },
    badge3Icon: iconField('Badge 3 Icon'),
    badge3Label: { type: 'text', label: 'Badge 3 Label' },
    badge4Icon: iconField('Badge 4 Icon'),
    badge4Label: { type: 'text', label: 'Badge 4 Label' },
  },
  defaultProps: {
    badge1Icon: '', badge1Label: '',
    badge2Icon: '', badge2Label: '',
    badge3Icon: '', badge3Label: '',
    badge4Icon: '', badge4Label: '',
  },
  render: (props) => {
    const badges = [
      [props.badge1Icon, props.badge1Label],
      [props.badge2Icon, props.badge2Label],
      [props.badge3Icon, props.badge3Label],
      [props.badge4Icon, props.badge4Label],
    ].filter(([, label]) => label) as [string, string][];
    if (badges.length === 0) return null;
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
          padding: '2rem 1rem',
          background: '#f9f9f9',
          borderRadius: '4px',
        }}
      >
        {badges.map(([icon, label], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {icon && (
              <img
                src={icon}
                alt={label}
                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              />
            )}
            <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#333' }}>{label}</span>
          </div>
        ))}
      </div>
    );
  },
};
