import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';

export interface SocialLinksProps {
  link1Label: string; link1Url: string;
  link2Label: string; link2Url: string;
  link3Label: string; link3Url: string;
  link4Label: string; link4Url: string;
}

export const createSocialLinksConfig = (
  intl: IntlShape
): ComponentConfig<SocialLinksProps> => {
  const labelLabel = (n: number) =>
    intl.formatMessage({ id: 'Editor.cfg.socialLinks.field.label' }, { n });
  const urlLabel = (n: number) =>
    intl.formatMessage({ id: 'Editor.cfg.socialLinks.field.url' }, { n });
  return {
  label: intl.formatMessage({ id: 'Editor.cfg.socialLinks.label' }),
  fields: {
    link1Label: { type: 'text', label: labelLabel(1) },
    link1Url: { type: 'text', label: urlLabel(1) },
    link2Label: { type: 'text', label: labelLabel(2) },
    link2Url: { type: 'text', label: urlLabel(2) },
    link3Label: { type: 'text', label: labelLabel(3) },
    link3Url: { type: 'text', label: urlLabel(3) },
    link4Label: { type: 'text', label: labelLabel(4) },
    link4Url: { type: 'text', label: urlLabel(4) },
  },
  defaultProps: {
    link1Label: '', link1Url: '',
    link2Label: '', link2Url: '',
    link3Label: '', link3Url: '',
    link4Label: '', link4Url: '',
  },
  render: (props) => {
    const links = [
      [props.link1Label, props.link1Url],
      [props.link2Label, props.link2Url],
      [props.link3Label, props.link3Url],
      [props.link4Label, props.link4Url],
    ].filter(([label, url]) => label && url) as [string, string][];
    if (links.length === 0) return <></>;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '0.5rem 0' }}>
        {links.map(([label, url], i) => (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2c5530', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}
          >
            {label}
          </a>
        ))}
      </div>
    );
  },
  };
};
