import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';
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

export const createTrustBadgesConfig = (
  intl: IntlShape
): ComponentConfig<TrustBadgesProps> => {
  const iconLabel = (n: number) =>
    intl.formatMessage({ id: 'Editor.cfg.trustBadges.field.icon' }, { n });
  const labelLabel = (n: number) =>
    intl.formatMessage({ id: 'Editor.cfg.trustBadges.field.label' }, { n });
  return {
  label: intl.formatMessage({ id: 'Editor.cfg.trustBadges.label' }),
  fields: {
    badge1Icon: iconField(iconLabel(1)),
    badge1Label: { type: 'text', label: labelLabel(1) },
    badge2Icon: iconField(iconLabel(2)),
    badge2Label: { type: 'text', label: labelLabel(2) },
    badge3Icon: iconField(iconLabel(3)),
    badge3Label: { type: 'text', label: labelLabel(3) },
    badge4Icon: iconField(iconLabel(4)),
    badge4Label: { type: 'text', label: labelLabel(4) },
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
    if (badges.length === 0) return <></>;
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
};
