import { html, TemplateResult } from 'lit';
import { Component } from '../../types';

export interface ProductSliderProps {
  title: string;
  skus: string[];
  autoplay: boolean;
  slidesToShow: number;
}

export const renderProductSlider = (component: Component): TemplateResult => {
  const props = component.properties as ProductSliderProps;
  
  return html`
    <div class="product-slider">
      <h2>${props.title}</h2>
      <div class="slider-container">
        ${props.skus.length > 0 
          ? props.skus.map(sku => html`<div class="product-slide">SKU: ${sku}</div>`)
          : html`<div class="empty-slider">No products selected</div>`
        }
      </div>
      <div class="slider-settings">
        Autoplay: ${props.autoplay ? 'Yes' : 'No'} | Slides: ${props.slidesToShow}
      </div>
    </div>
  `;
};

export const renderProductSliderPreview = (component: Component): TemplateResult => {
  const props = component.properties as ProductSliderProps;
  
  return html`
    <div class="component-preview product-slider-preview">
      <div class="preview-header">
        <span class="component-icon">🛒</span>
        <span class="component-name">${component.name}</span>
      </div>
      <div class="preview-content">
        <p><strong>Title:</strong> ${props.title}</p>
        <p><strong>Products:</strong> ${props.skus.length} SKUs</p>
        <p><strong>Settings:</strong> ${props.slidesToShow} slides ${props.autoplay ? '(autoplay)' : ''}</p>
      </div>
    </div>
  `;
};