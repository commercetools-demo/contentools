import React from 'react';
import styled from 'styled-components';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
}

const HeroContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 20px;
  box-sizing: border-box;
`;

const HeroBackground = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
`;

const HeroSubtitle = styled.p`
  font-size: 24px;
  margin-bottom: 32px;
  max-width: 600px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const HeroCta = styled.a`
  display: inline-block;
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  text-transform: uppercase;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const HeroPlaceholder = styled.div`
  background-color: #f5f5f5;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  ${HeroTitle} {
    color: #333;
  }

  ${HeroSubtitle} {
    color: #555;
  }
`;

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title = 'Hero Title',
  subtitle = 'Hero Subtitle',
  imageUrl = '',
  ctaText = 'Learn More',
  ctaUrl = '#',
}) => {
  if (imageUrl) {
    return (
      <HeroContainer>
        <HeroBackground src={imageUrl} alt={title} />
        <HeroOverlay />
        <HeroTitle>{title}</HeroTitle>
        <HeroSubtitle>{subtitle}</HeroSubtitle>
        {ctaText && <HeroCta href={ctaUrl}>{ctaText}</HeroCta>}
      </HeroContainer>
    );
  }

  return (
    <HeroContainer>
      <HeroPlaceholder>
        <HeroTitle>{title}</HeroTitle>
        <HeroSubtitle>{subtitle}</HeroSubtitle>
        {ctaText && <HeroCta href={ctaUrl}>{ctaText}</HeroCta>}
      </HeroPlaceholder>
    </HeroContainer>
  );
};

export default HeroBanner; 