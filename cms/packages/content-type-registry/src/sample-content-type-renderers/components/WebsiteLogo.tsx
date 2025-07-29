import React from 'react';
import styled from 'styled-components';

interface WebsiteLogoProps {
  logoUrl?: string;
  alt?: string;
  width?: number;
  height?: number;
  linkUrl?: string;
}

const LogoImage = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
`;

const LogoLink = styled.a`
  display: inline-block;
`;

export const WebsiteLogo: React.FC<WebsiteLogoProps> = ({
  logoUrl = '',
  alt = 'Website Logo',
  width = 200,
  height = 80,
  linkUrl = '',
}) => {
  const logoImage = (
    <LogoImage
      src={logoUrl}
      alt={alt}
      width={width}
      height={height}
    />
  );

  if (linkUrl) {
    return (
      <LogoLink href={linkUrl} title={alt}>
        {logoImage}
      </LogoLink>
    );
  }

  return logoImage;
};

export default WebsiteLogo; 