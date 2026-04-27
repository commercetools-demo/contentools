import React from 'react';
import { type ComponentConfig } from '@measured/puck';

export interface SocialLinksProps {
  link1Label: string; link1Url: string;
  link2Label: string; link2Url: string;
  link3Label: string; link3Url: string;
  link4Label: string; link4Url: string;
}

export const SocialLinks: ComponentConfig<SocialLinksProps> = {
  label: 'Social Links',
  fields: {
    link1Label: { type: 'text', label: 'Link 1 Label' },
    link1Url: { type: 'text', label: 'Link 1 URL' },
    link2Label: { type: 'text', label: 'Link 2 Label' },
    link2Url: { type: 'text', label: 'Link 2 URL' },
    link3Label: { type: 'text', label: 'Link 3 Label' },
    link3Url: { type: 'text', label: 'Link 3 URL' },
    link4Label: { type: 'text', label: 'Link 4 Label' },
    link4Url: { type: 'text', label: 'Link 4 URL' },
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
