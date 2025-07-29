import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import countryToCurrency, { Countries } from 'country-to-currency';

export interface Product {
  masterVariant: {
    sku: string;
    images: {
      url: string;
    }[];
    prices: {
      value: {
        centAmount: number;
        currencyCode: string;
      };
    }[];
  };
  name: {
    [key: string]: string;
  };
}

interface ProductSliderProps {
  title?: string;
  skus?: Product[];
  locale?: string;
  autoplay?: boolean;
  slidesToShow?: number;
}

const SliderContainer = styled.div`
  width: 100%;
  margin: 30px 0;
`;

const SliderTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const SliderWrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

const SliderTrack = styled.div<{ transform: string }>`
  display: flex;
  transition: transform 0.5s ease;
  transform: ${props => props.transform};
`;

const SliderSlide = styled.div<{ slidesToShow: number }>`
  flex: 0 0 calc(100% / ${props => props.slidesToShow});
  padding: 0 10px;
  box-sizing: border-box;
`;

const ProductCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ProductImageContainer = styled.div`
  aspect-ratio: 1;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
`;

const ProductImage = styled.img`
  max-width: 200px;
  object-fit: contain;
`;

const ProductDetails = styled.div`
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
`;

const ProductSku = styled.div`
  font-size: 12px;
  color: #777;
  margin-bottom: 15px;
`;

const ProductPrice = styled.div`
  font-weight: bold;
  color: #3498db;
  margin-top: auto;
`;

const SliderControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SliderArrow = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#ccc' : '#3498db'};
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 5px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: #2980b9;
  }
`;

const EmptySlider = styled.div`
  padding: 40px;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #777;
`;

export const ProductSlider: React.FC<ProductSliderProps> = ({
  title = 'Featured Products',
  skus = [],
  locale = 'en-US',
  autoplay = true,
  slidesToShow = 4,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoplay || !skus?.length) return;

    const interval = setInterval(() => {
      const maxSlide = Math.max(0, skus.length - slidesToShow);
      setCurrentSlide(prev => prev < maxSlide ? prev + 1 : 0);
    }, 3000);

    return () => clearInterval(interval);
  }, [autoplay, skus?.length, slidesToShow]);

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const nextSlide = () => {
    const maxSlide = Math.max(0, skus?.length - slidesToShow);
    if (currentSlide < maxSlide) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  if (!skus || !skus.length) {
    return (
      <SliderContainer>
        <SliderTitle>{title}</SliderTitle>
        <EmptySlider>
          No products to display. Please add product SKUs in the properties.
        </EmptySlider>
      </SliderContainer>
    );
  }

  const maxSlide = Math.max(0, skus.length - slidesToShow);

  return (
    <SliderContainer>
      <SliderTitle>{title}</SliderTitle>
      
      <SliderWrapper>
        <SliderTrack transform={`translateX(-${currentSlide * (100 / slidesToShow)}%)`}>
          {skus.map((sku, index) => {
            const countryCode = locale.split('-')[1] as Countries;
            const priceForLocale = sku?.masterVariant?.prices.find(
              price => price.value.currencyCode === countryToCurrency[countryCode]
            );

            return (
              <SliderSlide key={index} slidesToShow={slidesToShow}>
                <ProductCard>
                  <ProductImageContainer>
                    <ProductImage
                      src={sku?.masterVariant?.images[0]?.url}
                      alt={sku?.name?.[locale] || sku?.name?.['en-US']}
                    />
                  </ProductImageContainer>
                  <ProductDetails>
                    <ProductName>
                      {sku?.name?.[locale] || sku?.name?.['en-US']}
                    </ProductName>
                    <ProductSku>SKU: {sku?.masterVariant?.sku}</ProductSku>
                    <ProductPrice>
                      {priceForLocale?.value?.centAmount
                        ? (priceForLocale?.value?.centAmount / 100).toFixed(2)
                        : 'N/A'}{' '}
                      {priceForLocale?.value?.currencyCode}
                    </ProductPrice>
                  </ProductDetails>
                </ProductCard>
              </SliderSlide>
            );
          })}
        </SliderTrack>
      </SliderWrapper>

      <SliderControls>
        <SliderArrow onClick={prevSlide} disabled={currentSlide === 0}>
          ←
        </SliderArrow>
        <SliderArrow onClick={nextSlide} disabled={currentSlide >= maxSlide}>
          →
        </SliderArrow>
      </SliderControls>
    </SliderContainer>
  );
};

export default ProductSlider; 