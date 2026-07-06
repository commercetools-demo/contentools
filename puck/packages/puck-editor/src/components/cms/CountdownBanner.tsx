import React, { useEffect, useState } from 'react';
import { type ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';
import { ColorPickerField } from '../../fields/ColorPickerField';

export interface CountdownBannerProps {
  headline: string;
  subline: string;
  endDate: string;
  ctaText: string;
  ctaLink: string;
  background: string;
}

const calcTimeLeft = (endDate: string): string => {
  if (!endDate) return '';
  const end = new Date(endDate);
  const now = new Date();
  if (end <= now) return 'Offer ended';
  const diff = end.getTime() - now.getTime();
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  if (d > 0) return `${d}d ${h}h ${m}m left`;
  if (h > 0) return `${h}h ${m}m ${s}s left`;
  return `${m}m ${s}s left`;
};

const CountdownRender: React.FC<CountdownBannerProps> = ({
  headline, subline, endDate, ctaText, ctaLink, background,
}) => {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(endDate));
  useEffect(() => {
    if (!endDate) return;
    const id = setInterval(() => setTimeLeft(calcTimeLeft(endDate)), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  return (
    <div
      style={{
        background: background || '#2c5530',
        color: 'white',
        padding: '2rem 1rem',
        textAlign: 'center',
        borderRadius: '4px',
        margin: '1rem 0',
      }}
    >
      {headline && <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{headline}</h2>}
      {subline && <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '1rem' }}>{subline}</p>}
      {timeLeft && (
        <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1rem 0', letterSpacing: '0.05em' }}>
          {timeLeft}
        </p>
      )}
      {ctaText && ctaLink && (
        <a
          href={ctaLink}
          style={{
            display: 'inline-block',
            background: 'white',
            color: '#2c5530',
            padding: '0.75rem 2rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          {ctaText}
        </a>
      )}
    </div>
  );
};

export const createCountdownBannerConfig = (
  intl: IntlShape
): ComponentConfig<CountdownBannerProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.countdownBanner.label' }),
  fields: {
    headline: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.countdownBanner.field.headline' }) },
    subline: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.countdownBanner.field.subline' }) },
    endDate: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.countdownBanner.field.endDate' }) },
    ctaText: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.countdownBanner.field.ctaText' }) },
    ctaLink: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.countdownBanner.field.ctaLink' }) },
    background: {
      type: 'custom',
      label: intl.formatMessage({ id: 'Editor.cfg.countdownBanner.field.background' }),
      render: ({ value, onChange }) => <ColorPickerField value={value} onChange={onChange} />,
    },
  },
  defaultProps: {
    headline: '', subline: '', endDate: '', ctaText: '', ctaLink: '', background: '#2c5530',
  },
  render: (props) => <CountdownRender {...props} />,
});
